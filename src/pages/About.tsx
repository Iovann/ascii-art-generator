import React from "react";
import Link from "next/navigation";
import { Terminal, Code, Image, Share2, Palette } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        À propos du Générateur d'ASCII Art
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Qu'est-ce que l'ASCII Art?
        </h2>
        <p className="text-gray-700 mb-4">
          L'ASCII art est une technique artistique qui utilise des caractères du
          code ASCII (American Standard Code for Information Interchange) pour
          créer des images. Cette forme d'art a émergé dans les années 1960 et
          est devenue populaire avec l'avènement des premiers ordinateurs et
          imprimantes.
        </p>
        <p className="text-gray-700 mb-4">
          Avant l'ère des interfaces graphiques modernes, l'ASCII art était un
          moyen créatif d'afficher des images en utilisant uniquement des
          caractères textuels. Cette forme d'art a été largement utilisée dans
          les premiers jeux vidéo, les BBS (Bulletin Board Systems), les
          signatures d'e-mail, et même dans l'art numérique.
        </p>
        <p className="text-gray-700">
          Aujourd'hui, l'ASCII art continue d'être apprécié pour son esthétique
          rétro et sa simplicité. Il est utilisé dans divers contextes, des
          signatures d'e-mail aux jeux vidéo rétro, en passant par l'art
          numérique et les interfaces en ligne de commande.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Fonctionnalités de notre générateur
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Terminal className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Conversion de texte en ASCII
              </h3>
              <p className="mt-1 text-gray-600">
                Transformez n'importe quel texte en art ASCII avec différentes
                polices et styles. Personnalisez les couleurs et téléchargez
                votre création.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Image className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Conversion d'images en ASCII
              </h3>
              <p className="mt-1 text-gray-600">
                Téléchargez n'importe quelle image et transformez-la en art
                ASCII détaillé. Ajustez la résolution et les caractères utilisés
                pour un résultat optimal.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Palette className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Options de personnalisation
              </h3>
              <p className="mt-1 text-gray-600">
                Personnalisez vos créations avec différentes polices, couleurs,
                et ensembles de caractères. Ajustez la résolution et inversez
                les couleurs pour des effets uniques.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Share2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Partage et téléchargement
              </h3>
              <p className="mt-1 text-gray-600">
                Copiez facilement votre ASCII art dans le presse-papiers ou
                téléchargez-le sous forme de fichier texte. Partagez vos
                créations avec vos amis ou utilisez-les dans vos projets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Technologies utilisées
        </h2>
        <p className="text-gray-700 mb-4">
          Notre générateur d'ASCII art est construit avec les technologies web
          modernes suivantes:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            <strong>React:</strong> Une bibliothèque JavaScript pour construire
            des interfaces utilisateur interactives.
          </li>
          <li>
            <strong>TypeScript:</strong> Un sur-ensemble typé de JavaScript qui
            améliore la qualité du code.
          </li>
          <li>
            <strong>Tailwind CSS:</strong> Un framework CSS utilitaire pour
            créer des designs personnalisés rapidement.
          </li>
          <li>
            <strong>Figlet:</strong> Une bibliothèque pour générer des textes en
            ASCII art avec différentes polices.
          </li>
          <li>
            <strong>Canvas API:</strong> Utilisée pour le traitement d'images et
            la conversion en ASCII art.
          </li>
          <li>
            <strong>React Router:</strong> Pour la navigation entre les
            différentes pages de l'application.
          </li>
        </ul>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">
          Prêt à créer votre propre ASCII Art?
        </h2>
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

export default About;
