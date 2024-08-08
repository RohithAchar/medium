import React, { useState } from "react";
import { LabelledInput } from "./Signup";
import { SignUpData, SignUpSchema } from "@rohith_achar/medium";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "./extras";
import { PacmanLoader } from "react-spinners";

const Signin = () => {
  const navigate = useNavigate();
  const [signInData, setSigInData] = useState<SignUpData>({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const signupHandler = async () => {
    setIsLoading(true);
    const { success } = SignUpSchema.safeParse(signInData);

    if (!success) {
      setIsLoading(false);
      alert("Enter valid email");
      return;
    }
    if (signInData.password.length < 8) {
      setIsLoading(false);
      alert("Password should be more than 8 characters");
      return;
    }

    const res = await axios.post(
      `${BACKEND_URL}/api/v1/user/signin`,
      signInData
    );
    setIsLoading(false);
    if (res.status == 200) {
      localStorage.setItem("token", res.data.jwt);
      navigate("/blogs");
    }
    if (res.status == 203) {
      alert("Email and password not matching");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border border-slate-600 p-8 rounded-lg">
        <h1 className="text-center text-4xl font-bold">Enter the details</h1>
        <LabelledInput
          value={signInData.email}
          label="Enter your email"
          placeholder="abc@gmail.com"
          onChange={(e) => {
            setSigInData({ ...signInData, email: e.target.value });
          }}
        />
        <LabelledInput
          value={signInData.password}
          label="Enter password"
          placeholder="12345678"
          type={"password"}
          onChange={(e) => {
            setSigInData({ ...signInData, password: e.target.value });
          }}
        />

        <button
          className="btn btn-block mt-4 btn-primary shadow-lg shadow-indigo-500/50"
          onClick={signupHandler}
        >
          {isLoading ? <PacmanLoader size={12} /> : "Sign in"}
        </button>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link
            className="underline text-blue-400 font-semibold"
            to={"/signup"}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
