import { Edit, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileHeader = ({ onEditProfile }) => {
  const { user, logout } = useAuth();

  return (
    <div className="card hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h2 className="gradient-text" style={{ fontSize: '22px', fontWeight: '800' }}>Profile</h2>
        <div className="flex gap-2">
          <button
            onClick={onEditProfile}
            className="btn btn-ghost btn-small"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={logout}
            className="btn btn-ghost btn-small glow-danger"
            style={{ color: 'var(--danger-color)' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="avatar avatar-lg avatar-premium status-online"
            />
          ) : (
            <div 
              className="avatar avatar-lg avatar-premium status-online"
              style={{
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '28px',
                fontWeight: '700'
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