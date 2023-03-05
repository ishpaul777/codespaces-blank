import getConfig from "next/config";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSidebarContext } from "../../components/SidebarContext";
import { TEXT_EDIT_MODEL, TEXT_GENERATION_MODEL } from "../../constants/models";

export default function Edit() {
  const { publicRuntimeConfig } = getConfig();

  const router = useRouter();
  // useSidebarContext returns the setters and getters for managing sidebar
  const sidebarContext = useSidebarContext();

  const [promptResponse, setPromptResponse] = useState("");
  const [input, setInput] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleInstructions = (e) => {
    setInstructions(e.target.value);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${publicRuntimeConfig.tagoreAPIURL}/text/edit`, {
      method: "POST",
      body: JSON.stringify({
        model: TEXT_EDIT_MODEL,
        input: input,
        instruction: instructions,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return res.json().then((response) => {
            throw Error(response?.message);
          });
        }
      })
      .then((response) => {
        setPromptResponse(response.choices?.[0]?.text);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    // handleUnload handle the event when user tries to leave the edit page and makes the sidebar visible again
    const handleUnload = () => {
      sidebarContext?.setSidebarVisibility(true);
    };
    // making the sidebar invisible so that prompting/editing takes the whole place
    sidebarContext?.setSidebarVisibility(false);

    // adding the event so that sidebar becomes visible when the user is leaving the page
    // router.events.on('routeChangeStart', handleUnload)

    // return () => {
    //   // removing the event listener once the user leaves this page
    //   router.events.off('routeChangeStart', handleUnload)
    // }
  });

  return (
    <div className={`m-12 flex flex-col w-full`}>
      <h2 className={`text-4xl`}>Text Edit</h2>
      <div className={`flex flex-col gap-y-4 mt-6`}>
        <div>
          <label className={`block mb-1 text-lg font-medium text-gray-900`}>
            {" "}
            Input text{" "}
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
            placeholder="enter an input"
            onChange={handleInput}
            required
          ></input>
        </div>
        <div>
          <label className={`block mb-1 text-lg font-medium text-gray-900`}>
            {" "}
            Edit Instructions{" "}
          </label>
          <input
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
            placeholder="instructions to edit the input"
            onChange={handleInstructions}
            required
          ></input>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-primary rounded-lg hover:bg-gray-700 focus:shadow-outline focus:outline-none w-1/2"
            onClick={handleEdit}
          >
            {" "}
            {!loading ? (
              "Edit"
            ) : (
              <AiOutlineLoading3Quarters
                style={{ transform: "rotate(90deg)" }}
                className={`animate-spin`}
              />
            )}{" "}
          </button>
        </div>
        <div>
          {promptResponse !== "" ? (
            <div>
              <label className={`block mb-1 text-lg font-medium text-gray-900`}>
                Response
              </label>
              <textarea
                class="block p-2 w-1/2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="generating text ..."
                disabled={true}
                value={promptResponse}
              ></textarea>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
