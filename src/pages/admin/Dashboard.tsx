import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { subscribeToSettings, subscribeToMenu, getSettings, updateSettings, addMenuItem, subscribeToOrders } from '../../lib/firestore';
import { RestaurantSettings, MenuItem, Order } from '../../types';
import AdminSettings from '../../components/admin/AdminSettings';
import AdminMenuManager from '../../components/admin/AdminMenuManager';
import AdminOrdersManager from '../../components/admin/AdminOrdersManager';
import { LogOut, LayoutDashboard, Settings, Utensils, Menu, Send } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export default function Dashboard() {
  const { tenantId } = useTenant();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tenantId) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/admin');
      } else {
        setLoadingAuth(false);
        try {
          const currentData = await getSettings(tenantId);
          if (!currentData) {
            await updateSettings(tenantId, {
              restaurantName: 'PHILLY HYPE',
              heroTitle: 'EXPERIENCE THE HYPE',
              heroSubtitle: 'The best Philly Cheesesteaks & Smash Burgers in town.',
              contactEmail: 'hello@phillyhype.com',
              address: 'R. Melvin Jones 10B, 1600-867 Lisboa',
              isOpen: true,
              whatsappNumber: '351912345678',
              mbWayNumber: '912345678',
              deliveryFee: 2.50
            });
            
            const seedData: Omit<MenuItem, 'id'>[] = [
              { 
                name: 'Philly Classic', 
                price: 13.45, 
                description: 'Thinly sliced ribeye, caramelized onions, provolone cheese on a toasted hoagie roll.', 
                category: 'Cheesesteaks', 
                imageURL: 'https://images.unsplash.com/photo-1614548483848-18e310034a2e?q=80&w=1500&auto=format&fit=crop', 
                isAvailable: true, 
                createdAt: Date.now(),
                options: [
                  { name: 'Extra Cheese', price: 1.50 },
                  { name: 'Extra Meat', price: 3.50 }
                ]
              },
              { 
                name: 'Classic Smash Double', 
                price: 11.45, 
                description: 'Two smashed patties, American cheese, house sauce, pickles, potato bun.', 
                category: 'Burgers', 
                imageURL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop', 
                isAvailable: true, 
                createdAt: Date.now() + 3,
                options: [
                  { name: 'Add Bacon', price: 1.00 },
                  { name: 'Make it Triple', price: 2.00 }
                ]
              },
              { name: 'Loaded Fries', price: 13.95, description: 'Crispy fries topped with shaved ribeye, cheese sauce, and scallions.', category: 'Sides', imageURL: 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?q=80&w=1500&auto=format&fit=crop', isAvailable: true, createdAt: Date.now() + 6 },
              { name: 'Craft Lemonade', price: 3.50, description: 'Freshly squeezed lemons with mint and agave.', category: 'Drinks', imageURL: 'https://images.unsplash.com/photo-1523362622115-d0c3bcc58113?q=80&w=1500&auto=format&fit=crop', isAvailable: true, createdAt: Date.now() + 8 },
            ];
            
            for (const item of seedData) {
              await addMenuItem(tenantId, item);
            }
          }
        } catch (err) {
          console.error("Failed to seed config", err);
        }
      }
    });

    const unsubSettings = subscribeToSettings(tenantId, (data) => setSettings(data));
    const unsubMenu = subscribeToMenu(tenantId, (data) => setMenuItems(data));
    const unsubOrders = subscribeToOrders(tenantId, (data) => setOrders(data));

    return () => {
      unsub();
      unsubSettings();
      unsubMenu();
      unsubOrders();
    };
  }, [navigate, tenantId]);

  if (!tenantId) return null;

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-bg-dark flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col md:flex-row font-sans">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex inset-y-0 left-0 z-50 w-64 bg-black/80 backdrop-blur-md border-r border-white/5 flex-col">
        <div className="p-6 flex items-center gap-3 mb-6 border-b border-white/5">
          <div className="bg-accent/10 p-2 rounded-xl border border-accent/20">
            <LayoutDashboard className="w-5 h-5 text-accent" />
          </div>
          <span className="font-bold uppercase tracking-widest text-sm text-white">Admin Panel</span>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl uppercase tracking-widest text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-accent text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <Send className="w-4 h-4" /> Live Orders
          </button>
          
          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl uppercase tracking-widest text-xs font-bold transition-all ${activeTab === 'menu' ? 'bg-accent text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <Utensils className="w-4 h-4" /> Menu Items
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl uppercase tracking-widest text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-accent text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-bold uppercase tracking-widest text-xs"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto pb-24 md:pb-0">
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
          {activeTab === 'orders' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <AdminOrdersManager orders={orders} />
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <AdminMenuManager items={menuItems} />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {settings && <AdminSettings settings={settings} />}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50 flex justify-around items-center px-2 py-3 pb-safe">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${activeTab === 'orders' ? 'text-accent' : 'text-white/50'}`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Orders</span>
        </button>

        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${activeTab === 'menu' ? 'text-accent' : 'text-white/50'}`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Menu</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${activeTab === 'settings' ? 'text-accent' : 'text-white/50'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Settings</span>
        </button>

        <button 
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 text-white/50 hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>

    </div>
  );
}
