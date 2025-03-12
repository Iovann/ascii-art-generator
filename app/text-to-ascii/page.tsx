'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import figlet from 'figlet';
import {InputForm} from '@/src/components/text-to-ascii/InputForm';
import {AsciiArtResult} from '@/src/components/text-to-ascii/AsciiArtResult';
import {Tips} from '@/src/components/text-to-ascii/Tips';

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

export default function TextToAscii () {
  const [inputText, setInputText] = useState('Hello World');
  const [asciiArt, setAsciiArt] = useState('');
  const [selectedFont, setSelectedFont] = useState('Standard');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateAsciiArt();
  });

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

  return (
    <div className="container mx-auto sm:px-4 px-1 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary max-sm:px-4">
        Convertir du Texte en ASCII Art
      </h1>
      
      <div className="grid lg:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
        <div className="w-full">
          <InputForm
            inputText={inputText}
            setInputText={setInputText}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            textColor={textColor}
            setTextColor={setTextColor}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            isLoading={isLoading}
            generateAsciiArt={generateAsciiArt}
            fonts={fonts}
          />
        </div>
        
        <div className="w-full">
          <AsciiArtResult
            asciiArt={asciiArt}
            textColor={textColor}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
      
      <div className="mt-8 max-w-7xl mx-auto">
        <Tips />
      </div>
    </div>
  );
};