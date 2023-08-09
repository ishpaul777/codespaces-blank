import { useEffect, useState } from "react";
import { Input } from "../../components/inputs/Input";
import { isEmail } from "../../util/validateRegex";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMsgByCode } from "../../util/authError";

export function Verification({ title }) {
  const [ui, setUI] = useState({});
  const [state, setState] = useState("choose_method");
  const [emailError, setEmailError] = useState("");
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [codeOrEmail, setcodeOrEmail] = useState("");

  let navigate = useNavigate();

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
        "/self-service/verification/browser?return_to=" +
        returnTo;
    } else {
      selfServiceURL =
        window.REACT_APP_KRATOS_PUBLIC_URL +
        "/self-service/verification/browser";
    }

    if (!obj["flow"]) {
      window.location.href = selfServiceURL;
    } else {
      fetch(
        window.REACT_APP_KRATOS_PUBLIC_URL +
          "/self-service/verification/flows" +
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
          setState(res?.state);
          if (
            res?.ui?.nodes?.filter((node) => node.group === "code")?.length ===
            4
          ) {
            setIsResendVisible(true);
          }
          if (
            res?.ui?.nodes?.[0]?.attributes?.value &&
            res?.ui?.nodes?.[0]?.attributes?.name === "code"
          ) {
            setcodeOrEmail(res?.ui?.nodes?.[0]?.attributes?.value);
          }
          if (res && res.state === "passed_challenge") {
            setTimeout(() => {
              navigate("/auth/login");
            }, 1000);
          }
        })
        .catch(() => {
          window.location.href =
            window.REACT_APP_KRATOS_PUBLIC_URL +
            "/self-service/verification/browser";
        });
    }
  }, []);

  const handleSubmit = () => {
    if (state === "choose_method") {
      withEmail();
    } else {
      withCode();
    }
  };

  const handleChange = (e) => {
    setcodeOrEmail(e.target.value);
    if (e.target.name === "email") {
      if (e.target.value?.length === 0) {
        setEmailError(`${e.target.name} is required`);
        return;
      } else {
        setEmailError("");
      }

      if (!isEmail(e.target.value)) {
        setEmailError("Please enter a valid email address");
        return;
      } else {
        setEmailError("");
      }
    } else {
      if (e.target.value?.length !== 6) {
        setEmailError(`verification code should be 6 digits`);
      } else {
        setEmailError("");
      }
    }
  };

  const resendVerificationCode = () => {
    var email = "";

    // the node count which belongs to group code will be 4 only if it has an email to resend the verification email in the body
    if (ui?.nodes?.filter((node) => node.group === "code")?.length === 4) {
      email = ui?.nodes?.filter((node) => node.group === "code")?.[3]
        ?.attributes.value;
    }

    // this if block validates whether the ui node has email or not. if the email is not there it triggers a error notification that verification code cannot be resent
    if (email === "" || email === undefined) {
      // TODO: add error notification
      return;
    } else {
      withEmail();
    }
  };

  // withCode is a handler for verifying the verification code
  const withCode = () => {
    var verifyAccountUsingCodeForm = document.createElement("form");
    verifyAccountUsingCodeForm.action = ui.action;
    verifyAccountUsingCodeForm.method = ui.method;
    verifyAccountUsingCodeForm.style.display = "none";

    var codeInput = document.createElement("input");
    codeInput.name = "code";
    codeInput.value = codeOrEmail;

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
    methodInput.value = "code";

    verifyAccountUsingCodeForm.appendChild(codeInput);
    verifyAccountUsingCodeForm.appendChild(csrfInput);
    verifyAccountUsingCodeForm.appendChild(methodInput);
    document.body.appendChild(verifyAccountUsingCodeForm);
    verifyAccountUsingCodeForm.submit();
  };

  const withEmail = () => {
    var sendVerificationCodeToEmailForm = document.createElement("form");
    sendVerificationCodeToEmailForm.action = ui.action;
    sendVerificationCodeToEmailForm.method = ui.method;
    sendVerificationCodeToEmailForm.style.display = "none";

    var emailInput = document.createElement("input");
    emailInput.name = "email";
    emailInput.value = codeOrEmail;

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
    methodInput.value = "code";

    sendVerificationCodeToEmailForm.appendChild(emailInput);
    sendVerificationCodeToEmailForm.appendChild(csrfInput);
    sendVerificationCodeToEmailForm.appendChild(methodInput);
    document.body.appendChild(sendVerificationCodeToEmailForm);
    sendVerificationCodeToEmailForm.submit();
  };

  return (
    <>
      <h1 className="text-center text-3xl font-semibold">{title}</h1>
      {(state === "sent_email" || state === "passed_challenge") &&
        ui?.messages?.[0]?.text && (
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
          label={state === "choose_method" ? "Email" : "Verification Code"}
          type={"input"}
          onChange={handleChange}
          initialValue={codeOrEmail}
          error={emailError}
          backgroundColor="white"
          placeholder={`Enter your ${
            state === "choose_method" ? "email" : "code"
          }`}
          name={state === "choose_method" ? "email" : "code"}
        />
        <button
          className="block w-full bg-[#1E1E1E] hover:bg-slate-800 py-4 rounded-lg text-white font-semibold mb-2 shadow-md"
          onClick={(e) => {
            e.preventDefault();
            if (codeOrEmail === "") {
              setEmailError("Please enter your email");
            } else if (emailError !== "") {
              setEmailError("Please enter a valid email");
            } else {
              handleSubmit();
            }
          }}
        >
          {state === "choose_method" ? "Verify Your Email" : "Submit"}
        </button>
        <Link
          className="flex flex-row justify-center items-center"
          to={"/auth/login"}
        >
          <span>Back to Login</span>
        </Link>
        {isResendVisible && (
          <button className="social-sign-in" onClick={resendVerificationCode}>
            Resend Verification Code
          </button>
        )}
      </div>
    </>
  );
}
