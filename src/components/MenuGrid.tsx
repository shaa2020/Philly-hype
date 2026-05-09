import { useState } from 'react';
import { motion } from 'motion/react';
import { MenuItem, MenuCategory, CATEGORIES } from '../types';
import MenuCard from './MenuCard';
import ItemModal from './ItemModal';
import { useLanguage } from '../context/LanguageContext';

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { t, language } = useLanguage();

  const getTranslatedCategory = (cat: string) => {
    switch(cat) {
      case 'Cheesesteaks': return t('cheesesteaks');
      case 'Smash Burgers': return t('smashBurgers');
      case 'Sides': return t('sides');
      case 'Drinks': return t('drinks');
      case 'Dessert': return t('dessert');
      case 'All': return t('all');
      default: return cat;
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col mb-20 gap-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="md:max-w-md">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-8xl font-display uppercase leading-none mb-6"
            >
              {t('theMenu')} <span className="text-accent underline underline-offset-[20px]">{t('menuWord')}</span>
            </motion.h2>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
              {t('curatedHype')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-4 sm:px-8 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all relative overflow-hidden group ${
                  activeCategory === cat 
                    ? 'text-black bg-accent' 
                    : 'text-white/40 hover:text-white border border-white/5'
                }`}
              >
                <span className="relative z-10">{getTranslatedCategory(cat)}</span>
                {activeCategory !== cat && (
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl px-1">
          <input 
            type="text"
            placeholder={t('searchHype')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 px-0 py-4 text-xl sm:text-2xl font-display uppercase tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-accent transition-colors"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-focus-within:w-full transition-all duration-700" />
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <MenuCard item={item} onSelect={setSelectedItem} />
          </motion.div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-40 text-center text-white/20 uppercase tracking-[0.5em] text-xs italic">
            {t('checkBackSoon')}
          </div>
        )}
      </motion.div>

      <ItemModal 
        item={selectedItem} 
        allItems={items}
        onClose={() => setSelectedItem(null)} 
      />
    </section>
  );
}
