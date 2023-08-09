import React, { useEffect, useState } from "react";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import { Link } from "react-router-dom";
import { Input } from "../../components/inputs/Input";
import { isEmail, passwordValidation } from "../../util/validateRegex";

function Signup({ title }) {
  const [ui, setUI] = useState({});
  const [fields, setFields] = useState({
    firstName: {
      value: "",
      error: "",
    },
    lastName: {
      value: "",
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
    confirmPassword: {
      value: "",
      error: "",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      handleRegistrationWithEmail();
    }
  };
  const validateFields = () => {
    let isValid = true;

    if (fields.firstName.value === "") {
      isValid = false;
      setFields((prev) => {
        return {
          ...prev,
          firstName: {
            ...prev.firstName,
            error: "This field is required",
          },
        };
      });
    }

    if (fields.lastName.value === "") {
      isValid = false;
      setFields((prev) => {
        return {
          ...prev,
          lastName: {
            ...prev.lastName,
            error: "This field is required",
          },
        };
      });
    }

    if (fields.email.value === "") {
      isValid = false;
      setFields((prev) => {
        return {
          ...prev,
          email: {
            ...prev.email,
            error: "This field is required",
          },
        };
      });
    } else {
      if (!isEmail(fields.email.value)) {
        isValid = false;
        setFields((prev) => {
          return {
            ...prev,
            email: {
              ...prev.email,
              error: "Please enter a valid email",
            },
          };
        });
      }
    }

    let errorString = passwordValidation(fields.password.value);
    if (errorString) {
      isValid = false;
      setFields((prev) => {
        return {
          ...prev,
          password: {
            ...prev.password,
            error: errorString,
          },
        };
      });
    }

    if (fields.confirmPassword.value !== fields.password.value) {
      isValid = false;
      setFields((prev) => {
        return {
          ...prev,
          confirmPassword: {
            ...prev.confirmPassword,
            error: "Passwords do not match",
          },
        };
      });
    }
    return isValid;
  };

  useEffect(() => {
    var obj = {};
    window.location.search
      .split("?")
      .filter((each) => each.trim() !== "")
      .forEach((each) => {
        var temp = each.split("=");
        obj[temp[0]] = temp[1];
      });

    const returnTo = obj["return_to"];

    let selfServiceURL;
    if (returnTo) {
      selfServiceURL =
        window.REACT_APP_KRATOS_PUBLIC_URL +
        "/self-service/registration/browser?return_to=" +
        returnTo;
    } else {
      selfServiceURL =
        window.REACT_APP_KRATOS_PUBLIC_URL +
        "/self-service/registration/browser";
    }

    if (!obj["flow"]) {
      window.location.href = selfServiceURL;
    } else {
      fetch(
        window.REACT_APP_KRATOS_PUBLIC_URL +
          "/self-service/registration/flows" +
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
            "/self-service/registration/browser";
        });
    }
  }, []);

  // handleRegistrationWithEmail is the handler for user registration with email
  const handleRegistrationWithEmail = () => {
    var authForm = document.createElement("form");
    authForm.action = ui.action;
    authForm.method = ui.method;
    authForm.style.display = "none";

    var fnameInput = document.createElement("input");
    fnameInput.name = "traits.name.first";
    fnameInput.value = fields.firstName.value;

    var lnameInput = document.createElement("input");
    lnameInput.name = "traits.name.last";
    lnameInput.value = fields.lastName.value;

    var identifierInput = document.createElement("input");
    identifierInput.name = "traits.email";
    identifierInput.value = fields.email.value;

    var passwordInput = document.createElement("input");
    passwordInput.name = "password";
    passwordInput.value = fields.password.value;

    var csrfInput = document.createElement("input");
    csrfInput.name = "csrf_token";
    csrfInput.type = "hidden";
    csrfInput.value = ui.nodes.find(
      (value) => value.attributes.name === "csrf_token"
    ).attributes.value;

    var methodInput = document.createElement("input");
    methodInput.name = "method";
    methodInput.value = "password";

    authForm.appendChild(identifierInput);
    authForm.appendChild(passwordInput);
    authForm.appendChild(csrfInput);
    authForm.appendChild(methodInput);
    authForm.appendChild(fnameInput);
    authForm.appendChild(lnameInput);

    document.body.appendChild(authForm);
    authForm.submit();
  };

  const handleOIDC = (e) => {
    e.preventDefault();
    withOIDC("google");
  };

  const withOIDC = (values) => {
    var oidcForm = document.createElement("form");
    oidcForm.action = ui.action;
    oidcForm.method = ui.method;
    oidcForm.style.display = "none";

    var csrfInput = document.createElement("input");
    csrfInput.name = "csrf_token";
    csrfInput.type = "hidden";
    csrfInput.value = ui.nodes.find(
      (value) => value.attributes.name === "csrf_token"
    ).attributes.value;

    var methodInput = document.createElement("input");
    methodInput.name = "method";
    methodInput.value = "oidc";

    var providerInput = document.createElement("input");
    providerInput.name = "provider";
    providerInput.value = values;

    oidcForm.appendChild(providerInput);
    oidcForm.appendChild(csrfInput);
    oidcForm.appendChild(methodInput);

    document.body.appendChild(oidcForm);

    oidcForm.submit();
  };

  return (
    <>
      <h1 className="text-center text-3xl font-semibold">{title}</h1>
      <form
        className="bg-[#F3F5F8] w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          label={"First Name"}
          name={"firstName"}
          initialValue={fields.firstName.value}
          onChange={(e) => {
            // validate the first name
            if (e.target.value === "") {
              setFields((prev) => {
                return {
                  ...prev,
                  firstName: {
                    value: e.target.value,
                    error: "This field is required",
                  },
                };
              });
            }
            // if the first name is valid, remove the error
            else {
              setFields((prev) => {
                return {
                  ...prev,
                  firstName: {
                    value: e.target.value,
                    error: "",
                  },
                };
              });
            }
          }}
          error={fields.firstName.error}
          backgroundColor="white"
          placeholder="Enter your first name"
          padding="p-3"
          type="input"
        />
        <Input
          label={"Last Name"}
          name={"lastName"}
          initialValue={fields.lastName.value}
          onChange={(e) => {
            if (e.target.value === "") {
              setFields((prev) => {
                return {
                  ...prev,
                  lastName: {
                    value: e.target.value,
                    error: "This field is required",
                  },
                };
              });
            } else {
              setFields((prev) => {
                return {
                  ...prev,
                  lastName: {
                    value: e.target.value,
                    error: "",
                  },
                };
              });
            }
          }}
          error={fields.lastName.error}
          backgroundColor="white"
          placeholder="Enter your last name"
          padding="p-3"
          type="input"
        />

        <Input
          label={"Email"}
          name={"email"}
          initialValue={fields.email.value}
          onChange={(e) => {
            if (!isEmail(e.target.value)) {
              setFields({
                ...fields,
                email: {
                  value: e.target.value,
                  error: "Please enter a valid email",
                },
              });
            } else {
              setFields({
                ...fields,
                email: { value: e.target.value, error: "" },
              });
            }
          }}
          error={fields.email.error}
          backgroundColor="white"
          placeholder="Enter your email"
          padding="p-3"
          type="input"
        />
        <Input
          label={"Password"}
          name={"password"}
          initialValue={fields.password.value}
          onChange={(e) => {
            let errorString = passwordValidation(e.target.value);
            if (errorString) {
              setFields({
                ...fields,
                password: { value: e.target.value, error: errorString },
              });
            } else {
              setFields({
                ...fields,
                password: { value: e.target.value, error: "" },
              });
            }
          }}
          error={fields.password.error}
          backgroundColor="white"
          placeholder="Enter your password"
          padding="p-3"
          type={"password"}
        />
        <Input
          label={"Confirm Password"}
          name={"confirmPassword"}
          initialValue={fields.confirmPassword.value}
          onChange={(e) => {
            if (e.target.value !== fields.password.value) {
              setFields({
                ...fields,
                confirmPassword: {
                  value: e.target.value,
                  error: "Passwords do not match",
                },
              });
            } else {
              setFields({
                ...fields,
                confirmPassword: { value: e.target.value, error: "" },
              });
            }
          }}
          error={fields.confirmPassword.error}
          backgroundColor="white"
          placeholder="Confirm your password"
          padding="p-3"
          type={"input"}
        />
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
        <span className="text-gray-500 w-full text-center text-sm font-semibold">
          Already Have an account?
          <Link to="/auth/login" className="text-[#1E1E1E] font-semibold ml-2">
            Sign in
          </Link>
        </span>
      </form>
    </>
  );
}

export default Signup;
