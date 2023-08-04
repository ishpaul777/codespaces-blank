import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

function Authentication() {
  const [updatePasswordFields, setUpdatePasswordFields] = useState({
    password: {
      value: "",
      error: "",
    },
    confirmPassword: {
      value: "",
      error: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePasswordFieldChange = (e) => {
    setUpdatePasswordFields({
      ...updatePasswordFields,
      [e.target.name]: {
        value: e.target.value,
        error: "",
      },
    });
  };

  const [twoFactorAuthenticatorFields, setTwoFactorAuthenticatorFields] =
    useState({
      authenticator: {
        value: "",
        error: "",
      },
    });

  const handle2faAuthenticatorFieldChange = (e) => {
    setTwoFactorAuthenticatorFields({
      ...twoFactorAuthenticatorFields,
      [e.target.name]: {
        value: e.target.value,
        error: "",
      },
    });
  };

  return (
    <div className="w-full h-screen p-16 max-h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold">Security</h1>
      <div className="w-full flex md:flex-row flex-col gap-16 mt-4">
        <div className="w-full md:w-1/2">
          <div className="w-full flex flex-col gap-4">
            {/* uptdatepassword */}
            <div className="w-full flex flex-row justify-between items-center">
              <form className="w-full flex flex-col gap-4">
                <h2 className="text-xl font-bold">Update Password</h2>
                <div className="flex flex-col items-start gap-3 w-full justify-start">
                  <label
                    className="text-gray-500 font-semibold"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center border border-[#D0D5DD] px-3 rounded-md bg-white w-full shadow">
                    <input
                      value={updatePasswordFields.password.value}
                      onChange={handleUpdatePasswordFieldChange}
                      className="py-3 outline-none border-none bg-transparent w-full"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <AiFillEye className="w-5 h-5 text-gray-500" />
                      ) : (
                        <AiFillEyeInvisible className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <span className="text-red-500 text-sm font-semibold">
                    {" "}
                    {updatePasswordFields.password.error}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-3 w-full justify-start">
                  <label
                    className="text-gray-500 font-semibold"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="flex items-center border border-[#D0D5DD] px-3 rounded-md bg-white w-full shadow">
                    <input
                      value={updatePasswordFields.confirmPassword.value}
                      onChange={handleUpdatePasswordFieldChange}
                      className="py-3 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="********"
                    />
                  </div>
                  <span className="text-red-500 text-sm font-semibold">
                    {" "}
                    {updatePasswordFields.confirmPassword.error}
                  </span>
                </div>
                <button className="w-full bg-[#1e1e1e] text-white py-3 rounded-md font-semibold">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* 2fa auth */}
        <div className="w-full md:w-1/2">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-row justify-between items-center">
              <form className="w-full flex flex-col gap-4">
                <h2 className="text-xl font-bold">
                  Manage Two Factor Authentication
                </h2>
                <div className="flex flex-row items-start gap-3">
                  {/* qr code */}
									<img
										src="https://pentestlab.files.wordpress.com/2012/04/qrcode_attack.png"
										alt="qr code"
										className="w-1/2 h-full"
									/>
                  <div className="flex flex-col gap-4 w-full h-full justify-start">
                    <div className="flex flex-col gap-4 w-full h-full justiPfy-start">
                      <p className="text-[#1e1e1e] text-lg">
                        <strong>
                          {" "}
                          This is your authenticator secret key. Use this if you
                          can't scan the QR code.
                        </strong>{" "}
                        <br />
                        KANSA9119I100I168JJ8
                      </p>
                      <div className="flex flex-col gap-3">
                        <label
                          className="text-gray-500 font-semibold"
                          htmlFor="authenticator"
                        >
                          Authenticator Code
                        </label>
                        <div className="flex items-center border border-[#D0D5DD] px-3 rounded-md bg-white w-full shadow">
                          <input
                            className="py-3 outline-none border-none bg-transparent w-full"
                            type="one-time-code"
                            onChange={handle2faAuthenticatorFieldChange}
                            name="authenticator"
                            id="authenticator"
                            placeholder="********"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#1e1e1e] text-white py-3 rounded-md font-semibold"
                        >
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
