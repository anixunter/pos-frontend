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
  <h2 className="text-center text-2xl font-semibold text-gray-900">POS System</h2>

  <form
    className="mt-8 mx-auto max-w-xs space-y-4"
    onSubmit={handleSubmit}
  >
    <div className="space-y-3">
      <input
        id="username"
        name="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        placeholder="Username"
        className="w-full px-3 py-2 border-0 border-b border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-black"
      />
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Password"
        className="w-full px-3 py-2 border-0 border-b border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-black"
      />
    </div>

    {error && <p className="text-sm text-red-600">{error}</p>}

    <div className="flex justify-center">
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 text-sm font-medium text-white bg-black disabled:bg-gray-300"
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
    </div>
  </form>
</>
  );
};

export default Login;