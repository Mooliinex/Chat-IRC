import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

let socket;
const CONNECTION_PORT = "localhost:3000/";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName,
        message: message,
      },

    };

    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  return (
      <div className="App">
        {!loggedIn ? (
            <div className="logIn">
              <div className="inputs">
                <input
                    type="text"
                    placeholder="Ton pseudo..!"
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                />
                <input
                    type="text"
                    placeholder="Rejoins un channel..!"
                    onChange={(e) => {
                      setRoom(e.target.value);
                    }}
                />
              </div>
              <button onClick={connectToRoom}>Allez viens !</button>
            </div>
        ) : (
            <div className="chatContainer">
              <div className="messages">
                {messageList.map((val, key) => {
                  return (
                      <div
                          className="messageContainer"
                          id={val.author === userName ? "You" : "Other"}
                      >
                        <div className="messageIndividual">
                          {val.author}: {val.message}
                        </div>
                      </div>
                  );
                })}
              </div>
<form>
              <div className="messageInputs">
                <input
                    type="text"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
</form>
            </div>
        )}
      </div>
  );
}

export default App;
