import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomePage from './components/HomePage';
import ProductDetail from './components/ProductDetail';
import SellPage from './components/SellPage';
import Dashboard from './components/Dashboard';
import { auth } from './firebase/setup';  
import { onAuthStateChanged } from 'firebase/auth'; 
import Notifications from './components/Notifications';
import LoadingSpinner from './components/LoadingSpinner';
const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);  // Set the userId when the user is authenticated
      } else {
        setUserId(null);  // Reset userId if the user is not authenticated
      }
      setLoading(false); // Set loading to false once the auth state is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/sell" element={userId ? <SellPage /> : <div>Please log in to access this page.</div>} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/dashboard" element={userId ? <Dashboard userId={userId} /> : <div>Please log in to access this page.</div>} />
      </Routes>
    </Router>
  );
};

export default App;
