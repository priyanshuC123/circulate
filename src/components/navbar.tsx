import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/setup';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Modal from "./loginSingUpModal";
import logo from "../assets/logo (2).png";
import search from "../assets/search.png";
import bell from "../assets/bell.png";
import { getNotifications, Notification } from '../firebase/notifications';

const Navbar: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State to capture the search query
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(`User is logged in with ID: ${user.uid}`); // Debug log for userId
                setLoggedIn(true);
                // Fetch notifications for the logged-in user
                const userNotifications = await getNotifications(user.uid);
                setNotifications(userNotifications);
            } else {
                console.log("User is not logged in"); // Debug log for no user
                setLoggedIn(false);
                setNotifications([]); // Clear notifications if not logged in
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
        // Trigger the search using the current query
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
            <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
                <div className="flex items-center">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-10 mr-2" />
                    </Link>
                    <Link to="/" className="text-xl font-bold text-white">
                        Circulate
                    </Link>
                </div>
                <div className="flex items-center ml-auto">
                    <div className="flex items-center bg-white text-gray-900 rounded-md shadow-sm mr-4">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="p-2 w-96 rounded-l-md border border-gray-300 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress} // Trigger search on Enter key press
                        />
                        <button 
                            className="bg-blue-500 text-white p-2 rounded-r-md h-10"
                            onClick={handleSearch}
                        >
                            <img src={search} alt="Search" className="h-5 w-5" />
                        </button>
                    </div>
                    {loggedIn ? (
                        <>
                            <Link to="/dashboard" className="mr-4 font-bold text-white">Dashboard</Link>
                            <button onClick={handleLogout} className="mr-4 font-bold text-white">Logout</button>

                            {/* Bell Icon with notification count */}
                            <div className="relative">
                                <Link to="/notifications">
                                    <img src={bell} alt="Notifications" className="h-8 w-8" />
                                </Link>
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-600 text-white text-xs font-bold rounded-full text-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>

                        </>
                    ) : (
                        <button onClick={toggleModal} className="mr-4 font-bold text-white">Login</button>
                    )}
                    <button 
                        onClick={handleSellClick} 
                        className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-all"
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
