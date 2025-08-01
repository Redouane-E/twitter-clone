import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { createImagePreview, formatRelativeTime, renderTextWithMentions, findMentionAtCursor } from '../../utils/helpers';
import MentionSuggestions from '../UI/MentionSuggestions';

const QuoteTweetModal = ({ isOpen, onClose, originalPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
  const [currentMention, setCurrentMention] = useState(null);
  
  const { user } = useAuth();
  const { addQuoteTweet } = usePosts();
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

  const handleMentionSelect = (mentionUser) => {
    if (!currentMention || !textareaRef.current) return;
    
    const beforeMention = content.substring(0, currentMention.startIndex);
    const afterMention = content.substring(currentMention.endIndex);
    const newContent = `${beforeMention}@${mentionUser.username} ${afterMention}`;
    
    setContent(newContent);
    setShowMentions(false);
    setCurrentMention(null);
    setMentionQuery('');
    
    setTimeout(() => {
      const newCursorPosition = beforeMention.length + mentionUser.username.length + 2;
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

    addQuoteTweet(content.trim(), image, originalPost, user);
    
    setContent('');
    setImage(null);
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    setContent('');
    setImage(null);
    setShowMentions(false);
    setCurrentMention(null);
    setMentionQuery('');
    onClose();
  };

  const renderContent = (text) => {
    const parts = renderTextWithMentions(text);
    
    if (typeof parts === 'string') {
      return parts;
    }
    
    return parts.map((part, index) => {
      if (typeof part === 'object' && part.type === 'mention') {
        return (
          <span
            key={index}
            style={{
              color: 'var(--primary-color)',
              fontWeight: '500'
            }}
          >
            {part.text}
          </span>
        );
      }
      return part;
    });
  };

  const remainingChars = 280 - content.length;
  const canPost = (content.trim() || image) && remainingChars >= 0;

  if (!originalPost) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div 
            className="card"
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              margin: 0
            }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Quote Tweet</h2>
              <motion.button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%'
                }}
                whileHover={{ scale: 1.1, backgroundColor: 'var(--background-hover)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex gap-3 mb-4">
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
                      placeholder="Add a comment..."
                      className="textarea"
                      style={{
                        border: 'none',
                        padding: '12px 0',
                        fontSize: '18px',
                        minHeight: '100px',
                        resize: 'none'
                      }}
                      maxLength={280}
                      autoFocus
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
                            maxHeight: '300px',
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
                </div>
              </div>

              {/* Embedded Original Post */}
              <div 
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: 'var(--background-secondary)'
                }}
              >
                <div className="flex gap-3">
                  <div>
                    {originalPost.author.avatar ? (
                      <img
                        src={originalPost.author.avatar}
                        alt={originalPost.author.displayName}
                        className="avatar"
                        style={{ width: '32px', height: '32px' }}
                      />
                    ) : (
                      <div 
                        className="avatar"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'var(--primary-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        {originalPost.author.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 style={{ fontWeight: '600', fontSize: '14px' }}>{originalPost.author.displayName}</h4>
                      <span className="text-secondary text-small">@{originalPost.author.username}</span>
                      <span className="text-secondary text-small">·</span>
                      <span className="text-secondary text-small">
                        {formatRelativeTime(originalPost.timestamp)}
                      </span>
                    </div>
                    
                    {originalPost.content && (
                      <p style={{ marginBottom: '8px', lineHeight: '1.4', fontSize: '14px' }}>
                        {renderContent(originalPost.content)}
                      </p>
                    )}

                    {originalPost.image && (
                      <div style={{ marginBottom: '8px' }}>
                        <img
                          src={originalPost.image}
                          alt="Post content"
                          style={{
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: 'var(--border-radius)',
                            border: '1px solid var(--border-color)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                  >
                    {remainingChars}
                  </motion.span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn btn-secondary btn-small"
                    >
                      Cancel
                    </button>
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
                    >
                      {isLoading ? 'Posting...' : 'Quote Tweet'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteTweetModal;