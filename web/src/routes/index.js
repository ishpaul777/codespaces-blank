import Layout from "../components/layout/layout";
import { HomePage } from "../pages";
import DocumentPage from "../pages/documents";
import Document from "../pages/documents/create";
import ImagePage from "../pages/images";

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
    path: "/documents/create",
    element: <Document />,
  },
];
