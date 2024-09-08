# Circulate | Trade & Borrow Web Application

**Deployed Lin:** https://circulate-2v4d.onrender.com/

## Features
- **Buy, Sell, and Borrow Products:**  
  Users can list products for sale or borrowing and easily browse available items.
  
- **Real-Time Notifications:**  
  Users receive instant notifications for transaction approvals, confirmation of purchases, and borrowing requests.
  
- **Secure Authentication:**  
  Firebase authentication ensures that users can sign up, log in, and manage their profiles with security and ease.

- **Responsive UI:**  
  The platform is designed with Tailwind CSS, making it mobile-friendly and intuitive to use.

## Demo

https://github.com/user-attachments/assets/439a62c6-0de2-43ec-8b21-5502256a9b50

## Tech Stack

- **Frontend:**  
  [React.js](https://reactjs.org/) - A JavaScript library for building dynamic and interactive user interfaces.
  
- **Backend:**  
  [Firebase](https://firebase.google.com/) - Used for real-time database management, notifications, and authentication services.
  
- **Programming Language:**  
  [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that enables type safety to reduce runtime errors and enhance code maintainability.
  
- **UI Framework:**  
  [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating modern, responsive layouts quickly.



## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/circulate-trade-borrow.git
   cd circulate-trade-borrow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication in your Firebase project.
   - Copy your Firebase configuration and add it to a `.env` file in the project root:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the application:**
   ```bash
   npm start
   ```
   The app will be accessible at `http://localhost:3000`.

## Key Components

### 1. **Frontend (React)**
- **Dynamic User Interface:**  
  The UI is built with React components, allowing features such as product listings, transaction modals, and approval workflows to function smoothly in a real-time environment.
  
- **State Management:**  
  React’s state management ensures that data from Firebase is handled efficiently, providing a seamless experience.

### 2. **Backend (Firebase)**
- **Real-Time Database:**  
  Firebase Firestore manages product listings, user profiles, and transaction histories, allowing for real-time updates and interaction.
  
- **Authentication:**  
  Firebase Authentication provides a secure login and registration system, ensuring that only authorized users can perform actions like buying or borrowing products.


### 3. **TypeScript for Type Safety**
- **Type-Checking:**  
  TypeScript provides compile-time checks, reducing bugs and ensuring the stability of the platform by catching errors early in the development process.

### 4. **Tailwind CSS for UI Design**
- **Responsive Layouts:**  
  Tailwind CSS ensures that the platform is fully responsive, offering a consistent experience across different device types, including mobile and desktop.

## Future Improvements
- **Advanced Search Functionality:**  
  Implementing a more robust search feature to allow users to filter products by categories, price, and availability.
  
- **Enhanced Notifications:**  
  Push notifications for mobile users to stay updated on their transactions even when not actively using the platform.
  
- **User Reviews and Ratings:**  
  Allow users to review and rate sellers and products to improve the credibility and trust within the platform.

