import React from "react";
import { Copy, Download } from "lucide-react";
import { toast } from 'react-toastify';

interface AsciiArtResultProps {
  asciiArt: string;
  textColor: string;
  backgroundColor: string;
}
export function AsciiArtResult({
  asciiArt,
  textColor,
  backgroundColor,
}: AsciiArtResultProps) {


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asciiArt);
      toast.success('ASCII art copié dans le presse-papiers');
    } catch{
      toast.error('Erreur lors de la copie');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([asciiArt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ascii-art.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base sm:text-xl font-semibold text-gray-800">Résultat</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!asciiArt}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
            title="Copier dans le presse-papiers"
          >
            <Copy className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleDownload}
            disabled={!asciiArt}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
            title="Télécharger en tant que fichier texte"
          >
            <Download className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div
        className="border border-gray-300 rounded-md overflow-auto p-4 lg:h-[350px] lg:w-full w-[90vw] sm:w-[80vw] "
        style={{ backgroundColor }}
      >
        {asciiArt ? (
          <pre className="text-xs sm:text-sm md:text-lg min-w-full w-full overflow-auto"
               style={{ color: textColor }}>
            {asciiArt}
          </pre>
        ) : (
          <p className="text-gray-500 italic text-center">
            Le résultat de l&apos;ASCII art apparaîtra ici...
          </p>
        )}
      </div>
    </div>
  );
}
