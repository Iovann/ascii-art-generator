"use client";

import React from "react";
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

export const AsciiResult: React.FC<AsciiResultProps> = ({
  backgroundColor,
  zoom,
  src,
  onZoomIn,
  onZoomOut,
  onDownload,
}) => {
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
            title="Télécharger l'image"
          >
            <Download className="h-5 w-5 text-gray-700" />
          </button>
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
