import Layout from "../components/layout/layout";
import LayoutAlt from "../components/layout/layoutAlt";
import { HomePage } from "../pages";
import ChatPage from "../pages/chats/dashboard";
import DocumentPage from "../pages/documents";
import Profile from "../pages/profile-settings/profile";
import Document from "../pages/documents/create";
import ImagePage from "../pages/images";
import History from "../pages/history/history";
import Playground from "../pages/natdev/Playground";
import Compare from "../pages/natdev/Compare";
export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/documents",
        element: <DocumentPage />,
      },
      {
        path: "*",
        element: <>error</>,
      },
      {
        path: "/images",
        element: <ImagePage />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutAlt />,
    children: [
      { 
        path: "/profile",
        element: <Profile /> 
      },
      { path: "/history",
        element: <History />
      },
    ],
  },
  {
    path: "/documents/create",
    element: <Document />,
  },
  {
    path: "/chats/dashboard",
    element: <ChatPage />,
  },
  {
    path: "/playground",
    element: <Playground />,
  },
  {
    path: "/compare",
    element: <Compare />,
  },
];
