import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const config = { icon: '🔍', gradient: 'from-green-600 to-teal-700', role: 'quality' };

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/register', { username, email, password, role: config.role });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/Quality-Check/login'), 1000);
    } catch (err) {
      setError('Registration failed. Try a different email.');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md animate-in slide-in-from-bottom duration-700">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-3xl animate-in zoom-in duration-500`}>
              {config.icon}
            </div>
            <h2 className="text-2xl font-bold text-white capitalize mb-2">Quality Check Registration</h2>
            <p className="text-gray-400">Create your account</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <input
                type="text"
                value="Quality Check"
                disabled
                className="w-full px-4 py-3 bg-gray-600/30 border border-gray-600/50 rounded-lg text-gray-300 cursor-not-allowed"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm animate-in slide-in-from-top duration-300">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm animate-in slide-in-from-top duration-300">
                {success}
              </div>
            )}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-4 bg-gradient-to-r ${config.gradient} text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-4 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-600/50 hover:border-gray-500 transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/Quality-Check/login')}
              >
                Sign In
              </button>
            </div>
          </form>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-6 py-2 text-gray-400 hover:text-gray-300 transition-colors duration-300 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
