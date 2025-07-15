import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const res = login(username, password);
    if (res.success) {
      navigate('/pumps');
    } else {
      setError('Invalid credentials');
    }
  };
return (
  <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome back</h2>

      <input
        className="w-full mb-4 p-3 border rounded"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="w-full mb-4 p-3 border rounded"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Log in
      </button>
    </form>
  </div>
);


}
