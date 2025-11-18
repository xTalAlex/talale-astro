import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const usersCollection = collection(db, "users");

export const getUsersRanking = async () => {
  try {
    const q = query(usersCollection, orderBy("streak_record", "desc"));
    const snapshot = await getDocs(q);

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate?.() || data.created_at,
        updated_at: data.updated_at?.toDate?.() || data.updated_at,
      };
    });

    return users.sort((a, b) => {
      if (a.streak_record === b.streak_record) {
        return (b.cur_streak || 0) - (a.cur_streak || 0);
      }
      return (b.streak_record || 0) - (a.streak_record || 0);
    });
  } catch (error) {
    console.error("Error fetching users ranking:", error);
    throw error;
  }
};

export const getUserByNetlifyId = async (netlify_id) => {
  const q = query(usersCollection, where("netlify_id", "==", netlify_id));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const docData = snapshot.docs[0];
  const data = docData.data();
  return {
    id: docData.id,
    netlify_id: data.netlify_id,
    name: data.name,
    email: data.email,
    streak_record: data.streak_record || 0,
    cur_streak: data.cur_streak || 0,
    created_at: data.created_at.toDate(),
    updated_at: data.updated_at.toDate(),
  };
};

export const createUser = async (userData) => {
  const docRef = await addDoc(usersCollection, {
    ...userData,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  });
  return docRef.id;
};

export const updateUser = async (userId, userData) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...userData,
    updated_at: Timestamp.now(),
  });
};

export { Timestamp };
