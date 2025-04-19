// app/api/convert-to-ascii/route.ts
import { NextResponse } from "next/server";
import Jimp from "jimp";

export const runtime = 'nodejs';

// Définition des ensembles de caractères ASCII disponibles
const asciiCharSets: Record<string, string> = {
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
  aspectCorrection?: number;
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
      aspectCorrection: 0.5,
    };

    try {
      const configStr = formData.get("config") as string;
      if (configStr) {
        config = { ...config, ...JSON.parse(configStr) };
      }
    } catch {
      console.warn(
        "Erreur de parsing de la configuration, utilisation des valeurs par défaut"
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer as ArrayBuffer);

    // --- Remplacement de SHARP par JIMP ---
    // Lecture de l'image avec Jimp
    let image = await Jimp.read(buffer);

    // Réduction systématique des images trop grandes
    const MAX_DIM = 800;
    if (image.getWidth() > MAX_DIM || image.getHeight() > MAX_DIM) {
      image = image.resize(MAX_DIM, Jimp.AUTO);
    }

    const MAX_WIDTH = 400;
    const targetWidth = Math.min(config.width || 100, MAX_WIDTH);
    const aspectRatio = image.getHeight() / image.getWidth();
    const aspectCorrection = config.aspectCorrection || 0.65;
    const targetHeight = Math.floor(targetWidth * aspectRatio * aspectCorrection);

    // Redimensionner à la taille finale
    image = image.resize(targetWidth, targetHeight);

    // Récupérer les pixels
    const { data, width, height } = image.bitmap;
    // Jimp retourne un buffer RGBA
    const processedImage = {
      data,
      info: {
        width,
        height,
        channels: 4, // RGBA
      },
    };

    // Générer l'ASCII art
    const { asciiArt, colorData } = processImage(
      processedImage.data,
      processedImage.info,
      config
    );

    if (!config.preserveColors) {
      // Version simple sans couleurs - génération directe de l'image avec le texte ASCII
      const fontSize = 12;
      // Réduire l'interligne pour un meilleur aspect ratio
      const lineHeight = fontSize;
      const padding = 0;
      const lines = asciiArt.split("\n");
      // Maintenir les mêmes proportions pour la sortie finale
      const charWidth = fontSize * 0.6; // Facteur typique pour une police monospace
      const outputWidth = targetWidth * charWidth + padding * 2;
      const outputHeight = targetHeight * fontSize + padding * 2;
      const svgImage = `
        <svg width="${outputWidth}" height="${outputHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${
            config.backgroundColor || "#ffffff"
          }"/>
          <text x="${padding}" y="${padding + fontSize}" 
                font-family="monospace" font-size="${fontSize}px" 
                letter-spacing="0" line-height="1"
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
      // Retourner le SVG directement (plus de conversion PNG serverless)
      return new Response(svgImage, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": 'inline; filename="ascii-art.svg"',
        },
      });
    } else {
      // Version avec préservation des couleurs
      const fontSize = 8;
      const charWidth = fontSize * 0.6;
      const charHeight = fontSize;
      const canvasWidth = targetWidth * charWidth;
      const canvasHeight = targetHeight * charHeight;

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
                                     letter-spacing="0"
                                     fill="rgb(${r},${g},${b})">${char
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</text>`;
          }
        }
      }
      svgContent += `</svg>`;
      // Retourner le SVG coloré directement
      return new Response(svgContent, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": 'inline; filename="ascii-art-color.svg"',
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
  info: { width: number; height: number; channels: number },
  config: AsciiConfig
) {
  const { width, height, channels } = info;
  const {
    charSet = "standard",
    customChars = "",
    inverted = false,
  } = config;
  const chars =
    charSet === "custom" && customChars
      ? customChars
      : asciiCharSets[charSet] || asciiCharSets["standard"];
  let asciiResult = "";
  const colorData: { char: string; r: number; g: number; b: number }[] = [];
  for (let y = 0; y < height; y++) {
    let rowString = "";
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx + 0];
      const g = data[idx + 1];
      const b = data[idx + 2];
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