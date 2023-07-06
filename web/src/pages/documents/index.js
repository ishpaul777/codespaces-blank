import { Link, useNavigate } from "react-router-dom";
import { CreateButton } from "../../components/buttons/CreateButton";
import Search from "../../components/search";
// import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Modal from "../../components/Modal";
import { useEffect, useState } from "react";
import { deleteDocument, getDocuments } from "../../actions/text";
import moment from "moment";
import { errorToast, successToast } from "../../util/toasts";
import { getKratosSessionDetails } from "../../actions/kratos";
import useWindowSize from "../../hooks/useWindowSize";
export default function DocumentPage() {
  const [documentPageData, setDocumentPageData] = useState({
    count: 0,
    data: [],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    search_query: "",
  });

  let navigate = useNavigate();
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

  const fetchDocuments = async () => {
    getDocuments(pagination.limit, pagination.page, pagination.search_query)
      .then((response) => {
        setDocumentPageData({
          count: response.count,
          data: response.documents,
        });
      })
      .catch((error) => {
        errorToast(error?.message);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, [pagination.limit, pagination.page]);

  useEffect(() => {
    let timer = setTimeout(() => {
      setPagination({
        ...pagination,
        page: 1,
      });
      fetchDocuments();
    }, 500);
    return () => clearTimeout(timer);
  }, [pagination.search_query]);

  const tableStyles = {
    valuesPadding: "px-4 py-6",
    headerPadding: "p-4",
  };

  const [email, setEmail] = useState("");

  useEffect(() => {
    getKratosSessionDetails()
      .then((response) => {
        setEmail(response?.identity?.traits?.email);
      })
      .catch((error) => {
        errorToast(error?.message);
      });
  }, []);

  const handleDelete = (id) => {
    deleteDocument(id)
      .then(() => {
        if (documentPageData.data?.length === 1 && pagination.page !== 1) {
          setPagination({
            ...pagination,
            page: pagination.page - 1,
          });
        }
        fetchDocuments();
        successToast("Document deleted successfully");
      })
      .catch((error) => {
        errorToast(error?.message);
      });
  };
  const { isMobileScreen } = useWindowSize();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  return (
    // this is the main page container
    <div className="my-16 mx-10 min-w-[230px] ">
      {/* This is the page header */}
      <div className="flex flex-col  ">
        <div className="w-full flex flex-row  items-center justify-between gap-5 mt-8 md:mt-0">
          <div className="w-fit text-3xl font-medium ">Documents</div>
          <div
            className={`w-[50%]  flex flex-row justify-end gap-[3%] items-center`}
          >
            {!(window.innerWidth < 1000) && (
              <Search
                placeholder={"search documents"}
                onChange={(e) => {
                  setPagination({
                    ...pagination,
                    search_query: e.target.value,
                  });
                }}
              />
            )}

            {/* create document button */}

            <Link to="/documents/create">
              <CreateButton
                text={`${window.innerWidth < 420 ? "" : "Create Document"}`}
              />
            </Link>
          </div>
        </div>
        <div className="mt-5 flex justify-center items-center min-w-[230px] ">
          {window.innerWidth < 1000 && (
            <Search
              placeholder={"search documents"}
              onChange={(e) => {
                setPagination({
                  ...pagination,
                  search_query: e.target.value,
                });
              }}
            />
          )}
        </div>
      </div>
      {/* This is the page body */}
      <div className="mt-6 overflow-x-auto max-w-screen">
        <table className="w-full min-w-[700px]">
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
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black cursor-pointer`}
                    onClick={() => {
                      navigate(
                        `/documents/create?id=${value.id}&isEdit=true`
                      );
                    }}
                  >
                    {value.title}
                  </td>
                  <td
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black`}
                  >
                    {email}
                  </td>
                  <td
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black`}
                  >
                    {moment(value.updated_at).format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                  <td
                    className={`${tableStyles.valuesPadding} text-sm bg-white font-medium text-text-primary text-left rounded-t-lg text-black flex items-center gap-2`}
                  >
                    <div
                      className={`bg-background-secondary py-2 px-4 rounded-md cursor-pointer hover:bg-[#007BFF] hover:text-white`}
                      onClick={() => {
                        navigate(
                          `/documents/create?id=${value.id}&isEdit=true`
                        );
                      }}
                    >
                      Edit
                    </div>
                    <div
                      className={`bg-background-secondary py-2 px-4 rounded-md cursor-pointer hover:bg-[#FF0000] hover:text-white`}
                      onClick={() => {
                        setDeleteId(value.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false) }}
        closeButton={false}
      >
        <div className="text-left">
          <h3 className="text-xl font-medium mb-4 border-b pb-4 border-gray-300">Delete Document</h3>
          <div className="bg-red-100 p-4 text-[#FF0000] rounded-md mb-4 max-w-md font-semibold">
            Continuing with this action will delete the document permanently. Do you really want to delete the document?
          </div>
          <div className="flex justify-end w-full gap-4 border-t pt-4 border-gray-300">
            <div>
              <button className="bg-background-secondary hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId("");
                }}
              >
                Cancel
              </button>
            </div>
            <div>
              <button className="bg-[#FF0000] hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={() => {
                  handleDelete(deleteId);
                  setShowDeleteModal(false);
                  setDeleteId("");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {
        // this is the pagination
        documentPageData.count > pagination.limit && (
          <div
            className={`flex justify-between mt-6 ${pagination.page == 1 && "flex-row-reverse"
              }`}
          >
            {/* previous button */}
            {pagination.page > 1 && (
              <div
                className="bg-[#EDEDED] py-2 px-4 rounded-md cursor-pointer hover:scale-105"
                onClick={() => {
                  setPagination({
                    ...pagination,
                    page: pagination.page - 1,
                  });
                }}
              >
                Previous
              </div>
            )}
            {/* next button */}
            {documentPageData.data?.length >= pagination.limit &&
              pagination.page * pagination.limit < documentPageData.count && (
                <div
                  className="bg-[#EDEDED] py-2 px-4 rounded-md cursor-pointer hover:scale-105"
                  onClick={() => {
                    setPagination({
                      ...pagination,
                      page: pagination.page + 1,
                    });
                  }}
                >
                  Next
                </div>
              )}
          </div>
        )
      }
    </div>
  );
}
