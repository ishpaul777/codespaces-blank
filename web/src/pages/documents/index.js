import { Link } from "react-router-dom";
import { CreateButton } from "../../components/buttons/CreateButton";
import Search from "../../components/search";

export default function DocumentPage() {
  return (
    // this is the main page container
    <div className="my-16 mx-10">
      {/* This is the page header */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-3xl font-medium">Documents</h2>

        <div className="flex flex-row w-1/2 items-center gap-4">
          <Search placeholder={"search documents"} />
          {/* create document button */}
          <Link to="/documents/create">
            <CreateButton text={"Create Document"} />
          </Link>
        </div>
      </div>
    </div>
  );
}
