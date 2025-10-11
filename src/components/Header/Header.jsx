// src/components/Header/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Container, Logo } from '../'; // Assuming this path is correct

function Header() {
  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex items-center'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          <ul className='flex ml-auto items-center space-x-2'>
            {/* These links show for EVERYONE */}
            <li>
              <Link to="/" className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                Home
              </Link>
            </li>

            {/* These links only show for LOGGED-IN users */}
            <SignedIn>
              <li>
                <Link to="/all-posts" className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                  All Posts
                </Link>
              </li>
              <li>
                <Link to="/add-post" className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                  Add Post
                </Link>
              </li>
              <li className="ml-2">
                <UserButton afterSignOutUrl='/' />
              </li>
            </SignedIn>

            {/* These links only show for LOGGED-OUT users */}
            <SignedOut>
              <li>
                <Link to="/sign-in" className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                  Login
                </Link>
              </li>
            </SignedOut>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;