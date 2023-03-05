import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";
const Card = ({ title, desciption, link }) => {
  return (
    <div className={`max-w-sm p-6 border border-gray-200 rounded-lg shadow-md`}>
      <h5 className={`mb-2 text-2xl  text-gray-900`}>{title}</h5>
      <p className={`mb-3 font-normal text-gray-700`}>{desciption}</p>
      <Link href={link || ""}>
        <button
          type="button"
          className={`text-white text-center flex items-center gap-x-1 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm pt-2 pb-2 pr-4 pl-4`}
        >
          <p className={`text-base`}>Try it out</p>
          <HiArrowLongRight className={`text-base`} />
        </button>
      </Link>
    </div>
  );
};

export default Card;
