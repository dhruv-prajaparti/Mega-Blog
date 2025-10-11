import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// --- Clerk and React Router Imports ---
import { ClerkProvider, SignIn, SignUp, SignedIn } from '@clerk/clerk-react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// --- Your Page Imports ---
import Home from './pages/Home.jsx';
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import AllPosts from "./pages/AllPosts";
import Login from './pages/Login.jsx';

// --- Load Clerk Publishable Key ---
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key from .env.local");
}

// --- Define Your Routes with Clerk Protection ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
      // Clerk's sign-in and sign-up routes
      {
        path: "/sign-in/*",
        element:( 
        <div className='flex justify-center '>
        <Login />
        </div>
        ),
      },
      {
        path: "/sign-up/*",
        element: (
            <div className='flex justify-center '>
            <SignUp routing="path" path="/sign-up" />
            </div>),
      },
      // Protected routes wrapped with <SignedIn>
      {
        path: "/all-posts",
        element: (
          <SignedIn>
            <AllPosts />
          </SignedIn>
        ),
      },
      {
        path: "/add-post",
        element: (
          <SignedIn>
            <AddPost />
          </SignedIn>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <SignedIn>
            <EditPost />
          </SignedIn>
        ),
      },
    ],
  },
]);

// --- Render the Application ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);