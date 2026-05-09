import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuGrid from '../components/MenuGrid';
import HowItWorks from '../components/HowItWorks';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { subscribeToSettings, subscribeToMenu } from '../lib/firestore';
import { RestaurantSettings, MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubSettings = subscribeToSettings((data) => {
      setSettings(data);
    });
    
    // Simulate a minimum loading time for a smoother intro effect, or just let it load quickly.
    // For immediate rendering, we rely on the DB, but a minimum 500ms prevents a jarring flash.
    const startTime = Date.now();
    const unsubMenu = subscribeToMenu((data) => {
      setMenuItems(data);
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        setTimeout(() => setLoading(false), 500 - elapsed);
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubSettings();
      unsubMenu();
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-bg-dark flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-8"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-2 border-white/10 border-t-accent rounded-full" 
              />
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl text-white uppercase tracking-[0.3em]"
              >
                PHILLY HYPE
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-bg-dark relative">
        <Navbar restaurantName={settings?.restaurantName || 'PHILLY HYPE'} />
        
        <main className="flex-grow">
          <Hero settings={settings} />
          
          {/* Featured Section */}
          <section className="py-32 glass-morphism mx-6 mb-32 border border-white/5 relative overflow-hidden group rounded-3xl">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://plus.unsplash.com/premium_photo-1664478291780-0c67d5fb15e8?q=80&w=2000&auto=format&fit=crop"
              alt="Featured Item"
              className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-transparent" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{t('seasonalDrop')}</span>
              <h2 className="text-7xl font-display uppercase text-white leading-none mb-8">
                {t('theOutlaw')} <span className="text-accent underline underline-offset-[16px]">{t('outlaw')}</span>
              </h2>
              <p className="text-white/60 text-lg uppercase tracking-wide font-light mb-12 max-w-md">
                {t('outlawDesc')} 
              </p>
              <button 
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-white text-black font-extrabold uppercase tracking-widest hover:bg-accent transition-all rounded-full hover:shadow-[0_0_20px_rgba(255,107,0,0.3)]"
              >
                {t('snagItNow')}
              </button>
            </div>
          </div>
        </section>

        <HowItWorks />
        <MenuGrid items={menuItems} />
        <Reviews />
        <Contact settings={settings} />
      </main>

      <Footer settings={settings} />
      <Cart settings={settings} />
      </div>
    </>
  );
}
