import React, { useState } from 'react';
import {
  Link,
  NavLink,
  useNavigate
} from 'react-router-dom';

import { Search, X } from 'lucide-react';

import { assets } from '../assets/assets.js';

import {
  Show,
  SignInButton,
  UserButton
} from '@clerk/react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    const value = searchText.trim();

    if (!value) return;

    navigate(
      `/movies?search=${encodeURIComponent(value)}`
    );

    setSearchText('');
    setShowSearch(false);
    setOpen(false);
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link
        to="/"
        onClick={() => setOpen(false)}
      >
        <img
          className="logo"
          src={assets.logo}
          alt="VPCine"
        />
      </Link>

      {/* Mobile Menu */}
      <button
        className="menu"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <div
        className={
          'navlinks ' + (open ? 'open' : '')
        }
      >
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
        >
          Home
        </NavLink>

        <NavLink
          to="/movies"
          onClick={() => setOpen(false)}
        >
          Movies
        </NavLink>

        <NavLink
          to="/theaters"
          onClick={() => setOpen(false)}
        >
          Theaters
        </NavLink>

        <NavLink
          to="/releases"
          onClick={() => setOpen(false)}
        >
          Releases
        </NavLink>

        <NavLink
          to="/my-bookings"
          onClick={() => setOpen(false)}
        >
          My Bookings
        </NavLink>
      </div>

      {/* Right Side */}
      <div className="nav-actions">

        {/* Search */}
        <div
          className={`nav-search ${
            showSearch ? 'expanded' : ''
          }`}
        >
          {showSearch && (
            <input
              type="text"
              placeholder="Search movies..."
              value={searchText}
              autoFocus
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }

                if (e.key === 'Escape') {
                  setShowSearch(false);
                  setSearchText('');
                }
              }}
            />
          )}

          <button
            type="button"
            className="search-icon-btn"
            onClick={() => {
              if (
                showSearch &&
                searchText.trim()
              ) {
                handleSearch();
              } else {
                setShowSearch(true);
              }
            }}
            aria-label="Search movies"
          >
            <Search size={20} />
          </button>

          {showSearch && (
            <button
              type="button"
              className="search-close-btn"
              onClick={() => {
                setShowSearch(false);
                setSearchText('');
              }}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Logged Out */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="login">
              Login
            </button>
          </SignInButton>
        </Show>

        {/* Logged In */}
        <Show when="signed-in">
          <UserButton />
        </Show>

      </div>
    </nav>
  );
}