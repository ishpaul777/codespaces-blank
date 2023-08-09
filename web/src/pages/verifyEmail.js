import animationData from "../assets/lottiefiles/email-sent.json";
import Lottie from "react-lottie";
import { Link } from "react-router-dom";

export function VerifyEmail() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center align-center gap-4">
      <div className="w-full flex flex-col justify-center">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
          }}
          height={600}
          width={600}
        />
      </div>
      <h1 className="text-center text-3xl font-semibold">Verify your email</h1>
      <p className="text-center text-gray-500">
        We have sent you an email with a link to verify your account.
      </p>
      <Link
        to={"/auth/login"}
        className="w-full flex justify-center text-blue-500 text-lg"
      >
        Go to Login
      </Link>
    </div>
  );
}
