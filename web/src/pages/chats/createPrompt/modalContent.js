const ModalContent = ({ handleValueChange, promptValues, showerror }) => {
  return (
    <form className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-ful gap-2">
        <label className="font-medium text-gray-700 text-base">Title</label>
        <input
          placeholder="Name of the prompt"
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent"
          type="input"
          name="title"
          value={promptValues.title}
          onChange={handleValueChange}
        />
        <p
          className={`mt-1 ${showerror.title ? "block" : "d-none"
            } text-pink-600 text-sm`}
        >
          Please provide a title for prompt.
        </p>
      </div>
      <div className="flex flex-col w-ful gap-2">
        <label className="font-medium text-gray-700 text-base">
          Description
        </label>
        <textarea
          name={"description"}
          placeholder="A short description of the prompt"
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none"
          value={promptValues.description}
          rows={4}
          onChange={handleValueChange}
        />
        <p
          className={`mt-1 ${showerror.description ? "block" : "d-none"
            } text-pink-600 text-sm`}
        >
          Please provide a description for prompt.
        </p>
      </div>
      <div className="flex flex-col w-ful gap-2">
        <label className="font-medium text-gray-700 text-base">Prompt</label>
        <textarea
          placeholder="Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}"
          name={"prompt"}
          className="p-2 border border-[#CED0D4] rounded-md bg-transparent resize-none"
          value={promptValues.prompt}
          rows={10}
          onChange={handleValueChange}
        />
        <p
          className={`mt-1 ${showerror.prompt ? "block" : "d-none"
            } text-pink-600 text-sm`}
        >
          Please provide a template for prompt.
        </p>
      </div>
    </form>
  );
};
export default ModalContent;
