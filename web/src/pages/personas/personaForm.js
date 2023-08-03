import React from "react";
import { RiShareBoxLine } from "react-icons/ri";
import UppyUploader from "../../components/Uppy";
import Modal from "../../components/Modal";
import GenerateModal from "./GenerateModal";
import { AiOutlineDelete } from "react-icons/ai";

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
function PersonaForm({
  handleSubmit,
  isEditForm,
  handleChange,
  requestBody,
  setOpen,
  open,
  handleUpload,
  onDelete,
  handleModalClose,
  genOpen,
  setGenOpen,
}) {
  const promptExampleLink = "https://poe.com/prompt_examples";

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5 mx-10 dark:text-white">
        <div className="flex flex-row justify-between md:my-3 mt-[100px]">
          <h1 className="text-[24px] font-semibold">
            {" "}
            {isEditForm ? "Edit " : "Create "} Persona
          </h1>
          <button
            type="submit"
            className="text-[14px] font-semibold bg-black-50 py-[9px] px-[20px] text-white rounded-lg"
            onClick={handleSubmit}
          >
            {isEditForm ? "Save " : "Create "}
            and chat
          </button>
        </div>
        <div className="w-full mt-6 p-4">
          <div className="grid 2sm:grid-cols-[1fr_1fr] grid-cols-1">
            <div className="flex flex-col gap-4 2sm:py-7 pb-0 pt-7 2sm:border-b 2sm:border-b-[#EAECF0] dark:border-[#555] border-0">
              <h1 className="text-[18px] font-semibold">Name</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] dark:text-gray-100">
                Give your persona a name that you can easily remember
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0] dark:border-[#555]">
              <input
                className=" w-full px-4 py-3 border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b]"
                placeholder="Enter name here"
                name="name"
                onChange={handleChange}
                value={requestBody.name.value}
              />
              {/* error text which should be red danger*/}
              {requestBody.name.error && (
                <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                  {requestBody.name.error}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 2sm:py-7 pb-0 pt-7 2sm:border-b 2sm:border-b-[#EAECF0] dark:border-[#555] border-0">
              <h1 className="text-[18px] font-semibold">Description</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] dark:text-gray-100">
                Describe your persona in a few words so that you can easily find
                it later
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0] dark:border-[#555]">
              <textarea
                className=" w-full px-4 py-3 border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] resize-none"
                rows={3}
                placeholder="Enter description here"
                name="description"
                onChange={handleChange}
                value={requestBody.description.value}
              />
              {/* error text which should be red danger*/}
              {requestBody.description.error && (
                <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                  {requestBody.description.error}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 2sm:py-7 pb-0 pt-7 2sm:border-b 2sm:border-b-[#EAECF0] dark:border-[#555] border-0">
              <h1 className="text-[18px] font-semibold">Prompt</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] dark:text-gray-100 w-[70%]">
                All conversations with this bot will start with your prompt but
                it will not be visible to the user in the chat. If you would
                like the prompt message to be visible to the user, consider
                using an intro message instead.
              </p>
              <a
                href={promptExampleLink}
                className="flex flex-row items-center gap-2 text-[12px] text-blue-500 font-medium"
              >
                View prompt examples{" "}
                <RiShareBoxLine className="text-blue-500" />
              </a>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0] dark:border-[#555]">
              <textarea
                className=" w-full px-4 py-3 border border-[#D0D5DD] rounded-lg dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] resize-none"
                rows={3}
                placeholder="Enter prompt here"
                name="prompt"
                onChange={handleChange}
                value={requestBody.prompt.value}
              />
              {/* error text which should be red danger*/}
              {requestBody.prompt.error && (
                <span className="text-[12px] px-4 font-normal text-[#ed4b48]">
                  {requestBody.prompt.error}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 2sm:py-7 pb-0 pt-7 2sm:border-b 2sm:border-b-[#EAECF0] dark:border-[#555] border-0">
              <h1 className="text-[18px] font-semibold">Visibility</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] dark:text-gray-100">
                Choose who can see this persona
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 py-7 border-b border-b-[#EAECF0] dark:border-[#555]">
              <select
                name="visibility"
                onChange={handleChange}
                defaultValue={requestBody.visibility.value}
                value={requestBody.visibility.value}
                className=" px-[14px] py-[10px] border border-[#D0D5DD] rounded-lg  placeholder:text-[#667085] appearance-none dark:bg-background-sidebar-alt dark:text-white dark:border-[#3b3b3b] w-fit"
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
            <div className="flex flex-col gap-4 2sm:py-7 pb-0 pt-7 2sm:border-b 2sm:border-b-[#EAECF0] dark:border-[#555] border-0">
              <h1 className="text-[18px] font-semibold">Avatar</h1>
              <p className="text-[12px] font-normal text-[#6C6C6C] dark:text-gray-100">
                Upload an image to represent your persona
              </p>
            </div>
            <div className="w-full flex gap-3 items-center py-7 border-b border-b-[#EAECF0] dark:border-[#555]">
              {!requestBody.avatar.value ? (
                <div className="flex gap-5 items-center sm:flex-row flex-col sm:justify-between justify-center w-full">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setGenOpen(true);
                    }}
                    className="flex w-fit justify-center items-center text-sm font-semibold text-[#1e1e1e] border border-[#1e1e1e] rounded-lg h-[40px] px-2 py-3 dark:text-white dark:bg-background-sidebar-alt dark:hover:bg-white dark:hover:text-[#1e1e1e] dark:hover:border-[#1e1e1e] dark:hover:shadow-lg dark:border-[#3b3b3b] cursor-pointer"
                  >
                    Generate Avatar
                  </button>
                  <span className="text-[#667085] dark:text-gray-100">or</span>
                  <input
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(true);
                    }}
                    type="file"
                    className="text-sm block text-[#6c6c6c] dark:text-gray-100 bg-background-secondary dark:bg-background-sidebar-alt rounded-md file:rounded-r-md
                    file:mr-4 file:py-2 file:px-4
                    file:border-0
                    file:text-sm file:font-semibold file:bg-gray-300
                    file:dark:bg-violet-50 file:text-black file:cursor-pointer"
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
        <GenerateModal open={genOpen} onClose={handleModalClose} />
      </div>
    </form>
  );
}

export default PersonaForm;
