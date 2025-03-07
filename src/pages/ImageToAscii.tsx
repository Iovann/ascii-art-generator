import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Upload, Copy, Download, RefreshCw, Trash2, ZoomIn, ZoomOut, Palette } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// ASCII character sets from darkest to lightest
const asciiCharSets = {
  standard: '@%#*+=-:. ',
  detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  simple: '#@%=+*:-. ',
  blocks: '█▓▒░ ',
  minimal: '@:. ',
  dots: '●•·° ',
  stars: '★☆✮✯✡✧✦✥✤✣✢✜✛✪✫✬✭✮✯✰✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋',
  hearts: '❤♥♡💕💓💔💖💗💘💙💚💛💜💝',
  custom: ''
};

const ImageToAscii: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState('');
  const [coloredAsciiArt, setColoredAsciiArt] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [charSet, setCharSet] = useState('standard');
  const [customChars, setCustomChars] = useState('');
  const [resolution, setResolution] = useState(0.2); // 0.1 to 0.5
  const [inverted, setInverted] = useState(false);
  const [preserveColors, setPreserveColors] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (charSet === 'custom' && customChars.trim() === '') {
      setCustomChars(asciiCharSets.standard);
    }
  }, [charSet, customChars]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez télécharger une image valide');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

  const clearImage = () => {
    setImage(null);
    setAsciiArt('');
    setColoredAsciiArt([]);
  };

  const convertImageToAscii = () => {
    if (!image || !canvasRef.current) {
      toast.error('Veuillez d\'abord télécharger une image');
      return;
    }

    setIsLoading(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        const maxWidth = 100; // Maximum width in characters
        let width = Math.floor(img.width * resolution);
        let height = Math.floor(img.height * resolution);
        
        // Adjust to maintain aspect ratio and fit within maxWidth
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.floor(height * ratio);
        }
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Generate ASCII art
        let result = '';
        const chars = charSet === 'custom' ? customChars : asciiCharSets[charSet as keyof typeof asciiCharSets];
        
        // For colored ASCII art
        const coloredResult: string[][] = [];
        
        for (let y = 0; y < canvas.height; y += canvas.height / height) {
          const coloredRow: string[] = [];
          for (let x = 0; x < canvas.width; x += canvas.width / width) {
            const pixelIndex = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            
            // Get RGB values
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            
            // Calculate grayscale value
            let grayScale = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
            
            // Invert if needed
            if (inverted) {
              grayScale = 1 - grayScale;
            }
            
            // Map grayscale to character
            const charIndex = Math.floor(grayScale * (chars.length - 1));
            const char = chars[charIndex];
            
            result += char;
            
            // For colored version
            if (preserveColors) {
              const color = `rgb(${r}, ${g}, ${b})`;
              coloredRow.push(`<span style="color:${color}">${char}</span>`);
            } else {
              coloredRow.push(char);
            }
          }
          result += '\n';
          coloredResult.push(coloredRow);
        }
        
        setAsciiArt(result);
        setColoredAsciiArt(coloredResult);
        setIsLoading(false);
        
        // Generate colored preview
        if (preserveColors && colorCanvasRef.current) {
          renderColoredAsciiToCanvas(coloredResult, width, height);
        }
      };
      
      img.onerror = () => {
        toast.error('Erreur lors du chargement de l\'image');
        setIsLoading(false);
      };
      
      img.src = image;
    } catch (error) {
      console.error('Error converting image to ASCII:', error);
      toast.error('Erreur lors de la conversion de l\'image en ASCII');
      setIsLoading(false);
    }
  };

  const renderColoredAsciiToCanvas = (coloredAscii: string[][], width: number, height: number) => {
    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    
    // This is just a placeholder - in a real implementation, we would render the colored ASCII
    // to a canvas, but that's complex and beyond the scope of this example
    colorCanvas.width = width * 10;
    colorCanvas.height = height * 10;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiArt)
      .then(() => {
        toast.success('ASCII art copié dans le presse-papiers');
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Erreur lors de la copie dans le presse-papiers');
      });
  };

  const downloadAsciiArt = () => {
    const element = document.createElement('a');
    const file = new Blob([asciiArt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'image-ascii-art.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadColoredAsciiArt = () => {
    if (!resultRef.current) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Colored ASCII Art</title>
        <style>
          body {
            background-color: ${backgroundColor};
            font-family: monospace;
            line-height: 1;
            font-size: 10px;
            white-space: pre;
          }
        </style>
      </head>
      <body>
        <div>${coloredAsciiArt.map(row => row.join('')).join('<br>')}</div>
      </body>
      </html>
    `;
    
    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'colored-ascii-art.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Convertir une Image en ASCII Art
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Image d'entrée</h2>
          
          {!image ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
              <p className="text-gray-700 mb-2">
                {isDragActive
                  ? 'Déposez l\'image ici...'
                  : 'Glissez-déposez une image ici, ou cliquez pour sélectionner une image'}
              </p>
              <p className="text-sm text-gray-500">
                (Seuls les fichiers image sont acceptés)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={image} 
                  alt="Uploaded" 
                  className="w-full h-auto rounded-lg border border-gray-300" 
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Supprimer l'image"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <label htmlFor="charSet" className="block text-sm font-medium text-gray-700 mb-1">
                  Ensemble de caractères
                </label>
                <select
                  id="charSet"
                  value={charSet}
                  onChange={(e) => setCharSet(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="standard">Standard</option>
                  <option value="detailed">Détaillé</option>
                  <option value="simple">Simple</option>
                  <option value="blocks">Blocs</option>
                  <option value="minimal">Minimal</option>
                  <option value="dots">Points</option>
                  <option value="stars">Étoiles</option>
                  <option value="hearts">Cœurs</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>
              
              {charSet === 'custom' && (
                <div className="mb-4">
                  <label htmlFor="customChars" className="block text-sm font-medium text-gray-700 mb-1">
                    Caractères personnalisés (du plus sombre au plus clair)
                  </label>
                  <input
                    id="customChars"
                    type="text"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Entrez vos caractères personnalisés..."
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">
                  Résolution: {Math.round(resolution * 100)}%
                </label>
                <input
                  id="resolution"
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={resolution}
                  onChange={(e) => setResolution(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <input
                    id="inverted"
                    type="checkbox"
                    checked={inverted}
                    onChange={(e) => setInverted(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inverted" className="ml-2 block text-sm text-gray-700">
                    Inverser les couleurs
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="preserveColors"
                    type="checkbox"
                    checked={preserveColors}
                    onChange={(e) => setPreserveColors(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="preserveColors" className="ml-2 block text-sm text-gray-700">
                    Préserver les couleurs de l'image
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur de fond
                </label>
                <input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md"
                />
              </div>
              
              <button
                onClick={convertImageToAscii}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Conversion en cours...
                  </>
                ) : (
                  'Convertir en ASCII Art'
                )}
              </button>
            </div>
          )}
          
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <canvas ref={colorCanvasRef} style={{ display: 'none' }} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Résultat</h2>
            <div className="flex space-x-2">
              <button
                onClick={zoomOut}
                disabled={!asciiArt || zoom <= 0.5}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
                title="Zoom arrière"
              >
                <ZoomOut className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={zoomIn}
                disabled={!asciiArt || zoom >= 3}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
                title="Zoom avant"
              >
                <ZoomIn className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!asciiArt}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
                title="Copier dans le presse-papiers"
              >
                <Copy className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={preserveColors ? downloadColoredAsciiArt : downloadAsciiArt}
                disabled={!asciiArt}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
                title="Télécharger l'ASCII art"
              >
                <Download className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
          
          <div 
            ref={resultRef}
            className="border border-gray-300 rounded-md overflow-auto p-4 h-96"
            style={{ backgroundColor }}
          >
            {preserveColors && coloredAsciiArt.length > 0 ? (
              <div 
                style={{ 
                  fontFamily: 'monospace', 
                  lineHeight: '1', 
                  whiteSpace: 'pre',
                  fontSize: `${8 * zoom}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: coloredAsciiArt.map(row => row.join('')).join('<br>') 
                }}
              />
            ) : asciiArt ? (
              <SyntaxHighlighter
                language="text"
                style={docco}
                customStyle={{ 
                  backgroundColor: 'transparent',
                  color: '#000000',
                  margin: 0,
                  padding: 0,
                  fontSize: `${7 * zoom}px`,
                  lineHeight: '0.8rem',
                  fontFamily: 'monospace'
                }}
                wrapLines={true}
              >
                {asciiArt}
              </SyntaxHighlighter>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                <Palette className="h-12 w-12 mb-4 text-indigo-300" />
                <p>Le résultat de l'ASCII art apparaîtra ici...</p>
                <p className="text-sm mt-2">Téléchargez une image et cliquez sur "Convertir" pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800">Conseils pour la conversion d'images</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Les images avec un bon contraste donnent généralement de meilleurs résultats.</li>
          <li>Essayez différents ensembles de caractères pour voir lequel fonctionne le mieux avec votre image.</li>
          <li>Ajustez la résolution pour équilibrer le niveau de détail et la taille de l'ASCII art.</li>
          <li>Activez l'option \"Préserver les couleurs\" pour un résultat plus fidèle à l'image originale.</li>
          <li>Utilisez le zoom pour mieux voir les détails de votre ASCII art.</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageToAscii;