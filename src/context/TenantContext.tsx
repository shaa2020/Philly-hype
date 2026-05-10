import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

interface TenantContextType {
  tenantId: string | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  loading: true,
  error: null,
});

export const useTenant = () => useContext(TenantContext);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubAuth: () => void = () => {};

    const resolveTenant = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tenantParam = urlParams.get('tenant');
        
        if (tenantParam) {
          setTenantId(tenantParam);
          setLoading(false);
          return;
        }

        const hostname = window.location.hostname;
        
        // Fetch tenant ID based on custom domain
        if (hostname !== 'localhost' && !hostname.includes('.run.app')) {
          const tenantsRef = collection(db, 'tenants');
          const q = query(tenantsRef, where('domain', '==', hostname));
          
          try {
            // Add a timeout to prevent hanging
            const snapshot = await Promise.race([
              getDocs(q),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout fetching tenant')), 5000))
            ]);

            if (!snapshot.empty) {
              setTenantId(snapshot.docs[0].id);
            } else {
              setTenantId('default'); // Default fallback instead of error so they can preview the site
            }
          } catch (err) {
            console.error('Tenant fetch failed or timed out:', err);
            setTenantId('default');
          }
          setLoading(false);
          return;
        }

        // On fallback domains, listen to auth to determine tenant if logged in as an owner
        unsubAuth = onAuthStateChanged(auth, async (user) => {
          if (user && user.email !== 'iamshanto7860@gmail.com') {
            try {
              const tenantsRef = collection(db, 'tenants');
              const q = query(tenantsRef, where('ownerEmail', '==', user.email));
              const snapshot = await getDocs(q);
              
              if (!snapshot.empty) {
                setTenantId(snapshot.docs[0].id);
              } else {
                setTenantId('default');
              }
            } catch (err) {
              console.error('Error fetching admin tenant:', err);
              setTenantId('default');
            }
          } else {
            setTenantId('default');
          }
          setLoading(false);
        });

      } catch (err) {
        console.error('Error resolving tenant:', err);
        setError('Failed to resolve restaurant.');
        setLoading(false);
      }
    };

    resolveTenant();

    return () => unsubAuth();
  }, []);

  return (
    <TenantContext.Provider value={{ tenantId, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};
