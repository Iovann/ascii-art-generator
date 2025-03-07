'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Copy, Download, RefreshCw } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import figlet from 'figlet';

// Import figlet fonts
import standard from 'figlet/importable-fonts/Standard.js';
import slant from 'figlet/importable-fonts/Slant.js';
import small from 'figlet/importable-fonts/Small.js';
import banner from 'figlet/importable-fonts/Banner.js';
import big from 'figlet/importable-fonts/Big.js';
import block from 'figlet/importable-fonts/Block.js';
import bubble from 'figlet/importable-fonts/Bubble.js';
import digital from 'figlet/importable-fonts/Digital.js';
import ivrit from 'figlet/importable-fonts/Ivrit.js';
import mini from 'figlet/importable-fonts/Mini.js';
import script from 'figlet/importable-fonts/Script.js';
import shadow from 'figlet/importable-fonts/Shadow.js';

// Register fonts
figlet.parseFont('Standard', standard);
figlet.parseFont('Slant', slant);
figlet.parseFont('Small', small);
figlet.parseFont('Banner', banner);
figlet.parseFont('Big', big);
figlet.parseFont('Block', block);
figlet.parseFont('Bubble', bubble);
figlet.parseFont('Digital', digital);
figlet.parseFont('Ivrit', ivrit);
figlet.parseFont('Mini', mini);
figlet.parseFont('Script', script);
figlet.parseFont('Shadow', shadow);

const fonts = [
  'Standard',
  'Slant',
  'Small',
  'Banner',
  'Big',
  'Block',
  'Bubble',
  'Digital',
  'Ivrit',
  'Mini',
  'Script',
  'Shadow'
];

const TextToAscii: React.FC = () => {
  const [inputText, setInputText] = useState('Hello World');
  const [asciiArt, setAsciiArt] = useState('');
  const [selectedFont, setSelectedFont] = useState('Standard');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateAsciiArt();
  }, [inputText, selectedFont]);

  const generateAsciiArt = () => {
    if (!inputText.trim()) {
      setAsciiArt('');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = figlet.textSync(inputText, {
        font: selectedFont,
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
      });
      
      setAsciiArt(result);
    } catch (error) {
      console.error('Error generating ASCII art:', error);
      toast.error('Erreur lors de la génération de l\'ASCII art');
    } finally {
      setIsLoading(false);
    }
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
    element.download = 'ascii-art.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Convertir du Texte en ASCII Art
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Texte d&apos;entrée</h2>
          
          <div className="mb-4">
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-1">
              Votre texte
            </label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Entrez votre texte ici..."
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="fontSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Police ASCII
            </label>
            <select
              id="fontSelect"
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 mb-1">
                Couleur du texte
              </label>
              <input
                id="textColor"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
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
          </div>
          
          <button
            onClick={generateAsciiArt}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              'Générer l\'ASCII Art'
            )}
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Résultat</h2>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!asciiArt}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                title="Copier dans le presse-papiers"
              >
                <Copy className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={downloadAsciiArt}
                disabled={!asciiArt}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                title="Télécharger en tant que fichier texte"
              >
                <Download className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
          
          <div 
            className="border border-gray-300 rounded-md overflow-auto p-4 h-80"
            style={{ backgroundColor, color: textColor }}
          >
            {asciiArt ? (
              <SyntaxHighlighter
                language="text"
                style={docco}
                customStyle={{ 
                  backgroundColor: 'transparent',
                  color: textColor,
                  margin: 0,
                  padding: 0
                }}
                wrapLines={true}
              >
                {asciiArt}
              </SyntaxHighlighter>
            ) : (
              <p className="text-gray-500 italic">
                Le résultat de l&apos;ASCII art apparaîtra ici...
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800">Conseils pour l&apos;ASCII Art</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Les textes courts fonctionnent généralement mieux pour l&apos;ASCII art.</li>
          <li>Essayez différentes polices pour voir laquelle convient le mieux à votre texte.</li>
          <li>Certaines polices sont plus adaptées aux grands écrans en raison de leur taille.</li>
          <li>Vous pouvez copier l&apos;ASCII art généré et l&apos;utiliser dans des e-mails, des documents ou sur les réseaux sociaux.</li>
        </ul>
      </div>
    </div>
  );
};

export default TextToAscii;