// Using a more realistic google-card style
import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const reviews = [
  {
    name: "Marco S.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150",
    text: "The Philly Classic is life-changing. Better than what I had in PA. Absolute must try if you're in the area.",
    rating: 5,
    date: "2 days ago",
    platform: "Google"
  },
  {
    name: "Ana P.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    text: "That Smash double is dangerously good. The house sauce is elite, and delivery was much faster than expected.",
    rating: 5,
    date: "1 week ago",
    platform: "Google"
  },
  {
    name: "James L.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    text: "Fastest delivery and the packaging keeps it hot. 10/10. Definitely my new go-to spot for weekend cravings.",
    rating: 5,
    date: "2 weeks ago",
    platform: "Google"
  }
];

export default function Reviews() {
  const { t } = useLanguage();
  return (
    <section id="reviews" className="py-24 sm:py-32 relative overflow-hidden bg-bg-dark border-y border-white/5">
      <div className="absolute inset-0 bg-accent/[0.02]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-8xl font-display uppercase mb-6"
          >
            {t('realTalk').split(' ')[0]} <span className="text-accent italic">{t('realTalk').split(' ').slice(1).join(' ')}</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 text-white"
          >
            <div className="flex gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
            </div>
            <span className="font-bold">4.9/5</span>
            <span className="text-white/50 text-sm">based on 400+ reviews</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col text-left hover:border-white/20 transition-colors relative group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={rev.image} alt={rev.name} className="w-12 h-12 rounded-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-zinc-900">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{rev.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>{rev.date}</span>
                    </div>
                  </div>
                </div>
                {rev.platform === 'Google' && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
              </div>
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed overflow-hidden">
                {rev.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
