import Layout from "../components/layout/layout";
import LayoutAlt from "../components/layout/layoutAlt";
import { HomePage } from "../pages";
import ChatPage from "../pages/chats/dashboard";
import DocumentPage from "../pages/documents";
import Document from "../pages/documents/create";
import ImagePage from "../pages/images";
import History from "../pages/history/history";
import Playground from "../pages/natdev/Playground";
import Compare from "../pages/natdev/Compare";
import Personas from "../pages/personas";
import CreatePersona from "../pages/personas/create";
import { PersonaChat } from "../pages/personas/chat";
import FactcheckWorkflow from "../pages/workflow/factcheck";
import { Workflow } from "../pages/workflow";
import BlogPostWorkflow from "../pages/workflow/blog-post";
import { PersonaSachChat } from "../pages/personas/sach";
import Usage from "../pages/usage";
import Profile from "../pages/settings/profile";
import SettingsOrganisation from "../pages/settings/organisation";
import OrgMembers from "../pages/settings/organisation/members";
import InviteMembers from "../pages/settings/organisation/inviteMembers";
import Invitations from "../pages/settings/profile/invitations";
import Login from "../pages/auth/login";
import AuthLayout from "../pages/auth/authlayout";
import Signup from "../pages/auth/signup";

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
        path: "/history",
        element: <History />,
      },
      {
        path: "/usage",
        element: <Usage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/org",
        element: <SettingsOrganisation />,
      },
      {
        path: "/org/members",
        element: <OrgMembers />,
      },
      {
        path: "/org/members/invite",
        element: <InviteMembers />,
      },
      {
        path: "/profile/invitations",
        element: <Invitations />,
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
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login title="Welcome Back! Sign in" />,
      },
      {
        path: "/auth/signup",
        element: <Signup title="Welcome! Sign up" />,
      },
    ],
  },
];
