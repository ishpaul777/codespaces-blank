import React, { useEffect, useState } from "react";

import { passwordValidation } from "../../../util/validateRegex";
import { Input } from "../../../components/inputs/Input";
import { getErrorMsgByCode } from "../../../util/authError";

function Authentication() {
  const [ui, setUI] = useState({});

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

  useEffect(() => {
    var obj = {};
    window.location.search
      .split("?")
      .filter((each) => each.trim() !== "")
      .forEach((each) => {
        var temp = each.split("=");
        obj[temp[0]] = temp[1];
      });

    if (!obj["flow"]) {
      window.location.href =
        window.REACT_APP_KRATOS_PUBLIC_URL + "/self-service/settings/browser";
    } else {
      fetch(
        window.REACT_APP_KRATOS_PUBLIC_URL +
          "/self-service/settings/flows" +
          "?id=" +
          obj["flow"],
        {
          credentials: "include",
        }
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error(res.json());
          }
        })
        .then((res) => {
          setUI(res.ui);
        })
        .catch(() => {
          window.location.href =
            window.REACT_APP_KRATOS_PUBLIC_URL +
            "/self-service/settings/browser";
        });
    }
  }, []);

  const handleUpdatePasswordFieldChange = (e) => {
    setUpdatePasswordFields({
      ...updatePasswordFields,
      [e.target.name]: {
        ...updatePasswordFields[e.target.name],
        value: e.target.value,
      },
    });
  };

  const validateUpdatePassword = () => {
    let isValid = true;
    if (updatePasswordFields.password.value.trim().length === 0) {
      setUpdatePasswordFields((prev) => {
        return {
          ...prev,
          password: {
            ...prev.password,
            error: "Password is required",
          },
        };
      });
      isValid = false;
    }

    const errorString = passwordValidation(updatePasswordFields.password.value);
    if (errorString) {
      setUpdatePasswordFields((prev) => {
        return {
          ...prev,
          password: {
            ...prev.password,
            error: errorString,
          },
        };
      });
      isValid = false;
    }

    if (
      updatePasswordFields.confirmPassword.value !==
      updatePasswordFields.password.value
    ) {
      setUpdatePasswordFields((prev) => {
        return {
          ...prev,
          confirmPassword: {
            ...prev.confirmPassword,
            error: "Password and Confirm Password do not match",
          },
        };
      });
      isValid = false;
    }

    return isValid;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (validateUpdatePassword()) {
      updatePassword();
    }
  };

  const updatePassword = () => {
    var updatePasswordForm = document.createElement("form");
    updatePasswordForm.action = ui.action;
    updatePasswordForm.method = ui.method;
    updatePasswordForm.style.display = "none";

    var emailInput = document.createElement("input");
    emailInput.name = "traits.email";
    emailInput.value = ui?.nodes?.[1]?.attributes?.value;

    var passwordInput = document.createElement("input");
    passwordInput.name = "password";
    passwordInput.value = updatePasswordFields.password.value;

    var csrfInput = document.createElement("input");
    csrfInput.name = "csrf_token";
    csrfInput.value = ui.nodes.find(
      (value) => value.attributes.name === "csrf_token"
    ).attributes.value;

    var methodInput = document.createElement("input");
    methodInput.name = "method";
    methodInput.value = "password";

    updatePasswordForm.appendChild(emailInput);
    updatePasswordForm.appendChild(passwordInput);
    updatePasswordForm.appendChild(methodInput);
    updatePasswordForm.appendChild(csrfInput);
    document.body.appendChild(updatePasswordForm);
    updatePasswordForm.submit();
  };
  const [twoFactorAuthenticatorFields, setTwoFactorAuthenticatorFields] =
    useState({
      authenticator: {
        value: "",
        error: "",
      },
    });

  const validate2fa = () => {
    let isValid = true;
    if (twoFactorAuthenticatorFields.authenticator.value.trim().length !== 6) {
      setTwoFactorAuthenticatorFields((prev) => {
        return {
          ...prev,
          authenticator: {
            ...prev.authenticator,
            error: "Authenticator code is 6 digits",
          },
        };
      });
      isValid = false;
    }
    return isValid;
  };

  const handle2faAuthenticatorFieldChange = (e) => {
    // if the value is not 6 digits set the state with error message
    if (e.target.value.trim().length !== 6) {
      setTwoFactorAuthenticatorFields((prev) => {
        return {
          ...prev,
          authenticator: {
            ...prev.authenticator,
            value: e.target.value,
            error: "Authenticator code must be 6 digits",
          },
        };
      });
    } else {
      setTwoFactorAuthenticatorFields((prev) => {
        return {
          ...prev,
          authenticator: {
            ...prev.authenticator,
            value: e.target.value,
            error: "",
          },
        };
      });
    }
  };

  const handle2faSubmit = (e, method) => {
    e.preventDefault();
    if (method === "link") {
      if (validate2fa()) {
        handleTOTPLink();
      }
    } else {
      handleTOTPLink();
    }
  };

  const handleTOTPLink = () => {
    var totpForm = document.createElement("form");
    totpForm.action = ui.action;
    totpForm.method = ui.method;
    totpForm.style.display = "none";

    var csrfInput = document.createElement("input");
    csrfInput.name = "csrf_token";
    csrfInput.type = "hidden";
    csrfInput.value = ui.nodes.find(
      (value) => value.attributes.name === "csrf_token"
    ).attributes.value;

    var totpMethod = document.createElement("input");
    totpMethod.name = "method";
    totpMethod.value = "totp";

    var totpInput = document.createElement("input");
    totpInput.name = "totp_code";
    totpInput.value = twoFactorAuthenticatorFields.authenticator.value;

    totpForm.appendChild(csrfInput);
    totpForm.appendChild(totpMethod);
    totpForm.appendChild(totpInput);

    document.body.appendChild(totpForm);

    totpForm.submit();
  };

  const handleTOTPUnlink = () => {
    var totpForm = document.createElement("form");
    totpForm.action = ui.action;
    totpForm.method = ui.method;
    totpForm.style.display = "none";

    var csrfInput = document.createElement("input");
    csrfInput.name = "csrf_token";
    csrfInput.type = "hidden";
    csrfInput.value = ui.nodes.find(
      (value) => value.attributes.name === "csrf_token"
    ).attributes.value;

    var totpMethod = document.createElement("input");
    totpMethod.name = "method";
    totpMethod.value = "totp";

    var totpInput = document.createElement("input");

    totpInput.name = "totp_unlink";
    totpInput.value = "true";

    totpForm.appendChild(csrfInput);
    totpForm.appendChild(totpMethod);
    totpForm.appendChild(totpInput);

    document.body.appendChild(totpForm);

    totpForm.submit();
  };

  return (
    <div className="w-full h-screen p-16 flex flex-col gap-4 max-h-screen overflow-y-auto">
      <h1 className="text-2xl font-semibold">Security</h1>
      {ui?.messages?.[0]?.text && (
        <span
          className={`
                      border p-2 text-sm rounded-md
                    ${
                      ui?.messages?.[0]?.type === "error"
                        ? " bg-red-100 text-red-500 border-red-500"
                        : "bg-green-100 text-green-500 border-green-500"
                    }`}
        >
          {getErrorMsgByCode(ui?.messages?.[0]?.id)}
        </span>
      )}
      <div className="w-full flex md:flex-row flex-col gap-16 mt-4">
        <div className="w-full md:w-1/2">
          <div className="w-full flex flex-col gap-4">
            {/* uptdatepassword */}
            <div className="w-full flex flex-row justify-between items-center">
              <div
                className="w-full flex flex-col gap-4"
                onSubmit={handleUpdatePassword}
              >
                <h2 className="text-xl font-semibold">Update Password</h2>
                {ui.nodes?.filter((node) => node.group === "password")[0]
                  ?.messages?.length ? (
                  <span
                    className={
                      "border p-2 text-sm rounded-md bg-red-100 text-red-500 border-red-500"
                    }
                  >
                    {
                      ui.nodes.filter((node) => node.group === "password")[0]
                        ?.messages?.[0]?.text
                    }
                  </span>
                ) : null}
                <Input
                  label={"Password"}
                  type={"password"}
                  placeholder={"Enter your password"}
                  name={"password"}
                  value={updatePasswordFields.password.value}
                  onChange={handleUpdatePasswordFieldChange}
                  error={updatePasswordFields.password.error}
                />
                <Input
                  label={"Confirm password"}
                  type={"input"}
                  placeholder={"Confirm your password"}
                  name={"confirmPassword"}
                  value={updatePasswordFields.confirmPassword.value}
                  onChange={handleUpdatePasswordFieldChange}
                  error={updatePasswordFields.confirmPassword.error}
                />
                <button
                  className="w-full bg-[#1e1e1e] text-white py-3 rounded-md font-semibold"
                  type="submit"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 2fa auth */}
        <div className="w-full md:w-1/2">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-row justify-between items-center">
              <div
                className="w-full flex flex-col gap-4"
                onSubmit={handle2faSubmit}
              >
                <h2 className="text-xl font-bold">
                  Manage Two Factor Authentication
                </h2>
                {ui?.nodes?.filter(
                  (node) => node.attributes.node_type === "img"
                ).length ? (
                  <div className="flex flex-col md:flex-row items-start gap-3">
                    <img
                      src={
                        ui?.nodes?.find(
                          (node) => node?.attributes?.node_type === "img"
                        )?.attributes?.src
                      }
                      alt="qr code"
                      className="w-1/2 h-full"
                    />
                    <div className="flex flex-col gap-4 w-full h-full justify-start">
                      <div className="flex flex-col gap-4 w-full h-full justiPfy-start">
                        <p className="text-[#1e1e1e] text-lg flex flex-col gap-2">
                          <span className="font-semibold">
                            This is your authenticator secret key. Use this if
                            you can't scan the QR code.
                          </span>
                          <span className="">
                            {
                              ui?.nodes
                                ?.filter((node) => node?.group === "totp")
                                ?.find(
                                  (node) =>
                                    node?.attributes?.id === "totp_secret_key"
                                )?.attributes?.text?.text
                            }
                          </span>
                        </p>
                        <div className="flex flex-col gap-3">
                          <Input
                            name={"code"}
                            label={"Authenticator Code"}
                            type={"input"}
                            placeholder={
                              "Enter your 6 digit authenticator code"
                            }
                            value={
                              twoFactorAuthenticatorFields.authenticator.value
                            }
                            onChange={handle2faAuthenticatorFieldChange}
                            error={
                              twoFactorAuthenticatorFields.authenticator.error
                            }
                          />
                          <button
                            className="w-full bg-[#1e1e1e] text-white py-3 rounded-md font-semibold"
                            onClick={(e) => handle2faSubmit(e, "link")}
                          >
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex bg-black">
                    <button
                      className="w-full bg-[#1e1e1e] text-white py-3 rounded-md font-semibold"
                      onClick={(e) => handle2faSubmit(e, "unlink")}
                    >
                      Enable 2FA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
