import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const usersCollection = collection(db, "users");

/**
 * @throws {Error} If Firestore query fails
 */
export const getUsersRanking = async () => {
  const result = await getDocs(
    query(
      usersCollection,
      orderBy("streakRecord", "desc"),
      orderBy("curStreak", "desc"),
    ),
  );

  return result.docs.map((doc) => {
    const user = doc.data();
    return {
      id: doc.id,
      ...user,
    };
  });
};

/**
 * @param {string} secondaryId The auth database ID ('sub' from Auth0)
 * @throws {Error} If Firestore query fails
 */
export const getUserBySecondaryId = async (secondaryId) => {
  const result = await getDocs(
    query(usersCollection, where("secondaryId", "==", secondaryId)),
  );

  const docData = result?.docs?.[0];
  const data = docData?.data();
  return data
    ? {
        id: docData.id,
        secondaryId: data.secondaryId,
        name: data.name,
        email: data.email,
        streakRecord: data.streakRecord || 0,
        curStreak: data.curStreak || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    : null;
};

/**
 * @throws {Error} If Firestore operation fails
 */
export const createUser = async (userData) => {
  const docRef = await addDoc(usersCollection, {
    ...userData,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
};

/**
 * @throws {Error} If Firestore operation fails
 */
export const updateUser = async (userId, userData) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: Date.now(),
  });
};

/**
 * @param {string} userId The Firestore user document ID for the User
 * @throws {Error} If Firestore query fails
 */
export const getUserWishlist = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  let wishlist = { items: [], updatedAt: Date.now() };
  if (userDoc.exists()) {
    const userData = userDoc.data();
    wishlist = userData.wishlist || wishlist;
  }

  return wishlist;
};

/**
 * @param {string} userId  The Firestore user document ID for the User
 * @param {object} wishlist
 * @throws {Error} If Firestore operation fails
 */
export const updateUserWishlist = async (userId, wishlist) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    wishlist: {
      items: wishlist.items,
      updatedAt: wishlist.updatedAt ?? Date.now(),
    },
  });
};
