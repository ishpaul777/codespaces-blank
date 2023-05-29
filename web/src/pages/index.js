import { MdImage, MdOutlineFactCheck } from "react-icons/md";
import { Link } from "react-router-dom";

export function HomePage() {
  const iconColor = "#AC94FA";

  const menuOptions = [
    {
      title: "Chat with a factcheck expert",
      description:
        "Introducing our FactCheck Article Writer Chatbot, your go-to companion for crafting meticulously researched and reliable fact-check articles. Seamlessly collaborate with an AI-powered chatbot designed to enhance your writing process and ensure your content is backed by verifiable facts",
      icon: <MdOutlineFactCheck className="text-5xl" color={iconColor} />,
      link: "",
    },
    {
      title: "Generate an Image",
      description:
        "Unleash Your Imagination with AI-Powered Image Generation: Create stunning, high-quality images effortlessly and explore endless visual possibilities",
      icon: <MdImage className="text-5xl" color={iconColor} />,
      link: "/images",
    },
  ];

  return (
    <div className="my-16 mx-10 ">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-3xl font-medium">Dashboard</h2>
      </div>
      <div className="w-full grid grid-cols-2 mt-12 gap-4">
        {menuOptions.map((option) => (
          <Link
            to={option.link}
            className="p-6 cursor-pointer flex flex-col gap-4 transition-all focus:ring-gray-400 focus:shadow-xl duration-150 rounded-2xl shadow-sm hover:shadow-lg hover:ring-gray-300 hover:ring-2 ring-1 ring-gray-200  bg-white"
          >
            {option.icon}
            <h3 class="mb-2 text-lg font-semibold text-gray-700">
              {option.title}
            </h3>
            <p className="text-gray-500 flex-1 line-clamp-6 text-base">
              {option.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
