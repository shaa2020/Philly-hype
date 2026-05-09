import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt';

interface Translations {
  [key: string]: {
    en: string;
    pt: string;
  };
}

export const translations: Translations = {
  // Navbar
  menu: { en: 'Menu', pt: 'Menu' },
  reviews: { en: 'Reviews', pt: 'Avaliações' },
  events: { en: 'Events', pt: 'Eventos' },
  contact: { en: 'Contact', pt: 'Contacto' },
  installApp: { en: 'App', pt: 'App' },
  
  // Hero
  kitchenLive: { en: 'Kitchen is Live', pt: 'Cozinha Aberta' },
  kitchenClosed: { en: 'Kitchen Closed', pt: 'Cozinha Fechada' },
  exploreMenu: { en: 'Explore Menu', pt: 'Ver Menu' },
  orderOnline: { en: 'Order Online', pt: 'Pedir Online' },
  call: { en: 'Call', pt: 'Ligar' },
  whatsapp: { en: 'WhatsApp', pt: 'WhatsApp' },
  scroll: { en: 'Scroll', pt: 'Deslizar' },
  
  // Cart
  your: { en: 'Your', pt: 'O Seu' },
  order: { en: 'Order', pt: 'Pedido' },
  servicePreference: { en: 'Service Preference', pt: 'Preferência de Serviço' },
  contactDetails: { en: 'Contact Details', pt: 'Detalhes de Contacto' },
  name: { en: 'NAME *', pt: 'NOME *' },
  phone: { en: 'PHONE *', pt: 'TELEFONE *' },
  address: { en: 'STREET ADDRESS *', pt: 'MORADA *' },
  city: { en: 'CITY *', pt: 'CIDADE *' },
  door: { en: 'APT / DOOR', pt: 'PORTA / ANDAR' },
  zipCode: { en: 'ZIP CODE *', pt: 'CÓDIGO POSTAL *' },
  nif: { en: 'NIF (TIN) - Optional', pt: 'NIF (Opcional)' },
  zone: { en: 'Zone', pt: 'Zona' },
  delivery: { en: 'Delivery', pt: 'Entrega' },
  fee: { en: 'Fee', pt: 'Taxa' },
  min: { en: 'Min', pt: 'Mínimo' },
  doesNotMeetMin: { en: '* Does not meet min order value', pt: '* Não atinge o valor mínimo' },
  orderSent: { en: 'Order Sent!', pt: 'Pedido Enviado!' },
  orderOnWay: { en: 'Your order is on its way via WhatsApp. We will confirm shortly.', pt: 'O seu pedido segue pelo WhatsApp. Confirmaremos em breve.' },
  cartSilent: { en: 'The cart is silent', pt: 'O carrinho está vazio' },
  addInstructions: { en: 'Add special instructions...', pt: 'Adicionar instruções especiais...' },
  subtotal: { en: 'Subtotal', pt: 'Subtotal' },
  deliveryFee: { en: 'Delivery Fee', pt: 'Taxa de Entrega' },
  total: { en: 'Total', pt: 'Total' },
  orderViaWhatsapp: { en: 'Order via WhatsApp', pt: 'Pedir via WhatsApp' },
  storeClosedBtn: { en: 'Store is currently closed', pt: 'Loja encontra-se fechada' },
  payOnWa: { en: 'Pay on WA Proof', pt: 'Pagamento via WA' },
  guarantee: { en: 'Guarantee', pt: 'Garantia' },
  
  // Contact
  findUs: { en: 'Find Us', pt: 'Encontre-nos' },
  contactDesc: { en: 'Hit us up for catering, events, or just to say what\'s up.', pt: 'Contacte-nos para catering, eventos ou apenas para dizer olá.' },
  location: { en: 'Location', pt: 'Localização' },
  hoursStatus: { en: 'Hours & Status', pt: 'Horários e Estado' },
  weAreOpen: { en: 'We Are Open', pt: 'Estamos Abertos' },
  closedCurrently: { en: 'Closed Currently', pt: 'Encerrados de momento' },
  checkBack: { en: 'Check back during regular hours for the freshest drops.', pt: 'Volte durante o horário normal para as novidades.' },
  orderAndContact: { en: 'Order & Contact', pt: 'Pedidos e Contactos' },
  callUs: { en: 'Call Us', pt: 'Ligar' },
  deliveryPartners: { en: 'Delivery Partners', pt: 'Parceiros de Entrega' },
  comeThru: { en: 'Come thru.', pt: 'Apareça.' },
  experienceInPerson: { en: 'Experience the hype in person.', pt: 'Sinta a experiência ao vivo.' },
  
  open: { en: 'Open', pt: 'Aberto' },
  closed: { en: 'Closed', pt: 'Fechado' },
  
  // Home
  seasonalDrop: { en: 'Seasonal Drop', pt: 'Edição Sazonal' },
  theOutlaw: { en: 'The', pt: 'O' }, // Actually, I'll translate 'The ' differently.
  outlaw: { en: 'Outlaw', pt: 'Outlaw' },
  outlawDesc: { en: 'Thinly sliced ribeye, pepper jack cheese, jalapeños, and our secret outlaw smoky mayo.', pt: 'Bife fatiado finamente, queijo pepper jack, jalapeños e uma maionese secreta.' },
  snagItNow: { en: 'Snag it now', pt: 'Pedir agora' },
  
  // HowItWorks
  pickYourHype: { en: 'Pick your hype', pt: 'Escolhe o teu hype' },
  pickDesc: { en: 'Browse our curated selection of Philly cheesesteaks and smash burgers.', pt: 'Vê a nossa seleção imperdível de cheesesteaks e smash burgers.' },
  instantPay: { en: 'Instant Pay', pt: 'Pagamento Imediato' },
  instantDesc: { en: 'Use MB WAY for a seamless, fast checkout directly from your phone.', pt: 'Usa MB WAY para um pagamento rápido e simples a partir do teu telemóvel.' },
  confirmWa: { en: 'Confirm on WA', pt: 'Confirma no WA' },
  confirmDesc: { en: 'Send your receipt via WhatsApp and we will start the magic immediately.', pt: 'Envia o recibo por WhatsApp e a magia começa imediatamente.' },
  
  // Reviews
  realTalk: { en: 'Real Talk', pt: 'Sem Tretas' },
  
  // Menu Grid
  menuEmpty: { en: 'No menu items available.', pt: 'Sem itens disponíveis no menu.' },
  theMenu: { en: 'The', pt: 'O' },
  menuWord: { en: 'Menu', pt: 'Menu' },
  curatedHype: { en: 'Curated hype for your tastebuds', pt: 'Hype curado para o teu paladar' },
  searchHype: { en: 'Search the hype...', pt: 'Pesquisar destaque...' },
  checkBackSoon: { en: 'Check back soon for new drops', pt: 'Volta em breve para novidades' },
  all: { en: 'All', pt: 'Tudo' },
  cheesesteaks: { en: 'Cheesesteaks', pt: 'Cheesesteaks' },
  smashBurgers: { en: 'Smash Burgers', pt: 'Smash Burgers' },
  sides: { en: 'Sides', pt: 'Acompanhamentos' },
  drinks: { en: 'Drinks', pt: 'Bebidas' },
  dessert: { en: 'Dessert', pt: 'Sobremesa' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang === 'en' || savedLang === 'pt') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
