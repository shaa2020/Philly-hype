import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export default function MenuCard({ item, onSelect }: MenuCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-bg-card border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(255,107,0,0.1)] cursor-pointer"
      onClick={() => onSelect(item)}
    >
      <div className="relative h-64 sm:h-72 overflow-hidden">
        {item.imageURL ? (
          <img 
            src={item.imageURL} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 italic text-sm">
            Image Pending
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div
            className="px-6 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-black font-semibold uppercase tracking-wider text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-lg"
          >
            {item.isAvailable ? 'See Details' : 'Sold Out'}
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 z-10 px-4 py-1.5 bg-black/70 text-white backdrop-blur-md border border-white/10 rounded-full font-bold text-sm">
          €{item.price.toFixed(2)}
        </div>
      </div>
      
      <div className="p-6 sm:p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-3">
          <h3 className="text-xl sm:text-2xl font-display uppercase leading-tight text-white tracking-wide group-hover:text-accent transition-colors">
            {item.name}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
            {item.category}
          </span>
        </div>
        
        <p className="text-white/40 text-[13px] sm:text-sm leading-relaxed mb-6 flex-grow font-light line-clamp-2">
          {item.description}
        </p>
        
        <div className="pt-5 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5 opacity-60">
             {[1, 2, 3].map((i) => (
               <div key={i} className="w-1 h-1 rounded-full bg-accent" />
             ))}
          </div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent group-hover:text-white transition-colors flex items-center gap-2"
          >
            Customize <Plus className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
