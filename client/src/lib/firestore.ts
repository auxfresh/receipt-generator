
import { 
  ref, 
  push, 
  set, 
  remove, 
  get, 
  query, 
  orderByChild, 
  equalTo,
  serverTimestamp 
} from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Receipt, BankingReceiptData, ShoppingReceiptData } from '@/types/receipt';

const RECEIPTS_PATH = 'receipts';

export const saveReceipt = async (
  userId: string,
  type: 'banking' | 'shopping',
  title: string,
  data: BankingReceiptData | ShoppingReceiptData,
  logoFile?: File
): Promise<string> => {
  let logoUrl = '';
  
  if (logoFile) {
    const logoRef = storageRef(storage, `logos/${userId}/${Date.now()}_${logoFile.name}`);
    const snapshot = await uploadBytes(logoRef, logoFile);
    logoUrl = await getDownloadURL(snapshot.ref);
  }

  const receiptData = {
    userId,
    type,
    title,
    data,
    logoUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const userReceiptsRef = ref(db, `users/${userId}/receipts`);
  const newReceiptRef = push(userReceiptsRef);
  await set(newReceiptRef, receiptData);
  
  return newReceiptRef.key!;
};

export const getUserReceipts = async (userId: string): Promise<Receipt[]> => {
  try {
    console.log('Fetching receipts for user:', userId);
    console.log('Database URL:', import.meta.env.VITE_FIREBASE_DATABASE_URL);
    
    // Check if user is authenticated
    const { auth } = await import('./firebase');
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser?.uid);
    console.log('User authenticated:', !!currentUser);
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Alternative approach: query by user-specific path
    const userReceiptsRef = ref(db, `users/${userId}/receipts`);
    const userReceiptsQuery = query(userReceiptsRef, orderByKey());
    const snapshot = await get(userReceiptsQuery);
    
    console.log('Database snapshot exists:', snapshot.exists());
    
    if (!snapshot.exists()) {
      console.log('No receipts found for user');
      return [];
    }
    
    const receipts: Receipt[] = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      console.log('Receipt data:', data);
      receipts.push({
        id: childSnapshot.key!,
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
      });
    });
    
    console.log('Total receipts found:', receipts.length);
    // Sort by createdAt desc (newest first)
    return receipts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    console.error('Error fetching receipts - Full error object:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    throw error; // Re-throw to see the actual error in the UI
  }
};

export const updateReceipt = async (
  receiptId: string,
  data: Partial<BankingReceiptData | ShoppingReceiptData>,
  logoFile?: File
): Promise<void> => {
  const receiptRef = ref(db, `${RECEIPTS_PATH}/${receiptId}`);
  
  // Get existing receipt data first
  const snapshot = await get(receiptRef);
  const existingData = snapshot.val();
  
  const updateData: any = {
    ...existingData,
    data: { ...existingData.data, ...data },
    updatedAt: serverTimestamp(),
  };

  if (logoFile) {
    const logoRef = storageRef(storage, `logos/${receiptId}/${Date.now()}_${logoFile.name}`);
    const uploadSnapshot = await uploadBytes(logoRef, logoFile);
    updateData.logoUrl = await getDownloadURL(uploadSnapshot.ref);
  }

  await set(receiptRef, updateData);
};

export const deleteReceipt = async (receiptId: string): Promise<void> => {
  const receiptRef = ref(db, `${RECEIPTS_PATH}/${receiptId}`);
  await remove(receiptRef);
};
