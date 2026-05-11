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
  
  const overlayOpacity = settings?.heroOverlayOpacity !== undefined ? settings.heroOverlayOpacity / 100 : 0.8;
  const overlayOpacityStrong = settings?.heroOverlayOpacity !== undefined ? Math.min(1, (settings.heroOverlayOpacity + 10) / 100) : 0.9;
  
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 bg-bg-dark border-b border-white/5">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-right-bottom opacity-40 md:opacity-100"
          style={{ backgroundImage: `url(${settings?.heroImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000&auto=format&fit=crop'})` }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bg-dark to-transparent"
          style={{
            '--tw-gradient-via-position': '50%',
            '--tw-gradient-stops': `var(--color-bg-dark), rgba(255,255,255,${overlayOpacity}) var(--tw-gradient-via-position), transparent`
          } as React.CSSProperties}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-start max-w-3xl">
          
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
            <div className="flex flex-row flex-wrap items-center gap-6 sm:gap-8">
              <button 
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-accent hover:text-white transition-colors relative after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[2px] after:bg-accent/30 hover:after:bg-white pb-1.5"
              >
                {t('exploreMenu')}
              </button>

              <div className="hidden sm:block w-px h-8 bg-white/10"></div>

              <div className="relative group z-50">
                <button 
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[2px] after:bg-white/10 hover:after:bg-white pb-1.5"
                >
                  {t('contact')}
                </button>
                <div className="absolute top-full left-0 mt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 flex flex-col bg-bg-card border border-white/10 rounded-xl overflow-hidden min-w-[160px] shadow-2xl backdrop-blur-xl">
                  <a 
                    href={`tel:${settings?.whatsappNumber}`} 
                    className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-3 px-5 py-4 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> {t('call')}
                  </a>
                  <a 
                    href={`https://wa.me/${settings?.whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-[#25D366] hover:bg-white/10 flex items-center gap-3 px-5 py-4 border-t border-white/5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> {t('whatsapp')}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 max-w-[400px] sm:max-w-none">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 pl-3 border-l-2 border-accent">{t('orderOnline')}</span>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-[450px]">
                {settings?.uberEatsUrl && (
                  <a 
                    href={settings.uberEatsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center sm:justify-start gap-3 sm:gap-4 px-5 py-4 sm:px-6 sm:py-5 rounded-[2rem] bg-white/10 border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-accent transition-colors" />
                    <span className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{t('uberEats') || 'UberEats'}</span>
                  </a>
                )}
                {settings?.deliverooUrl && (
                  <a 
                    href={settings.deliverooUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center sm:justify-start gap-3 sm:gap-4 px-5 py-4 sm:px-6 sm:py-5 rounded-[2rem] bg-white/10 border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-accent transition-colors" />
                    <span className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{t('deliveroo') || 'Deliveroo'}</span>
                  </a>
                )}
                {settings?.glovoUrl && (
                  <a 
                    href={settings.glovoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center sm:justify-start gap-3 sm:gap-4 px-5 py-4 sm:px-6 sm:py-5 rounded-[2rem] bg-white/10 border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-accent transition-colors" />
                    <span className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{t('glovo') || 'Glovo'}</span>
                  </a>
                )}
                {settings?.boltFoodUrl && (
                  <a 
                    href={settings.boltFoodUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center sm:justify-start gap-3 sm:gap-4 px-5 py-4 sm:px-6 sm:py-5 rounded-[2rem] bg-white/10 border border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-accent transition-colors" />
                    <span className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{t('boltFood') || 'Bolt Food'}</span>
                  </a>
                )}
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
