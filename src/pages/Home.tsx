import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuGrid from '../components/MenuGrid';
import HowItWorks from '../components/HowItWorks';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { subscribeToSettings, subscribeToMenu } from '../lib/firestore';
import { RestaurantSettings, MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { useTenant } from '../context/TenantContext';

export default function Home() {
  const { tenantId } = useTenant();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const demoSettings: RestaurantSettings = {
    restaurantName: 'PHILLY HYPE',
    heroTitle: 'THE REAL PHILLY EXPERIENCE IN LISBON',
    heroSubtitle: 'Authentic Philly Cheesesteaks & Smash Burgers.',
    contactEmail: 'contact@phillyhype.pt',
    address: 'Rua Melvin Jones 10B, 1600-867 Lisboa, Portugal',
    isOpen: true,
    whatsappNumber: '',
    mbWayNumber: '',
    deliveryFee: 2.50,
    promoBannerEnabled: true,
    promoBannerText: '🔥 BEST CHEESESTEAKS IN LISBON 🔥',
    storyEnabled: true,
    storyHeadline: 'Directly from Philly to Lisbon',
    storyDescription: 'Craving an authentic Philly Cheesesteak? We brought the real deal to Lisbon. Thinly sliced ribeye, melted cheese, and fresh bread.',
    highlightEnabled: true,
    highlightTitle: 'The Outlaw Loaded Fries',
    highlightSubtitle: 'Messy but completely worth it.',
    highlightDescription: 'Crispy fries topped with shaved ribeye, cheese sauce, and fresh scallions.'
  };

  const demoMenu: MenuItem[] = [
    { id: '1', name: 'Original Philly Cheesesteak', price: 13.90, description: 'Thinly sliced ribeye, caramelized onions, provolone or cheese sauce.', category: 'Cheesesteaks', imageURL: 'https://images.unsplash.com/photo-1614548483848-18e310034a2e?q=80&w=1500&auto=format&fit=crop', isAvailable: true, createdAt: Date.now() },
    { id: '2', name: 'Classic Smash Double', price: 11.50, description: 'Two smashed beef patties, American cheese, house sauce on a brioche bun.', category: 'Burgers', imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop', isAvailable: true, createdAt: Date.now() },
    { id: '3', name: 'Outlaw Loaded Fries', price: 8.50, description: 'Crispy fries smothered in cheese sauce, topped with ribeye pieces.', category: 'Sides', imageURL: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1500&auto=format&fit=crop', isAvailable: true, createdAt: Date.now() },
    { id: '4', name: 'Chicken Philly', price: 12.90, description: 'Finely chopped chicken breast, grilled onions, provolone cheese.', category: 'Cheesesteaks', imageURL: 'https://images.unsplash.com/photo-1655381656515-56543162b719?q=80&w=1500&auto=format&fit=crop', isAvailable: true, createdAt: Date.now() }
  ];

  useEffect(() => {
    if (!tenantId) return;

    const unsubSettings = subscribeToSettings(tenantId, (data) => {
      setSettings(data);
    });
    
    const startTime = Date.now();
    const fallbackTimeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000); // Fail-safe to ensure loading always disappears

    const unsubMenu = subscribeToMenu(tenantId, (data) => {
      setMenuItems(data);
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        setTimeout(() => setLoading(false), 500 - elapsed);
      } else {
        setLoading(false);
      }
    }, (error) => {
      console.error("Failed to load menu", error);
      setLoading(false);
    });

    return () => {
      clearTimeout(fallbackTimeoutId);
      unsubSettings();
      unsubMenu();
    };
  }, [tenantId]);

  if (!tenantId) return null;

  const displaySettings = settings || (tenantId === 'default' ? demoSettings : null);
  const displayMenu = menuItems.length > 0 ? menuItems : (tenantId === 'default' ? demoMenu : []);

  return (
    <>
      <Helmet>
        <title>{displaySettings?.restaurantName ? `${t('menuWord')} | ${displaySettings.restaurantName}` : t('menuWord')}</title>
        <meta name="description" content={t('curatedHype')} />
      </Helmet>
      
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
        <Navbar restaurantName={displaySettings?.restaurantName || 'PHILLY HYPE'} logoUrl={displaySettings?.logoUrl} />
        
        <main className="flex-grow">
          <Hero settings={displaySettings} />
          
          {/* Promotional Banner */}
          <AnimatePresence>
            {displaySettings?.promoBannerEnabled && displaySettings?.promoBannerText && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full bg-accent text-black relative z-20 overflow-hidden border-y border-black/10"
              >
                <div className="py-2.5 sm:py-3 relative flex items-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMTEiLz4KPC9zdmc+')] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
                  <motion.div
                    animate={{ x: [0, "-50%"] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="flex whitespace-nowrap w-max"
                  >
                    {[...Array(2)].map((_, groupIndex) => (
                      <div key={groupIndex} className="flex items-center gap-8 px-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="flex items-center gap-8">
                            {displaySettings.promoBannerLink ? (
                              <a href={displaySettings.promoBannerLink} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity whitespace-nowrap flex items-center gap-8">
                                {displaySettings.promoBannerText}
                                <span className="w-1.5 h-1.5 bg-black rounded-full opacity-30" />
                              </a>
                            ) : (
                              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-8">
                                {displaySettings.promoBannerText}
                                <span className="w-1.5 h-1.5 bg-black rounded-full opacity-30" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Our Story Section */}
          {displaySettings?.storyEnabled && (
            <section className="py-24 sm:py-32 bg-bg-dark border-t border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 rounded-bl-[100px] blur-3xl pointer-events-none" />
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24 items-center relative z-10">
                <div className="order-2 md:order-1 relative">
                  <div className="absolute -inset-4 border border-white/5 rounded-2xl transform -rotate-2 bg-white/5" />
                  <img 
                    src={displaySettings.storyImage || "https://images.unsplash.com/photo-1549488344-c5aab08e2f0d?q=80&w=1200&auto=format&fit=crop"}
                    alt="Our Story"
                    className="relative w-full aspect-[4/5] object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="order-1 md:order-2 space-y-8">
                  <div>
                    <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                      {t('ourStory') || 'Our Story'}
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-white uppercase tracking-wider leading-[1.1]">
                      {displaySettings.storyHeadline || "The Start of an Era"}
                    </h2>
                  </div>
                  <div className="w-16 h-1 bg-accent/50" />
                  <p className="text-white/60 text-sm sm:text-base tracking-wide font-light leading-relaxed whitespace-pre-wrap">
                    {displaySettings.storyDescription || "Crafting the perfect Philly Cheesesteak takes more than just good ingredients. It takes passion, dedication, and a bit of outlaw spirit. We set out to redefine the classic, bringing bold flavors and street-style energy to every bite."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Featured Section */}
          {(displaySettings?.highlightEnabled ?? true) && (
            <section className="py-32 glass-morphism mx-6 mb-32 border border-white/5 relative overflow-hidden group rounded-3xl">
              <div className="absolute inset-0 z-0">
                <img 
                  src={displaySettings?.highlightImage || "https://plus.unsplash.com/premium_photo-1664478291780-0c67d5fb15e8?q=80&w=2000&auto=format&fit=crop"}
                  alt={displaySettings?.highlightTitle || "Featured Item"}
                  className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-transparent" />
              
              <div className="relative z-10 max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  {displaySettings?.highlightTag && (
                    <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                      {displaySettings?.highlightTag}
                    </span>
                  )}
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-display uppercase text-white leading-[1.1] mb-8 break-words">
                    <span className="block mb-2">{displaySettings?.highlightTitle || t('theOutlaw')}</span>
                    {displaySettings?.highlightSubtitle && (
                      <span className="text-accent relative inline-block">
                        {displaySettings?.highlightSubtitle}
                        <span className="absolute -bottom-2 sm:-bottom-4 left-0 w-full h-[4px] bg-accent"></span>
                      </span>
                    )}
                  </h2>
                  {(displaySettings?.highlightDescription || t('outlawDesc')) && (
                    <p className="text-white/60 text-lg uppercase tracking-wide font-light mb-12 max-w-md">
                      {displaySettings?.highlightDescription || t('outlawDesc')} 
                    </p>
                  )}
                  <button 
                    onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-4 bg-white text-black font-extrabold uppercase tracking-widest hover:bg-accent transition-all rounded-full hover:shadow-[0_0_20px_rgba(230,0,0,0.3)]"
                  >
                    {displaySettings?.highlightButtonText || t('snagItNow')}
                  </button>
                </div>
              </div>
            </section>
          )}

        <HowItWorks />
        <MenuGrid items={displayMenu} />
        <Contact settings={displaySettings} />
      </main>

      <Footer settings={displaySettings} />
      <Cart settings={displaySettings} />
      </div>
    </>
  );
}
