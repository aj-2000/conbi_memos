import React from "react";
import { FcGoogle } from "react-icons/fc";
import supabase from "../utils/supabase.js";
const AuthForm = () => {
  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black">
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
