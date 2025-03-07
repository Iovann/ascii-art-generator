import React from 'react';
import { Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Sample ASCII art examples
const galleryItems = [
  {
    id: 1,
    title: 'Chat',
    author: 'ASCII Artist',
    type: 'Animal',
    art: `
 /\\_/\\
( o.o )
 > ^ <
    `,
    color: '#3B82F6'
  },
  {
    id: 2,
    title: 'Château',
    author: 'ASCII Creator',
    type: 'Architecture',
    art: `
    /\\
   /  \\
  /____\\
  |    |
  |[]  |
  |    |
  |    |
__|____|____
    `,
    color: '#10B981'
  },
  {
    id: 3,
    title: 'Fleur',
    author: 'Text Artist',
    type: 'Nature',
    art: `
   _
 _(_)_
(_)@(_)
  (_)
   |
   |
  \\|/
   `,
    color: '#EC4899'
  },
  {
    id: 4,
    title: 'Voiture',
    author: 'ASCII Designer',
    type: 'Transport',
    art: `
    ____
  _/  |_\\_
 |_______|
  O     O
    `,
    color: '#F59E0B'
  },
  {
    id: 5,
    title: 'Coeur',
    author: 'Text Crafter',
    type: 'Symbole',
    art: `
 /\\  /\\
(  \\/  )
 \\    /
  \\  /
   \\/
    `,
    color: '#EF4444'
  },
  {
    id: 6,
    title: 'Bateau',
    author: 'ASCII Sailor',
    type: 'Transport',
    art: `
    |\\
    |\\\\
    | \\\\
    |  \\\\
    |___\\\\
 __|____\\_____
 \\___________/
~~~~~~~~~~~~~~~~~
    `,
    color: '#6366F1'
  },
  {
    id: 7,
    title: 'Arbre',
    author: 'Nature Artist',
    type: 'Nature',
    art: `
    /\\
   /  \\
  /    \\
 /      \\
/        \\
----||----
    ||
    ||
    `,
    color: '#047857'
  },
  {
    id: 8,
    title: 'Visage Souriant',
    author: 'Emoji Creator',
    type: 'Émoticône',
    art: `
 _____
/     \\
| ^_^ |
\\_____/
    `,
    color: '#FBBF24'
  }
];

const Gallery: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Galerie d'ASCII Art
      </h1>
      
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
        Explorez notre collection d'œuvres ASCII pour trouver l'inspiration. 
        Chaque création montre les possibilités artistiques des caractères simples.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Par: {item.author}</span>
                <span>Type: {item.type}</span>
              </div>
            </div>
            
            <div className="p-4" style={{ backgroundColor: item.color + '10' }}>
              <SyntaxHighlighter
                language="text"
                style={docco}
                customStyle={{ 
                  backgroundColor: 'transparent',
                  color: item.color,
                  margin: 0,
                  padding: 0,
                  fontFamily: 'monospace'
                }}
                wrapLines={true}
              >
                {item.art}
              </SyntaxHighlighter>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">
          Créez votre propre ASCII Art
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Inspiré par notre galerie? Créez votre propre ASCII art en utilisant notre générateur.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/text-to-ascii" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Convertir du texte
          </Link>
          <Link 
            to="/image-to-ascii" 
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