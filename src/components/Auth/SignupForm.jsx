import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validateUsername, generateUserId } from '../../utils/helpers';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../../utils/storage';

const SignupForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters';
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const users = getStoredData(STORAGE_KEYS.USERS) || [];
    if (users.find(u => u.email === formData.email)) {
      newErrors.email = 'Email already exists';
    }
    if (users.find(u => u.username === formData.username)) {
      newErrors.username = 'Username already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    const users = getStoredData(STORAGE_KEYS.USERS) || [];
    const newUser = {
      id: generateUserId(),
      username: formData.username,
      displayName: formData.displayName,
      email: formData.email,
      password: formData.password,
      avatar: null,
      bio: '',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setStoredData(STORAGE_KEYS.USERS, updatedUsers);

    login({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      displayName: newUser.displayName,
      avatar: newUser.avatar,
      bio: newUser.bio
    });

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-center mb-3" style={{ fontSize: '24px', fontWeight: '700' }}>
        Join Twitter today
      </h2>

      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="input"
          style={{ borderColor: errors.username ? 'var(--danger-color)' : undefined }}
        />
        {errors.username && (
          <span style={{ color: 'var(--danger-color)', fontSize: '13px' }}>
            {errors.username}
          </span>
        )}
      </div>

      <div>
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={formData.displayName}
          onChange={handleChange}
          className="input"
          style={{ borderColor: errors.displayName ? 'var(--danger-color)' : undefined }}
        />
        {errors.displayName && (
          <span style={{ color: 'var(--danger-color)', fontSize: '13px' }}>
            {errors.displayName}
          </span>
        )}
      </div>

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

      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input"
          style={{ borderColor: errors.confirmPassword ? 'var(--danger-color)' : undefined }}
        />
        {errors.confirmPassword && (
          <span style={{ color: 'var(--danger-color)', fontSize: '13px' }}>
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
      </button>

      <div className="text-center">
        <span className="text-secondary">Already have an account? </span>
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
          Sign in
        </button>
      </div>
    </form>
  );
};

export default SignupForm;