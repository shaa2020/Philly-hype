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
    <section id="reviews" className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-display uppercase mb-6">
            {t('realTalk').split(' ')[0]} <span className="text-accent italic">{t('realTalk').split(' ').slice(1).join(' ')}</span>
          </h2>
          <div className="flex gap-1 text-accent">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 border border-white/5 flex flex-col items-center text-center group"
            >
              <Quote className="w-8 h-8 text-white/10 mb-6 group-hover:text-accent transition-colors" />
              <p className="text-white/70 text-lg font-light italic mb-8 [text-wrap:balance]">
                "{rev.text}"
              </p>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                {rev.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
