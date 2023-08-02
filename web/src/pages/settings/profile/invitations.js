import { useEffect, useState } from "react";
import Wrapper from "../../../components/layout/wrapper";
import {
  acceptInvitation,
  getInvitations,
  rejectInvitation,
} from "../../../actions/profile";
import { errorToast, successToast } from "../../../util/toasts";

function Invitations() {
  let tableColumns = [
    {
      title: "Organisation",
      dataIndex: "organisation",
      width: "w-1/4",
    },
    {
      title: "Invited By",
      dataIndex: "invited_by",
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

  const [invitations, setInvitations] = useState([]);

  const fetchInvitations = async () => {
    getInvitations()
      .then((res) => {
        setInvitations(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = (inviteID, data) => {
    acceptInvitation(inviteID, data)
      .then(() => {
        successToast("Invitation accepted successfully");
        fetchInvitations();
      })
      .catch(() => {
        errorToast("Unable to accept invitation");
      });
  };

  const handleReject = async (inviteID) => {
    rejectInvitation(inviteID)
      .then(() => {
        successToast("Invitation rejected successfully");
        fetchInvitations();
      })
      .catch(() => {
        errorToast("Unable to reject invitation");
      });
  };

  return (
    <Wrapper>
      <div className="flex flex-col gap-6">
        <span className="text-2xl text-[#1e1e1e] font-semibold">
          Invitations
        </span>
        <table className="border-collapse">
          <thead>
            {tableColumns.map((column, index) => (
              <th
                key={index}
                className={`bg-background-sidebar text-sm font-medium rounded-t-md text-text-primary text-left p-4 ${column.width} ${tableStyles.headerPadding}`}
              >
                {column.title}
              </th>
            ))}
          </thead>
          <tbody>
            {invitations?.map((invitation, index) => (
              <tr
                key={index}
                className={`border-b border-[#eaeaea] ${
                  index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                }`}
              >
                <td
                  key={index}
                  className={`text-sm font-normal text-text-secondary ${tableColumns[index].width} ${tableStyles.valuesPadding}`}
                >
                  {invitation.organisation?.title}
                </td>
                <td
                  key={index}
                  className={`text-sm font-normal text-text-secondary ${tableColumns[index].width} ${tableStyles.valuesPadding}`}
                >
                  {invitation.invited_by?.display_name}
                </td>
                <td
                  key={index}
                  className={`text-sm font-normal text-text-secondary ${tableColumns[index].width} ${tableStyles.valuesPadding}`}
                >
                  {invitation.role}
                </td>
                <td
                  className={`flex items-center ${tableStyles.valuesPadding} gap-4 `}
                >
                  <button
                    className={`p-2 rounded-md bg-border-secondary hover:bg-[#d0d1d6]`}
                    onClick={() =>
                      handleAccept(invitation.id, {
                        role: invitation.role,
                        organisation_id: invitation.organisation.id,
                        inviter_id: invitation.invited_by.id,
                      })
                    }
                  >
                    Accept
                  </button>
                  <button
                    className={`p-2 rounded-md bg-border-secondary hover:bg-red-500 hover:text-white`}
                    onClick={() => handleReject(invitation.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}

export default Invitations;
