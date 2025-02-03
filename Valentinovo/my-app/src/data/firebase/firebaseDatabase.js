import {
  collection,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const db = getFirestore();

export const saveUser = async (userId, user) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, user, { merge: true })
}

export const matchUser = async (userId, gender) => {
  const usersRef = collection(db, "users");
  const oppositeGender = gender === "male" ? "female" : "male";

  const q = query(
    usersRef,
    where("gender", "==", oppositeGender),
    where("matchedWith", "==", "") // Samo korisnici koji nisu još upareni
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Dohvat prvog korisnika koji nije uparen
    const matchedUser = querySnapshot.docs[0];
    const matchedUserId = matchedUser.id;

    // Dohvat podataka o korisniku kojeg tražiš
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const user = userDoc.data();

    // Provjera da li je korisnik već uparen, ako jeste, oslobodi ga
    if (user.matchedWith) {
      const previousMatchedUserRef = doc(db, "users", user.matchedWith);
      const previousMatchedUserDoc = await getDoc(previousMatchedUserRef);
      if (previousMatchedUserDoc.exists()) {
        await updateDoc(previousMatchedUserRef, {
          matchedWith: "",      // Oslobađanje prethodnog partnera
          waitingList: true,    // Staviti ga na čekanje
        });
      }
    }

    // Provjera da li je partner već zauzet, ako jeste, preskoči ga
    const matchedUserRef = doc(db, "users", matchedUserId);
    const matchedUserDoc = await getDoc(matchedUserRef);
    if (matchedUserDoc.exists() && matchedUserDoc.data().matchedWith !== "") {
      return null;  // Ako je partner već uparen, preskoči ga
    }

    // Uparivanje korisnika
    await updateDoc(userRef, { matchedWith: matchedUserId, waitingList: false });
    await updateDoc(matchedUserRef, { matchedWith: userId, waitingList: false });

    return matchedUserId;
  }

  return null; // Ako nema partnera, vrati null
};


export const skipUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (!userData) {
      console.log("User data not found");
      return null;
    }

    const currentMatchedWith = userData.matchedWith;

    if (currentMatchedWith) {
      // Uklanjamo trenutno spajanje (match)
      await updateDoc(userRef, { matchedWith: "", isWaiting: true }); // Dodajemo isWaiting true za prvog korisnika
      await updateDoc(doc(db, "users", currentMatchedWith), { matchedWith: "", isWaiting: true }); // Dodajemo isWaiting true za partnera

      console.log(`Unmatched users: ${userId} and ${currentMatchedWith}`);

      // Dodajemo korisnike u waiting listu
      await updateDoc(doc(db, "users", userId), { isWaiting: true });
      await updateDoc(doc(db, "users", currentMatchedWith), { isWaiting: true });

      return null; // Nema novog partnera
    }

    return null;
  } catch (error) {
    console.error("Error skipping user:", error);
    return null;
  }
};
