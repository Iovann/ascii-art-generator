import Link from "next/link";

export function Description() {
  return (
    <>
      <section className="bg-accent px-4 py-8 sm:p-10 rounded-2xl mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-primary">
          Qu&apos;est-ce que l&apos;ASCII Art?
        </h2>
        <p className="text-sm sm:text-base mb-4 text-center max-w-3xl mx-auto">
          L&apos;ASCII art est une technique artistique qui utilise des
          caractères du code ASCII pour créer des images visuellement
          captivantes. Cette forme d&apos;art numérique transforme des lettres,
          chiffres et symboles en véritables œuvres d&apos;art.
        </p>
        <p className="text-sm sm:text-base text-center max-w-3xl mx-auto">
          Notre générateur vous permet de créer facilement vos propres œuvres
          ASCII à partir de texte ou d&apos;images, avec la possibilité de
          préserver les couleurs originales pour un résultat encore plus
          impressionnant.
        </p>
      </section>
      <section className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl px-4 font-bold mb-6 text-primary">
          Prêt à créer votre propre ASCII Art?
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-4">
          <Link
            href="/text-to-ascii"
            className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Convertir du texte
          </Link>
          <Link
            href="/image-to-ascii"
            className="bg-secondary hover:bg-primary-light text-white font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Convertir une image
          </Link>
        </div>
      </section>
    </>
  );
}
