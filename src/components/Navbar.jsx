import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
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
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-5xl font-bold">ROF</h1>
        <div>
          {isLoggedIn ? (
            <>
              {/* Show Home and Logout if the user is logged in */}
              <Link to="/" className="text-white px-4 hover:underline">Home</Link>
              <button onClick={handleLogout} className="text-white px-4 hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show Register and Login if the user is not logged in */}
              <Link to="/register" className="text-white px-4 hover:underline">Register</Link>
              <Link to="/login" className="text-white px-4 hover:underline">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
