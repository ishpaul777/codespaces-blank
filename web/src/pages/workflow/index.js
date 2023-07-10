import { Link } from "react-router-dom";
import BlogPost from "../../assets/blogpost.svg";
import Factcheck from "../../assets/factcheck.svg";
import { BsArrowRightShort } from "react-icons/bs";

export const Workflow = () => {
  const menuOptions = [
    {
      title: "Write a blog post",
      description:
        "Unlock the truth with our expert Script Writer Bot. Crafted for accuracy and engagement, it delves into various topics, exposing misinformation.",
      image: BlogPost,
      link: "/workflows/blogpost",
    },
    {
      title: "Write a fact check",
      description:
        "Introducing our Fact Check Article Writer Chatbot, your go-to companion for crafting meticulously researched and reliable fact-check articles.",
      image: Factcheck,
      link: "/workflows/fact-check",
    },
  ];

  return (
    <div className="my-16 mx-10">
      <div className="flex flex-row justify-between  items-center ">
        <h2 className="text-3xl mt-8 md:mt-0 font-medium dark:text-white">Workflows</h2>
      </div>
      <div className="w-full grid grid-cols-1 lg:mt-12 mt-8 gap-4 sm:grid-cols-2">
        {menuOptions.map((option) => (
          <Link
            to={option.link}
            className="p-4 cursor-pointer flex flex-col md:flex-row gap-4 transition-all focus:ring-gray-400 focus:shadow-xl duration-150 rounded-lg shadow-sm hover:shadow-lg relative hover:ring-gray-300 hover:ring-2 ring-1 ring-gray-200  bg-white dark:bg-background-sidebar-alt dark:text-white dark:ring-background-secondary-alt"
          >
             <img
              className="md:w-48 w-full h-full"
              src={option.image}
              alt={option.title}
            />
            <div className="flex gap-2 flex-col">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                {option.title}
              </h3>
              <p className="text-gray-500 flex-1 line-clamp-6 text-base dark:text-gray-200">
                {option.description}
              </p>
              <BsArrowRightShort className="w-8 h-8 text-gray-700 ml-auto dark:text-white" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
