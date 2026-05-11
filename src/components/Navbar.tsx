import { Link } from 'react-router-dom';
import { usePWA } from '../hooks/usePWA';
import { Download, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  restaurantName: string;
  logoUrl?: string;
}

export default function Navbar({ restaurantName, logoUrl }: NavbarProps) {
  const { installPrompt, isInstalled, showInstallPrompt } = usePWA();
  const { t, language, setLanguage } = useLanguage();

  return (
    <nav className="fixed top-0 z-50 w-full bg-bg-dark/80 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 md:h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img src={logoUrl} alt={restaurantName} className="h-10 md:h-12 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(230,0,0,0.4)] group-hover:shadow-[0_0_20px_rgba(230,0,0,0.6)] group-hover:rotate-6 transition-all duration-500">
                 <Flame className="w-4 h-4 md:w-5 md:h-5 text-black fill-black/90" strokeWidth={1.5} />
              </div>
              <span className="text-lg md:text-2xl font-display uppercase tracking-tight text-white group-hover:text-accent transition-colors">
                {restaurantName || 'PHILLY HYPE'}
              </span>
            </>
          )}
        </Link>
        
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          <a href="#menu" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all relative group">
            {t('menu')}
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#contact" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all relative group">
            {t('contact')}
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          
          <div className="h-4 w-px bg-white/10 mx-2" />
          
          <button 
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </button>
          
          {installPrompt && !isInstalled && (
            <button 
              onClick={showInstallPrompt}
              className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all ml-2"
            >
              <Download className="w-3 h-3" />
              {t('installApp')}
            </button>
          )}


        </div>

        <div className="md:hidden flex items-center gap-4">
           <button 
             onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
             className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all mr-2"
           >
             {language === 'pt' ? 'EN' : 'PT'}
           </button>
           {installPrompt && !isInstalled && (
             <button 
               onClick={showInstallPrompt}
               className="p-1.5 text-white/50 hover:text-white border border-white/10 rounded-full"
             >
               <Download className="w-4 h-4" />
             </button>
           )}

        </div>
      </div>
    </nav>
  );
}
