"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface AsciiControlsProps {
  image: string;
  charSet: string;
  customChars: string;
  resolution: number;
  inverted: boolean;
  preserveColors: boolean;
  backgroundColor: string;
  isLoading: boolean;
  onClearImage: () => void;
  onCharSetChange: (value: string) => void;
  onCustomCharsChange: (value: string) => void;
  onResolutionChange: (value: number) => void;
  onInvertedChange: (value: boolean) => void;
  onPreserveColorsChange: (value: boolean) => void;
  onBackgroundColorChange: (value: string) => void;
  onConvert: () => void;
  imageWidth?: number | null;
  imageHeight?: number | null;
}

export function AsciiControls({
  charSet,
  customChars,
  resolution,
  inverted,
  preserveColors,
  backgroundColor,
  isLoading,
  onCharSetChange,
  onCustomCharsChange,
  onResolutionChange,
  onInvertedChange,
  onPreserveColorsChange,
  onBackgroundColorChange,
  onConvert,
  imageWidth,
  imageHeight,
}: AsciiControlsProps) {
  // Résolution max adaptative selon la taille de l'image
  const baseMax = 2;
  const refSize = 800;
  const maxResolution =
    imageWidth && imageHeight
      ? Math.max(0.3, baseMax * (refSize / Math.max(imageWidth, imageHeight)))
      : baseMax;

  // Valeur par défaut à la moitié du max
  const defaultResolution = Math.round((0.1 + maxResolution) / 2 * 100) / 100;
  React.useEffect(() => {
    if (resolution === undefined || resolution === null || resolution === 0) {
      onResolutionChange(defaultResolution);
    }
  }, [maxResolution, defaultResolution, onResolutionChange, resolution]);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label
          htmlFor="charSet"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ensemble de caractères
        </label>
        <select
          id="charSet"
          value={charSet}
          onChange={(e) => onCharSetChange(e.target.value)}
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

      {charSet === "custom" && (
        <div className="mb-4">
          <label
            htmlFor="customChars"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Caractères personnalisés (du plus sombre au plus clair)
          </label>
          <input
            id="customChars"
            type="text"
            value={customChars}
            onChange={(e) => onCustomCharsChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Entrez vos caractères personnalisés..."
          />
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="resolution"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Résolution: {Math.round(resolution * 100)}% (max:{" "}
          {Math.round(maxResolution * 100)}%)
        </label>
        <input
          id="resolution"
          type="range"
          min="0.1"
          max={maxResolution}
          step="0.05"
          value={resolution}
          onChange={(e) => onResolutionChange(parseFloat(e.target.value))}
          disabled={isLoading}
        />
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center">
          <input
            id="inverted"
            type="checkbox"
            checked={inverted}
            onChange={(e) => onInvertedChange(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="inverted"
            className="ml-2 block text-sm text-gray-700"
          >
            Inverser les couleurs
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="preserveColors"
            type="checkbox"
            checked={preserveColors}
            onChange={(e) => onPreserveColorsChange(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="preserveColors"
            className="ml-2 block text-sm text-gray-700"
          >
            Préserver les couleurs de l&apos;image
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="backgroundColor"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Couleur de fond
        </label>
        <input
          id="backgroundColor"
          type="color"
          value={backgroundColor}
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          className="w-full p-1 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={onConvert}
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            Conversion en cours...
          </>
        ) : (
          "Convertir en ASCII Art"
        )}
      </button>
    </div>
  );
}
