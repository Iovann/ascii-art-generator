// app/api/convert-to-ascii/route.ts
import { NextResponse } from "next/server";
import sharp from "sharp";

// Définition des ensembles de caractères ASCII disponibles
const asciiCharSets = {
  standard: "@%#*+=-:. ",
  detailed:
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  simple: "#@%=+*:-. ",
  blocks: "█▓▒░ ",
  minimal: "@:. ",
  dots: "●•·° ",
  stars: "★☆✮✯✡✧✦✥✤✣✢✜✛✪✫✬✭✮✯✰✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋",
  hearts: "❤♥♡💕💓💔💖💗💘💙💚💛💜💝",
};

// Type pour la configuration
interface AsciiConfig {
  charSet: string;
  customChars?: string;
  resolution: number;
  inverted: boolean;
  preserveColors: boolean;
  backgroundColor?: string;
  width?: number;
}

/**
 * Handler de route API pour la conversion d'images en ASCII art
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Aucune image fournie" },
        { status: 400 }
      );
    }

    // Récupérer la configuration
    let config: AsciiConfig = {
      charSet: "standard",
      resolution: 0.1,
      inverted: false,
      preserveColors: true,
      width: 300,
    };

    try {
      const configStr = formData.get("config") as string;
      if (configStr) {
        config = { ...config, ...JSON.parse(configStr) };
      }
    } catch (error) {
      console.warn(
        "Erreur de parsing de la configuration, utilisation des valeurs par défaut"
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    const MAX_WIDTH = 400;
    const targetWidth = Math.min(config.width || 100, MAX_WIDTH);
    const aspectRatio = (metadata.height || 1) / (metadata.width || 1);
    const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5);

    // Traiter l'image pour obtenir les pixels
    const processedImage = await sharp(buffer)
      .resize(targetWidth, targetHeight, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Générer l'ASCII art
    const { asciiArt, colorData } = processImage(
      processedImage.data,
      processedImage.info,
      config
    );

    if (!config.preserveColors) {
      // Version simple sans couleurs - génération directe de l'image avec le texte ASCII
      const fontSize = 12;
      const lineHeight = fontSize * 1.2;
      // Supprimer le padding ici
      const padding = 0;
      const lines = asciiArt.split("\n");
      const outputWidth = targetWidth * (fontSize * 0.6) + padding * 2;
      const outputHeight = lines.length * lineHeight + padding * 2;

      const svgImage = `
        <svg width="${outputWidth}" height="${outputHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${
            config.backgroundColor || "#ffffff"
          }"/>
          <text x="${padding}" y="${padding + fontSize}" 
                font-family="monospace" font-size="${fontSize}px" 
                letter-spacing="-0.1em" line-height="1"
                fill="${config.inverted ? "#ffffff" : "#000000"}">
            ${lines
              .map(
                (line, i) =>
                  `<tspan x="${padding}" dy="${i === 0 ? 0 : lineHeight}">${line
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")}</tspan>`
              )
              .join("")}
          </text>
        </svg>
      `;

      const finalImage = await sharp(Buffer.from(svgImage)).png().toBuffer();

      return new Response(finalImage, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="ascii-art.png"',
        },
      });
    } else {
      // Version avec préservation des couleurs - création d'une image basée sur les pixels colorés
      // Calculer les dimensions exactes nécessaires (sans padding)
      const fontSize = 8;
      const charWidth = fontSize * 0.6;
      const charHeight = fontSize * 1.2;
      
      const canvasWidth = targetWidth * charWidth;
      const canvasHeight = targetHeight * charHeight;

      // Créer une image pixel par pixel pour préserver les couleurs
      const canvas = sharp({
        create: {
          width: canvasWidth,
          height: canvasHeight,
          channels: 4,
          background: config.backgroundColor || "#ffffff",
        },
      });

      // Préparer un SVG qui préserve les couleurs (sans padding)
      let svgContent = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${
          config.backgroundColor || "#ffffff"
        }"/>`;

      for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
          const idx = y * targetWidth + x;
          if (colorData[idx]) {
            const { char, r, g, b } = colorData[idx];
            svgContent += `<text x="${x * charWidth}" y="${
              y * charHeight + fontSize
            }" 
                                 font-family="monospace" font-size="${fontSize}px" 
                                 fill="rgb(${r},${g},${b})">${char
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</text>`;
          }
        }
      }

      svgContent += `</svg>`;

      const finalImage = await sharp(Buffer.from(svgContent)).png().toBuffer();

      return new Response(finalImage, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="ascii-art-color.png"',
        },
      });
    }
  } catch (error) {
    console.error("Erreur de conversion:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la conversion",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * Convertit les données d'image en art ASCII
 * @param data - Buffer des données de pixels
 * @param info - Informations sur l'image
 * @param config - Configuration pour la conversion
 * @returns Résultat avec ASCII art plain text et données de couleur
 */
function processImage(
  data: Buffer,
  info: sharp.OutputInfo,
  config: AsciiConfig
) {
  const { width, height, channels } = info;

  // Utiliser les paramètres de configuration
  const {
    charSet = "standard",
    customChars = "",
    inverted = false,
    preserveColors = true,
  } = config;

  // Sélectionner l'ensemble de caractères
  const chars =
    charSet === "custom" && customChars
      ? customChars
      : asciiCharSets[charSet as keyof typeof asciiCharSets] ||
        asciiCharSets.standard;

  let asciiResult = "";
  const colorData: Array<{ char: string; r: number; g: number; b: number }> =
    [];

  // Traiter chaque pixel
  for (let y = 0; y < height; y++) {
    let rowString = "";

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;

      // Extraire les composantes RGB
      const r = data[idx] || 0;
      const g = channels > 1 ? data[idx + 1] : r;
      const b = channels > 2 ? data[idx + 2] : g;

      // Calculer la luminosité
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Sélectionner le caractère en fonction de la luminosité
      const charIndex = Math.floor(
        inverted
          ? (1 - brightness) * (chars.length - 1)
          : brightness * (chars.length - 1)
      );

      const char = chars[charIndex] || chars[0];

      rowString += char;
      colorData.push({ char, r, g, b });
    }

    asciiResult += rowString + "\n";
  }

  return {
    asciiArt: asciiResult, // Version texte brut
    colorData, // Données de couleur par caractère
  };
}