import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { createImagePreview, findMentionAtCursor } from '../../utils/helpers';
import MentionSuggestions from '../UI/MentionSuggestions';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
  const [currentMention, setCurrentMention] = useState(null);
  
  const { user } = useAuth();
  const { addPost } = usePosts();
  const textareaRef = useRef();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imagePreview = await createImagePreview(file);
      setImage(imagePreview);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const getCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { x: 0, y: 0 };

    const rect = textarea.getBoundingClientRect();
    const cursorPosition = textarea.selectionStart;
    
    // Create a temporary div to measure text position
    const tempDiv = document.createElement('div');
    const styles = window.getComputedStyle(textarea);
    tempDiv.style.font = styles.font;
    tempDiv.style.padding = styles.padding;
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.style.wordWrap = 'break-word';
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = styles.width;
    tempDiv.style.height = 'auto';
    
    const textBeforeCursor = content.substring(0, cursorPosition);
    tempDiv.textContent = textBeforeCursor;
    
    document.body.appendChild(tempDiv);
    const tempRect = tempDiv.getBoundingClientRect();
    document.body.removeChild(tempDiv);
    
    return {
      x: rect.left + tempRect.width - rect.left,
      y: rect.top + tempRect.height - rect.top
    };
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    const cursorPosition = e.target.selectionStart;
    const mention = findMentionAtCursor(newContent, cursorPosition);
    
    if (mention) {
      setCurrentMention(mention);
      setMentionQuery(mention.query);
      setMentionPosition(getCursorPosition());
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setCurrentMention(null);
      setMentionQuery('');
    }
  };

  const handleMentionSelect = (user) => {
    if (!currentMention || !textareaRef.current) return;
    
    const beforeMention = content.substring(0, currentMention.startIndex);
    const afterMention = content.substring(currentMention.endIndex);
    const newContent = `${beforeMention}@${user.username} ${afterMention}`;
    
    setContent(newContent);
    setShowMentions(false);
    setCurrentMention(null);
    setMentionQuery('');
    
    // Focus back to textarea and position cursor after the mention
    setTimeout(() => {
      const newCursorPosition = beforeMention.length + user.username.length + 2;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleMentionClose = () => {
    setShowMentions(false);
    setCurrentMention(null);
    setMentionQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsLoading(true);

    const post = {
      content: content.trim(),
      image,
      author: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      }
    };

    addPost(post);
    setContent('');
    setImage(null);
    setIsLoading(false);
  };

  const remainingChars = 280 - content.length;
  const canPost = (content.trim() || image) && remainingChars >= 0;

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName}
                className="avatar"
              />
            ) : (
              <div 
                className="avatar"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div style={{ position: 'relative' }}>
              <motion.textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="What's happening?"
                className="textarea"
                style={{
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '20px',
                  minHeight: '120px',
                  resize: 'none'
                }}
                maxLength={280}
                animate={{
                  height: content.length > 100 ? '160px' : '120px'
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              <MentionSuggestions
                isOpen={showMentions}
                query={mentionQuery}
                position={mentionPosition}
                onSelect={handleMentionSelect}
                onClose={handleMentionClose}
              />
            </div>

            <AnimatePresence>
              {image && (
                <motion.div 
                  style={{ position: 'relative', marginBottom: '16px' }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img
                    src={image}
                    alt="Upload preview"
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      borderRadius: 'var(--border-radius)',
                      border: '1px solid var(--border-color)'
                    }}
                  />
                  <motion.button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <div>
                <label
                  style={{
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'var(--transition)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--background-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Image size={20} color="var(--primary-color)" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <motion.span 
                  className="text-small"
                  style={{
                    color: remainingChars < 20 ? 'var(--danger-color)' : 'var(--text-secondary)'
                  }}
                  animate={{
                    scale: remainingChars < 20 ? [1, 1.2, 1] : 1,
                    color: remainingChars < 0 ? 'var(--danger-color)' : remainingChars < 20 ? 'var(--warning-color)' : 'var(--text-secondary)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {remainingChars}
                </motion.span>
                <motion.button
                  type="submit"
                  disabled={!canPost || isLoading}
                  className="btn btn-primary btn-small"
                  style={{
                    opacity: canPost ? 1 : 0.5,
                    cursor: canPost ? 'pointer' : 'not-allowed'
                  }}
                  whileHover={canPost ? { scale: 1.05 } : {}}
                  whileTap={canPost ? { scale: 0.95 } : {}}
                  animate={{
                    opacity: canPost ? 1 : 0.5
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;