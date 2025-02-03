import React, { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { registerUser, signInUser } from "../../data/firebase/firebaseAuth";
import './background.css'
import slika from "../../assets/pinterest3fr.jpg";

export const loginScreenAction = async ({ request }) => {
    const formData = await request.formData();
    const formId = formData.get("formId");
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");
    const gender = formData.get("gender");
    const number = formData.get("number");

    try {
        const { user, error } =
            formId === 'login'
                ? await signInUser(email, password)
                : await registerUser(username, email, password, gender, number);

        if (user) {
            return redirect("/waiting");
        }

        if (!user) {
            alert("Korisnik ne postoji ili korisnik već postoji.");
        }

        // Error
        if (error) {
            const errorMessage = error?.message || "Došlo je do greške. Pokušajte ponovo.";

            // Specificno
            if (error.code === "auth/invalid-credential") {
                alert("Pogrešni podaci. Provjerite email i lozinku.");
            } else {
                alert(errorMessage);
            }
        } else {
            alert("Alo! Something went wrong.");
        }

        return null;
    } catch (error) {
        alert("Došlo je do greške. Pokušajte ponovo.");
        return { errorMessage: "Došlo je do greške. Pokušajte ponovo." };
    }
};

const LoginScreen = () => {
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const disableZoom = (event) => {
            event.preventDefault();
        };

        document.addEventListener("wheel", disableZoom, { passive: false });
        document.addEventListener("touchmove", disableZoom, { passive: false });

        return () => {
            document.removeEventListener("wheel", disableZoom);
            document.removeEventListener("touchmove", disableZoom);
        };
    }, []);


    const switchToLogin = () => {
        setIsLogin(true);
    };

    const switchToRegistration = () => {
        setIsLogin(false);
    };


    return (
        <div
            className="h-screen overflow-hidden user-select-none lal flex items-center justify-center overflow-x-hidden"
            style={{
                backgroundImage: `url(${slika})`,
                backgroundSize: "cover",
                backgroundPosition: "calc(50%) center", // Pomjeranje slike ulijevo
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
            }}
        >

            <div className="absolute top-10 w-full text-center">

                <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-red-300 from-pink-900">Valentinovo</span> u SŠ "Uskoplje"</h1>
                <p class="text-lg font-normal text-red-200 lg:text-xl dark:text-red-800">Ako ne znaš koga pozvati na kavu, možda je vrijeme da pogledaš tko je u tvojoj školi! ☕.</p>

            </div>


            <div className="absolute z-10 w-full p-8 max-w-md">
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>



            <div className="relative left-[-0.4%]">
                {/* Dva gumba za Login i Register */}
                <div className="absolute top-[-150px] w-max transform -translate-x-1/2 z-10 flex justify-center space-x-0 max-w-md">


                    {/* Gumb za Login */}
                    <button
                        onClick={switchToLogin}
                        style={{
                            background: !isLogin
                                ? "linear-gradient(to bottom, #ce716f, #ED807F)"
                                : "linear-gradient(to bottom, #df7b79, #df6d6c)"
                        }}
                        className={`text-md lol text-red-200 font-bold py-6 px-20 rounded-t-full w-56  transition duration-300 ${isLogin ? "z-10" : "z-0"} absolute left-[-195px]`}
                    >
                        Prijavi se!
                    </button>

                    {/* Gumb za Register */}
                    <button
                        onClick={switchToRegistration}
                        style={{
                            background: isLogin
                                ? "linear-gradient(to bottom, #ce716f, #ED807F)"
                                : "linear-gradient(to bottom, #df7b79, #df6d6c)"
                        }}
                        className={`text-md lol text-red-200 font-bold py-6 px-20 rounded-t-full w-56  transition duration-300 ${isLogin ? "z-0" : "z-10"} focus:outline-none absolute -left-5`}
                    >
                        Registriraj se!
                    </button>
                </div>
            </div>


            <footer className="absolute bottom-0 w-full py-4 pb-8" style={{ background: "rgba(255, 182, 193, 0.8)" }}>
                <div className="container mx-auto text-center">
                    <p className="text-lg font-semibold text-red-600">
                        Stranicu su napravili :
                        <span className="font-bold text-red-700"> Josip Knežević </span> i
                        <span className="font-bold text-red-700"> Jakov Vuković </span>
                    </p>
                    <div className="mt-2 text-sm text-red-400">
                        <p>&copy; 2025 Valentinovo SŠ "Uskoplje"</p>
                    </div>
                </div>
            </footer>



        </div>
    );
};

export default LoginScreen;