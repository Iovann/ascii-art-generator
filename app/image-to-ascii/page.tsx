"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { asciiCharSets } from "./constants";
import { ImageUploader } from "./components/ImageUploader";
import { AsciiControls } from "./components/AsciiControls";
import { AsciiResult } from "./components/AsciiResult";
import { Tips } from "./components/Tips";

export default function ImageToAscii() {
  const [image, setImage] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState("");
  const [coloredAsciiArt, setColoredAsciiArt] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [charSet, setCharSet] = useState("standard");
  const [customChars, setCustomChars] = useState("");
  const [resolution, setResolution] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [preserveColors, setPreserveColors] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [zoom, setZoom] = useState(1);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiResult, setAsciiResult] = useState<string>("");
  const previewImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (charSet === "custom" && customChars.trim() === "") {
      setCustomChars(asciiCharSets.standard);
    }
  }, [charSet, customChars]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez télécharger une image valide");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const clearImage = () => {
    setImage(null);
    setAsciiArt("");
    setColoredAsciiArt([]);
  };

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
      // Nettoyer l'URL créée quand l'image est chargée
      previewImageRef.current?.addEventListener(
        "load",
        () => {
          URL.revokeObjectURL(imageUrl);
        },
        { once: true }
      );
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la conversion en ASCII");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(asciiArt)
      .then(() => {
        toast.success("ASCII art copié dans le presse-papiers");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast.error("Erreur lors de la copie dans le presse-papiers");
      });
  };

  const downloadAsImage = () => {
    if (!asciiResult) return;
    const link = document.createElement("a");
    link.download = "ascii-art.png";
    link.href = asciiResult;
    link.click();
  };
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Convertir une Image en ASCII Art
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Image d&apos;entrée
          </h2>

          <ImageUploader 
            image={image}
            onImageChange={(img, w, h) => {
              setImage(img);
              setImageWidth(w);
              setImageHeight(h);
            }}
          />

          {image && (
            <AsciiControls
              charSet={charSet}
              customChars={customChars}
              resolution={resolution}
              inverted={inverted}
              preserveColors={preserveColors}
              backgroundColor={backgroundColor}
              isLoading={isLoading}
              onCharSetChange={setCharSet}
              onCustomCharsChange={setCustomChars}
              onResolutionChange={setResolution}
              onInvertedChange={setInverted}
              onPreserveColorsChange={setPreserveColors}
              onBackgroundColorChange={setBackgroundColor}
              onConvert={convertImageToAscii}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
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

      {/* Canvas cachés pour le traitement d'image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={colorCanvasRef} style={{ display: "none" }} />
    </div>
  );
}
