import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../firebase/products'; // Firebase functions
import { auth } from '../firebase/setup'; // Firebase auth setup
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase authentication listener
import { addNotification, Notification } from '../firebase/notifications'; // Importing notification functions
import { Timestamp } from 'firebase/firestore';
import RequestModal from './RequestModal'; // Import the modal component
import Modal from './loginSingUpModal'; // Import the login/signup modal
import LoadingSpinner from './LoadingSpinner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rentPrice?: number;
  imageUrl?: string;
  status?: 'available' | 'sold' | 'borrowed';
  userId: string; // Owner of the product
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [modalAction, setModalAction] = useState<'buy' | 'borrow' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getProductById(id);
        setProduct(data as Product);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    fetchProduct();

    return () => unsubscribe();
  }, [id]);

  const handleRequest = async (phoneNumber: string, daysToBorrow?: number) => {
    if (userId && product && modalAction) {
      if (userId === product.userId) {
        alert("You cannot buy or borrow your own product.");
        setModalAction(null);
        return;
      }

      const notification: Notification = {
        productId: product.id,
        productName: product.name,
        userId: userId,
        ownerId: product.userId,
        action: modalAction,
        daysToBorrow: modalAction === 'borrow' ? daysToBorrow : undefined,
        timestamp: Timestamp.now(),
        phoneNumber: phoneNumber,
      };

      await addNotification(notification);
      alert(`Your ${modalAction} request has been sent to the owner for approval.`);
      setModalAction(null); // Close the modal
    }
  };

  const handleBuyClick = () => {
    if (userId) {
      setModalAction('buy');
    } else {
      setIsLogin(true);
      setShowModal(true);
    }
  };

  const handleBorrowClick = () => {
    if (userId) {
      setModalAction('borrow');
    } else {
      setIsLogin(true);
      setShowModal(true);
    }
  };

  if (!product) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" bg-gray-100 max-w-7xl mx-auto mt-8 p-4 pr-8 pl-8 lg:pt-20  pt-40 md:pr-40 md:pl-40">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 w-full flex justify-center items-center">
          <div
            className="w-full h-80 p-4 box-border cursor-pointer bg-white rounded-md shadow-md md:w-80"
            onClick={() => setIsImageModalOpen(true)}
          >
            <img 
              src={product.imageUrl || "https://via.placeholder.com/300"} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="md:w-2/3 md:ml-8 mt-4 md:mt-0">
          <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
          <p className="text-xl text-gray-700 mb-2">Price: ₹{product.price}</p>
          {product.rentPrice && product.rentPrice > 0 && (
            <p className="text-xl text-gray-500 mb-4">Rent Price: ₹{product.rentPrice}</p>
          )}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBuyClick} 
              disabled={product.status === 'sold'}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-all"
            >
              {product.status === 'sold' ? 'Sold' : 'Buy'}
            </button>
            {product.rentPrice && product.rentPrice > 0 && (
              <button 
                onClick={handleBorrowClick} 
                disabled={product.status === 'borrowed' || product.status === 'sold'}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
              >
                {product.status === 'borrowed' ? 'Borrowed' : 'Borrow'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Product Description</h3>
        <p>{product.description}</p>
      </div>

      {/* Modal for entering phone number and confirming action */}
      <RequestModal
        isOpen={modalAction !== null}
        onClose={() => setModalAction(null)}
        onConfirm={handleRequest}
        action={modalAction!}
      />

      {/* Full-Screen Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <button 
              className="absolute top-0 right-0 m-4 text-white text-2xl" 
              onClick={() => setIsImageModalOpen(false)}
            >
              &times;
            </button>
            <img 
              src={product.imageUrl || "https://via.placeholder.com/300"} 
              alt={product.name} 
              className="w-screen h-screen object-contain"
            />
          </div>
        </div>
      )}

      {/* Login/Signup Modal */}
      <Modal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        isLogin={isLogin} 
        setIsLogin={setIsLogin} 
        setLoggedIn={(isLoggedIn) => setUserId(isLoggedIn ? userId : null)} 
      />
    </div>
  );
};

export default ProductDetail;
