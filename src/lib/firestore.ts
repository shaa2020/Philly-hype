import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { RestaurantSettings, MenuItem, Order, OrderStatus } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: null, // Skipping auth info for brevity in this helper
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Do not throw to avoid crashing the entire React app
  // throw new Error(JSON.stringify(errInfo));
}

export const getSettings = async (tenantId: string): Promise<RestaurantSettings | null> => {
  try {
    const docRef = doc(db, 'restaurants', tenantId, 'settings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as RestaurantSettings;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `restaurants/${tenantId}/settings/global`);
    return null;
  }
};

export const updateSettings = async (tenantId: string, settings: Omit<RestaurantSettings, 'id'>) => {
  try {
    const docRef = doc(db, 'restaurants', tenantId, 'settings', 'global');
    await setDoc(docRef, settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `restaurants/${tenantId}/settings/global`);
  }
};

export const subscribeToSettings = (tenantId: string, callback: (settings: RestaurantSettings | null) => void) => {
  const docRef = doc(db, 'restaurants', tenantId, 'settings', 'global');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() } as RestaurantSettings);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `restaurants/${tenantId}/settings/global`);
  });
};

export const subscribeToMenu = (tenantId: string, callback: (items: MenuItem[]) => void, onError?: (err: any) => void) => {
  const q = query(collection(db, 'restaurants', tenantId, 'menu'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: MenuItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `restaurants/${tenantId}/menu`);
    if (onError) onError(error);
  });
};

export const addMenuItem = async (tenantId: string, item: Omit<MenuItem, 'id'>) => {
  try {
    const newDocRef = doc(collection(db, 'restaurants', tenantId, 'menu'));
    await setDoc(newDocRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `restaurants/${tenantId}/menu`);
  }
};

export const updateMenuItem = async (tenantId: string, id: string, item: Partial<Omit<MenuItem, 'id'>>) => {
  try {
    const docRef = doc(db, 'restaurants', tenantId, 'menu', id);
    await updateDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `restaurants/${tenantId}/menu/${id}`);
  }
};

export const deleteMenuItem = async (tenantId: string, id: string) => {
  try {
    const docRef = doc(db, 'restaurants', tenantId, 'menu', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `restaurants/${tenantId}/menu/${id}`);
  }
};

export const uploadImage = async (tenantId: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `restaurants/${tenantId}/menu/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

export const uploadPaymentProof = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.6 quality to ensure it's < 1MB for Firestore
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const addOrder = async (tenantId: string, order: Omit<Order, 'id'>) => {
  try {
    const newDocRef = doc(collection(db, 'restaurants', tenantId, 'orders'));
    await setDoc(newDocRef, order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `restaurants/${tenantId}/orders`);
  }
};

export const updateOrderStatus = async (tenantId: string, id: string, status: OrderStatus) => {
  try {
    const docRef = doc(db, 'restaurants', tenantId, 'orders', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `restaurants/${tenantId}/orders/${id}`);
  }
};

export const subscribeToOrders = (tenantId: string, callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'restaurants', tenantId, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `restaurants/${tenantId}/orders`);
  });
};
