import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { formatRelativeTime, renderTextWithMentions } from '../../utils/helpers';

const ReplyModal = ({ isOpen, onClose, originalPost }) => {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const { addReply } = usePosts();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    addReply(content, originalPost, user);
    setContent('');
    onClose();
  };

  const handleMentionClick = (username) => {
    // In a real app, this would navigate to the user's profile
    console.log('Navigate to user profile:', username);
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
            onClick={() => handleMentionClick(part.username)}
            style={{
              color: 'var(--primary-color)',
              cursor: 'pointer',
              fontWeight: '500',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            {part.text}
          </span>
        );
      }
      return part;
    });
  };

  const renderOriginalPost = () => {
    return (
      <div 
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: 'var(--background-secondary)'
        }}
      >
        <div className="flex gap-2">
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
            <div className="flex items-center gap-1 mb-1">
              <h4 style={{ fontWeight: '600', fontSize: '14px' }}>{originalPost.author.displayName}</h4>
              <span className="text-secondary" style={{ fontSize: '12px' }}>@{originalPost.author.username}</span>
              <span className="text-secondary" style={{ fontSize: '12px' }}>·</span>
              <span className="text-secondary" style={{ fontSize: '12px' }}>
                {formatRelativeTime(originalPost.timestamp)}
              </span>
            </div>
            
            {originalPost.content && (
              <p style={{ marginBottom: '8px', lineHeight: '1.4', fontSize: '14px' }}>
                {renderContent(originalPost.content)}
              </p>
            )}

            {originalPost.image && (
              <div>
                <img
                  src={originalPost.image}
                  alt="Original post content"
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
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            zIndex: 1000
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              backgroundColor: 'var(--background)',
              borderRadius: 'var(--border-radius)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontWeight: '700', fontSize: '18px' }}>Reply to @{originalPost.author.username}</h3>
              <motion.button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                whileHover={{ backgroundColor: 'var(--background-hover)' }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {renderOriginalPost()}

            <form onSubmit={handleSubmit}>
              <div className="flex gap-3 mb-4">
                <div>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="avatar"
                      style={{ width: '40px', height: '40px' }}
                    />
                  ) : (
                    <div 
                      className="avatar"
                      style={{
                        width: '40px',
                        height: '40px',
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
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Post your reply"
                    className="textarea"
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid var(--border-color)',
                      padding: '12px 0',
                      fontSize: '16px',
                      minHeight: '100px',
                      resize: 'none'
                    }}
                    maxLength={280}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span 
                      className="text-small"
                      style={{
                        color: content.length > 260 ? 'var(--danger-color)' : 'var(--text-secondary)'
                      }}
                    >
                      {280 - content.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={!content.trim() || content.length > 280}
                  className="btn btn-primary"
                  style={{
                    opacity: content.trim() && content.length <= 280 ? 1 : 0.5,
                    cursor: content.trim() && content.length <= 280 ? 'pointer' : 'not-allowed'
                  }}
                  whileHover={content.trim() && content.length <= 280 ? { scale: 1.05 } : {}}
                  whileTap={content.trim() && content.length <= 280 ? { scale: 0.95 } : {}}
                >
                  Reply
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReplyModal;