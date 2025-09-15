import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
    //i dont need to navigate to login manually as public route
    // is dependent on isAuthenticated and when logged in its
    // value is true and making it re-render and automatically 
    // directs to dashboard
  };

  return (
    <>
      <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username"/>
          </div>
          <div>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-semibold cursor-pointer rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;