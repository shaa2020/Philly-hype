import { RestaurantSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  settings: RestaurantSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-white/10 bg-black py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-2">
            {settings?.restaurantName || 'PHILLY HYPE'}
          </h2>
          <a 
            href="https://maps.app.goo.gl/tE9sWzfAkQJRwNMs5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/50 text-sm uppercase tracking-widest hover:text-accent transition-colors"
          >
            {settings?.address}
          </a>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-4 items-center mb-2">
            {settings?.uberEatsUrl && (
              <a 
                href={settings.uberEatsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#06C167] hover:text-[#06C167]/80 transition-colors"
              >
                UberEats
              </a>
            )}
            {settings?.deliverooUrl && (
              <a 
                href={settings.deliverooUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00CCBC] hover:text-[#00CCBC]/80 transition-colors"
              >
                Deliveroo
              </a>
            )}
          </div>
          <a href={`mailto:${settings?.contactEmail}`} className="text-white/70 hover:text-accent transition-colors text-sm uppercase tracking-widest">
            {settings?.contactEmail}
          </a>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${settings?.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-white/50 text-xs uppercase tracking-widest font-bold">
              {settings?.isOpen ? t('open') : t('closed')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
