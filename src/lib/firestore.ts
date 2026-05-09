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
  throw new Error(JSON.stringify(errInfo));
}

export const getSettings = async (): Promise<RestaurantSettings | null> => {
  try {
    const docRef = doc(db, 'settings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as RestaurantSettings;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'settings/global');
    return null;
  }
};

export const updateSettings = async (settings: Omit<RestaurantSettings, 'id'>) => {
  try {
    const docRef = doc(db, 'settings', 'global');
    await setDoc(docRef, settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/global');
  }
};

export const subscribeToSettings = (callback: (settings: RestaurantSettings | null) => void) => {
  const docRef = doc(db, 'settings', 'global');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() } as RestaurantSettings);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'settings/global');
  });
};

export const subscribeToMenu = (callback: (items: MenuItem[]) => void) => {
  const q = query(collection(db, 'menu'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: MenuItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'menu');
  });
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  try {
    const newDocRef = doc(collection(db, 'menu'));
    await setDoc(newDocRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'menu');
  }
};

export const updateMenuItem = async (id: string, item: Partial<Omit<MenuItem, 'id'>>) => {
  try {
    const docRef = doc(db, 'menu', id);
    await updateDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `menu/${id}`);
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const docRef = doc(db, 'menu', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `menu/${id}`);
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `menu/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

export const addOrder = async (order: Omit<Order, 'id'>) => {
  try {
    const newDocRef = doc(collection(db, 'orders'));
    await setDoc(newDocRef, order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'orders');
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
  }
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'orders');
  });
};
