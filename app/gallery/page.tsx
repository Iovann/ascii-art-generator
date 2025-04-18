import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { galleryItems } from './constant';

const Gallery: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl md:text-2xl xl:text-3xl font-bold mb-6 text-center text-primary">
        Galerie d&apos;images ASCII Art
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
        Explorez notre collection d&apos;images générées en ASCII Art ou ajoutez les vôtres !
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
            </div>
            <div className="p-4 flex justify-center items-center">
              <Image
                src={item.src}
                alt={item.title}
                width={250}
                height={250}
                className="object-contain rounded shadow h-full w-full"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Créez votre propre ASCII Art
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Inspiré par notre galerie ? Créez votre propre ASCII art en utilisant notre générateur.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href={"/text-to-ascii"} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Convertir du texte
          </Link>
          <Link 
            href={"/image-to-ascii"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Convertir une image
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gallery;