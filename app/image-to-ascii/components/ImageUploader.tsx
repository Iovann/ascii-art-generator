'use client'

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface ImageUploaderProps {
  image: string | null;
  width: number | null;
  height: number | null;
  onImageChange: (image: string | null, width: number | null, height: number | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ image, width, height, onImageChange }) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez télécharger une image valide');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          onImageChange(reader.result as string, img.width, img.height);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

  const clearImage = () => {
    onImageChange(null, null, null);
  };

  return (
    <div>
      {!image ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
          <p className="text-gray-700 mb-2">
            {isDragActive
              ? 'Déposez l\'image ici...'
              : 'Glissez-déposez une image ici, ou cliquez pour sélectionner une image'}
          </p>
          <p className="text-sm text-gray-500">
            (Seuls les fichiers image sont acceptés)
          </p>
        </div>
      ) : (
        <div className="relative">
          <img 
            src={image} 
            alt="Uploaded" 
            className="w-full h-auto rounded-lg border border-gray-300" 
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Supprimer l'image"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}; 