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
import Personas from "../pages/personas";
import CreatePersona from "../pages/personas/create";
import EditPersona from "../pages/personas/edit";
import { PersonaChat } from "../pages/personas/chat";
import FactcheckWorkflow from "../pages/workflow/factcheck";
import { Workflow } from "../pages/workflow";
import BlogPostWorkflow from "../pages/workflow/blog-post";
import { PersonaSachChat } from "../pages/personas/sach";

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
        path: "/personas",
        element: <Personas />,
      },
      {
        path: "/personas/create",
        element: <CreatePersona />,
      },
      {
        path: "/personas/:id/edit",
        element: <EditPersona />,
      },
      {
        path: "/workflows",
        element: <Workflow />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutAlt />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      { path: "/history", element: <History /> },
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
    path: "personas/:id/chat",
    element: <PersonaChat />,
  },
  {
    path: "personas/factly/sach/chat",
    element: <PersonaSachChat />,
  },
  {
    path: "/playground",
    element: <Playground />,
  },
  {
    path: "/compare",
    element: <Compare />,
  },
  {
    path: "/workflows/fact-check",
    element: <FactcheckWorkflow />,
  },
  {
    path: "/workflows/blogpost",
    element: <BlogPostWorkflow />,
  },
];
