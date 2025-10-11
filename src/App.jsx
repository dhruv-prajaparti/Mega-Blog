import React from 'react';
import './App.css';
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  // All Redux-related code (imports, useDispatch, useEffect) is now gone.
  // Clerk's <ClerkProvider> in main.jsx handles everything globally.

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;