// notifications.tsx

import { db } from './setup';
import { collection, addDoc, getDocs, query, where, orderBy,getDoc, Timestamp, updateDoc, doc } from 'firebase/firestore';
// Assuming you have the Product interface imported from the products file

// Notification interface for type safety
export interface Notification {
    id?: string;
    productId: string;
    productName: string;
    userId: string;  // ID of the user who triggered the notification
    ownerId: string; // ID of the product owner
    action: 'buy' | 'borrow' | 'buy-approved' | 'borrow-approved' | 'buy-rejected' | 'borrow-rejected';
    daysToBorrow?: number; // Only for borrow actions
    timestamp: Timestamp;
    approved?: boolean;  // Indicates if the owner has approved the request
    approvedAt?: Timestamp;
    phoneNumber?: string;  
  }
  

// Collection reference for notifications
const notificationsCollection = collection(db, 'notifications');

// Function to add a notification to Firestore
export const addNotification = async (notificationData: Notification): Promise<void> => {
  try {
    await addDoc(notificationsCollection, {
      ...notificationData,
      timestamp: Timestamp.now() // Set the timestamp here directly
    });
    console.log("Notification added successfully.");
  } catch (e) {
    console.error("Error adding notification:", e);
  }
};

// Function to update the notification approval status
export const updateNotificationApproval = async (notificationId: string, approve: boolean): Promise<void> => {
    try {
      const notificationDoc = doc(db, 'notifications', notificationId);
      await updateDoc(notificationDoc, {
        approved: approve, // Update the document with approval status
        action: approve ? (await getDoc(notificationDoc)).data()?.action + '-approved' : (await getDoc(notificationDoc)).data()?.action + '-rejected', // Update the action based on approval
        approvedAt: Timestamp.now(), // Store the approval timestamp
      });
      console.log(`Notification ${approve ? 'approved' : 'rejected'} successfully.`);
    } catch (e) {
      console.error("Error updating notification approval:", e);
    }
  };
  
  

  export const notifyRequesterAfterApproval = async (notificationData: Notification): Promise<void> => {
    try {
      // Notify the user that their request was approved
      await addNotification({
        ...notificationData,
        action: notificationData.action === 'buy' ? 'buy-approved' : 'borrow-approved',
        timestamp: Timestamp.now(),
      });
  
      // Update the product status here based on the approved action
      if (notificationData.action === 'buy') {
        await updateProductStatusToSold(notificationData.productId); // Function to mark the product as sold
      } else if (notificationData.action === 'borrow') {
        await updateProductStatusToBorrowed(notificationData.productId, notificationData.daysToBorrow!); // Function to mark the product as borrowed
      }
  
      console.log("Requester notified successfully after approval.");
    } catch (e) {
      console.error("Error notifying requester after approval:", e);
    }
  };
  

// Function to get notifications for a specific user
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(notificationsCollection, where("ownerId", "==", userId), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() } as Notification);
    });
    return notifications;
  } catch (e) {
    console.error("Error getting notifications:", e);
    return [];
  }
};

// Function to get pending approval notifications for a specific user (owner)
export const getPendingApprovals = async (ownerId: string): Promise<Notification[]> => {
  try {
    const q = query(notificationsCollection, where("ownerId", "==", ownerId), where("approved", "==", false));
    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() } as Notification);
    });
    return notifications;
  } catch (e) {
    console.error("Error getting pending approvals:", e);
    return [];
  }
};

// Assuming you have functions to update product status
const updateProductStatusToSold = async (productId: string): Promise<void> => {
  const productDoc = doc(db, 'products', productId);
  await updateDoc(productDoc, { status: 'sold' });
};

const updateProductStatusToBorrowed = async (productId: string, daysToBorrow: number): Promise<void> => {
  const productDoc = doc(db, 'products', productId);
  await updateDoc(productDoc, { status: 'borrowed', borrowDuration: daysToBorrow });
};
