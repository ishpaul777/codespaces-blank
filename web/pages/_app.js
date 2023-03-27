import "../styles/globals.css";
import { Inter } from "@next/font/google";
import { SidebarContext } from "../components/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SidebarContext>
      <div
        className={`app-container  
    ${inter.className}
    `}
      >
        {getLayout(<Component {...pageProps} />)}
      </div>
    </SidebarContext>
  );
}
