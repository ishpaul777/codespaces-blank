import { useEffect } from "react";
import Card from "../components/card";
import Layout from "../components/layout/layout";
import { useSidebarContext } from "../components/SidebarContext";

export default function Home() {
  const sideBarContext = useSidebarContext();

  useEffect(() => {
    sideBarContext?.setSidebarVisibility(true);
  }, []);
  return (
    <div className={`m-12 flex flex-col gap-y-4`}>
      <h2 className={`text-4xl`}>Dashboard</h2>
      <div className={`flex gap-8 mt-8`}>
        <Card
          title={"Text Generation"}
          link={"/text/completion"}
          desciption={
            "You input some text as a prompt, and the application will generate a text completion that attempts to match whatever context or pattern you gave it."
          }
        />
        <Card
          title={"Text Edit"}
          link={"/text/edit"}
          desciption={
            " You provide some text and an instruction for how to modify it, the application will attempt to edit it accordingly."
          }
        />
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
