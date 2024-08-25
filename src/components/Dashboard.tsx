import React, { useState, useEffect } from 'react';
import { getUserProducts, getUserHistory } from '../firebase/products';
import { Timestamp } from 'firebase/firestore';

interface Product {
  id: string;  
  name: string;
  description: string;
  price: number;
  rentPrice?: number;
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
    <div className="dashboard max-w-4xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Listed Products</h2>
      <ul className="mb-8">
        {listedProducts.map((product) => (
          <li key={product.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <strong>{product.name}</strong> - {product.description} - ${product.price}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mb-4">History</h2>
      <ul>
        {history.map((entry) => (
          <li key={entry.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
            {entry.action} - {entry.productName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
