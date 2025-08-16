import { useState } from 'react';
import { Heart, Repeat2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { formatRelativeTime, renderTextWithMentions } from '../../utils/helpers';

const Reply = ({ reply, onReply }) => {
  const { user } = useAuth();
  const { toggleLike, toggleRetweet } = usePosts();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = () => {
    toggleLike(reply.id, user.id);
  };

  const handleRetweet = () => {
    toggleRetweet(reply.id, user.id);
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

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    onReply(replyContent);
    setReplyContent('');
    setShowReplyInput(false);
  };

  return (
    <motion.div 
      className="card"
      style={{ 
        padding: '12px',
        marginLeft: '20px',
        borderLeft: '2px solid var(--border-color)'
      }}
      whileHover={{ backgroundColor: 'var(--background-hover)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex gap-3">
        <div>
          {reply.author.avatar ? (
            <img
              src={reply.author.avatar}
              alt={reply.author.displayName}
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
              {reply.author.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 style={{ fontWeight: '600', fontSize: '14px' }}>{reply.author.displayName}</h4>
            <span className="text-secondary text-small">@{reply.author.username}</span>
            <span className="text-secondary text-small">·</span>
            <span className="text-secondary text-small">
              {formatRelativeTime(reply.timestamp)}
            </span>
          </div>
          
          {reply.content && (
            <p style={{ marginBottom: '8px', lineHeight: '1.4', fontSize: '14px' }}>
              {renderContent(reply.content)}
            </p>
          )}

          <div className="flex items-center gap-4" style={{ maxWidth: '300px' }}>
            <motion.button
              onClick={() => setShowReplyInput(!showReplyInput)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-secondary)',
                transition: 'var(--transition)',
                fontSize: '12px'
              }}
              whileHover={{ 
                backgroundColor: 'rgba(29, 161, 242, 0.1)',
                color: 'var(--primary-color)',
                scale: 1.1
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(29, 161, 242, 0.1)';
                e.currentTarget.style.color = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <MessageCircle size={14} />
              <span className="text-small">{reply.replyCount || 0}</span>
            </motion.button>

            <motion.button
              onClick={handleRetweet}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: reply.retweeted ? 'var(--success-color)' : 'var(--text-secondary)',
                transition: 'var(--transition)',
                fontSize: '12px'
              }}
              whileHover={{ 
                backgroundColor: 'rgba(0, 186, 124, 0.1)',
                color: 'var(--success-color)',
                scale: 1.1
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 186, 124, 0.1)';
                e.currentTarget.style.color = 'var(--success-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = reply.retweeted ? 'var(--success-color)' : 'var(--text-secondary)';
              }}
            >
              <motion.div
                animate={reply.retweeted ? { rotate: [0, 180, 360] } : { rotate: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Repeat2 size={14} />
              </motion.div>
              <span className="text-small">{reply.retweets}</span>
            </motion.button>

            <motion.button
              onClick={handleLike}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: reply.liked ? 'var(--danger-color)' : 'var(--text-secondary)',
                transition: 'var(--transition)',
                fontSize: '12px'
              }}
              whileHover={{ 
                backgroundColor: 'rgba(244, 33, 46, 0.1)',
                color: 'var(--danger-color)',
                scale: 1.1
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(244, 33, 46, 0.1)';
                e.currentTarget.style.color = 'var(--danger-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = reply.liked ? 'var(--danger-color)' : 'var(--text-secondary)';
              }}
            >
              <motion.div
                animate={reply.liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Heart size={14} fill={reply.liked ? 'currentColor' : 'none'} />
              </motion.div>
              <span className="text-small">{reply.likes}</span>
            </motion.button>
          </div>

          {showReplyInput && (
            <form onSubmit={handleSubmitReply} style={{ marginTop: '8px' }}>
              <div className="flex gap-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Post your reply"
                  className="textarea"
                  style={{
                    flex: 1,
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    padding: '8px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'none'
                  }}
                  maxLength={280}
                />
                <motion.button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="btn btn-primary btn-small"
                  style={{
                    height: 'fit-content',
                    alignSelf: 'flex-end',
                    opacity: replyContent.trim() ? 1 : 0.5,
                    cursor: replyContent.trim() ? 'pointer' : 'not-allowed'
                  }}
                  whileHover={replyContent.trim() ? { scale: 1.05 } : {}}
                  whileTap={replyContent.trim() ? { scale: 0.95 } : {}}
                >
                  Reply
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Reply;