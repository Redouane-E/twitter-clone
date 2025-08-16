import { useState } from 'react';
import { Heart, Repeat2, MessageCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { formatRelativeTime, renderTextWithMentions } from '../../utils/helpers';
import QuoteTweetModal from './QuoteTweetModal';
import ReplyModal from './ReplyModal';
import Reply from './Reply';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { toggleLike, toggleRetweet } = usePosts();
  const [showQuoteTweetModal, setShowQuoteTweetModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const handleLike = () => {
    toggleLike(post.id, user.id);
  };

  const handleRetweet = () => {
    toggleRetweet(post.id, user.id);
  };

  const handleQuoteTweet = () => {
    // Prevent quoting quote tweets to avoid infinite chains
    if (post.quotedPost) return;
    setShowQuoteTweetModal(true);
  };

  const handleReply = () => {
    setShowReplyModal(true);
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

  const renderEmbeddedPost = (quotedPost) => {
    return (
      <div 
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '12px',
          marginTop: '12px',
          backgroundColor: 'var(--background-secondary)'
        }}
      >
        <div className="flex gap-2">
          <div>
            {quotedPost.author.avatar ? (
              <img
                src={quotedPost.author.avatar}
                alt={quotedPost.author.displayName}
                className="avatar"
                style={{ width: '24px', height: '24px' }}
              />
            ) : (
              <div 
                className="avatar"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {quotedPost.author.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <h4 style={{ fontWeight: '600', fontSize: '14px' }}>{quotedPost.author.displayName}</h4>
              <span className="text-secondary" style={{ fontSize: '12px' }}>@{quotedPost.author.username}</span>
              <span className="text-secondary" style={{ fontSize: '12px' }}>·</span>
              <span className="text-secondary" style={{ fontSize: '12px' }}>
                {formatRelativeTime(quotedPost.timestamp)}
              </span>
            </div>
            
            {quotedPost.content && (
              <p style={{ marginBottom: '8px', lineHeight: '1.4', fontSize: '14px' }}>
                {renderContent(quotedPost.content)}
              </p>
            )}

            {quotedPost.image && (
              <div>
                <img
                  src={quotedPost.image}
                  alt="Quoted post content"
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
    <motion.div 
      className="card" 
      style={{ paddingBottom: '12px' }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex gap-3">
        <div>
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.displayName}
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
              {post.author.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 style={{ fontWeight: '700' }}>{post.author.displayName}</h4>
            <span className="text-secondary text-small">@{post.author.username}</span>
            <span className="text-secondary text-small">·</span>
            <span className="text-secondary text-small">
              {formatRelativeTime(post.timestamp)}
            </span>
          </div>
          
          {post.content && (
            <p style={{ marginBottom: '12px', lineHeight: '1.5' }}>
              {renderContent(post.content)}
            </p>
          )}

          {post.image && (
            <div style={{ marginBottom: '12px' }}>
              <img
                src={post.image}
                alt="Post content"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-color)'
                }}
              />
            </div>
          )}

          {post.quotedPost && renderEmbeddedPost(post.quotedPost)}

          {post.replies && post.replies.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              {post.replies.map((reply) => (
                <Reply 
                  key={reply.id} 
                  reply={reply} 
                  onReply={(content) => {
                    // Handle nested reply
                    console.log('Replying to reply:', content);
                  }} 
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between" style={{ maxWidth: '400px' }}>
            <motion.button
              onClick={handleReply}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                transition: 'var(--transition)'
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
              <MessageCircle size={18} />
              <span className="text-small">{post.replyCount || 0}</span>
            </motion.button>

            <motion.button
              onClick={handleRetweet}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: post.retweeted ? 'var(--success-color)' : 'var(--text-secondary)',
                transition: 'var(--transition)'
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
                e.currentTarget.style.color = post.retweeted ? 'var(--success-color)' : 'var(--text-secondary)';
              }}
            >
              <motion.div
                animate={post.retweeted ? { rotate: [0, 180, 360] } : { rotate: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Repeat2 size={18} />
              </motion.div>
              <span className="text-small">{post.retweets}</span>
            </motion.button>

            <motion.button
              onClick={handleQuoteTweet}
              disabled={!!post.quotedPost}
              style={{
                background: 'none',
                border: 'none',
                cursor: post.quotedPost ? 'not-allowed' : 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                opacity: post.quotedPost ? 0.5 : 1,
                transition: 'var(--transition)'
              }}
              whileHover={!post.quotedPost ? { 
                backgroundColor: 'rgba(29, 161, 242, 0.1)',
                color: 'var(--primary-color)',
                scale: 1.1
              } : {}}
              whileTap={!post.quotedPost ? { scale: 0.95 } : {}}
              onMouseEnter={(e) => {
                if (!post.quotedPost) {
                  e.currentTarget.style.backgroundColor = 'rgba(29, 161, 242, 0.1)';
                  e.currentTarget.style.color = 'var(--primary-color)';
                }
              }}
              onMouseLeave={(e) => {
                if (!post.quotedPost) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <BarChart3 size={18} />
              <span className="text-small">{post.quotes || 0}</span>
            </motion.button>

            <motion.button
              onClick={handleLike}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: post.liked ? 'var(--danger-color)' : 'var(--text-secondary)',
                transition: 'var(--transition)'
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
                e.currentTarget.style.color = post.liked ? 'var(--danger-color)' : 'var(--text-secondary)';
              }}
            >
              <motion.div
                animate={post.liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
              </motion.div>
              <span className="text-small">{post.likes}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <QuoteTweetModal
        isOpen={showQuoteTweetModal}
        onClose={() => setShowQuoteTweetModal(false)}
        originalPost={post}
      />

      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        originalPost={post}
      />
    </motion.div>
  );
};

export default PostCard;