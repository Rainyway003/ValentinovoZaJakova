import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { matchUser, skipUser } from "../../data/firebase/firebaseDatabase";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../data/firebase/firebase";

const MatchScreen = () => {
  const navigate = useNavigate();
  const [matchFound, setMatchFound] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [userData, setUserData] = useState(null);
  const [alreadyMatched, setAlreadyMatched] = useState(false);
  const [waitingList, setWaitingList] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    if (!userId || !userEmail) {
      navigate("/login");
    } else {
      setUserData({ userId, userEmail });

      const userRef = doc(db, "users", userId);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const user = docSnap.data();
          if (user.matchedWith) {
            setAlreadyMatched(true);
            setWaiting(false);
          } else {
            setWaitingList(true);  // Ako korisnik nije uparen, treba biti na čekanju
            setWaiting(false);  // Ne čekaj više
          }
        }
      });
    }
  }, [navigate]);

  const handleSkip = async () => {
    if (!userData) return;

    // Provjera da li je korisnik već na čekanju ili uparen
    if (userData.waitingList || userData.matchedWith) {
      console.log("Korisnik je već na čekanju ili uparen, ne može skipati.");
      return; // Korisnik ne može skipati ako je na čekanju ili uparen
    }

    setWaiting(true); // Postavljanje stanja na čekanje

    // Dohvat korisnika iz baze podataka
    const userRef = doc(db, "users", userData.userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const user = userDoc.data();
      console.log("User Data:", user); // Logiraj podatke korisnika

      // Ako korisnik ima partnera, brišemo "matchedWith" i stavljamo ga na čekanje
      if (user.matchedWith) {
        console.log("Korisnik je već uparen, brišemo uparivanje i stavljamo na čekanje");

        // Ažuriranje statusa korisnika: brišemo "matchedWith" i stavljamo ga na waiting listu
        await updateDoc(userRef, {
          matchedWith: "",   // Brišemo uparivanje
          waitingList: true, // Stavljamo ga na čekanje
        });

        // Dohvat partnera kojeg je korisnik imao
        const matchedUserRef = doc(db, "users", user.matchedWith);
        const matchedUserDoc = await getDoc(matchedUserRef);

        if (matchedUserDoc.exists()) {
          const matchedUser = matchedUserDoc.data();

          // Ažuriranje partnera - brišemo "matchedWith" i stavljamo ga na čekanje
          await updateDoc(matchedUserRef, {
            matchedWith: "",   // Brišemo uparivanje
            waitingList: true, // Stavili smo ga na čekanje
          });
        }

        // Postavljamo korisnika na čekanje i omogućavamo traženje novog partnera
        setTimeout(() => {
          setWaiting(false); // Zaustavljamo čekanje
          setMatchFound(false); // Nema partnera trenutno
          setWaitingList(true); // Stavili smo korisnika na waiting listu
          console.log("Korisnik može sada tražiti novog partnera");
        }, 10000); // 10 sekundi čekanja
      } else {
        console.log("Korisnik nije uparen, ništa se ne mijenja.");
        setWaiting(false); // Zaustavljamo čekanje
        setMatchFound(false); // Nema partnera
      }
    } else {
      // Ako korisnik nije pronađen, odmah završavamo čekanje
      setWaiting(false); // Zaustavljamo čekanje
    }
  };

  const handleMatch = async () => {
    if (!userData) return;

    // Ako je korisnik na čekanju, traži partnera odmah
    if (waitingList) {
      console.log("Korisnik je na čekanju, traži partnera.");
      const matchedUserId = await matchUser(userData.userId, "male"); // Pretpostavljamo da je "male"
      if (matchedUserId) {
        // Kada nađe partnera, ažuriraj oba korisnika
        await updateDoc(doc(db, "users", userData.userId), { matchedWith: matchedUserId });
        await updateDoc(doc(db, "users", matchedUserId), { matchedWith: userData.userId });
        setMatchFound(true);
        setWaitingList(false); // Resetiramo waiting list
      } else {
        setWaiting(false);
        setWaitingList(true); // Ako nema partnera, postavljamo ga na waiting listu
      }
    } else {
      console.log("Korisnik nije na čekanju, već ima partnera.");
    }
  };


  if (waiting) {
    return <p>⏳ Tražimo partnera...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-300">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-4">Čekanje na partnera...</h2>

        {waitingList ? (
          <div>
            <h3 className="text-xl text-orange-600">Na čekanju ste, tražimo novog partnera!</h3>
            <button
              onClick={handleMatch}
              className="mt-4 w-48 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
            >
              Pronađi novog partnera
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl text-green-600">Partner pronađen!</h3>
            <button
              onClick={() => navigate("/chat")}
              className="mt-4 w-48 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
            >
              Kreni u chat
            </button>
            <button
              onClick={handleSkip}
              className="mt-4 w-48 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
            >
              Preskoči
            </button>
          </div>
        )}
      </div>
    </div>
  );

};

export default MatchScreen;
