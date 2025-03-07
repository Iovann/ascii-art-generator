import Link from "next/link";
import { Type, Image, BookOpen } from "lucide-react";

const ctaData = [
  {
    icon: Type,
    title: "Texte en ASCII",
    description: "Convertissez n'importe quel texte en art ASCII avec différentes polices et styles.",
    href: "/text-to-ascii",
    ctaText: "Essayer maintenant"
  },
  {
    icon: Image,
    title: "Image en ASCII",
    description: "Transformez vos photos en art ASCII coloré avec des options de personnalisation.",
    href: "/image-to-ascii",
    ctaText: "Essayer maintenant"
  },
  {
    icon: BookOpen,
    title: "Galerie d'exemples",
    description: "Explorez notre collection d'œuvres ASCII pour trouver l'inspiration.",
    href: "/gallery",
    ctaText: "Explorer la galerie"
  }
];

export function CtaSection() {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 place-items-center gap-8 mb-16">
      {ctaData.map((item, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center"
        >
          <div className="p-3 bg-accent rounded-full mb-4">
            <item.icon className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{item.title}</h2>
          <p className="text-gray-600 mb-6">{item.description}</p>
          <Link
            href={item.href}
            className="text-primary hover:text-primary-light font-medium inline-flex items-center"
          >
            {item.ctaText} <span className="ml-1">→</span>
          </Link>
        </div>
      ))}
    </section>
  );
}

export default CtaSection;
