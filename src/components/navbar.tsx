import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/setup';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Modal from "./loginSingUpModal";
import logo from "../assets/logo_icon (2).png";
import search from "../assets/searchicon.png";
import bell from "../assets/bell.png";
import { getNotifications, Notification } from '../firebase/notifications';

const Navbar: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(`User is logged in with ID: ${user.uid}`);
                setLoggedIn(true);
                const userNotifications = await getNotifications(user.uid);
                setNotifications(userNotifications);
            } else {
                console.log("User is not logged in");
                setLoggedIn(false);
                setNotifications([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleSellClick = () => {
        if (loggedIn) {
            navigate('/sell');
        } else {
            setIsLogin(true);
            setShowModal(true);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setLoggedIn(false);
            navigate('/'); 
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== '') {
            navigate(`/?search=${searchQuery}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <nav className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white ">
                <div className="flex items-center">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-12 mr-2 rounded-full shadow-md" />
                    </Link>
                    <Link to="/" className="text-2xl font-extrabold text-white tracking-wide">
                        Circulate
                    </Link>
                </div>
                
                <div className="flex justify-center flex-1">
                    <div className="flex items-center bg-white text-gray-900 rounded-full shadow-lg">
                        <input 
                            type="text" 
                            placeholder="Search for products..." 
                            className="p-2 pl-5 w-96 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress} 
                        />
                        <button 
                            className="bg-blue-500 text-white p-2 rounded-r-full hover:bg-blue-600 transition-colors"
                            onClick={handleSearch}
                            style={{ height: '42px' }}
                        >
                            <img src={search} alt="Search" className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center">
                    {loggedIn ? (
                        <>
                            <div className="relative mr-4">
                                <Link to="/notifications">
                                    <img src={bell} alt="Notifications" className="h-8 w-8" />
                                </Link>
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-block w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full text-center shadow-lg">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            <Link to="/dashboard" className="mr-4 font-bold text-white hover:underline">Dashboard</Link>
                            <button onClick={handleLogout} className="mr-4 font-bold text-white hover:underline">Logout</button>
                        </>
                    ) : (
                        <button onClick={toggleModal} className="mr-4 font-bold text-white hover:underline">Login</button>
                    )}
                    <button 
                        onClick={handleSellClick} 
                        className="relative bg-blue-500 text-white font-bold py-2 px-3 rounded-full shadow-lg transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300
                        before:absolute before:inset-0 before:rounded-full before:border-2 before:border-white before:transform-gpu before:scale-105 before:opacity-100"
                    >
                        + SELL
                    </button>
                </div>
            </nav>
            <Modal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                isLogin={isLogin} 
                setIsLogin={setIsLogin} 
                setLoggedIn={setLoggedIn}
            />
        </>
    );
}

export default Navbar;
