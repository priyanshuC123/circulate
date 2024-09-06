import React, { useState, useEffect } from 'react';
import { getNotifications, updateNotificationApproval, notifyRequesterAfterApproval, addNotification, Notification } from '../firebase/notifications';
import { auth } from '../firebase/setup';
import { onAuthStateChanged } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import LoadingSpinner from './LoadingSpinner';
const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch notifications for the logged-in user and sort by timestamp
        const userNotifications = await getNotifications(user.uid);
        setNotifications(userNotifications.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()));
      } else {
        setNotifications([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApproval = async (notificationId: string, approve: boolean, notification: Notification) => {
    // Update the original notification with "Approved" or "Rejected"
    await updateNotificationApproval(notificationId, approve);

    if (approve) {
      // Notify the requester and update the product status to sold/borrowed
      await notifyRequesterAfterApproval(notification);

      // Notify the owner about the approval
      await addNotification({
        ...notification,
        action: notification.action.includes('buy') ? 'buy-approved' : 'borrow-approved',
        userId: notification.ownerId, // Sending to the owner
        ownerId: notification.userId, // The requester
        timestamp: Timestamp.now(),
      });
    } else {
      // Notify the requester that their request was rejected
      await addNotification({
        ...notification,
        action: notification.action.includes('buy') ? 'buy-rejected' : 'borrow-rejected',
        timestamp: Timestamp.now(),
        userId: notification.userId, // Sending to the requester
        ownerId: notification.ownerId, // The owner
      });

      // Notify the owner about the rejection
      await addNotification({
        ...notification,
        action: notification.action.includes('buy') ? 'buy-rejected' : 'borrow-rejected',
        userId: notification.ownerId, // Sending to the owner
        ownerId: notification.userId, // The requester
        timestamp: Timestamp.now(),
      });
    }

    // Refresh the page after approval or rejection
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  

  return (
    <div className="max-w-full mx-auto mt-8 p-4 pt-20">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="mb-4 p-4 bg-white rounded shadow-md">
              <p><strong>Action:</strong> {notification.action}</p>
              <p><strong>Product:</strong> {notification.productName}</p>
              <p><strong>Timestamp:</strong> {notification.timestamp.toDate().toLocaleString()}</p>
              <p><strong>Phone Number:</strong> {notification.phoneNumber}</p> {/* Display phone number */}
              {notification.daysToBorrow && (
                <p><strong>Days to Borrow:</strong> {notification.daysToBorrow}</p>
              )}
              {/* Conditional Rendering based on Action */}
              {notification.action.includes('rejected') ? (
                <p className="mt-4 text-red-600">This request has been rejected.</p>
              ) : notification.action.includes('approved') ? (
                <p className="mt-4 text-green-600">This request has been approved.</p>
              ) : (
                notification.approved === undefined && (
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleApproval(notification.id!, true, notification)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(notification.id!, false, notification)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
