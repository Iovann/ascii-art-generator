"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { ImageUploader } from "./components/ImageUploader";
import { AsciiControls } from "./components/AsciiControls";
import { AsciiResult } from "./components/AsciiResult";
import { Tips } from "./components/Tips";

export default function ImageToAscii() {
  const [image, setImage] = useState<string | null>(null);
  const [asciiResult, setAsciiResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [charSet, setCharSet] = useState("standard");
  const [customChars, setCustomChars] = useState("");
  const [resolution, setResolution] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [preserveColors, setPreserveColors] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [zoom, setZoom] = useState(1);

  // Nettoie l'image et le résultat ASCII
  const clearImage = () => {
    setImage(null);
    setAsciiResult("");
  };

  // Conversion image -> ASCII (API call)
  const convertImageToAscii = async () => {
    if (!image) {
      toast.error("Veuillez d'abord télécharger une image");
      return;
    }
    setIsLoading(true);
    try {
      // Convertir l'image base64 en File
      const base64Data = image.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: "image/png" });
      const file = new File([blob], "image.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("image", file);
      formData.append(
        "config",
        JSON.stringify({
          charSet,
          customChars,
          resolution,
          inverted,
          preserveColors,
          backgroundColor,
          width: Math.floor(300 * resolution),
        })
      );

      const response = await fetch("/api/ascii-convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur de conversion:", errorData);
        toast.error(errorData.details || "Erreur lors de la conversion");
        throw new Error(errorData.error || "Erreur lors de la conversion");
      }

      // Créer un blob à partir de la réponse
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      console.log(imageUrl);
      setAsciiResult(imageUrl);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la conversion en ASCII");
    } finally {
      setIsLoading(false);
    }
  };

  // Zoom controls
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  // Télécharger l'image ASCII
  const downloadAsImage = () => {
    if (!asciiResult) return;
    const link = document.createElement("a");
    link.download = "ascii-art.png";
    link.href = asciiResult;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl md:text-2xl xl:ext-3xl font-bold mb-6 text-center text-primary">
        Convertir une image en ASCII Art
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ImageUploader
            image={image}
            onImageChange={setImage}
          />
          {image && (
            <AsciiControls
              image={image}
              charSet={charSet}
              customChars={customChars}
              resolution={resolution}
              inverted={inverted}
              preserveColors={preserveColors}
              backgroundColor={backgroundColor}
              isLoading={isLoading}
              onClearImage={clearImage}
              onCharSetChange={setCharSet}
              onCustomCharsChange={setCustomChars}
              onResolutionChange={setResolution}
              onInvertedChange={setInverted}
              onPreserveColorsChange={setPreserveColors}
              onBackgroundColorChange={setBackgroundColor}
              onConvert={convertImageToAscii}
            />
          )}
        </div>
        <div className="bg-white sm:p-6 rounded-lg shadow-md">
          <AsciiResult
            backgroundColor={backgroundColor}
            zoom={zoom}
            src={asciiResult}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onDownload={downloadAsImage}
          />
        </div>
      </div>
      <Tips />
    </div>
  );
}
