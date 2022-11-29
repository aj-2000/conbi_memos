import React from "react";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "../utils/supabase";
const notify = (message: string) => toast(message);

const AuthForm = () => {
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      notify("An error occured while signing in.");
    }
  }
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black">
      <ToastContainer />
      <div
        onClick={signInWithGoogle}
        className="flex justify-center items-center bg-white rounded-lg py-2 px-4 gap-x-2 shadow-sm hover:shadow hover:cursor-pointer"
      >
        <FcGoogle className="hover:scale-125" size={26} />
        <span className="text-lg font-extralight capitalize">Sign In</span>
      </div>
    </div>
  );
};

export default AuthForm;
