import { formatDistanceToNow } from 'date-fns';

export const formatRelativeTime = (timestamp) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
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

export const extractMentions = (text) => {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }
  
  return mentions;
};

export const renderTextWithMentions = (text) => {
  const mentions = extractMentions(text);
  
  if (mentions.length === 0) {
    return text;
  }
  
  const parts = [];
  let lastIndex = 0;
  
  mentions.forEach((mention) => {
    parts.push(text.slice(lastIndex, mention.startIndex));
    parts.push({
      type: 'mention',
      username: mention.username,
      text: `@${mention.username}`
    });
    lastIndex = mention.endIndex;
  });
  
  parts.push(text.slice(lastIndex));
  
  return parts.filter(part => part !== '');
};

export const getMentionSuggestions = (query, users = []) => {
  if (!query || query.length < 1) {
    return users.slice(0, 5);
  }
  
  return users
    .filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);
};

export const findMentionAtCursor = (text, cursorPosition) => {
  const beforeCursor = text.slice(0, cursorPosition);
  const afterCursor = text.slice(cursorPosition);
  
  const mentionMatch = beforeCursor.match(/@([a-zA-Z0-9_]*)$/);
  
  if (!mentionMatch) {
    return null;
  }
  
  const spaceAfterMatch = afterCursor.match(/^[a-zA-Z0-9_]*(\s|$)/);
  
  return {
    query: mentionMatch[1],
    startIndex: mentionMatch.index,
    endIndex: cursorPosition + (spaceAfterMatch ? spaceAfterMatch[1].length : 0)
  };
};