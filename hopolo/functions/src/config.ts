export const getConfig = () => {
  return {
    encryptionKey: process.env.ENCRYPTION_KEY || ''
  };
};