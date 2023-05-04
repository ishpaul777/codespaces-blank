import Layout from "../components/layout/layout";
import { HomePage } from "../pages";
import ChatPage from "../pages/chats/dashboard";
import TempChatPage from "../pages/chats/tempDashboard";
import DocumentPage from "../pages/documents";
import Document from "../pages/documents/create";
import ImagePage from "../pages/images";
import History from "../pages/history/history";
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
      {
        path: "/history",
        element: <History />,
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
    path: "/chats/temp",
    element: <TempChatPage />,
  },
];
