import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode }from 'jwt-decode'; // Ensure this import is correct

const ProtectedRoute = ({ element }) => {
    const navigate = useNavigate();

  // Check if the user is logged in by checking for the token in localStorage

  const handleLogout = () => {
    // Remove the JWT token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };
  // Check if the user is authenticated
  const token = localStorage.getItem('token');

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the token to check if the user is an admin
    const decodedToken = jwtDecode(token);

    // Check if the user has admin privileges
    if (!decodedToken.isAdmin) {
      // Render a message for non-admin users
      return (
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-5xl font-bold text-red-700">Access Denied!</h1>
          <p className="mt-4">Only admin can access this route, Logout and login as admin again.</p>
          <button className='text-red-700' onClick={handleLogout}>Click here to Logout..</button>
        </div>
      );
    }

    // If user is admin, allow access to the protected component
    return element;
  } catch (error) {
    console.error('Error decoding token:', error);
    // If there's an error with the token, redirect to login
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;