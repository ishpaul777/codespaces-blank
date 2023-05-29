import { HashLoader } from "react-spinners";

export default function CentralLoading() {
  return (
    <div className={`w-[100vw] h-[100vh] flex justify-center items-center`}>
      <HashLoader color="#667085" size={100} />
    </div>
  );
}
