import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/setup";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Modal from "./loginSingUpModal";
import logo from "../assets/logo_icon (2).png";
import bell from "../assets/bell.png";
import Search from "../assets/search.png";
import menuIcon from "../assets/menu.png";
import { getNotifications, Notification } from "../firebase/notifications";
import LoadingSpinner from "./LoadingSpinner";
const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(false);
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSellClick = () => {
    if (loggedIn) {
      navigate("/sell");
    } else {
      setIsLogin(true);
      setShowModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/?search=${searchQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white">
        {/* Main navbar content */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="block lg:hidden focus:outline-none"
            >
              <img src={menuIcon} alt="Menu" className="h-8 w-8" />
            </button>
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-8 pl-3 mr-2 rounded-full shadow-md"
              />
              {/* Make the text size responsive */}
              <span className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
                Circulate
              </span>
            </Link>
          </div>

          {/* Large screens: Full navbar content */}
          <div className="hidden lg:flex items-center flex-grow">
            {/* Center search bar */}
            <div className="flex justify-center flex-grow">
              <div className="flex items-center bg-white border border-gray-300 text-gray-900 rounded-md shadow-lg w-full max-w-lg">
                {/* Search Icon */}
                <img
                  src={Search}
                  alt="Search Icon"
                  className="h-6 w-6 ml-3 mr-2"
                />
                <input
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  className="p-3 pl-2 w-full rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {/* Right-aligned content */}
            <div className="flex items-center space-x-6 ml-auto">
              {loggedIn && (
                <div className="relative">
                  <Link to="/notifications">
                    <img src={bell} alt="Notifications" className="h-8 w-8" />
                  </Link>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-block w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full text-center shadow-lg">
                      {notifications.length}
                    </span>
                  )}
                </div>
              )}

              {loggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="font-bold text-white hover:underline"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-bold text-white hover:underline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleModal}
                  className="font-bold text-white hover:underline"
                >
                  Login
                </button>
              )}

              <button
                onClick={handleSellClick}
                className="bg-blue-500 text-white font-bold py-2 px-3 rounded-full shadow-lg transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-white"
              >
                + SELL
              </button>
            </div>
          </div>

          {/* Small screens: Login/Logout should be shown */}
          <div className="lg:hidden flex items-center space-x-6">
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="font-bold text-white hover:underline"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={toggleModal}
                className="font-bold text-white hover:underline"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Search bar - visible below navbar for small screens */}
        <div className="lg:hidden absolute top-full left-0 w-full bg-gray-100">
          <div className="flex justify-center py-4 px-3">
            <div className="flex items-center bg-white border border-gray-300 text-gray-900 rounded-md shadow-lg w-full max-w-lg">
            <img
                  src={Search}
                  alt="Search Icon"
                  className="h-6 w-6 ml-3 mr-2"
                />
              <input
                type="text"
                placeholder="Search for Products, Brands and More"
                className="p-3 pl-5 w-full rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar for mobile view */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        >
          <div className="absolute top-0 left-0 h-full w-64 bg-gray-800 p-6 shadow-2xl z-50">
            <button
              onClick={toggleSidebar}
              className="block lg:hidden mb-4 focus:outline-none"
            >
              <img src={menuIcon} alt="Close" className="h-8 w-8" />
            </button>
            <ul className="space-y-4 text-white">
              {loggedIn && (
                <>
                  <li>
                    <Link to="/dashboard" className="block">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/notifications" className="block">
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="block">
                      Logout
                    </button>
                  </li>
                </>
              )}

              {!loggedIn && (
                <li>
                  <button onClick={toggleModal} className="block">
                    Login
                  </button>
                </li>
              )}

              <li>
                <button
                  onClick={handleSellClick}
                  className="block bg-blue-500 text-white font-bold py-2 px-3 rounded-full"
                >
                  + SELL
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setLoggedIn={setLoggedIn}
      />
    </>
  );
};

export default Navbar;
