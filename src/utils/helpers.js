import { formatDistanceToNow } from 'date-fns';

export const formatRelativeTime = (timestamp) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    return 'Just now';
  }
};

export const generateUserId = () => {
  return Date.now().toString();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 20;
};

export const truncateText = (text, maxLength = 280) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file type'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};