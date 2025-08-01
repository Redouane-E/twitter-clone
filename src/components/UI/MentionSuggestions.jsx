import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMentionSuggestions } from '../../utils/helpers';

const MentionSuggestions = ({ 
  isOpen, 
  query, 
  position,
  users = [],
  onSelect,
  onClose 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef();

  // Sample users for demonstration (in real app, this would come from API)
  const defaultUsers = [
    { id: '1', username: 'john_doe', displayName: 'John Doe', avatar: null },
    { id: '2', username: 'jane_smith', displayName: 'Jane Smith', avatar: null },
    { id: '3', username: 'alex_wilson', displayName: 'Alex Wilson', avatar: null },
    { id: '4', username: 'sarah_johnson', displayName: 'Sarah Johnson', avatar: null },
    { id: '5', username: 'mike_brown', displayName: 'Mike Brown', avatar: null },
    { id: '6', username: 'emily_davis', displayName: 'Emily Davis', avatar: null },
    { id: '7', username: 'david_miller', displayName: 'David Miller', avatar: null },
    { id: '8', username: 'lisa_garcia', displayName: 'Lisa Garcia', avatar: null },
  ];

  const allUsers = users.length > 0 ? users : defaultUsers;

  useEffect(() => {
    if (isOpen) {
      const filteredSuggestions = getMentionSuggestions(query, allUsers);
      setSuggestions(filteredSuggestions);
      setSelectedIndex(0);
    }
  }, [isOpen, query, allUsers]);

  const handleSelect = (user) => {
    onSelect(user);
    onClose();
  };

  const handleKeyDown = useCallback((e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, suggestions, selectedIndex, onClose, handleSelect]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && suggestions.length > 0 && (
        <motion.div
          style={{
            position: 'absolute',
            left: position?.x || 0,
            top: (position?.y || 0) + 24,
            zIndex: 1000,
            maxWidth: '280px',
          }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div 
            ref={listRef}
            style={{
              backgroundColor: 'var(--background-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {suggestions.length === 0 ? (
              <div style={{ padding: '8px', color: 'var(--text-secondary)' }}>
                No users found.
              </div>
            ) : (
              suggestions.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div
                    onClick={() => handleSelect(user)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      borderRadius: 'var(--border-radius)',
                      cursor: 'pointer',
                      backgroundColor: index === selectedIndex ? 'var(--background-hover)' : 'transparent',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {user.displayName}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MentionSuggestions;