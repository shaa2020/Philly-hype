import { RestaurantSettings } from '../types';
import { MapPin, Phone, Mail, Clock, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactProps {
  settings: RestaurantSettings | null;
}

export default function Contact({ settings }: ContactProps) {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-32 px-6 relative max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 border-b border-white/10 pb-8">
        <div>
          <h2 className="text-4xl md:text-6xl font-display uppercase text-white mb-4">{t('findUs')}</h2>
          <p className="text-white/50 text-sm md:text-base uppercase tracking-widest max-w-md">
            {t('contactDesc')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-bg-card border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors group">
            <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{t('location')}</h3>
            <p className="text-lg font-medium text-white">{settings?.address || '123 Philly Street, PA 19104'}</p>
          </div>

          <div className="bg-bg-card border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors group">
            <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{t('hoursStatus')}</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${settings?.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-lg font-black uppercase tracking-widest">
                {settings?.isOpen ? t('weAreOpen') : t('closedCurrently')}
              </span>
            </div>
            <p className="text-sm text-white/40">{t('checkBack')}</p>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-bg-card border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors group">
            <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">{t('orderAndContact')}</h3>
            <div className="space-y-2 mt-4">
              <a href={`https://wa.me/${settings?.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl font-black text-white hover:text-[#25D366] transition-colors block">
                {t('whatsapp')}
              </a>
              <a href={`tel:${settings?.whatsappNumber}`} className="text-lg md:text-xl font-black text-white hover:text-accent transition-colors block">
                {t('callUs')}
              </a>
            </div>
          </div>

          <div className="bg-bg-card border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors group">
            <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors flex-shrink-0">
              <Clock className="w-5 h-5 flex-none" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">{t('deliveryPartners')}</h3>
            <div className="space-y-3">
              {settings?.uberEatsUrl ? (
                <a href={settings.uberEatsUrl} target="_blank" rel="noopener noreferrer" className="block text-lg font-black text-[#06C167] hover:text-[#06C167]/80 transition-colors">
                  UberEats
                </a>
              ) : (
                <p className="text-sm font-medium text-white/20 line-through">UberEats</p>
              )}
              {settings?.deliverooUrl ? (
                <a href={settings.deliverooUrl} target="_blank" rel="noopener noreferrer" className="block text-lg font-black text-[#00CCBC] hover:text-[#00CCBC]/80 transition-colors">
                  Deliveroo
                </a>
              ) : (
                <p className="text-sm font-medium text-white/20 line-through">Deliveroo</p>
              )}
            </div>
          </div>
        </div>

        {/* Visual / Image */}
        <div className="lg:col-span-1 h-full min-h-[400px] border border-white/5 rounded-3xl overflow-hidden relative group">
          <img 
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
            alt="Restaurant Vibe" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-3xl font-display uppercase leading-none mb-2">{t('comeThru')}</h3>
            <p className="text-white/70 text-sm uppercase tracking-widest font-bold">{t('experienceInPerson')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
