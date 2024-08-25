import React, { useState, useEffect } from 'react';
import { sellProduct, Product } from '../firebase/products';
import { auth } from '../firebase/setup';
import { onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';

const SellPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>(''); // Change price state to string
  const [rentPrice, setRentPrice] = useState<string>(''); // Change rentPrice state to string
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSell = async () => {
    if (!userId) {
      alert("You must be logged in to sell a product.");
      return;
    }

    if (name && description && price !== '' && parseFloat(price) > 0) {
      setLoading(true);

      const productData: Omit<Product, 'id'> = {
        name,
        description,
        price: parseFloat(price), // Convert price to number
        userId,
        status: 'available',
        createdAt: Timestamp.now(),
      };

      if (rentPrice !== '') {
        productData.rentPrice = parseFloat(rentPrice);
      }

      try {
        let imageUrl = '';

        if (file) {
          const storage = getStorage();
          const storageRef = ref(storage, `products/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            'state_changed',
            () => {}, // Optional: handle progress
            (error) => {
              console.error("Error uploading image:", error);
              alert("Error uploading image. Please try again.");
              setLoading(false);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              productData.imageUrl = imageUrl;

              const productId = await sellProduct(productData);
              if (productId) {
                alert("Product listed successfully!");
                resetForm();
              }
              setLoading(false);
            }
          );
        } else {
          const productId = await sellProduct(productData);
          if (productId) {
            alert("Product listed successfully!");
            resetForm();
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error listing product:", error);
        alert("Failed to list product. Please try again.");
        setLoading(false);
      }
    } else {
      alert("Please fill in all the required fields.");
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setRentPrice('');
    setFile(null);
  };

  return (
    <div className="sell-page max-w-2xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Sell Product</h1>
      <input 
        type="text" 
        placeholder="Product Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <textarea 
        placeholder="Product Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <input 
        type="number" 
        placeholder="Price" 
        value={price} 
        onChange={(e) => setPrice(e.target.value.replace(/^0+/, ''))} // Remove leading zeros
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <input 
        type="number" 
        placeholder="Rent Price (optional)" 
        value={rentPrice} 
        onChange={(e) => setRentPrice(e.target.value.replace(/^0+/, ''))} // Remove leading zeros
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <input 
        type="file" 
        onChange={handleFileChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <button 
        onClick={handleSell} 
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all"
      >
        {loading ? 'Listing Product...' : 'List Product'}
      </button>
    </div>
  );
};

export default SellPage;
