import React from 'react';
import { motion } from 'motion/react';
import { Utensils, CreditCard, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: t('pickYourHype'),
      desc: t('pickDesc')
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: t('instantPay'),
      desc: t('instantDesc')
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: t('confirmWa'),
      desc: t('confirmDesc')
    }
  ];

  return (
    <section className="py-32 bg-white/2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative p-12 glass-morphism group hover:bg-accent/[0.03] transition-colors"
            >
              <div className="text-accent mb-6 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <h3 className="text-3xl font-display uppercase mb-4 text-white">
                {step.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest">
                {step.desc}
              </p>
              <div className="absolute top-0 right-0 p-8 text-6xl font-display text-white/5 select-none">
                0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
