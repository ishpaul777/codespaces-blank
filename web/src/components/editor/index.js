import { ScooterCore } from "@factly/scooter-core";
import { useSelector } from "react-redux";

export function Editor({
  initialValue,
  editorInstance,
  tagoreConfig,
  onChange,
}) {
  return (
    <ScooterCore
      placeholder="Write your content here. Press / for commands and /generate for AI commands"
      className="bg-white dark:bg-background-sidebar-alt dark:text-white text-black-50"
      editorInstance={editorInstance}
      initialValue={initialValue}
      heightStrategy="flexible"
      menuType="bubble"
      onChange={onChange}
      tagoreConfig={tagoreConfig}
    />
  );
}
