import React, { Dispatch, SetStateAction } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import "./styles.scss";
const TipTap = (props: { setText: Dispatch<SetStateAction<string>> }) => {
  const editor = useEditor({
    content: "<p>Any thoughts!</p>",
    extensions: [StarterKit],
    onUpdate({ editor }) {
      props.setText(editor.getHTML());
      console.log(editor.getHTML());
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
