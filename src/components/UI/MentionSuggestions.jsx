import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
} from '@/components/ui/popover';
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
  const commandRef = useRef();

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
  }, [isOpen, suggestions, selectedIndex, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, suggestions, selectedIndex, handleKeyDown]);

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
          <motion.div 
            className="rounded-md border bg-popover text-popover-foreground shadow-md w-72"
            layoutId="mention-dropdown"
          >
            <Command ref={commandRef}>
              <CommandList>
                {suggestions.length === 0 ? (
                  <CommandEmpty>No users found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {suggestions.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <CommandItem
                          value={user.username}
                          onSelect={() => handleSelect(user)}
                          className={`cursor-pointer ${
                            index === selectedIndex ? 'bg-accent text-accent-foreground' : ''
                          }`}
                        >
                          <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.1 }}
                          >
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.displayName}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div 
                                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold"
                              >
                                {user.displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">{user.displayName}</span>
                              <span className="text-sm text-muted-foreground">@{user.username}</span>
                            </div>
                          </motion.div>
                        </CommandItem>
                      </motion.div>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MentionSuggestions;