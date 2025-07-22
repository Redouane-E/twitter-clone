import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { createImagePreview } from '../../utils/helpers';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { addPost } = usePosts();

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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            />

            {image && (
              <div style={{ position: 'relative', marginBottom: '16px' }}>
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
                <button
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
                >
                  <X size={16} />
                </button>
              </div>
            )}

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
                <span 
                  className="text-small"
                  style={{
                    color: remainingChars < 20 ? 'var(--danger-color)' : 'var(--text-secondary)'
                  }}
                >
                  {remainingChars}
                </span>
                <button
                  type="submit"
                  disabled={!canPost || isLoading}
                  className="btn btn-primary btn-small"
                  style={{
                    opacity: canPost ? 1 : 0.5,
                    cursor: canPost ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;