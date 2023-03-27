import Link from "next/link";
import { CreateButton } from "../../components/buttons/CreateButton";
import Layout from "../../components/layout/layout";
import Search from "../../components/search";
import { Sidebar } from "../../components/Sidebar";

export default function Documents() {
  return (
    // this is the main page container
    <div className="my-16 mx-10">
      {/* This is the page header */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-3xl font-medium">Documents</h2>

        <div className="flex flex-row w-1/2 items-center gap-4">
          <Search placeholder={"search documents"} />
          {/* create document button */}
          <Link href="/documents/create">
            <CreateButton text={"Create Document"} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// returning the sidebar layout with the documents component
Documents.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
