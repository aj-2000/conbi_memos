import { Dispatch, SetStateAction } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import "./styles.scss";
import Placeholder from "@tiptap/extension-placeholder";
const TipTap = (props: { setText: Dispatch<SetStateAction<string>> }) => {
  const editor = useEditor({
    content: "",
    extensions: [StarterKit, Placeholder],

    onUpdate({ editor }) {
      props.setText(editor.getHTML());
    },
  });
  return (
    <div>
      <div className="p-4 bg-gradient-to-t rounded shadow-sm border-2 border-gray-200 gap-2 flex flex-col">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTap;
