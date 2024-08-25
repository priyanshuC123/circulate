import { db } from './setup';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc, Timestamp } from 'firebase/firestore';

// Define the collection where products will be stored
const productsCollection = collection(db, 'products');

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  rentPrice?: number | null;
  userId: string;
  createdAt: Timestamp;
  purchasedBy?: string;
  borrowedBy?: string;
  status: 'available' | 'sold' | 'borrowed';
  borrowDuration?: number;
  soldAt?: Timestamp;
  borrowedAt?: Timestamp;
  imageUrl?: string; // Add the imageUrl field here
}

// Function to update product status to sold
export const updateProductStatusToSold = async (productId: string): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    await updateDoc(productDoc, {
      status: 'sold',
      soldAt: Timestamp.now()
    });
  } catch (e) {
    console.error("Error updating product status to sold:", e);
  }
};

// Function to update product status to borrowed
export const updateProductStatusToBorrowed = async (productId: string, daysToBorrow: number): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    await updateDoc(productDoc, {
      status: 'borrowed',
      borrowDuration: daysToBorrow,
      borrowedAt: Timestamp.now(),
      
    });
  } catch (e) {
    console.error("Error updating product status to borrowed:", e);
  }
};

// Function to get a specific product by its ID (for product detail page)
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productDoc = doc(db, 'products', productId);
    const productSnapshot = await getDoc(productDoc);
    if (productSnapshot.exists()) {
      return { id: productSnapshot.id, ...productSnapshot.data() } as Product;
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
};

// Remaining functions unchanged...


// Search function to find products by name or description
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const products: Product[] = [];
    const q = query(productsCollection, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
    const q2 = query(productsCollection, where('description', '>=', searchTerm), where('description', '<=', searchTerm + '\uf8ff'));

    const nameQuerySnapshot = await getDocs(q);
    const descriptionQuerySnapshot = await getDocs(q2);

    nameQuerySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    descriptionQuerySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products;
  } catch (e) {
    console.error("Error searching products: ", e);
    return [];
  }
};


// Function to add a new product to the Firestore (for selling or listing)
export const sellProduct = async (productData: Product): Promise<string | null> => {
  try {
    productData.createdAt = Timestamp.now();
    productData.status = 'available';  // Set the initial status of the product
    const docRef = await addDoc(productsCollection, productData);
    return docRef.id; // Return the ID of the newly created product
  } catch (e) {
    console.error("Error adding product:", e);
    return null;
  }
};

// Function to get all products for display on the home page
export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

// // Function to get a specific product by its ID (for product detail page)
// export const getProductById = async (productId: string): Promise<Product | null> => {
//   try {
//     const productDoc = doc(db, 'products', productId);
//     const productSnapshot = await getDoc(productDoc);
//     if (productSnapshot.exists()) {
//       return { id: productSnapshot.id, ...productSnapshot.data() } as Product;
//     } else {
//       console.error("No such document!");
//       return null;
//     }
//   } catch (e) {
//     console.error("Error getting document: ", e);
//     return null;
//   }
// };

// Function to update product data (e.g., if a user edits their listing)
export const updateProduct = async (productId: string, updatedData: Partial<Product>): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    await updateDoc(productDoc, updatedData);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

// Function to delete a product (e.g., if a user wants to remove their listing)
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    await deleteDoc(productDoc);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

// Function to get all products listed by a specific user (for user dashboard)
export const getUserProducts = async (userId: string): Promise<Product[]> => {
  try {
    const q = query(productsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const userProducts: Product[] = [];
    querySnapshot.forEach((doc) => {
      userProducts.push({ id: doc.id, ...doc.data() } as Product);
    });
    return userProducts;
  } catch (e) {
    console.error("Error getting user products: ", e);
    return [];
  }
};

// Function to get all borrowed or bought products by a specific user (for user dashboard history)
export const getUserHistory = async (userId: string): Promise<Product[]> => {
  try {
    const q = query(productsCollection, where("borrowedBy", "==", userId));
    const querySnapshot = await getDocs(q);
    const transactions: Product[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as Product);
    });
    return transactions;
  } catch (e) {
    console.error("Error getting user history: ", e);
    return [];
  }
};

// Function to buy a product
export const buyProduct = async (productId: string, userId: string): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
      console.error("No such document to buy!");
      return;
    }

    await updateDoc(productDoc, {
      purchasedBy: userId,
      status: 'sold',
      soldAt: Timestamp.now()
    });
  } catch (e) {
    console.error("Error buying product: ", e);
  }
};

// Function to borrow a product
export const borrowProduct = async (productId: string, userId: string, daysToBorrow: number): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
      console.error("No such document to borrow!");
      return;
    }

    await updateDoc(productDoc, {
      borrowedBy: userId,
      borrowDuration: daysToBorrow,
      status: 'borrowed',
      borrowedAt: Timestamp.now()
    });
  } catch (e) {
    console.error("Error borrowing product: ", e);
  }
};
