import { usePosts } from '../../contexts/PostContext';
import PostCard from './PostCard';

const Feed = () => {
  const { posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <div className="text-center" style={{ padding: '40px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTop: '3px solid var(--primary-color)',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p className="text-secondary mt-2">Loading posts...</p>
      </div>
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
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;