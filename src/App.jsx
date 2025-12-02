import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Rentals from './pages/Rentals.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Users from './pages/Users.jsx';
import Admin from './pages/Admin.jsx';
import Legal from './pages/Legal.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/users" element={<Users />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;