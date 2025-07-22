export const STORAGE_KEYS = {
  USER: 'twitterUser',
  POSTS: 'twitterPosts',
  USERS: 'twitterUsers'
};

export const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting stored data:', error);
    return null;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error setting stored data:', error);
    return false;
  }
};

export const removeStoredData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing stored data:', error);
    return false;
  }
};