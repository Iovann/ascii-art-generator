'use client'

import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

interface ImageDropzoneProps {
  onImageSelect: (imageData: string) => void;
}

export default function ImageDropzone({ onImageSelect }: ImageDropzoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez télécharger une image valide');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result as string);
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

  return (
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
  );
} 