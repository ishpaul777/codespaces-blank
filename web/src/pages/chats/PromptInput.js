import Mentions from "./Mentions";
import React from "react";
import Modal from "./Modal";
import { useSelector } from "react-redux";
import useDarkMode from "../../hooks/useDarkMode";
//  value={currentPrompt}
// className="outline-none text-base border-none focus:ring-0"
// placeholder="Type a message"
// onChange={handlePromptChange}
// onKeyDown={handleKeypressStream}
function PromptInput(props) {
  const {
    value,
    onChange,
    placeholder,
    onEnter,
    isPromptModalVisible,
    setIsPromptModalVisible,
    position,
  } = props;
  const prompts = useSelector((state) => state.prompts);
  const options = prompts?.map((prompt) => {
    return {
      value: prompt.prompt,
      label: prompt.title,
    };
  });
  const { darkMode } = useDarkMode();
  const [isSelectingPrompt, setIsSelectingPrompt] = React.useState(false);

  const [promptVars, setPromptVars] = React.useState([]);

  const handlePromptSelect = (option, prefix) => {
    const { value } = option;
    const { value: oldValue } = props;

    // Find the last occurrence of prefix in oldValue
    const prefixIndex = oldValue.lastIndexOf(prefix);

    if (prefixIndex !== -1) {
      // Find the first occurrence of space after prefix
      const spaceIndex = oldValue.indexOf(" ", prefixIndex);

      // Replace old value from prefix to space with the selected value
      let newValue;
      if (spaceIndex === -1) {
        // No space found after prefix, replace the rest of the string with value
        newValue = oldValue.slice(0, prefixIndex) + value;
      } else {
        // Replace the substring from prefix to space with value
        newValue =
          oldValue.slice(0, prefixIndex) + value + oldValue.slice(spaceIndex);
      }

      // Call the onChange callback with the new value
      onChange(newValue);
      setIsSelectingPrompt(false);

      // the new value may or may not contain variables in {{}}, now we need to open a modal asking for the values of those variables from the user
      const variablesRegex = /{{([^}]*)}}/g;
      let match;
      const variables = [];

      while ((match = variablesRegex.exec(newValue)) !== null) {
        variables.push(match[1]);
      }

      if (variables.length > 0) {
        const temp = variables.map((variable) => {
          return {
            [variable]: "",
          };
        });
        setPromptVars(temp);
        setIsPromptModalVisible(true);
      }
    }
  };

  // if user is not selecting prompt then handle the keypress event normally else handle it for prompt selection only
  const handleKeydown = (e) => {
    if (isSelectingPrompt) {
      return;
    }
    if (!value || value.trim() === "") {
      return;
    }
    if (e.keyCode === 13 && !isPromptModalVisible) {
      e.preventDefault();
      return onEnter(e);
    }
  };

  const handleInsertVariableValues = () => {
    const { value: oldValue } = props;

    const newValue = oldValue.replace(
      /{{(\w+)}}/g, // Regular expression to match variable placeholders
      (match, variableName) => {
        // Find the variable value in promptVars array
        const variable = promptVars.find((v) => v[variableName]);
        return variable ? variable[variableName] : match; // Replace placeholder with value or return placeholder
      }
    );

    onChange(newValue);
    setIsPromptModalVisible(false);
    setPromptVars([]);
  };

  return (
    <div>
      <Mentions
        style={{
          maxHeight: "400px",
          zIndex: isPromptModalVisible ? "-1" : "0",
        }}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        onSelect={(option, prefix) => handlePromptSelect(option, prefix)}
        options={options}
        onKeyDown={(e) => {
          handleKeydown(e);
        }}
        position={position}
        onSearch={() => setIsSelectingPrompt(true)}
        onBlur={() => setIsSelectingPrompt(false)}
      />
      <Modal
        centered
        closable={false}
        title="Insert Variable Values for Prompt"
        visible={isPromptModalVisible}
        onOk={() => handleInsertVariableValues()}
        okText="Save"
        onCancel={() => {
          setIsPromptModalVisible(false);
          setPromptVars([]);
        }}
      >
        <form
          className="flex flex-col h-full gap-4"
          onChange={(e) => {
            const { name, value } = e.target;
            const temp = promptVars.map((variable) => {
              const key = Object.keys(variable)[0];
              if (key === name) {
                return {
                  [key]: value,
                };
              }
              return variable;
            });
            setPromptVars(temp);
          }}
        >
          {promptVars.map((variable, index) => {
            const key = Object.keys(variable)[0];
            return (
              <div key={index} className="flex flex-col gap-2 h-full">
                <label
                  className="font-medium text-gray-700 dark:text-white   text-base"
                  htmlFor={key}
                >
                  {key}
                </label>
                <div className="flex flex-col w-ful gap-2 h-full">
                  <textarea
                    id={key}
                    placeholder="Name of the prompt"
                    rows={4}
                    className={`p-2 border border-[#CED0D4] dark:border-[#3B3B3B] dark:placeholder:text-white  rounded-md bg-transparent resize-none`}
                    type="input"
                    name={key}
                    value={variable[key]}
                  />
                </div>
              </div>
            );
          })}
        </form>
      </Modal>
    </div>
  );
}

export default PromptInput;
