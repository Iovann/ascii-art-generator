import React from "react";
import Link from "next/link";
import { Terminal, Image, Share2, Palette } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl md:text-2xl xl:text-3xl font-bold mb-6 text-center text-primary">
        À propos du Générateur d&apos;ASCII Art
      </h1>

      <div className="bg-white p-4 md:p-6 xl:p-8 rounded-lg shadow-md mb-8 max-sm:text-justify max-sm:text-sm">
        <h2 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-semibold mb-4 text-gray-800">
          L&apos;ASCII Art&nbsp;: l&apos;art de coder des images avec du texte
        </h2>
        <p className="text-gray-700 mb-4">
          L&apos;ASCII art est une forme d&apos;art numérique née dans les années 1960, qui consiste à représenter des images en utilisant uniquement des caractères du clavier. Véritable héritage de l&apos;époque des premiers ordinateurs et terminaux, il allie créativité, astuce et minimalisme.
        </p>
        <p className="text-gray-700 mb-4">
          Avant l&apos;arrivée des interfaces graphiques, l&apos;ASCII art permettait de donner vie à des illustrations, logos ou portraits sur des écrans et imprimantes limités au texte. Aujourd&apos;hui, il séduit toujours par son esthétique rétro, sa simplicité et son côté ludique.
        </p>
        <p className="text-gray-700">
          Que ce soit pour personnaliser un profil, décorer un terminal, partager sur les réseaux ou simplement s&apos;amuser, l&apos;ASCII art est un terrain d&apos;expression unique où chaque caractère compte.
        </p>
      </div>

      <div className="bg-white p-4 md:p-6 xl:p-8 rounded-lg shadow-md mb-8 max-sm:text-justify max-sm:text-sm">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-gray-800">
          Pourquoi utiliser notre générateur&nbsp;?
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Transformez facilement vos <strong>images</strong> ou <strong>textes</strong> en œuvres ASCII originales.</li>
          <li>Choisissez parmi plusieurs <strong>styles de caractères</strong> (classiques, blocs, symboles, etc.).</li>
          <li>Ajustez la <strong>résolution</strong>, la <strong>correction des proportions</strong> et la <strong>palette de couleurs</strong> pour un rendu sur mesure.</li>
          <li>Prévisualisez, zoomez, copiez, partagez ou téléchargez vos créations en un clic.</li>
          <li>Accessible sur tous les supports (ordinateur, mobile, tablette) avec une interface moderne et intuitive.</li>
        </ul>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Terminal className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <span className="font-semibold text-gray-800">Conversion de texte</span>
              <p className="text-gray-600 text-sm">Tapez ou collez un texte pour le transformer en ASCII art instantanément.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Image className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <span className="font-semibold text-gray-800">Conversion d&apos;images</span>
              <p className="text-gray-600 text-sm">Importez une photo ou un dessin pour obtenir sa version ASCII personnalisée.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Palette className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <span className="font-semibold text-gray-800">Options avancées</span>
              <p className="text-gray-600 text-sm">Résolution, couleurs, inversion, caractères personnalisés, correction des proportions… tout est paramétrable.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Share2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <span className="font-semibold text-gray-800">Partage et export</span>
              <p className="text-gray-600 text-sm">Copiez, partagez ou téléchargez facilement vos créations ASCII pour les utiliser partout.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 xl:p-8 rounded-lg shadow-md mb-8 max-sm:text-justify max-sm:text-sm">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-gray-800">
          Envie d&apos;essayer&nbsp;?
        </h2>
        <p className="text-gray-700 mb-6">
          Lancez-vous et découvrez la magie de l&apos;ASCII art en quelques clics. Que vous soyez nostalgique du rétro, amateur de pixel art ou simplement curieux, ce générateur est fait pour vous&nbsp;!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/text-to-ascii" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
            Convertir du texte
          </Link>
          <Link href="/image-to-ascii" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
            Convertir une image
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
