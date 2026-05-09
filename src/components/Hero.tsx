import { motion } from 'motion/react';
import { RestaurantSettings } from '../types';
import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  settings: RestaurantSettings | null;
}

export default function Hero({ settings }: HeroProps) {
  const { t } = useLanguage();
  const title = settings?.heroTitle || 'EXPERIENCE THE HYPE';
  const subtitle = settings?.heroSubtitle || 'The best Philly Cheesesteaks & Smash Burgers in town.';
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-24 md:py-32 bg-bg-dark border-b border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-right-bottom opacity-40 md:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent md:bg-gradient-to-r md:from-bg-dark md:via-bg-dark/90 md:to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-start max-w-3xl">
          {settings?.isOpen ? (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 flex items-center gap-3 border border-white/10 px-4 py-2 rounded-sm bg-black/20 backdrop-blur-md"
             >
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/80">
                {t('kitchenLive')}
              </span>
             </motion.div>
          ) : (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 flex items-center gap-3 border border-white/10 px-4 py-2 rounded-sm bg-black/20 backdrop-blur-md"
             >
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/50">
                {t('kitchenClosed')}
              </span>
             </motion.div>
          )}
          
          <div className="relative mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4rem] sm:text-[6rem] lg:text-[8rem] font-display uppercase leading-[0.85] text-white flex flex-col tracking-tight"
            >
              <span>{title.split(' ')[0]}</span>
              <span className="text-accent">{title.split(' ').slice(1).join(' ')}</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 sm:gap-12 w-full mt-4"
          >
            <div className="w-8 h-[1px] bg-accent mt-3 hidden sm:block delay-500 transition-all" />
            <p className="text-sm sm:text-base text-white/60 max-w-sm font-light leading-relaxed tracking-wide">
              {subtitle}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col gap-10 mt-12 sm:mt-16 sm:pl-20"
          >
            <div className="flex flex-wrap items-center gap-8">
              <a 
                href="#menu" 
                className="group relative flex items-center gap-4 text-white hover:text-accent transition-colors"
              >
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-accent transition-colors" />
                </div>
                <span className="font-bold uppercase tracking-[0.2em] text-[10px]">{t('exploreMenu')}</span>
              </a>

              <div className="relative group z-50">
                <button 
                  className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-white/20 hover:after:bg-white pb-1"
                >
                  {t('contact')}
                </button>
                <div className="absolute top-full left-0 mt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 flex flex-col bg-bg-card border border-white/10 rounded-xl overflow-hidden min-w-[140px] shadow-xl">
                  <a 
                    href={`tel:${settings?.whatsappNumber}`} 
                    className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-3 px-4 py-3 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> {t('call')}
                  </a>
                  <a 
                    href={`https://wa.me/${settings?.whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-[#25D366] hover:bg-white/5 flex items-center gap-3 px-4 py-3 border-t border-white/5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> {t('whatsapp')}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 pl-2 border-l-2 border-accent">{t('orderOnline')}</span>
              <div className="flex flex-wrap gap-4 items-center">
                <a 
                  href={settings?.uberEatsUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-full bg-[#06C167]/10 border border-[#06C167]/20 hover:bg-[#06C167] text-[#06C167] hover:text-black transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  UberEats
                </a>
                <a 
                  href={settings?.deliverooUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-full bg-[#00CCBC]/10 border border-[#00CCBC]/20 hover:bg-[#00CCBC] text-[#00CCBC] hover:text-white transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  Deliveroo
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 right-6 lg:right-12 flex flex-col items-center gap-4 hidden sm:flex"
      >
        <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-white/30 rotate-180 [writing-mode:vertical-lr]">{t('scroll')}</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}
