import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IoClipboardOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { BsDownload } from "react-icons/bs";

export function CodeBlock({ language, value }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  const styles = {
    iconColor: "#fff",
    iconSize: "20px",
  };

  return (
    <div className="codeblock relative font-sans text-[16px]">
      <div className="flex items-center justify-between py-1.5 px-4">
        <span className="text-xs lowercase text-white">{language}</span>

        <div className="flex items-center">
          <button
            className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-white"
            onClick={copyToClipboard}
          >
            {isCopied ? (
              <IoMdCheckmark size={styles.iconSize} color={styles.iconColor} />
            ) : (
              <IoClipboardOutline
                size={styles.iconSize}
                color={styles.iconColor}
              />
            )}
            {isCopied ? "Copied!" : "Copy code"}
          </button>
          <button
            className="flex items-center rounded bg-none p-1 text-xs text-white"
            // onClick={downloadAsFile}
          >
            <BsDownload size={styles.iconSize} color={styles.iconColor} />
          </button>
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

CodeBlock.displayName = "CodeBlock";
