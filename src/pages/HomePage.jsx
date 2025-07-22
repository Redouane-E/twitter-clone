import { useState } from 'react';
import CreatePost from '../components/Post/CreatePost';
import Feed from '../components/Post/Feed';
import ProfileHeader from '../components/Profile/ProfileHeader';
import EditProfileModal from '../components/Profile/EditProfileModal';
import ThemeToggle from '../components/UI/ThemeToggle';

const HomePage = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="app-layout">
      <div className="sidebar-left">
        <div style={{ position: 'sticky', top: '20px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            marginBottom: '20px',
            color: 'var(--primary-color)'
          }}>
            Twitter
          </h2>
        </div>
      </div>
      
      <div className="main-content">
        <div className="header">
          <h1>Home</h1>
          <ThemeToggle />
        </div>
        
        <div style={{ padding: '0 20px' }}>
          <CreatePost />
          <Feed />
        </div>
      </div>
      
      <div className="sidebar-right">
        <div style={{ position: 'sticky', top: '20px' }}>
          <ProfileHeader onEditProfile={() => setShowEditProfile(true)} />
        </div>
      </div>
      
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
    </div>
  );
};

export default HomePage;