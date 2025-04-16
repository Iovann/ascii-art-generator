'use client'

import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { asciiCharSets } from '../constants';

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
}

export  function AsciiControls({
  image,
  charSet,
  customChars,
  resolution,
  inverted,
  preserveColors,
  backgroundColor,
  isLoading,
  onClearImage,
  onCharSetChange,
  onCustomCharsChange,
  onResolutionChange,
  onInvertedChange,
  onPreserveColorsChange,
  onBackgroundColorChange,
  onConvert
}: AsciiControlsProps) {
  return (
    <div className="space-y-4">
      {/* <div className="relative">
        <img 
          src={image} 
          alt="Uploaded" 
          className="w-full h-auto rounded-lg border border-gray-300" 
        />
        <button
          onClick={onClearImage}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Supprimer l'image"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div> */}

      <div className="mb-4">
        <label htmlFor="charSet" className="block text-sm font-medium text-gray-700 mb-1">
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

      {charSet === 'custom' && (
        <div className="mb-4">
          <label htmlFor="customChars" className="block text-sm font-medium text-gray-700 mb-1">
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
        <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">
          Résolution: {Math.round(resolution * 100)}%
        </label>
        <input
          id="resolution"
          type="range"
          min="0.1"
          max="2"
          step="0.05"
          value={resolution}
          onChange={(e) => onResolutionChange(parseFloat(e.target.value))}
          className="w-full"
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
          <label htmlFor="inverted" className="ml-2 block text-sm text-gray-700">
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
          <label htmlFor="preserveColors" className="ml-2 block text-sm text-gray-700">
            Préserver les couleurs de l&apos;image
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
          'Convertir en ASCII Art'
        )}
      </button>
    </div>
  );
}; 