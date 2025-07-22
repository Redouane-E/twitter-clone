import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createImagePreview } from '../../utils/helpers';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../../utils/storage';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    bio: user.bio || '',
    avatar: user.avatar
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imagePreview = await createImagePreview(file);
      setFormData(prev => ({ ...prev, avatar: imagePreview }));
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedUser = {
      ...user,
      displayName: formData.displayName,
      bio: formData.bio,
      avatar: formData.avatar
    };

    const users = getStoredData(STORAGE_KEYS.USERS) || [];
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...updatedUser } : u
    );
    
    setStoredData(STORAGE_KEYS.USERS, updatedUsers);
    login(updatedUser);

    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
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
    }}>
      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          margin: 0
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Edit Profile</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="avatar avatar-lg"
                />
              ) : (
                <div 
                  className="avatar avatar-lg"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}
                >
                  {formData.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <label
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid white'
                }}
              >
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="textarea"
              placeholder="Tell people about yourself..."
              maxLength={160}
              style={{ minHeight: '80px' }}
            />
            <div className="text-right text-small text-secondary">
              {formData.bio.length}/160
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;