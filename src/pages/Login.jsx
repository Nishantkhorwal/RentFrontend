import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token); // Save JWT token in localStorage

        // Redirect to the home page after successful login
        navigate('/'); // Programmatically navigate to the home route
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-100 max-w-full'>
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 mb-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <Link to = "/register"><p className='text-red-500'>Dont have an account? Click here to register..</p></Link>
        </form>
        
      </div>
    </div>
  );
}