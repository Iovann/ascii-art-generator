export const Tips = () => {
  return (
    <div className="mt-8 bg-indigo-50 p-4 md:p-6 rounded-lg">
      <h2 className="text-base sm:text-xl font-semibold mb-4 text-primary">
        Conseils pour la conversion d&apos;images
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm sm:text-base">
        <li>Privilégiez les images avec un bon contraste et une taille raisonnable (moins de 800x800 px) pour un traitement rapide et un rendu optimal.</li>
        <li>Plus l&apos;image a une haute résolution ou un poids important, plus le traitement peut être long.</li>
        <li>Essayez différents ensembles de caractères (classiques, détaillés, blocs, symboles, etc.) pour adapter le style ASCII à votre image.</li>
        <li>Ajustez la <strong>résolution</strong> pour équilibrer le niveau de détail et la lisibilité : une résolution plus faible donne un ASCII plus simple, une résolution plus élevée offre plus de détails mais peut rendre l&apos;image moins lisible.</li>
        <li>Activez l&apos;option <strong>&quot;Préserver les couleurs&quot;</strong> pour un résultat plus fidèle à l&apos;image originale, ou désactivez-la pour un rendu noir et blanc classique.</li>
        <li>Utilisez le zoom pour mieux voir les détails de votre ASCII art ou pour l&apos;adapter à votre écran.</li>
        <li>Vous pouvez copier, partager ou télécharger le résultat facilement depuis l&apos;interface.</li>
        <li>Options de téléchargement :
          <ul className="list-disc pl-5 mt-1">
            <li><strong>SVG</strong> : offre la meilleure qualité et est idéal pour l&apos;impression ou la modification, mais le fichier peut être volumineux.</li>
            <li><strong>PNG/JPG</strong> : plus légers, adaptés au partage ou à l&apos;utilisation web, mais la qualité peut être légèrement réduite.</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};