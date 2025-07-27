import { motion, AnimatePresence } from 'framer-motion';
import { usePosts } from '../../contexts/PostContext';
import PostCard from './PostCard';
import PostSkeleton from '../UI/PostSkeleton';

const Feed = () => {
  const { posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(3)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </motion.div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center" style={{ padding: '40px' }}>
        <h3 style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>
          No posts yet
        </h3>
        <p className="text-secondary">
          Be the first to share what's happening!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default Feed;