import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import Sidebar from "./Sidebar";
import TypingIndicator from "./TypingIndicator";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useSocket } from "../hooks/useSocket";

function Chat() {
  const [tempUsername, setTempUsername] = useState("");
  const [username, setUsername] = useState("");

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const [messagesByUser, setMessagesByUser] = useState({});
  const [lastMessage, setLastMessage] = useState({});
  const [unread, setUnread] = useState({});

  const [message, setMessage] = useState("");

  const [typingUser, setTypingUser] = useState(null);

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messagesByUser, activeUser]);

 // ================= SOCKET =================
useSocket({
  socket,
  activeUser,
  username,
  setUsers,
  setMessagesByUser,
  setLastMessage,
  setUnread,
  setTypingUser,
});

  // ================= JOIN =================
  const join = () => {
    if (!tempUsername.trim()) return;

    setUsername(tempUsername);

    socket.emit("register", tempUsername);
  };

  // ================= OPEN CHAT =================
  const openChat = (user) => {
    setActiveUser(user);

    // REMOVE UNREAD DOT
    setUnread((prev) => {
      const copy = { ...prev };
      delete copy[user.username];
      return copy;
    });

    // TELL OTHER USER WE SAW MESSAGES
    socket.emit("message_seen", {
      to: user.socketId,
      from: username,
    });
  };

  // ================= SEND MESSAGE =================
const sendMessage = () => {

  if (!message.trim() || !activeUser) return;

  // STOP TYPING
  socket.emit("stop_typing", {
    from: username,
    to: activeUser.socketId,
  });

  setTypingUser(null);

  // SEND MESSAGE
  socket.emit("private_message", {
    to: activeUser.socketId,
    from: username,
    message,
  });

  // ADD LOCALLY
  setMessagesByUser((prev) => ({
    ...prev,
    [activeUser.username]: [
      ...(prev[activeUser.username] || []),
      {
        from: username,
        message,
        seen: false,
      },
    ],
  }));

  // LAST MESSAGE
  setLastMessage((prev) => ({
    ...prev,
    [activeUser.username]: message,
  }));

  setMessage("");
};
return (
  <div className="app">

    <Sidebar
      users={users}
      username={username}
      activeUser={activeUser}
      openChat={openChat}
      lastMessage={lastMessage}
      unread={unread}
    />

    {/* ================= CHAT ================= */}
    <div className="chat">

        {/* LOGIN */}
        {!username && (
          <div className="login">
            <input
              value={tempUsername}
              onChange={(e) =>
                setTempUsername(e.target.value)
              }
              placeholder="Enter username"
            />

            <button onClick={join}>
              Join
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!activeUser && username && (
          <div className="empty">
            Select a user to start chatting
          </div>
        )}

        {/* ACTIVE CHAT */}
        {activeUser && (
          <>
            {/* HEADER */}
            <div className="header">
              {activeUser.username}
            </div>

            {/* MESSAGES */}
{/* MESSAGES */}
<MessageList
  messages={
    messagesByUser[activeUser.username] || []
  }
  username={username}
  messagesEndRef={messagesEndRef}
/>
            <TypingIndicator
  typingUser={
    typingUser === activeUser.username
      ? typingUser
      : null
  }
/>

            {/* INPUT */}
<MessageInput
  message={message}
  setMessage={setMessage}
  sendMessage={sendMessage}
  socket={socket}
  username={username}
  activeUser={activeUser}
  typingTimeoutRef={typingTimeoutRef}
/>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;