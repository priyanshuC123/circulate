import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/setup"; // Adjust this path to your project structure
import googleimg from '../assets/google.webp';

interface ModalProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; // New prop to update loggedIn state
}

const Modal: React.FC<ModalProps> = ({ showModal, setShowModal, isLogin, setIsLogin, setLoggedIn }) => {
    if (!showModal) return null;

    const toggleModal = () => {
        setShowModal(false);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const googleSignin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setLoggedIn(true); // Update the loggedIn state in the Navbar
            setShowModal(false); // Close the modal after successful sign-in
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    <button onClick={toggleModal} className="text-gray-400 hover:text-gray-600">
                        ×
                    </button>
                </div>
                <div className="p-4">
                    <button 
                        onClick={googleSignin} 
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 flex justify-center items-center"
                    >
                        <img 
                            src={googleimg}
                            alt="Google" 
                            className="h-5 w-5 mr-2" 
                        />
                        {isLogin ? 'Login with Google' : 'Sign Up with Google'}
                    </button>
                    <div className="text-center text-gray-500 my-2">or</div>
                    {isLogin ? <LoginForm /> : <SignupForm />}
                </div>
                <div className="p-4 border-t text-center">
                    {isLogin ? (
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <button onClick={toggleForm} className="text-blue-500">
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm">
                            Already have an account?{' '}
                            <button onClick={toggleForm} className="text-blue-500">
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const LoginForm: React.FC = () => (
    <form>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
                type="email" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Enter your email" 
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
                type="password" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Enter your password" 
            />
        </div>
        <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Login
        </button>
    </form>
);

const SignupForm: React.FC = () => (
    <form>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input 
                type="text" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Enter your name" 
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
                type="email" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Enter your email" 
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
                type="password" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Enter your password" 
            />
        </div>
        <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Sign Up
        </button>
    </form>
);

export default Modal;
