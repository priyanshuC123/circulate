import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProducts, Product } from '../firebase/products';

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

  const shortenName = (name: string, maxLength: number) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  return (
    <div className="home-page max-w-full mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Live Products For Sell / Borrow</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <li key={product.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <Link to={`/product/${product.id}`}>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-40 object-contain mb-4 rounded-lg"
                />
              )}
              <p className="text-md font-semibold mb-2">{shortenName(product.name, 50)}</p>
              <p className="text-lg text-gray-800 font-bold">₹{product.price}</p>
              {product.status === 'borrowed' ? (
                <p className="text-sm text-red-500">Rent: Not Available (Borrowed)</p>
              ) : product.rentPrice && product.rentPrice > 0 ? (
                <p className="text-sm text-gray-500">Rent: ₹{product.rentPrice}</p>
              ) : (
                <p className="text-sm text-red-500">Rent: Not Available</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
