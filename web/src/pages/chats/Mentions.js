import React, { useState, useEffect, useRef } from "react";

const Mentions = (props) => {
  const { options, onChange, onSearch, onSelect, onKeyDown, onBlur, position } =
    props;
  const [showPromptsList, setShowPromptsList] = useState(false);
  const [promptsList, setPromptsList] = useState(options);
  const [searchText, setSearchText] = useState("");
  const [activePromptIndex, setActivePromptIndex] = useState(-1);

  const list = useRef(null); // add this line to create a ref

  const handlePrefixKeyDown = (e) => {
    if (e.key === "/" && !showPromptsList) {
      onSearch();
      setShowPromptsList(true);
      setActivePromptIndex(0);
    }
    if (showPromptsList) {
      if (e.key === "ArrowDown" && activePromptIndex < promptsList.length - 1) {
        setActivePromptIndex(activePromptIndex + 1);
        // updateListScroll();
      }
      if (e.key === "ArrowUp" && activePromptIndex > 0) {
        setActivePromptIndex(activePromptIndex - 1);
        // updateListScroll();
      }
    }
    if (e.key === "Enter" && showPromptsList && activePromptIndex > -1) {
      const option = promptsList[activePromptIndex];
      onSelect(option, "/");
      setShowPromptsList(false);
      setActivePromptIndex(0);
    }
    if (e.key === "Enter" && !showPromptsList) {
      onKeyDown(e);
    }
    if (e.key === "Backspace" && showPromptsList) {
      const temp = props.value.split("/");
      if (temp[temp.length - 1] === "") {
        onBlur();
        setShowPromptsList(false);
      }
      setSearchText(temp[temp.length - 1]);
    }
  };
  useEffect(() => {
    if (list.current) {
      list.current.scrollTop = activePromptIndex * 30;
    }
  }, [activePromptIndex]);

  useEffect(() => {
    const temp = options.filter((option) => {
      return (
        option.label?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
    });
    setPromptsList(temp);
    setActivePromptIndex(0);
  }, [options]);

  const handleChange = (e) => {
    const { value } = e.target;

    if (value.trim === "" || promptsList.length === 0 || value === "/ ") {
      onBlur();
      setShowPromptsList(false);
    }

    const match = value.match(/\/\w*$/);

    if (match) {
      onSearch();
      setShowPromptsList(true);
      setActivePromptIndex(0);
    } else {
      onBlur();
      setShowPromptsList(false);
      setActivePromptIndex(-1);
    }

    if (showPromptsList) {
      // setSearchText to the text after the last /
      const temp = value.split("/");
      setSearchText(temp[temp.length - 1]);
    }
    onChange(value);
  };

  React.useEffect(() => {
    const temp = options.filter((option) => {
      return (
        option.label?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
    });
    setPromptsList(temp);
  }, [searchText]);

  const textareaRef = useRef(null);
  useEffect(() => {
    textareaRef.current.style.height = "32px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [props.value]);

  return (
    <div>
      <textarea
        onChange={(e) => {
          handleChange(e);
        }}
        className="rounded-md bg-transparent w-full outline-none text-base scrollbar-custom max-h-40 pt-1 overflow-x-hidden overflow-y-auto resize-none"
        // onKeyDown={(e) => { handleKeydown(e) }}
        ref={textareaRef}
        value={props.value}
        onKeyDown={(e) => {
          handlePrefixKeyDown(e);
        }}
        placeholder={props.placeholder}
      />
      {showPromptsList && promptsList.length > 0 && (
        <ul
          ref={list}
          className={`absolute ${
            position === "top" ? "bottom" : "top"
          }-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-56 overflow-y-auto scrollbar-custom`}
        >
          {promptsList.map((option, index) => {
            return (
              <li
                className={`cursor-pointer hover:bg-gray-100 p-4 ${
                  activePromptIndex === index ? "bg-gray-200 active" : ""
                }`}
                onClick={() => {
                  setShowPromptsList(false);
                  onSelect(option, "/");
                }}
                key={index}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Mentions;
