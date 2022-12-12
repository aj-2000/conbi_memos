import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import "./styles.scss";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];
const names = [
  "Lea Thompson",
  "Cyndi Lauper",
  "Tom Cruise",
  "Madonna",
  "Jerry Hall",
  "Joan Collins",
  "Winona Ryder",
  "Christina Applegate",
  "Alyssa Milano",
  "Molly Ringwald",
  "Ally Sheedy",
  "Debbie Harry",
  "Olivia Newton-John",
  "Elton John",
  "Michael J. Fox",
  "Axl Rose",
  "Emilio Estevez",
  "Ralph Macchio",
  "Rob Lowe",
  "Jennifer Grey",
  "Mickey Rourke",
  "John Cusack",
  "Matthew Broderick",
  "Justine Bateman",
  "Lisa Bonet",
];

// A new Y document
const ydoc = new Y.Doc();
// Registered with a WebRTC provider
const provider = new WebrtcProvider("test5", ydoc);

const getRandomElement = (list: any) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomColor = () => getRandomElement(colors);
const getRandomName = () => getRandomElement(names);

const getInitialUser = () => {
  return {
    name: getRandomName(),
    color: getRandomColor(),
  };
};

const TipTap = (props: { setText: Dispatch<SetStateAction<string>> }) => {
  const [users, setUsers] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const setName = useCallback(() => {
    const name = (window.prompt("Name") || "").trim().substring(0, 32);

    if (name) {
      return setCurrentUser({ ...currentUser, name });
    }
  }, [currentUser]);
  const editor = useEditor({
    content: "",
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
      Placeholder,
      CollaborationCursor.configure({
        provider: provider,
        onUpdate: (updatedUsers): any => {
          setUsers(updatedUsers);
        },
        user: currentUser,
      }),
    ],

    onUpdate({ editor }) {
      props.setText(editor.getHTML());
      console.log(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && currentUser) {
      editor.chain().focus().user(currentUser).run();
    }
  }, [editor, currentUser]);
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
