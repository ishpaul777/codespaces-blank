import { useEffect, useState } from "react";
import { MdImage, MdOutlineFactCheck } from "react-icons/md";
import { Link } from "react-router-dom";
import { getDefaultPersona } from "../actions/persona";
import { errorToast } from "../util/toasts";
import { SlSocialInstagram } from "react-icons/sl";
import { SiChatbot } from "react-icons/si";
import { TfiWrite } from "react-icons/tfi";
import { RxAvatar } from "react-icons/rx";
export function HomePage() {
  const iconColor = "#AC94FA";

  const [defaultPersonas, setDefaultPersonas] = useState([]);
  const menuOptions = [
    {
      title: "Explore the universe with our Chatbot",
      description:
        "Discover the wonders of AI chatbots with our versatile multipurpose companion. Engage in captivating conversations that offer assistance, insights, and entertainment, opening up a world of immersive experiences.",
      icon: <SiChatbot className="text-5xl" color={iconColor} />,
      link: "/chats/dashboard",
    },
    {
      title: "Generate an Image",
      description:
        "Unleash Your Imagination with AI-Powered Image Generation: Create stunning, high-quality images effortlessly and explore endless visual possibilities",
      icon: <MdImage className="text-5xl" color={iconColor} />,
      link: "/images",
    },
    {
      title: "Chat with a factcheck expert",
      description:
        "Introducing our FactCheck Article Writer Chatbot, your go-to companion for crafting meticulously researched and reliable fact-check articles. Seamlessly collaborate with an AI-powered chatbot designed to enhance your writing process and ensure your content is backed by verifiable facts",
      icon: <MdOutlineFactCheck className="text-5xl" color={iconColor} />,
      link:
        defaultPersonas.length > 0
          ? `/personas/${
              defaultPersonas?.find(
                (persona) => persona.slug === "factcheck-writer"
              )?.id
            }/chat`
          : "/",
    },
    {
      title: "Connect with a Social Media Content Creator Expert",
      description:
        "Unleash your social media content potential with our expert bot! Connect and chat with our Social Media Content Creator Expert Bot for valuable insights and guidance. Elevate your content game and achieve social media success like never before.",
      icon: <SlSocialInstagram className="text-5xl" color={iconColor} />,
      link:
        defaultPersonas.length > 0
          ? `/personas/${
              defaultPersonas?.find(
                (persona) => persona.slug === "social-media-content-creator"
              )?.id
            }/chat`
          : "/",
    },
    {
      title: "Connect with the expert script writer",
      description:
        "Unlock the truth with our expert Script Writer Bot. Crafted for accuracy and engagement, it delves into various topics, exposing misinformation. Educate, inform, and empower your audience with compelling scripts tailored to their chosen topic and desired tone.",
      icon: <TfiWrite className="text-5xl" color={iconColor} />,
      link:
        defaultPersonas.length > 0
          ? `/personas/${
              defaultPersonas?.find(
                (persona) => persona.slug === "script-writer"
              )?.id
            }/chat`
          : "/",
    },
    {
      title: "Create Your Own Custom Persona and Chat Away!",
      description:
        "Unleash your creativity and build a personalized chat persona that reflects your unique style. Dive into the world of customized conversations by creating your own persona and engage in captivating chats tailored to your preferences. Click the card to embark on a journey of self-expression and enjoy meaningful interactions with your very own custom chat persona.",
      icon: <RxAvatar className="text-5xl" color={iconColor} />,
      link: "/personas/create",
    },
  ];

  useEffect(() => {
    getDefaultPersona()
      .then((response) => {
        setDefaultPersonas(response?.personas);
      })
      .catch((error) => {
        errorToast("Something went wrong! Please try again later.");
      })
      .finally(() => {});
  }, []);

  return (
    <div className="my-16 mx-10 ">
      <div className="flex flex-row md:justify-between justify-center items-center p-5 ">
        <h2 className="text-3xl font-medium">Dashboard</h2>
      </div>
      <div className="w-full grid grid-cols-1 mt-12 gap-4 sm:grid-cols-2">
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
