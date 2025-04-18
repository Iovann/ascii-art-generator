import { Github, Heart, Linkedin} from 'lucide-react';


export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-center md:text-left text-lg font-medium">
              © {new Date().getFullYear()} ASCII Art Generator
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Transformez vos idées en art ASCII
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center space-x-6 mb-4">
              <a 
                href="https://github.com/Iovann" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/don-dy-iovann-atcho/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <span className="flex items-center text-gray-300">
              Fait par <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" /> Iovann
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;