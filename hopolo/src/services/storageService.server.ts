import { adminStorage } from '../lib/firebase-admin.server';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadFile(file: File): Promise<string> {
  // Validation
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${file.name}. Max size is 5MB.`);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  }

  const bucket = adminStorage.bucket();
  const filename = `products/${uuidv4()}_${file.name}`;
  const blob = bucket.file(filename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blob.save(buffer, {
    metadata: {
      contentType: file.type,
    },
  });

  // Make the file public or get a signed URL
  // For simplicity in this boutique app, we'll use the public URL format if the bucket allows it,
  // or a long-lived signed URL.
  
  // Alternative: await blob.makePublic();
  // return `https://storage.googleapis.com/${bucket.name}/${filename}`;

  const [url] = await blob.getSignedUrl({
    action: 'read',
    expires: '03-01-2500', // Long lived
  });

  return url;
}
