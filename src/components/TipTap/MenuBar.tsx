import React from "react";
import "./styles.scss";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaList,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import { GoListOrdered, GoListUnordered } from "react-icons/go";
import { BsCodeSquare } from "react-icons/bs";
import { MdHorizontalRule } from "react-icons/md";
const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 ${editor.isActive("bold") ? "is-active" : ""}`}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 ${editor.isActive("italic") ? "is-active" : ""}`}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 ${editor.isActive("strike") ? "is-active" : ""}`}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 ${editor.isActive("code") ? "is-active" : ""}`}
      >
        <FaCode />
      </button>

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 ${editor.isActive("paragraph") ? "is-active" : ""}`}
      >
        <FaParagraph />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 ${
          editor.isActive("heading", { level: 1 }) ? "is-active" : ""
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 ${
          editor.isActive("heading", { level: 2 }) ? "is-active" : ""
        }`}
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 ${editor.isActive("bulletList") ? "is-active" : ""}`}
      >
        <FaList />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 ${editor.isActive("orderedList") ? "is-active" : ""}`}
      >
        <GoListOrdered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 ${editor.isActive("codeBlock") ? "is-active" : ""}`}
      >
        <BsCodeSquare />
      </button>

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={`p-2`}
      >
        <MdHorizontalRule />
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={`p-2`}
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={`p-2`}
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default MenuBar;
