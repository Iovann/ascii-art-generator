'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Upload, Copy, Download, RefreshCw, Trash2, ZoomIn, ZoomOut, Palette } from 'lucide-react';


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
  const previewImageRef = useRef<HTMLImageElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const enhanceImageContrast = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Trouver les valeurs min et max
    let min = 255;
    let max = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const val = 0.3 * r + 0.59 * g + 0.11 * b;
      
      if (val < min) min = val;
      if (val > max) max = val;
    }
    
    // Appliquer l'étirement de contraste
    const factor = 255 / (max - min);
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - min) * factor));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - min) * factor));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - min) * factor));
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

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
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      const img = new Image();
      img.onload = () => {
        // Utiliser les dimensions exactes de l'image
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Améliorer le contraste
        enhanceImageContrast(ctx, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Calculer la taille optimale des caractères
        const charWidth = Math.max(2, Math.floor(canvas.width / 300));
        const charHeight = charWidth * 1.5; // Ratio pour maintenir la proportion
        
        const cols = Math.floor(canvas.width / charWidth);
        const rows = Math.floor(canvas.height / charHeight);

        // Créer le canvas de sortie
        const outputCanvas = document.createElement('canvas');
        const outputCtx = outputCanvas.getContext('2d');
        if (!outputCtx) throw new Error('Could not get output context');

        // Configurer le canvas de sortie
        outputCanvas.width = canvas.width;
        outputCanvas.height = canvas.height;
        outputCtx.fillStyle = '#ffffff';
        outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        // Configurer le texte
        outputCtx.font = `${charWidth}px monospace`;
        outputCtx.textBaseline = 'top';

        let asciiResult = '';
        const coloredResult: string[][] = [];

        for (let y = 0; y < rows; y++) {
          const coloredRow: string[] = [];
          let rowString = '';

          for (let x = 0; x < cols; x++) {
            const pixelX = Math.floor(x * charWidth);
            const pixelY = Math.floor(y * charHeight);
            
            // Calculer la couleur moyenne du bloc
            let r = 0, g = 0, b = 0;
            let count = 0;

            for (let py = 0; py < charHeight; py++) {
              for (let px = 0; px < charWidth; px++) {
                const idx = ((pixelY + py) * canvas.width + (pixelX + px)) * 4;
                if (idx < data.length) {
                  r += data[idx];
                  g += data[idx + 1];
                  b += data[idx + 2];
                  count++;
                }
              }
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            // Calculer la luminosité et choisir le caractère
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const chars = asciiCharSets[charSet as keyof typeof asciiCharSets];
            const charIndex = Math.floor(brightness * (chars.length - 1));
            const char = chars[charIndex];

            // Dessiner le caractère
            outputCtx.fillStyle = `rgb(${r},${g},${b})`;
            outputCtx.fillText(char, pixelX, pixelY);

            rowString += char;
            coloredRow.push(`<span style="color:rgb(${r},${g},${b})">${char}</span>`);
          }
          asciiResult += rowString + '\n';
          coloredResult.push(coloredRow);
        }

        setAsciiArt(asciiResult);
        setColoredAsciiArt(coloredResult);
        setPreviewImage(outputCanvas.toDataURL('image/png'));
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

  const downloadAsImage = () => {
    if (!previewImageRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'ascii-art.png';
    link.href = previewImageRef.current.src;
    link.click();
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const renderAsciiArt = () => {
    if (!asciiArt) return null;

    return (
      <div 
        style={{ 
          fontFamily: 'monospace', 
          lineHeight: '0.8',
          fontSize: `${7 * zoom}px`,
          letterSpacing: '-0.1em',
          whiteSpace: 'pre',
          backgroundColor: backgroundColor,
          color: inverted ? backgroundColor : '#000000',
          padding: '0',
          overflow: 'hidden',
          display: 'inline-block',
          transformOrigin: 'top left',
          transform: `scale(${zoom})`
        }}
      >
        {preserveColors ? (
          <div dangerouslySetInnerHTML={{ 
            __html: coloredAsciiArt.map(row => row.join('')).join('\n') 
          }} />
        ) : (
          asciiArt
        )}
      </div>
    );
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
                onClick={downloadAsImage}
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
            {asciiArt ? (
              renderAsciiArt()
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                <Palette className="h-12 w-12 mb-4 text-indigo-300" />
                <p>Le résultat de l'ASCII art apparaîtra ici...</p>
                <p className="text-sm mt-2">Téléchargez une image et cliquez sur &quot;Convertir&quot; pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800">Conseils pour la conversion d&apos;images</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Les images avec un bon contraste donnent généralement de meilleurs résultats.</li>
          <li>Essayez différents ensembles de caractères pour voir lequel fonctionne le mieux avec votre image.</li>
          <li>Ajustez la résolution pour équilibrer le niveau de détail et la taille de l&apos;ASCII art.</li>
          <li>Activez l&apos;option &quot;Préserver les couleurs&quot; pour un résultat plus fidèle à l&apos;image originale.</li>
          <li>Utilisez le zoom pour mieux voir les détails de votre ASCII art.</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageToAscii;