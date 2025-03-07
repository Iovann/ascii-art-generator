import React from 'react';
import { Link } from 'react-router-dom';
import { Type, Image, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Générateur d'ASCII Art
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transformez du texte ou des images en œuvres d'art ASCII magnifiques et personnalisées.
        </p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link 
            to="/text-to-ascii" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Commencer
          </Link>
          <Link 
            to="/gallery" 
            className="bg-white text-indigo-600 border border-indigo-200 font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg hover:border-indigo-300 transform hover:-translate-y-1"
          >
            Voir la galerie
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Type className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Texte en ASCII</h2>
          <p className="text-gray-600 mb-6 text-center">
            Convertissez n'importe quel texte en art ASCII avec différentes polices et styles.
          </p>
          <div className="text-center">
            <Link 
              to="/text-to-ascii" 
              className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
            >
              Essayer maintenant <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Image className="h-10 w-10 text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Image en ASCII</h2>
          <p className="text-gray-600 mb-6 text-center">
            Transformez vos photos en art ASCII coloré avec des options de personnalisation.
          </p>
          <div className="text-center">
            <Link 
              to="/image-to-ascii" 
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
            >
              Essayer maintenant <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Galerie d'exemples</h2>
          <p className="text-gray-600 mb-6 text-center">
            Explorez notre collection d'œuvres ASCII pour trouver l'inspiration.
          </p>
          <div className="text-center">
            <Link 
              to="/gallery" 
              className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
            >
              Explorer la galerie <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-10 rounded-2xl mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Qu'est-ce que l'ASCII Art?
        </h2>
        <p className="text-gray-700 mb-4 text-center max-w-3xl mx-auto">
          L'ASCII art est une technique artistique qui utilise des caractères du code ASCII 
          pour créer des images visuellement captivantes. Cette forme d'art numérique transforme 
          des lettres, chiffres et symboles en véritables œuvres d'art.
        </p>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          Notre générateur vous permet de créer facilement vos propres œuvres ASCII 
          à partir de texte ou d'images, avec la possibilité de préserver les couleurs 
          originales pour un résultat encore plus impressionnant.
        </p>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Prêt à créer votre propre ASCII Art?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/text-to-ascii" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Convertir du texte
          </Link>
          <Link 
            to="/image-to-ascii" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Convertir une image
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;