import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProducts, Product } from '../firebase/products';
import { Timestamp } from 'firebase/firestore';
import AdSection from './AdSection'; // Import the AdSection component

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery) || 
    product.description.toLowerCase().includes(searchQuery)
  );

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const shortenName = (name: string, maxLength: number) => {
    const capitalized = capitalizeWords(name.toLowerCase());
    return capitalized.length > maxLength ? capitalized.substring(0, maxLength) + '...' : capitalized;
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen lg:pt-20 pt-40"> {/* Added padding to the top */}
      {!searchQuery && <AdSection />} {/* Conditionally render AdSection */}
      <div className="home-page max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-20"> {/* Centered content and added responsive padding */}
        
        {!searchQuery && (
          <div className="pt-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-800" id="explore-section">
              Explore Products to Buy or Borrow
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Find great deals or borrow items you need, easily!
            </p>
          </div>
        )}

        {searchQuery && (
          <div className="pt-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-800" id="explore-section">
              Search Results:
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Find great deals or borrow items you need, easily!
            </p>
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
          {filteredProducts.map((product) => (
            <li 
              key={product.id} 
              className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm transition-transform transform hover:scale-105 mx-auto" // Center cards
              style={{ height: '280px', width: '280px' }} // Adjusted card size
            >
              <Link to={`/product/${product.id}`} className="h-full flex flex-col justify-between">
                <div className="flex justify-center items-center border-b pb-2 border-gray-300 mb-4" style={{ height: '160px', width: '100%' }}>
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="h-full object-contain"
                    />
                  )}
                </div>
                
                <div>
                  <p className="text-md font-semibold mb-2 text-gray-800">{shortenName(product.name, 32)}</p> {/* Reduced name length and text size */}
                  
                  <p className="text-xl text-gray-700 font-bold">₹{product.price}</p>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    {product.status === 'borrowed' ? (
                      <p className="text-sm text-red-500">Rent: N/A (Borrowed)</p>
                    ) : product.rentPrice && product.rentPrice > 0 ? (
                      <p>Rent: ₹{product.rentPrice}</p>
                    ) : (
                      <p className="text-red-500">Rent: N/A</p>
                    )}
                    <p className="text-right">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
