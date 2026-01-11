import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    // Create a unique filename to prevent collisions
    const filename = `${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, `products/${filename}`);
    
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
};
