import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";

import supabase from "./utils/supabase.js";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { v4 as uuidv4 } from "uuid";
import LoadingSpinner from "./components/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import { CiSaveUp1 } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { languages } from "./data/languages";
import { FcGoogle } from "react-icons/fc";
type Todo = {
  task: string;
  isCompleted: boolean;
  id: string;
};

type MemoBlock = {
  id: string;
  text: string;
  code: string;
  codeType: string;
  todos: Todo[];
  created_at: string;
};

const notify = (message: string) => toast(message);

function App() {
  const [user, setUser] = useState<any>(null);
  const [task, setTask] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [codeType, setCodeType] = useState<string>("js");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [updated, setUpdated] = useState<string>();
  const [memos, setMemos] = useState<MemoBlock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //get user from session
  useEffect(() => {
    if (!user) {
      supabase.auth
        .getSession()
        .then(({ data, error }: any) => {
          setUser(data.session.user);
          notify("Signed in successfully.");
        })
        .catch((err: any) => {
          notify("Please Sign In to continue.");
        });
    }
  }, []);

  const fetchMemos = () => {
    setIsLoading(true);
    supabase
      .from("memos")
      .select()
      .order("created_at", { ascending: false })
      .eq("userId", user?.id)
      .then(({ data, error }) => {
        setIsLoading(false);
        const memosData: MemoBlock[] = [];
        data?.map((memo) => {
          memosData.push(memo);
        });
        setMemos(memosData);
      });
  };

  //fetching memos from db
  useEffect(() => {
    if (user?.id) fetchMemos();
    return () => {
      setMemos([]);
    };
  }, [user?.id, updated]);

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut().then(({ error }: any) => {
      if (error) {
        console.log(error);
        notify("An error occured while logging out.");
      } else {
        setUser(null);
        setIsLoading(false);
        notify("Logged out successfully.");
      }
    });
  };

  const saveMemo = () => {
    setIsLoading(false);
    if (todos.length > 0 || text !== "" || code !== "") {
      supabase
        .from("memos")
        .insert({
          text: text,
          code: code,
          userId: user?.id,
          todos: todos,
          codeType: codeType,
        })
        .then(({ data, error }) => {
          if (!error) {
            setTask("");
            setText("");
            setCode("");
            setTodos([]);
            setCodeType("js");
            notify("Memo successfully saved.");
            setUpdated(Date.now().toString());
          } else {
            notify("Failed to save memo.");
          }
          setIsLoading(false);
        });
    } else {
      notify("Empty memo can not be saved.");
    }
  };
  const deleteMemo = async (id: string) => {
    setIsLoading(false);
    const { error } = await supabase.from("memos").delete().eq("id", id);
    if (error) {
      console.log(error);
      setIsLoading(false);
      notify("An error occurred while deleting the memo.");
    } else {
      setUpdated(Date.now().toString());
      setIsLoading(false);
      notify("Memo deleted successfully.");
    }
  };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      notify("An error occured while signing in.");
    } 
  }

  return (
    <div className="App">
      <div>
        <ToastContainer />
      </div>
      {user?.role ? (
        <div className="w-screen h-screen overflow-auto bg-gray-100 flex flex-col items-center">
          <div className="flex rounded justify-between px-2 md:px-4 bg-white w-screen">
            <div className="flex py-2 rounded-lg gap-x-2">
              <img
                className="rounded-full min-w-[40px] max-w-[40px] h-[40px]"
                src={user?.identities?.at(0).identity_data.avatar_url}
              />

              <div>
                <p className="text-sm ">Welcome,</p>
                <p className="text-xs">
                  {user?.email.replace("@gmail.com", "")}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-4 hover:cursor-pointer">
              <div
                onClick={logout}
                className="flex justify-center gap-x-2 items-center py-2 px-4 shadow rounded-2xl cursor-pointer"
              >
                <FiLogOut className="text-red-600" size={28} />
                <span className="text-sm uppercase font-semibold">Logout</span>
              </div>
            </div>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col gap-4 my-10 w-full px-2 md:px-auto md:w-[800px]">
              <span className="text-center text-5xl font-mono font-extralight uppercase">
                Conbi Memos
              </span>
              <div className="bg-white p-4 rounded flex flex-col gap-4 border-1 border-gray-200 my-6 shadow">
                <textarea
                  onChange={(e) => setText(e.target.value)}
                  className="p-2 bg-gradient-to-t rounded shadow-sm border-2 border-gray-200"
                  rows={4}
                  value={text}
                  placeholder="Any Thoughts..."
                />
                <div className="flex flex-col gap-2">
                  <span className="uppercase text-sky-500 font-bold">
                    #Tasks
                  </span>
                  <div className="flex justify-between gap-2">
                    <input
                      onChange={(e) => setTask(e.target.value)}
                      type="text"
                      value={task}
                      className="p-2 bg-gradient-to-t rounded border shadow-sm border-gray-200 w-full"
                    />
                    <button
                      className="p-2 flex gap-2 bg-sky-500 text-white rounded shadow-sm"
                      onClick={() => {
                        if (task) {
                          setTodos((prevTodos) => [
                            ...prevTodos,
                            {
                              task: task,
                              isCompleted: false,
                              id: uuidv4(),
                            },
                          ]);
                          setTask("");
                        }
                      }}
                    >
                      <IoMdAdd size={25} />
                      <span className="uppercase">Add</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {todos.map((todo, i) => {
                      return (
                        <span
                          key={todo.id}
                          className="text-white bg-sky-500 rounded-md p-2 shadow-sm"
                        >
                          {`#${i + 1} ${todo.task}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <span className="uppercase text-sky-500 font-bold">
                      #Code
                    </span>

                    <select
                      name="language"
                      id="language"
                      onChange={(e) => {
                        setCodeType(e.target.value);
                        console.log(e.target.value);
                      }}
                      defaultValue="js"
                    >
                      {languages.map((lang) => (
                        <option value={lang.extension}>{lang.language}</option>
                      ))}
                    </select>
                  </div>

                  <CodeEditor
                    value={code}
                    language={codeType}
                    placeholder="Please enter some code."
                    onChange={(evn) => setCode(evn.target.value)}
                    padding={15}
                    style={{
                      fontSize: 12,
                      backgroundColor: "#f5f5f5",
                      fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }}
                  />
                </div>
                <div>
                  <button
                    className="p-2 flex gap-2 bg-green-500 text-white rounded"
                    onClick={saveMemo}
                  >
                    <CiSaveUp1 size={25} />
                    <span className="uppercase">Save</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {memos.map((memo, memoIndex) => {
                  return (
                    <>
                      <div
                        key={memo.id}
                        className="bg-white p-4 rounded flex flex-col gap-4 hover:border-2 hover:border-gray-200 hover:shadow"
                      >
                        <div className="text-sm text-gray-400 ">
                          {moment(memo.created_at)
                            .utcOffset(330)
                            .format("MM/DD/YYYY HH:mm:ss")}
                        </div>

                        {memo.text !== "" ? <p>{memo.text}</p> : null}
                        {memo.todos.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            <span
                              className="uppercase text-sky-500 font-bold"
                              key={memo.id + "span"}
                            >
                              #Tasks
                            </span>

                            {memo.todos.map((todo, todoIndex) => {
                              return (
                                <>
                                  <div
                                    className="flex gap-2 items-center"
                                    key={todo.id}
                                  >
                                    <div
                                      key={todo.id + "div"}
                                      onClick={() => {
                                        setMemos((prevMemos) => {
                                          prevMemos[memoIndex].todos[
                                            todoIndex
                                          ].isCompleted = !todo.isCompleted;

                                          supabase
                                            .from("memos")
                                            .update({
                                              todos: prevMemos[memoIndex].todos,
                                            })
                                            .match({ id: memo.id })
                                            .then(({ data, error }) => {
                                              if (error) {
                                                toast(
                                                  "An error occured while updating response."
                                                );
                                                console.log(error);
                                              } else {
                                                supabase
                                                  .from("memos")
                                                  .select()
                                                  .order("created_at", {
                                                    ascending: false,
                                                  })
                                                  .eq("userId", user?.id)
                                                  .then(({ data, error }) => {
                                                    const memosData: MemoBlock[] =
                                                      [];
                                                    data?.map((memo) => {
                                                      memosData.push(memo);
                                                    });
                                                    setMemos(memosData);
                                                    toast(
                                                      "Reponse updated successfully."
                                                    );
                                                  });
                                              }
                                            });
                                          return prevMemos;
                                        });
                                      }}
                                      className="flex justify-center items-center p-[0.5px] w-6 h-6 rounded-full border border-black cursor-pointer"
                                    >
                                      {" "}
                                      {todo?.isCompleted ? (
                                        <FcCheckmark size={20} />
                                      ) : null}{" "}
                                    </div>

                                    <p
                                      key={todo.id + "p"}
                                      className={`${
                                        todo?.isCompleted
                                          ? "line-through"
                                          : null
                                      }`}
                                    >
                                      {todo?.task}
                                    </p>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        ) : null}
                        {memo.code !== "" ? (
                          <div className="shadow-sm">
                            <CodeEditor
                              value={memo?.code}
                              language={memo?.codeType}
                              disabled
                              placeholder="Please enter some code."
                              padding={15}
                              style={{
                                fontSize: 12,
                                backgroundColor: "#f5f5f5",
                                fontFamily:
                                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                              }}
                            />
                          </div>
                        ) : null}
                        <div>
                          <button
                            className="p-2 flex gap-2 bg-red-500 text-white rounded shadow-sm"
                            onClick={() => {
                              deleteMemo(memo.id);
                            }}
                          >
                            <AiOutlineDelete size={25} />
                            <span className="uppercase text-center">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center w-screen h-screen bg-black">
          <div
            onClick={signInWithGoogle}
            className="flex justify-center items-center bg-white rounded-lg py-2 px-4 gap-x-2 shadow-sm hover:shadow hover:cursor-pointer"
          >
            <FcGoogle className="hover:scale-125" size={26} />
            <span className="text-lg font-extralight capitalize">Sign In</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
