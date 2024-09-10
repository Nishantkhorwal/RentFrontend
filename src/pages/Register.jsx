import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Registration successful:', data);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setError('');
  
        // Store token and proceed with authentication
        localStorage.setItem('token', data.token); // Save the token in localStorage
        // You can now redirect to a protected route or perform other actions
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server error');
    } finally {
      setLoading(false); // End loading
    }
  };
  

  return (
    <div className='bg-gray-100 max-w-full'>
      <div className="container mx-auto px-4 py-11">
        <h1 className="text-4xl font-bold mb-4 text-center">Register</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your name"
              required
            />
          </div>
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}