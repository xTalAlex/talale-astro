import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  runTransaction,
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
 * @throws {Error} If Firestore operation fails
 */
export const createUser = async (userData) => {
  const now = Date.now();
  const docRef = await addDoc(usersCollection, {
    ...userData,
    streakRecord: userData.streakRecord ?? 0,
    curStreak: userData.curStreak ?? 0,
    createdAt: now,
    updatedAt: now,
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
 * @param {string} secondaryId The auth database ID ('sub' from Auth0)
 * @throws {Error} If Firestore query fails
 */
export const getUserBySecondaryId = async (secondaryId) => {
  const querySnapshot = await getDocs(
    query(usersCollection, where("secondaryId", "==", secondaryId)),
  );

  const docData = querySnapshot?.docs?.[0];
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

/**
 * @throws {Error} If Firestore query fails
 */
export const getRankings = async () => {
  const querySnapshot = await getDocs(
    query(
      usersCollection,
      orderBy("streakRecord", "desc"),
      orderBy("curStreak", "desc"),
    ),
  );

  return querySnapshot.docs.map((doc) => {
    const user = doc.data();
    return {
      id: doc.id,
      ...user,
    };
  });
};

/**
 * @param {string} secondaryId The auth database ID ('sub' from Auth0)
 * @param {Object<{name: string, email:string, victory: boolean}>} rankingData User data to create/update
 * @returns {Promise<{created: boolean, userId: string, curStreak: number, streakRecord: number}>}
 * @throws {Error} If Firestore transaction fails
 */
export const upsertRanking = async (secondaryId, rankingData) => {
  return await runTransaction(db, async (transaction) => {
    let created = false;
    let userId = "";
    let curStreak = 0;
    let streakRecord = 0;

    const querySnapshot = await getDocs(
      query(usersCollection, where("secondaryId", "==", secondaryId)),
    );

    const now = Date.now();

    if (querySnapshot.empty) {
      const newUserRef = doc(usersCollection);

      created = true;
      userId = newUserRef.id;
      curStreak = rankingData.victory ? 1 : 0;
      streakRecord = rankingData.victory ? 1 : 0;

      transaction.set(newUserRef, {
        secondaryId,
        name: rankingData.name,
        email: rankingData.email,
        streakRecord: rankingData.victory ? 1 : 0,
        curStreak: rankingData.victory ? 1 : 0,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data();
      const userRef = doc(db, "users", existingDoc.id);

      created = false;
      userId = existingDoc.id;
      curStreak = rankingData.victory ? Number(existingData.curStreak) + 1 : 0;
      streakRecord =
        Number(existingData.streakRecord) > curStreak
          ? existingData.streakRecord
          : curStreak;

      transaction.update(userRef, {
        name: rankingData.name,
        email: rankingData.email,
        streakRecord: streakRecord,
        curStreak: curStreak,
        updatedAt: now,
      });
    }

    return { created, userId, curStreak, streakRecord };
  });
};
