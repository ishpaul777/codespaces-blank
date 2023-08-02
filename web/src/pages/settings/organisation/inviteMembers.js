import { BsChevronLeft } from "react-icons/bs";
import Wrapper from "../../../components/layout/wrapper";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { Input } from "../../../components/inputs/Input";
import { useState } from "react";
import { isEmail } from "../../../util/validateRegex";
import { sendInvites } from "../../../actions/organisation";
import { useSelector } from "react-redux";
import { errorToast, successToast } from "../../../util/toasts";
import SelectInput from "../../../components/inputs/select";

function InviteMembers() {
  const iconStyling = {
    size: 16,
    color: "#1e1e1e",
  };

  const { selectedOrgID } = useSelector(({ organisations }) => {
    return {
      selectedOrgID: organisations?.selectedOrg,
    };
  });

  const formOptions = ["Email", "First name", "Last name", "Role"];

  let initialFormState = {
    email: {
      value: "",
      error: "",
    },
    firstName: {
      value: "",
      error: "",
    },
    lastName: {
      value: "",
      error: "",
    },
    role: {
      value: "",
      error: "",
    },
  };

  const [form, setForm] = useState([initialFormState]);

  const handleAddForm = () => {
    setForm([
      ...form,
      {
        email: {
          value: "",
          error: "",
        },
        firstName: {
          value: "",
          error: "",
        },
        lastName: {
          value: "",
          error: "",
        },
        role: {
          value: "",
          error: "",
        },
      },
    ]);
  };

  const validateForm = () => {
    let error = false;
    let newForm = [...form];
    form.forEach((formItem, index) => {
      if (!formItem.email.value) {
        newForm[index].email.error = "Email is required";
        error = true;
      } else {
        if (!isEmail(formItem.email.value)) {
          newForm[index].email.error = "Invalid email format";
          error = true;
        }
      }

      if (!formItem.firstName.value) {
        newForm[index].firstName.error = "First name is required";
        error = true;
      }
      if (!formItem.lastName.value) {
        newForm[index].lastName.error = "Last name is required";
        error = true;
      }
      if (!formItem.role.value) {
        newForm[index].role.error = "Role is required";
        error = true;
      }
    });

    setForm(newForm);
    return error;
  };

  const handleInvite = () => {
    if (validateForm()) {
      return;
    }

    let payload = [];

    form.forEach((formItem) => {
      payload.push({
        email: formItem.email.value,
        first_name: formItem.firstName.value,
        last_name: formItem.lastName.value,
        role: formItem.role.value,
      });
    });

    sendInvites(selectedOrgID, payload, window.location.hostname)
      .then(() => {
        successToast("Invites sent successfully");
        setForm([initialFormState]);
      })
      .catch(() => {
        errorToast("Error sending invites");
      });
  };

  return (
    <Wrapper>
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-center">
          <Link to="/org/members">
            <BsChevronLeft {...iconStyling} cursor={"pointer"} />
          </Link>
          <span className="text-2xl text-[#1e1e1e] font-semibold">
            Invite members
          </span>
        </div>
        <div className={`flex flex-col gap-4`}>
          <div className="grid grid-cols-[9fr_1fr]">
            <div className="w-full grid grid-cols-4 gap-2">
              {formOptions.map((option) => (
                <span className="text-base">{option}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[9fr_1fr] items-center gap-2">
            {form.map((formItem, index) => (
              <>
                <div className="w-full grid grid-cols-4 gap-2 z-10">
                  <Input
                    showLabel={false}
                    placeholder={"Enter email"}
                    type={"input"}
                    onChange={(e) => {
                      let temp = [...form];
                      if (e.target.value) {
                        temp[index].email.value = e.target.value;
                        temp[index].email.error = "";
                      } else {
                        temp[index].email.value = "";
                        temp[index].email.error = "Email is required";
                      }
                      setForm(temp);
                    }}
                    initialValue={formItem.email.value}
                    error={formItem.email.error}
                  ></Input>
                  <Input
                    showLabel={false}
                    placeholder={"Enter first name"}
                    type={"input"}
                    onChange={(e) => {
                      let temp = [...form];
                      if (e.target.value) {
                        temp[index].firstName.value = e.target.value;
                        temp[index].firstName.error = "";
                      } else {
                        temp[index].firstName.value = "";
                        temp[index].firstName.error = "First name is required";
                      }
                      setForm(temp);
                    }}
                    initialValue={formItem.firstName.value}
                    error={formItem.firstName.error}
                  ></Input>
                  <Input
                    showLabel={false}
                    placeholder={"Enter last name"}
                    type={"input"}
                    onChange={(e) => {
                      let temp = [...form];
                      if (e.target.value) {
                        temp[index].lastName.value = e.target.value;
                        temp[index].lastName.error = "";
                      } else {
                        temp[index].lastName.value = "";
                        temp[index].lastName.error = "Last name is required";
                      }
                      setForm(temp);
                    }}
                    initialValue={formItem.lastName.value}
                    error={formItem.lastName.error}
                  ></Input>
                  <SelectInput
                    value={formItem.role.value}
                    error={formItem.role.error}
                    placeholder={"Select role"}
                    listOptions={[
                      {
                        value: "admin",
                        label: "Admin",
                      },
                      {
                        value: "member",
                        label: "Member",
                      },
                    ]}
                    index={index}
                    onChange={(value) => {
                      let temp = [...form];
                      if (value) {
                        temp[index].role.value = value;
                        temp[index].role.error = "";
                      } else {
                        temp[index].role.value = "";
                        temp[index].role.error = "Role is required";
                      }
                      setForm(temp);
                    }}
                  />
                  {/* <SelectInput
                    value={formItem.role.value}
                    error={formItem.role.error}
                    placeholder={"Select role"}
                    listOptions={[
                      {
                        value: "admin",
                        label: "Admin",
                      },
                      {
                        value: "member",
                        label: "Member",
                      },
                    ]}
                    index={index}
                    onChange={(value) => {
                      let temp = [...form];
                      if (value) {
                        temp[index].role.value = value;
                        temp[index].role.error = "";
                      } else {
                        temp[index].role.value = "";
                        temp[index].role.error = "Role is required";
                      }
                      setForm(temp);
                    }}
                  /> */}
                  {/* <Input
                    showLabel={false}
                    placeholder={"Enter role"}
                    type={"input"}
                    onChange={() => {}}
                  ></Input> */}
                </div>
                {index !== 0 ? (
                  <RxCross2
                    size={20}
                    color={"#1e1e1e"}
                    cursor={"pointer"}
                    onClick={() => {
                      let temp = [...form];
                      temp.splice(index, 1);
                      setForm(temp);
                    }}
                  ></RxCross2>
                ) : (
                  <div></div>
                )}
              </>
            ))}
          </div>
          <div className="w-full flex items-center gap-4">
            <button
              className="py-2 px-4 bg-black text-white rounded-md"
              onClick={handleAddForm}
            >
              Add
            </button>
            <button
              className="py-2 px-4 bg-black text-white rounded-md"
              onClick={handleInvite}
            >
              Invite
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default InviteMembers;
