import React, { useState, useEffect } from "react";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import { Link } from "react-router-dom";
import { Input } from "../../components/inputs/Input";
import { isEmail, passwordValidation } from "../../util/validateRegex";
import { getErrorMsgByCode } from "../../util/authError";

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

  const [aal2, setaal2] = useState(false);
  const [ui, setUI] = useState({});

  const handleFieldChange = (e) => {
    let { name, value } = e.target;
    if (value === "") {
      setFields({
        ...fields,
        [name]: { value, error: "This field is required" },
      });
    } else {
      setFields({
        ...fields,
        [name]: { value, error: "" },
      });
    }
  };

  const validateFields = () => {
    let isValid = true;

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
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      handleLogin();
      return;
    }
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
        "/self-service/login/browser?return_to=" +
        returnTo;
    } else {
      selfServiceURL =
        window.REACT_APP_KRATOS_PUBLIC_URL + "/self-service/login/browser";
    }

    if (!obj["flow"]) {
      window.location.href = selfServiceURL;
    } else {
      fetch(
        window.REACT_APP_KRATOS_PUBLIC_URL +
          "/self-service/login/flows" +
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
          setaal2(res?.requested_aal === "aal2"); // aal stands for authenticator assurance level
        })
        .catch(() => {
          window.location.href =
            window.REACT_APP_KRATOS_PUBLIC_URL + "/self-service/login/browser";
        });
    }
  }, []);

  const handleLogin = () => {
    var authForm = document.createElement("form");
    authForm.action = ui.action;
    authForm.method = ui.method;
    authForm.style.display = "none";

    var identifierInput = document.createElement("input");
    identifierInput.name = "identifier";
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

    document.body.appendChild(authForm);
    authForm.submit();
  };

  const handleSignInWithGoogle = (e) => {
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
      <form className="bg-[#F3F5F8] w-full flex flex-col gap-4">
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
        <Input
          label={"Email"}
          name={"email"}
          type={"input"}
          initialValue={fields.email.value}
          error={fields.email.error}
          onChange={handleFieldChange}
          backgroundColor="white"
          placeholder={"Enter your email"}
          padding="p-3"
        ></Input>
        <Input
          label={"Password"}
          name={"password"}
          type={"password"}
          initialValue={fields.password.value}
          error={fields.password.error}
          onChange={handleFieldChange}
          placeholder={"Enter your password"}
          padding="p-3"
        />
        <div className="flex flex-row-reverse text-blue-600">
          <Link to={"/auth/recovery"}>Forgot Password?</Link>
        </div>
        <button
          onClick={handleLogin}
          className="block w-full bg-[#1E1E1E] hover:bg-slate-800 py-4 rounded-lg text-white font-semibold mb-2 shadow-md"
        >
          Sign in
        </button>
        <div className="flex items-center justify-between gap-2 w-full">
          <hr className="h-px w-2/5 mx-auto bg-gray-300  border-0" />
          <p className="text-gray-500 text-center font-semibold">or</p>
          <hr className="h-px w-2/5 mx-auto bg-gray-300  border-0" />
        </div>
        <button
          className="flex gap-3 justify-center items-center w-full bg-white hover:bg-gray-100 py-4 rounded-lg text-[#1E1E1E] font-semibold mb-2 shadow-md"
          onClick={handleSignInWithGoogle}
        >
          <img src={GoogleIcon} alt="google icon" />
          Sign in with Google
        </button>
        <span className="text-gray-500 text-sm text-center w-full font-semibold">
          Don't have an account?
          <Link
            to="/auth/registration"
            className="text-[#1E1E1E] font-semibold ml-2"
          >
            Sign up
          </Link>
        </span>
        <span className="text-gray-500 text-sm text-center w-full font-semibold">
          {ui?.messages?.[0]?.id === 4000010 && (
            <Link to={"/auth/verification"}>Verify your account</Link>
          )}
        </span>
      </form>
    </>
  );
}

export default Login;
