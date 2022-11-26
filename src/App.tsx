import React, { useEffect, useRef, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import AuthForm from "./components/AuthForm";
import supabase from "./utils/supabase.js";
import CodeEditor from "@uiw/react-textarea-code-editor";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

type Todo = {
  task: string;
  isCompleted: boolean;
  id: string;
};

type MemoBlock = {
  id: string;
  text: string;
  code: string;
  todos: Todo[];
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [task, setTask] = useState<string>();
  const [text, setText] = useState<string>();
  const [code, setCode] = useState<string>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [updated, setUpdated] = useState<string>();
  const [memos, setMemos] = useState<MemoBlock[]>([]);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data, error }: any) => {
        setUser(data.session.user);
        console.log(data.session.user);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  const fetchMemos = () => {
    supabase
      .from("memos")
      .select()
      .order("created_at", { ascending: false })
      .eq("userId", user?.id)
      .then(({ data, error }) => {
        console.log(data);
        const memosData: MemoBlock[] = [];
        data?.map((memo) => {
          memosData.push(memo);
        });
        setMemos(memosData);
      });
  };

  useEffect(() => {
    if (user?.id) fetchMemos();
  }, [user?.id, updated]);

  const logout = async () => {
    await supabase.auth.signOut().then(({ error }: any) => {
      if (error) {
        console.log(error);
      } else {
        setUser(null);
      }
    });
  };

  const saveMemo = () => {
    supabase
      .from("memos")
      .insert({
        text: text,
        code: code,
        codeType: "js",
        userId: user?.id,
        todos: todos,
      })
      .then(({ data, error }) => {
        if (!error) {
          setTask("");
          setText("");
          setCode("");
          setTodos([]);
          toast("Memo successfully saved!");
          setUpdated(Date.now().toString());
        } else {
          toast("Failed to save memo.");
        }
      });
  };
  const deleteMemo = async (id: string) => {
    const { error } = await supabase.from("memos").delete().eq("id", id);
    if (error) {
      console.log(error);
    } else {
      setUpdated(Date.now().toString());
    }
  };
  return (
    <div className="App">
      <div>
        <Toaster />
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
          <div className="flex flex-col w-[800px]">
            <span>Memos</span>
            <div className="bg-white p-4 rounded flex flex-col gap-4 border-1 border-gray-200 mx-12 my-6 shadow">
              <textarea
                onChange={(e) => setText(e.target.value)}
                className="p-2"
                rows={4}
                value={text}
                placeholder="Any Thoughts..."
              />
              <div className="flex flex-col gap-2">
                <span>Tasks</span>
                <div className="flex justify-between">
                  <input
                    onChange={(e) => setTask(e.target.value)}
                    type="text"
                    value={task}
                    className="border w-[500px]"
                  />
                  <button
                    onClick={() => {
                      setTodos((prevTodos) => [
                        ...prevTodos,
                        {
                          task: task || "",
                          isCompleted: false,
                          id: uuidv4(),
                        },
                      ]);
                      setTask("");
                      console.log(todos);
                    }}
                  >
                    Add
                  </button>
                </div>
                {todos.map((todo) => {
                  return (
                    <span key={todo.id} className="text-black">
                      {todo.task}
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-col gap-2">
                <span>Enter Some JS Code</span>
                <CodeEditor
                  value={code}
                  language="js"
                  placeholder="Please enter JS code."
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
                <button onClick={saveMemo}>Save</button>
              </div>
            </div>
            <div>
              {memos.map((memo) => {
                return (
                  <>
                    <div className="bg-white p-4 rounded flex flex-col">
                      <p>{memo.text}</p>
                      <div className="flex flex-col">
                        <span>Tasks</span>
                        {memo.todos.map((todo, i) => {
                          return (
                            <>
                              <div
                                className="flex justify-between"
                                key={todo.id}
                              >
                                <div
                                  onClick={() => {
                                    setTodos((prevTodos) => {
                                      todo.isCompleted = !todo.isCompleted;
                                      prevTodos[i] = todo;
                                      supabase
                                        .from("memos")
                                        .update({ todos: prevTodos })
                                        .match({ userId: user?.id })
                                        .then(({ data, error }) => {
                                          if (error) console.log(error);
                                          else console.log(data);
                                          setUpdated(Date.now().toString());
                                        });
                                      return prevTodos;
                                    });
                                  }}
                                  className={`w-4 h-4 rounded-full border border-black ${
                                    todo?.isCompleted ? "bg-black" : null
                                  }`}
                                />

                                <p className="">{todo?.task}</p>
                              </div>
                            </>
                          );
                        })}
                      </div>
                      <div>
                        <CodeEditor
                          value={memo?.code}
                          language="js"
                          disabled
                          placeholder="Please enter JS code."
                          padding={15}
                          style={{
                            fontSize: 12,
                            backgroundColor: "#f5f5f5",
                            fontFamily:
                              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                          }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          deleteMemo(memo.id);
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

export default App;
