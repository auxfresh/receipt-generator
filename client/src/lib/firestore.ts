import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Receipt, BankingReceiptData, ShoppingReceiptData } from '@/types/receipt';

const RECEIPTS_COLLECTION = 'receipts';

export const saveReceipt = async (
  userId: string,
  type: 'banking' | 'shopping',
  title: string,
  data: BankingReceiptData | ShoppingReceiptData,
  logoFile?: File
): Promise<string> => {
  let logoUrl = '';
  
  if (logoFile) {
    const logoRef = ref(storage, `logos/${userId}/${Date.now()}_${logoFile.name}`);
    const snapshot = await uploadBytes(logoRef, logoFile);
    logoUrl = await getDownloadURL(snapshot.ref);
  }

  const receiptData = {
    userId,
    type,
    title,
    data,
    logoUrl,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, RECEIPTS_COLLECTION), receiptData);
  return docRef.id;
};

export const getUserReceipts = async (userId: string): Promise<Receipt[]> => {
  try {
    const q = query(
      collection(db, RECEIPTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      updatedAt: doc.data().updatedAt.toDate().toISOString(),
    })) as Receipt[];
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      // Index not ready, return empty array for now
      console.warn('Firestore index not ready, returning empty results');
      return [];
    }
    throw error;
  }
};

export const updateReceipt = async (
  receiptId: string,
  data: Partial<BankingReceiptData | ShoppingReceiptData>,
  logoFile?: File
): Promise<void> => {
  const receiptRef = doc(db, RECEIPTS_COLLECTION, receiptId);
  const updateData: any = {
    data,
    updatedAt: Timestamp.now(),
  };

  if (logoFile) {
    const logoRef = ref(storage, `logos/${receiptId}/${Date.now()}_${logoFile.name}`);
    const snapshot = await uploadBytes(logoRef, logoFile);
    updateData.logoUrl = await getDownloadURL(snapshot.ref);
  }

  await updateDoc(receiptRef, updateData);
};

export const deleteReceipt = async (receiptId: string): Promise<void> => {
  const receiptRef = doc(db, RECEIPTS_COLLECTION, receiptId);
  await deleteDoc(receiptRef);
};
