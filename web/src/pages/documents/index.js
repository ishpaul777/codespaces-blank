import { Link } from "react-router-dom";
import { CreateButton } from "../../components/buttons/CreateButton";
import Search from "../../components/search";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import { getDocuments } from "../../actions/text";
import moment from "moment";
import { errorToast } from "../../util/toasts";
export default function DocumentPage() {
  const [documentPageData, setDocumentPageData] = useState({
    count: 0,
    data: [],
  });

  const tableHeader = [
    {
      name: "Name",
      width: "w-1/4",
    },
    {
      name: "Created By",
      width: "w-1/4",
    },
    {
      name: "Last Modified",
      width: "w-1/4",
    },
    {
      name: "Actions",
      width: "w-1/4",
    },
  ];

  useEffect(() => {
    getDocuments()
      .then((response) => {
        setDocumentPageData({
          count: response.count,
          data: response.documents,
        });
      })
      .catch((error) => {
        errorToast(error?.message);
      });
  }, []);

  let values = [
    {
      name: "Document 1",
      createdBy: "John Doe",
      lastModified: "2021-10-10",
    },
  ];

  const tableStyles = {
    valuesPadding: "px-4 py-6",
    headerPadding: "p-4",
  };

  return (
    // this is the main page container
    <div className="my-16 mx-10">
      {/* This is the page header */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-3xl font-medium">Documents</h2>

        <div className="flex flex-row w-1/2 items-center gap-2">
          <Search placeholder={"search documents"} />
          {/* create document button */}
          <Link to="/documents/create">
            <CreateButton text={"Create Document"} />
          </Link>
        </div>
      </div>
      {/* This is the page body */}
      <div className="mt-6">
        <table className="w-full">
          {tableHeader.map((header, index) => {
            return (
              <th
                key={index}
                className={`${header.width} ${tableStyles.headerPadding} text-sm bg-background-sidebar font-medium text-text-primary text-left rounded-t-lg text-table-text`}
              >
                {header.name}
              </th>
            );
          })}
          <tbody className={`w-full`}>
            {documentPageData.data.map((value, index) => {
              return (
                <tr
                  className="w-full border-y border-border-primary"
                  key={index}
                >
                  <td
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black`}
                  >
                    {value.title}
                  </td>
                  <td
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black`}
                  >
                    {value?.createdBy || "John Doe"}
                  </td>
                  <td
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black`}
                  >
                    {moment(value.updated_at).format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                  <td
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black flex items-center gap-2`}
                  >
                    <button className="flex gap-2 text-[#6495ED] border border-[#6495ED] bg-white p-2 rounded-md">
                      <AiOutlineEdit className="text-base" color="#6495ED" />
                      <span>Edit</span>
                    </button>
                    <button className="flex gap-2 text-[#DC143C] border border-[#DC143C] bg-white p-2 rounded-md">
                      <AiOutlineDelete className="text-base" color="#DC143C" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
