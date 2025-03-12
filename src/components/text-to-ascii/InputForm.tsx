import { RefreshCw } from "lucide-react";

interface InputFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  isLoading: boolean;
  generateAsciiArt: () => void;
  fonts: string[];
}
export function InputForm({
  inputText,
  setInputText,
  selectedFont,
  setSelectedFont,
  textColor,
  setTextColor,
  backgroundColor,
  setBackgroundColor,
  isLoading,
  generateAsciiArt,
  fonts,
}: InputFormProps) {
  return (
    <div className="bg-white  p-2 sm:p-4 md:p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-base sm:text-xl font-semibold mb-4 text-gray-800">
        Texte d&apos;entrée
      </h2>

      <div className="mb-4">
        <label
          htmlFor="inputText"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Votre texte
        </label>
        <textarea
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[100px] max-h-[200px]"
          placeholder="Entrez votre texte ici..."
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="fontSelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Police ASCII
        </label>
        <select
          id="fontSelect"
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="textColor"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Couleur du texte
          </label>
          <input
            id="textColor"
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="backgroundColor"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Couleur de fond
          </label>
          <input
            id="backgroundColor"
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full h-10 p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <button
        onClick={generateAsciiArt}
        disabled={isLoading}
        className="w-full bg-primary cursor-pointer text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            <span className="whitespace-nowrap">Génération en cours...</span>
          </>
        ) : (
          "Générer l'ASCII Art"
        )}
      </button>
    </div>
  );
}