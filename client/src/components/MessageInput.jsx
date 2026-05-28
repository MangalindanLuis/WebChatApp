function MessageInput({
  message,
  setMessage,
  sendMessage,
  socket,
  username,
  activeUser,
  typingTimeoutRef,
}) {

  const handleTyping = (e) => {

    setMessage(e.target.value);

    // START TYPING
    socket.emit("typing", {
      from: username,
      to: activeUser.socketId,
    });

    // CLEAR OLD TIMER
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // STOP TYPING
    typingTimeoutRef.current =
      setTimeout(() => {

        socket.emit("stop_typing", {
          from: username,
          to: activeUser.socketId,
        });

      }, 1000);
  };

  return (
    <div className="inputBar">

      <input
        value={message}
        onChange={handleTyping}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>
  );
}

export default MessageInput;