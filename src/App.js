import "./App.css";
import "./normal.css";
import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [chatlog, setChatlog] = useState([
    {
      user: "gpt",
      message: "Como posso te ajudar?",
    },
    {
      user: "me",
      message: "Vou te usar",
    },
  ]);

  // limpa o chat
  function clearChat() {
    setChatlog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatlogNew = [...chatlog, { user: "me", message: `${input}` }];
    setInput("");
    setChatlog(chatlogNew);
    const messages = chatlogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });
    const data = await response.json();
    setChatlog([...chatlogNew, { user: "gpt", message: `${data.message}` }]);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+ </span>
          New Chat{" "}
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatlog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}></div>
        <div className="message">{message.message}</div>
      </div>
    </div>
  );
};

export default App;
