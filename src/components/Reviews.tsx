import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const reviews = [
  {
    name: "Marco S.",
    text: "The Philly Classic is life-changing. Better than what I had in PA.",
    rating: 5
  },
  {
    name: "Ana P.",
    text: "That Smash double is dangerously good. The house sauce is elite.",
    rating: 5
  },
  {
    name: "James L.",
    text: "Fastest delivery and the packaging keeps it hot. 10/10.",
    rating: 5
  }
];

export default function Reviews() {
  const { t } = useLanguage();
  return (
    <section id="reviews" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/2" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-display uppercase mb-6"
          >
            {t('realTalk').split(' ')[0]} <span className="text-accent italic">{t('realTalk').split(' ').slice(1).join(' ')}</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-1 text-accent"
          >
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative p-12 glass-morphism group hover:bg-accent/[0.03] transition-colors flex flex-col items-center text-center"
            >
              <Quote className="w-10 h-10 text-accent/20 mb-8 group-hover:text-accent group-hover:scale-110 transition-all duration-500" />
              <p className="text-white/70 text-lg font-light italic mb-8 leading-relaxed [text-wrap:balance]">
                "{rev.text}"
              </p>
              <div className="mt-auto flex flex-col items-center gap-3">
                <div className="flex gap-1 text-accent/50 group-hover:text-accent transition-colors">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                  {rev.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
