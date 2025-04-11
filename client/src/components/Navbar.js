import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../utils/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const profileNav = ()=>{
    navigate('/profile')
  }

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="px-4 py-2 text-gray-600 hover:text-white hover:bg-blue-500 rounded-md transition duration-200"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Task Reminder
          </Link>

          <div className="flex space-x-4 items-center relative">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>

            {token ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:text-white hover:bg-blue-600 transition duration-200"
                >
                  {user?.name || 'Account'}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10">
                     <button onClick={profileNav} className='block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition duration-150 '>Profile</button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition duration-150"
                    >
                      Logout
                    </button>
                   
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
