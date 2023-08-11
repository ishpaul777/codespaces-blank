import { Link } from "react-router-dom";
import { getErrorMsgByCode } from "../../util/authError";
import { isEmail } from "../../util/validateRegex";
import { useEffect, useState } from "react";
import { Input } from "../../components/inputs/Input";

export function ForgotPassword({ title }) {
  const [ui, setUI] = useState({});
  const [recoveryEmail, setRecoveryEmail] = useState({
    value: "",
    error: "",
  });

  const handleChange = (e) => {
    const { value } = e.target;
    let error = "";

    if (value?.trim()?.length === 0) {
      error = "Email is required";
    } else if (!isEmail(value)) {
      error = "Please enter a valid email address";
    }

    setRecoveryEmail({
      value,
      error,
    });
  };

  const handleSubmit = () => {
    if (!recoveryEmail.error) {
      if (recoveryEmail.value.trim()?.length) {
        if (isEmail(recoveryEmail.value)) {
          handleRecovery();
        } else {
          setRecoveryEmail({
            ...recoveryEmail,
            error: "Please enter a valid email address",
          });
        }
      } else {
        setRecoveryEmail({
          ...recoveryEmail,
          error: "Email address is required",
        });
      }
    }
  };

  const handleRecovery = () => {
    var recoverPasswordForm = document.createElement("form");
    recoverPasswordForm.action = ui.action;
    recoverPasswordForm.method = ui.method;
    recoverPasswordForm.style.display = "none";

    var emailInput = document.createElement("input");
    emailInput.name = "email";
    emailInput.value = recoveryEmail.value;

    var csrfInput = document.createElement("input");
    csrfInput.name = "csrf_token";
    csrfInput.value = ui.nodes.find((value) => {
      if (value.attributes.name === "csrf_token") {
        return value;
      } else {
        return null;
      }
    }).attributes.value;

    var methodInput = document.createElement("input");
    methodInput.name = "method";
    methodInput.value = "link";

    recoverPasswordForm.appendChild(emailInput);
    recoverPasswordForm.appendChild(csrfInput);
    recoverPasswordForm.appendChild(methodInput);
    document.body.appendChild(recoverPasswordForm);
    recoverPasswordForm.submit();
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
    fetch(
      window.REACT_APP_KRATOS_PUBLIC_URL +
        "/self-service/recovery/flows?id=" +
        obj["flow"],
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then((res) => {
        setUI(res.ui);
      })
      .catch((err) => {
        window.location.href =
          window.REACT_APP_KRATOS_PUBLIC_URL + "/self-service/recovery/browser";
      });
  }, []);

  return (
    <>
      <h1 className="text-center text-3xl font-semibold">{title}</h1>
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
          {ui?.messages?.[0]?.text}
        </span>
      )}
      <div className="bg-[#F3F5F8] w-full flex flex-col gap-4">
        <Input
          label={"Email"}
          type={"input"}
          onChange={handleChange}
          initialValue={recoveryEmail.value}
          error={recoveryEmail.error}
          backgroundColor="white"
          placeholder={`Enter your Email`}
          name={"email"}
        />
        <button
          className="block w-full bg-[#1E1E1E] hover:bg-slate-800 py-4 rounded-lg text-white font-semibold mb-2 shadow-md"
          onClick={() => handleSubmit()}
        >
          Send Recovery Email
        </button>
        <Link
          className="flex flex-row justify-center items-center"
          to={"/auth/login"}
        >
          <span>Back to Login</span>
        </Link>
      </div>
    </>
  );
}
