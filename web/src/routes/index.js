import Layout from "../components/layout/layout";
import { HomePage } from "../pages";
import DocumentPage from "../pages/documents";
import Document from "../pages/documents/create";

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
    ],
  },
  {
    path: "/documents/create",
    element: <Document />,
  },
];
