import { RiShareBoxLine } from "react-icons/ri";
import UppyUploader from "../../components/Uppy";
import { useState } from "react";
import Modal from "../../components/Modal";
import { AiOutlineDelete } from "react-icons/ai";
import { isURL } from "../../util/validateRegex";
import { createPersona } from "../../actions/persona";
import { errorToast, successToast } from "../../util/toasts";
import { useNavigate } from "react-router-dom";

function Link({ to, children, className, onDelete }) {
  return (
    <div className="flex items-center">
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
      <AiOutlineDelete
        cursor={"pointer"}
        onClick={onDelete}
        className="ml-2 text-red-500"
      />
    </div>
  );
}

export default function CreatePersona() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const [requestBody, setRequestBody] = useState({
    name: {
      value: "",
      error: "",
    },
    description: {
      value: "",
      error: "",
    },
    prompt: {
      value: "",
      error: "",
    },
    visibility: {
      value: "",
      error: "",
    },
    avatar: {
      value: "",
      error: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestBody({
      ...requestBody,
      [name]: {
        value,
        error: "",
      },
    });
  };

  const onDelete = () => {
    setRequestBody({
      ...requestBody,
      avatar: {
        value: "",
        error: "",
      },
    });
  };

  const handleUpload = (url) => {
    setRequestBody({
      ...requestBody,
      avatar: {
        value: url,
        error: "",
      },
    });

    setOpen(false);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const validateRequestBody = () => {
    // validate name field
    // length should be greater than 3
    var isValid = true;
    if (requestBody.name.value.length < 3) {
      setRequestBody((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          error: "Name should be greater than 3 characters",
        },
      }));
      isValid = false;
    }
    // validate description field
    // length should be greater than 3
    if (requestBody.description.value.length < 3) {
      setRequestBody((prev) => {
        return {
          ...prev,
          description: {
            ...prev.description,
            error: "Description should be greater than 3 characters",
          },
        };
      });
      isValid = false;
    }

    // validate prompt field
    // prompt length should be greater than 20
    if (requestBody.prompt.value.length < 20) {
      setRequestBody((prev) => {
        return {
          ...prev,
          prompt: {
            ...prev.prompt,
            error: "Prompt should be greater than 20 characters",
          },
        };
      });
      isValid = false;
    }

    // validate visibility field
    // visibility should be either public or private
    if (
      requestBody.visibility.value !== "public" &&
      requestBody.visibility.value !== "private"
    ) {
      setRequestBody((prev) => {
        return {
          ...prev,
          visibility: {
            ...prev.visibility,
            error: "Visibility should be either public or private",
          },
        };
      });
      isValid = false;
    }

    // validate avatar field
    // avatar should be a valid url
    if (!isURL(requestBody.avatar.value)) {
      setRequestBody((prev) => {
        return {
          ...prev,
          avatar: {
            ...prev.avatar,
            error: "Avatar should be a valid URL",
          },
        };
      });
      isValid = false;
    }

    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateRequestBody();
    if (!isValid) {
      return;
    }
    const reqBody = {
      name: requestBody.name.value,
      description: requestBody.description.value,
      prompt: requestBody.prompt.value,
      visibility: requestBody.visibility.value,
      avatar: requestBody.avatar.value,
    };

    createPersona(reqBody)
      .then((res) => {
        successToast("Persona created successfully");
        navigate("/personas/" + res.id + "/chat", {
          state: {
            name: res.name,
            desc: res.description,
            image: res.avatar,
          },
        });
      })
      .catch((err) => {
        errorToast("Unable to create persona");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5 mx-10">
        <div className="flex flex-row justify-between my-3">
          <h1 className="text-[24px] font-semibold">Create Persona</h1>
          <button
            type="submit"
            className="text-[14px] font-semibold bg-black-50 py-[9px] px-[20px] text-white rounded-lg"
            onClick={handleSubmit}
          >
            Create and chat
          </button>
        </div>
        <div className="w-full mt-6 p-4">
          <div className="grid grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-4 py-7 border-b border-b-[#EAECF0]">
              <h1 className="text-[18px] font-semibold">Name</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C]">
                Give your persona a name that you can easily remember
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0]">
              <input
                className=" w-full px-4 py-3 border border-[#D0D5DD] rounded-lg"
                placeholder="Enter name here"
                name="name"
                onChange={handleChange}
              />
              {/* error text which should be red danger*/}
              {requestBody.name.error && (
                <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                  {requestBody.name.error}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 py-7 border-b border-b-[#EAECF0]">
              <h1 className="text-[18px] font-semibold">Description</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] ">
                Describe your persona in a few words so that you can easily find
                it later
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0]">
              <textarea
                className=" w-full px-4 py-3 border border-[#D0D5DD] rounded-lg"
                placeholder="Enter name here"
                name="description"
                onChange={handleChange}
              />
              {/* error text which should be red danger*/}
              {requestBody.description.error && (
                <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                  {requestBody.description.error}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 py-7 border-b border-b-[#EAECF0]">
              <h1 className="text-[18px] font-semibold">Prompt</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] w-[70%]">
                All conversations with this bot will start with your prompt but
                it will not be visible to the user in the chat. If you would
                like the prompt message to be visible to the user, consider
                using an intro message instead.
              </p>
              <a
                href="#"
                className="flex flex-row items-center gap-2 text-[12px] text-[#0022D4] font-medium"
              >
                View prompt examples <RiShareBoxLine color="#0022D4" />
              </a>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0]">
              <textarea
                className=" w-full px-4 py-3 border border-[#D0D5DD] rounded-lg"
                placeholder="Enter name here"
                name="prompt"
                onChange={handleChange}
              />
              {/* error text which should be red danger*/}
              {requestBody.prompt.error && (
                <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                  {requestBody.prompt.error}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 py-7 border-b border-b-[#EAECF0]">
              <h1 className="text-[18px] font-semibold">Visibility</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] ">
                Choose who can see this persona
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0]">
              <select
                name="visibility"
                onChange={handleChange}
                defaultValue={requestBody.visibility.value}
                className="w-[40%] px-[14px] py-[10px] border border-[#D0D5DD] rounded-lg  placeholder:text-[#667085] appearance-none"
              >
                <option disabled value="">
                  Choose visibility option
                </option>
                <option value="private">Private: Only you can chat </option>
                <option value="public"> Public: Anyone can chat</option>
              </select>
              {requestBody.visibility.error && (
                <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                  {requestBody.visibility.error}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 py-7 border-b border-b-[#EAECF0]">
              <h1 className="text-[18px] font-semibold">Avatar</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] ">
                Upload an image to represent your persona
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0]">
              {!requestBody.avatar.value ? (
                <div className="flex flex-row gap-5 items-center">
                  <input
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(true);
                    }}
                    type="file"
                    className="text-sm text-[#667085] border border-[#D0D5DD] rounded-lg file:border-0 file:p-[10px] file:font-normal file:text-[#667085] file:bg-[#F4F4F4]"
                  />
                  {requestBody.avatar.error && (
                    <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                      {requestBody.avatar.error}
                    </span>
                  )}
                </div>
              ) : (
                <Link
                  to={requestBody.avatar.value}
                  onDelete={onDelete}
                  className="text-blue-500"
                >
                  View Avatar
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="grid-cols-2 my-10"></div>
        <Modal open={open} onClose={handleModalClose}>
          <UppyUploader onUpload={handleUpload}></UppyUploader>
        </Modal>
      </div>
    </form>
  );
}
