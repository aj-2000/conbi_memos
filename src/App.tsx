import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import AuthForm from "./components/AuthForm";
import supabase from "./utils/supabase.js";
import CodeEditor from "@uiw/react-textarea-code-editor";

type Todo = {
  task: string;
  isCompleted: boolean;
};

type MemoBlock = {
  id: string;
  text: string;
  code: string;
  todos: Todo[];
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
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
    fetchMemos();
  }, [user?.id]);

  const logout = async () => {
    await supabase.auth.signOut().then(({ error }: any) => {
      if (error) {
        console.log(error);
      } else {
        setUser(null);
      }
    });
  };

  return (
    <div className="App">
      {user?.role ? (
        <div className="w-screen h-screen overflow-auto bg-black">
          <div className="flex rounded justify-between px-2 md:px-4 bg-white">
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
          <div className="flex flex-col">
            <span>Memos</span>
            <div className="bg-white p-4 rounded flex flex-col">
              <textarea defaultValue={"Any thoughts"}/>
              <div className="flex flex-col">
                <span>Tasks</span>
                <div className="flex justify-between">
                  <input type="text" />
                  <button>Add</button>
                </div>
              </div>
              <div>
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
                <button>Save</button>
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
                              <div className="flex justify-between" key={i}>
                                <input
                                  type="radio"
                                  id={i.toString()}
                                  name="fav_language"
                                  value="HTML"
                                  defaultChecked={todo.isCompleted}
                                />
                                 {" "}
                                <label htmlFor={i.toString()}>
                                  {todo.task}
                                </label>
                              </div>
                            </>
                          );
                        })}
                      </div>
                      <div>
                        <CodeEditor
                          value={memo.code}
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
