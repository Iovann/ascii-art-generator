"use client";

import React, { useState } from "react";
import { Download, ZoomIn, ZoomOut, Palette } from "lucide-react";
import Image from "next/image";

interface AsciiResultProps {
  backgroundColor: string;
  zoom: number;
  src: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
}

// Utilitaire pour télécharger des fichiers
function downloadFile(data: string | ArrayBuffer, filename: string, type: string) {
  if (typeof data === 'string') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Convertir SVG en image raster (PNG/JPG)
async function svgToRaster(svgUrl: string, format: 'png' | 'jpeg', width = 600, height = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Canvas context error');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(`image/${format}`));
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
}

export const AsciiResult: React.FC<AsciiResultProps> = ({
  backgroundColor,
  zoom,
  src,
  onZoomIn,
  onZoomOut,
  onDownload,
}) => {
  // Dropdown état : par défaut sur PNG
  const [downloadType, setDownloadType] = useState<'svg' | 'png' | 'jpeg'>('png');
  const [loading, setLoading] = useState(false);

  // Gestion du téléchargement selon le type choisi
  const handleDownload = async () => {
    if (!src) return;
    setLoading(true);
    try {
      if (downloadType === 'svg') {
        if (src.startsWith('data:image/svg+xml')) {
          const base64 = src.split(',')[1];
          const svgString = atob(base64);
          downloadFile(svgString, 'ascii-art.svg', 'image/svg+xml');
        } else {
          const response = await fetch(src);
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('svg')) {
            const svgString = await response.text();
            downloadFile(svgString, 'ascii-art.svg', 'image/svg+xml');
          } else {
            const blob = await response.blob();
            downloadFile(await blob.arrayBuffer(), 'ascii-art', blob.type);
          }
        }
      } else {
        // PNG ou JPG : convertir le src (SVG ou image) en raster
        const dataUrl = await svgToRaster(src, downloadType);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `ascii-art.${downloadType === 'jpeg' ? 'jpg' : downloadType}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base sm:text-xl font-semibold text-gray-800">Résultat</h2>
        <div className="flex space-x-2">
          <button
            onClick={onZoomOut}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            title="Zoom arrière"
          >
            <ZoomOut className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={onZoomIn}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            title="Zoom avant"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            title="Télécharger l'image (original)"
          >
            <Download className="h-5 w-5 text-gray-700" />
          </button>
          {/* Sélecteur de format + bouton de téléchargement custom */}
          <div className="flex items-center space-x-2">
            <select
              value={downloadType}
              onChange={e => setDownloadType(e.target.value as 'svg' | 'png' | 'jpeg')}
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700"
              disabled={loading}
            >
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
            </select>
            <button
              onClick={handleDownload}
              className={`p-2 rounded-md transition-colors bg-indigo-500 hover:bg-indigo-600 text-white flex items-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
              title={`Télécharger en ${downloadType.toUpperCase()}`}
              type="button"
            >
              {loading ? '...' : `Télécharger (${downloadType.toUpperCase()})`}
            </button>
          </div>
        </div>
      </div>

      <div
        className="border border-gray-300 rounded-md overflow-auto"
        style={{
          backgroundColor,
          minHeight: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {src ? (
            <Image
              src={src}
              alt="ASCII Art"
              width={600}
              height={400}
              className="w-full h-auto"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <Palette className="h-12 w-12 mb-4 text-indigo-300" />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
