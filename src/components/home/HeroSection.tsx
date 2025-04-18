import Link from "next/link"

export function HeroSection () {
    return(
        <section className="relative min-h-[85vh] flex items-center justify-center mb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 " 
          style={{ 
            backgroundImage: "url('/images/matrix.webp')",
          }}
        >
        </div>

        {/* Contenu */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 text-white">
            Générateur d&apos;ASCII Art
          </h1>
          <p className="text-base sm:text-xl text-gray-100 max-w-3xl mx-auto mb-8">
            Transformez du texte ou des images en œuvres d&apos;art ASCII magnifiques et personnalisées.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/text-to-ascii" 
              className="bg-primary hover:bg-button-hover text-white font-bold  py-2 px-5 sm:py-4 sm:px-10 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Commencer
            </Link>
            <Link 
              href="/gallery" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold py-2 px-5 sm:py-4 sm:px-10 rounded-full transition-all backdrop-blur-sm shadow-md hover:shadow-lg"
            >
              Voir la galerie
            </Link>
          </div>
        </div>
      </section>
    )
}