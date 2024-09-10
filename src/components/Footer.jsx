import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

  // Check if the user is logged in by checking for the token in localStorage
  const isLoggedIn = !!localStorage.getItem('token'); // Returns true if the token exists

  const handleLogout = () => {
    // Remove the JWT token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };
  return (
    <footer className="bg-gray-800 p-4 ">
      <div className="container mx-auto text-center text-white">
        <p className="mb-2">© {new Date().getFullYear()} ROF. All rights reserved.</p>
        <p className="mb-2">
          <Link to="/" className="hover:underline">Home</Link> |
          <button onClick={handleLogout} href="/contact" className="hover:underline ms-1"> Logout</button>
        </p>
        <p className="text-sm">
          Follow us on
          <a href="https://twitter.com/rof" className="ml-2 hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a>, 
          <a href="https://facebook.com/rof" className="ml-2 hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a>, 
          and 
          <a href="https://www.instagram.com/ROFGroup/" className="ml-2 hover:underline" target="_blank" rel="noopener noreferrer">Instagram</a>.
        </p>
      </div>
    </footer>
  );
}