import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProducts, getUserHistory } from '../firebase/products';
import { Timestamp } from 'firebase/firestore';

interface Product {
  id: string;  
  name: string;
  price: number;
  rentPrice?: number;
  imageUrl?: string; // Added imageUrl property
  userId?: string;
  createdAt?: Timestamp;
  purchasedBy?: string;
  borrowedBy?: string;
  status?: 'available' | 'sold' | 'borrowed';
  borrowDuration?: number;
  soldAt?: Timestamp;
  borrowedAt?: Timestamp;
}

interface HistoryEntry {
  id: string;
  productName: string;
  action: 'Bought' | 'Borrowed';
}

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [listedProducts, setListedProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      const products = await getUserProducts(userId);
      setListedProducts(products as Product[]);
    };

    const fetchUserHistory = async () => {
      const products = await getUserHistory(userId);
      
      const historyEntries: HistoryEntry[] = products.map(product => ({
        id: product.id as string,  
        productName: product.name,
        action: product.status === 'sold' ? 'Bought' : 'Borrowed',
      }));

      setHistory(historyEntries);
    };

    if (userId) {
      fetchUserProducts();
      fetchUserHistory();
    }
  }, [userId]);

  return (
    <div className="bg-gray-100 min-h-screen lg:pt-20 pt-40">
    <div className=" bg-gray-100 dashboardw-full max-w-7xl mx-auto p-8 pt-40rounded-lg " >
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      {/* Listed Products Section */}
      <h2 className="text-2xl font-semibold mb-4">Listed Products</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {listedProducts.map((product) => (
          <li key={product.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow" style={{ backgroundColor: 'white' }}>
            <Link to={`/product/${product.id}`} className="flex items-center space-x-4" >
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-24 h-24 object-contain rounded-md"
                />
              )}
              <div className="flex flex-col">
                <strong className="text-lg font-semibold">{product.name}</strong>
                <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* History Section */}
      <h2 className="text-2xl font-semibold mb-4">History</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {history.map((entry) => (
          <li key={entry.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <span className="text-lg">{entry.action}</span>
              <strong className="text-lg font-semibold">{entry.productName}</strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Dashboard;
