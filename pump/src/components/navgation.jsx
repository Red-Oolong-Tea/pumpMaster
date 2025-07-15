import { useNavigate } from 'react-router-dom';
import { logout } from '../auth/auth';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="text-black px-6 py-3 flex items-center justify-between shadow bg-white">

      <div className="flex items-center gap-6">
        <div className="font-bold text-xl">PumpMaster</div>
        <div className="text-sm text-gray-700 hover:text-black cursor-pointer">Dashboard</div>
        <div className="text-sm text-gray-700 hover:text-black cursor-pointer">Pumps</div>
        <div className="text-sm text-gray-700 hover:text-black cursor-pointer">Reports</div>
        <div className="text-sm text-gray-700 hover:text-black cursor-pointer">Alerts</div>
      </div>

      <div className="flex-1 mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-3 py-1 rounded text-black bg-gray-100 focus:outline-none"
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          SC
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-20">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
