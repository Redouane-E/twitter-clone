import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail } from '../../utils/helpers';
import { getStoredData, STORAGE_KEYS } from '../../utils/storage';

const LoginForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    const users = getStoredData(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      login({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio
      });
    } else {
      setErrors({ general: 'Invalid email or password' });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-center mb-3" style={{ fontSize: '24px', fontWeight: '700' }}>
        Sign in to Twitter
      </h2>

      {errors.general && (
        <div style={{ 
          color: 'var(--danger-color)', 
          padding: '12px',
          backgroundColor: '#fef2f2',
          borderRadius: 'var(--border-radius)',
          fontSize: '14px'
        }}>
          {errors.general}
        </div>
      )}

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input"
          style={{ borderColor: errors.email ? 'var(--danger-color)' : undefined }}
        />
        {errors.email && (
          <span style={{ color: 'var(--danger-color)', fontSize: '13px' }}>
            {errors.email}
          </span>
        )}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input"
          style={{ borderColor: errors.password ? 'var(--danger-color)' : undefined }}
        />
        {errors.password && (
          <span style={{ color: 'var(--danger-color)', fontSize: '13px' }}>
            {errors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="text-center">
        <span className="text-secondary">Don't have an account? </span>
        <button
          type="button"
          onClick={onToggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-color)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;