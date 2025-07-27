import { useState } from 'react';
import { Plus } from 'lucide-react';
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
          <h2 className="gradient-text" style={{ 
            fontSize: '28px', 
            fontWeight: '800',
            marginBottom: '24px',
            letterSpacing: '-0.025em'
          }}>
            ✨ Twitter
          </h2>
          
          <div className="card hover-lift" style={{
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '700',
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>
              What's happening?
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              Join the conversation and share your thoughts with the world.
            </p>
          </div>
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
          
          {/* Trending Card */}
          <div className="card hover-lift" style={{ marginTop: '20px' }}>
            <h3 className="gradient-text" style={{ 
              fontSize: '20px', 
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              ✨ Trending
            </h3>
            <div className="space-y-3">
              <div className="glass-effect" style={{
                padding: '12px 16px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  #ReactJS
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Trending in Technology
                </p>
              </div>
              <div className="glass-effect" style={{
                padding: '12px 16px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  #WebDevelopment
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Trending in Tech
                </p>
              </div>
              <div className="glass-effect" style={{
                padding: '12px 16px',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  #JavaScript
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Trending worldwide
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-small" style={{ marginTop: '16px', width: '100%' }}>
              Show more
            </button>
          </div>

          {/* Stats Card */}
          <div className="card hover-lift shimmer" style={{ 
            marginTop: '20px',
            background: 'var(--primary-gradient)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '700',
              marginBottom: '16px',
              opacity: 0.9
            }}>
              🚀 Your Impact
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>127</p>
                <p style={{ fontSize: '12px', opacity: 0.8 }}>Followers</p>
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>89</p>
                <p style={{ fontSize: '12px', opacity: 0.8 }}>Following</p>
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>1.2K</p>
                <p style={{ fontSize: '12px', opacity: 0.8 }}>Likes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
      
      {/* Floating Action Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000
      }}>
        <button
          className="btn btn-primary glow-primary float-animation"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            padding: '0',
            boxShadow: 'var(--shadow-xl), var(--shadow-glow)'
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default HomePage;