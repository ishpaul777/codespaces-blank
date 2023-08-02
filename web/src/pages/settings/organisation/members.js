import { useSelector } from "react-redux";
import Wrapper from "../../../components/layout/wrapper";
import { Link } from "react-router-dom";

function OrgMembers() {
  let tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "w-1/4",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "w-1/4",
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "w-1/4",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "w-1/4",
    },
  ];

  const tableStyles = {
    valuesPadding: "px-4 py-6",
    headerPadding: "p-4",
  };

  const { users } = useSelector(({ organisations }) => {
    let selectedOrg = organisations?.details?.find(
      (org) => org?.id === organisations?.selectedOrg
    );

    return {
      users: selectedOrg?.organisation_users?.map((user) => ({
        name: user?.user?.first_name + " " + user?.user?.last_name,
        email: user?.user?.email,
        role: user?.role,
      })),
    };
  });

  return (
    <Wrapper>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl text-[#1e1e1e] font-semibold">Members</span>
          <Link to={"/org/members/invite"}>
            <button className="py-2 px-4 bg-black text-white rounded-md">
              Invite members
            </button>
          </Link>
        </div>
        <table className="border-collapse">
          <thead>
            {tableColumns.map((column, index) => {
              return (
                <th
                  key={index}
                  className={`bg-background-sidebar text-sm font-medium rounded-t-md text-text-primary text-left p-4 ${column.width} ${tableStyles.headerPadding}`}
                >
                  {column.title}
                </th>
              );
            })}
          </thead>
          <tbody>
            {users?.map((user, index) => {
              return (
                <tr
                  key={index}
                  className={`border-b border-[#eaeaea] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                  }`}
                >
                  {tableColumns.map((column, index) => {
                    return (
                      <>
                        {column.dataIndex === "actions" ? (
                          <td
                            className={`flex items-center ${tableStyles.valuesPadding}`}
                          >
                            <button
                              className={`p-2 rounded-md bg-border-secondary hover:bg-red-500 hover:text-white`}
                            >
                              Remove
                            </button>
                          </td>
                        ) : (
                          <td
                            key={index}
                            className={`text-sm font-normal text-text-secondary ${column.width} ${tableStyles.valuesPadding}`}
                          >
                            {column.dataIndex === "name"
                              ? user[column.dataIndex] === " "
                                ? "---"
                                : user[column.dataIndex]
                              : user[column.dataIndex]}
                          </td>
                        )}
                      </>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}

export default OrgMembers;
