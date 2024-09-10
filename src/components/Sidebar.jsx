import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { TbLogin } from "react-icons/tb";

export default function Sidebar() {
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
    <div className="flex h-screen fixed">
      <aside className="bg-black w-64 flex flex-col p-4">
        <h1 className="text-white text-4xl font-bold mb-8">ROF</h1>
        <div className="flex flex-col space-y-4">
          {isLoggedIn ? (
            <>
              {/* Show Home and Logout if the user is logged in */}
              <Link to="/" className='flex flex-row justify-between cursor-pointer'><div  className="text-white ">Home</div><IoHomeOutline className='text-white'/></Link>
              <div onClick={handleLogout} className='flex flex-row justify-between cursor-pointer'><button  className="text-white  text-left">
                Logout
              </button><IoIosLogOut className='text-white' /></div>
            </>
          ) : (
            <>
              {/* Show Register and Login if the user is not logged in */}
              <Link to="/register" className='flex flex-row justify-between cursor-pointer'><div  className="text-white ">Register</div><FaUser className='text-white'/></Link>
              <Link to="/login" className='flex flex-row justify-between cursor-pointer'><div  className="text-white ">Login</div><TbLogin className='text-white'/></Link>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
