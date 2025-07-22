import { Edit, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileHeader = ({ onEditProfile }) => {
  const { user, logout } = useAuth();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Profile</h2>
        <div className="flex gap-2">
          <button
            onClick={onEditProfile}
            className="btn btn-secondary btn-small"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={logout}
            className="btn btn-secondary btn-small"
            style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
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
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
            {user.displayName}
          </h3>
          <p className="text-secondary text-small">@{user.username}</p>
          {user.bio && (
            <p style={{ marginTop: '12px' }}>{user.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;