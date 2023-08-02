import React, { useState } from "react";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import { Link } from "react-router-dom";

function Login({ title }) {
  const [fields, setFields] = useState({
    email: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
  });

  const handleFieldChange = (e) => {
    setFields({
      ...fields,
      [e.target.name]: {
        value: e.target.value,
        error: "",
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      alert(JSON.stringify(fields, null, 2));
    } else {
      return;
    }
  };

  const validateFields = () => {
    let isValid = true;
    const email = fields.email.value;
    const password = fields.password.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!emailRegex.test(email)) {
      isValid = false;
      setFields({ ...fields, email: { error: "Please enter a valid email" } });
      return isValid;
    }
    if (!passwordRegex.test(password)) {
      isValid = false;
      alert("Please enter a valid password");
      setFields({
        ...fields,
        password: { error: "Please enter a valid password" },
      });
      return isValid;
    }
    return isValid;
  };

  return (
    <>
      <h1 className="text-center text-3xl font-semibold">{title}</h1>
      <form
        className="bg-[#F3F5F8] w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-start gap-3 w-full justify-start">
          <label className="text-gray-500 font-semibold" htmlFor="email">
            Email
          </label>
          <div className="flex items-center border border-[#D0D5DD] px-3 rounded-md bg-white w-full shadow">
            <input
              value={fields.email.value}
              onChange={handleFieldChange}
              className="py-3 outline-none border-none bg-transparent w-full"
              type="text"
              name="email"
              id="email"
              placeholder="abcd@example.com"
            />
          </div>
          <span className="text-red-500 text-sm font-semibold">
            {" "}
            {fields.email.error}
          </span>
        </div>
        <div className="flex flex-col items-start gap-3 w-full justify-start">
          <label className="text-gray-500 font-semibold" htmlFor="password">
            Password
          </label>
          <div className="flex items-center border border-[#D0D5DD] px-3 rounded-md bg-white w-full shadow">
            <input
              value={fields.password.value}
              onChange={handleFieldChange}
              className="py-3 outline-none border-none bg-transparent w-full"
              type="text"
              name="password"
              id="password"
              placeholder="********"
            />
          </div>
          <span className="text-red-500 text-sm font-semibold">
            {" "}
            {fields.password.error}
          </span>
        </div>
        <button
          type="submit"
          className="block w-full bg-[#1E1E1E] hover:bg-slate-800 py-4 rounded-lg text-white font-semibold mb-2 shadow-md"
        >
          Sign in
        </button>
        <div className="flex items-center justify-between gap-2 w-full">
          <hr className="h-px w-2/5 mx-auto bg-gray-300  border-0" />
          <p className="text-gray-500 text-center font-semibold">or</p>
          <hr className="h-px w-2/5 mx-auto bg-gray-300  border-0" />
        </div>
        <button className="flex gap-3 justify-center items-center w-full bg-white hover:bg-gray-100 py-4 rounded-lg text-[#1E1E1E] font-semibold mb-2 shadow-md">
          <img src={GoogleIcon} alt="google icon" />
          Sign in with Google
        </button>
        <span className="text-gray-500 text-sm text-center w-full font-semibold">
          Don't have an account?
          <Link to="/auth/signup" className="text-[#1E1E1E] font-semibold ml-2">
            Sign up
          </Link>
        </span>
      </form>
    </>
  );
}

export default Login;
