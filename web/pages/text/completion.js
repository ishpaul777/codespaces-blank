import getConfig from "next/config";
import dynamic from "next/dynamic";
import { useState } from "react";
import { TEXT_GENERATION_MODEL } from "../../constants/models";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const Editor = dynamic(
  () => import("@factly/scooter").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export default function Completion() {
  const { publicRuntimeConfig } = getConfig();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptResponse, setPromptResponse] = useState("");
  // handles the changes in the editor and sets the state of prompt to whatever text is in the editor
  const handleChange = ({ text }) => {
    setPrompt(text);
  };

  const handleGenerate = () => {
    setLoading(true);
    fetch(`${publicRuntimeConfig.tagoreAPIURL}/text/generate`, {
      method: "POST",
      body: JSON.stringify({
        model: TEXT_GENERATION_MODEL,
        prompt: prompt,
        max_tokens: 200,
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

  return (
    <div className={`mt-12 ml-12 flex flex-col gap-y-4 w-full`}>
      <h2 className={`text-4xl`}>Text Generation</h2>
      <div className={`mt-12 flex flex-col gap-y-2`}>
        <h3 className={`text-xl mb-4`}>Enter your prompt</h3>
        <div className={`flex  w-full gap-x-2`}>
          <Editor onChange={handleChange} />
          <textarea
            class="block p-2 w-1/2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="generating text ..."
            disabled={true}
            value={promptResponse}
          ></textarea>
        </div>

        <button
          href="#_"
          className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-primary rounded-lg hover:bg-gray-700 focus:shadow-outline focus:outline-none w-1/5"
          onClick={handleGenerate}
        >
          {!loading ? (
            "Generate"
          ) : (
            <AiOutlineLoading3Quarters
              style={{ transform: "rotate(90deg)" }}
              className={`animate-spin`}
            />
          )}
        </button>
      </div>
    </div>
  );
}
