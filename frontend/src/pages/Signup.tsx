import React, { ChangeEvent, useState } from "react";
import { SignUpData, SignUpSchema } from "@rohith_achar/medium";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "./extras";
import { PacmanLoader } from "react-spinners";

const Signup = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState<SignUpData>({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const signupHandler = async () => {
    setIsLoading(true);
    const { success } = SignUpSchema.safeParse(signupData);

    if (!success) {
      setIsLoading(false);
      alert("Enter valid email");
      return;
    }
    if (signupData.password.length < 8) {
      setIsLoading(false);
      alert("Password should be more than 8 characters");
      return;
    }

    const res = await axios.post(
      `${BACKEND_URL}/api/v1/user/signup`,
      signupData
    );
    setIsLoading(false);
    if (res.status == 201) {
      console.log(res.data.jwt);
      localStorage.setItem("token", res.data.jwt);
      navigate("/blogs");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border border-slate-600 p-8 rounded-lg">
        <h1 className="text-center text-4xl font-bold">Create an account</h1>
        <LabelledInput
          value={signupData.email}
          label="Enter your email"
          placeholder="abc@gmail.com"
          onChange={(e) => {
            setSignupData({ ...signupData, email: e.target.value });
          }}
        />
        <LabelledInput
          value={signupData.password}
          label="Enter password"
          placeholder="12345678"
          type={"password"}
          onChange={(e) => {
            setSignupData({ ...signupData, password: e.target.value });
          }}
        />
        <LabelledInput
          value={signupData.name || ""}
          label="Enter your username"
          placeholder="John Doe"
          onChange={(e) => {
            setSignupData({ ...signupData, name: e.target.value });
          }}
        />
        <button
          className="btn btn-block mt-4 btn-primary shadow-lg shadow-indigo-500/50"
          onClick={signupHandler}
        >
          {isLoading ? <PacmanLoader size={12} /> : "Sign up"}
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            className="underline text-blue-400 font-semibold"
            to={"/signin"}
          >
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

export const LabelledInput = ({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: LabelledInputType) => {
  return (
    <label className="form-control w-full max-w-xs mt-2">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs"
        value={value}
        onChange={onChange}
        required={true}
      />
    </label>
  );
};

type LabelledInputType = {
  label: string;
  value: string;
  placeholder: string;
  type?: "password" | "text";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
