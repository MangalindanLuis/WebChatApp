function MessageList({
  messages,
  username,
  messagesEndRef,
}) {
  return (
    <div className="messages">

      {messages.map((m, i) => (
        <div
          key={i}
          className={
            m.from === username
              ? "messageWrap meWrap"
              : "messageWrap otherWrap"
          }
        >

          {/* MESSAGE */}
          <div
            className={
              m.from === username
                ? "msg me"
                : "msg other"
            }
          >
            {m.message}
          </div>

          {/* SEEN STATUS */}
          {m.from === username && (
            <div
              className={`seenStatus ${
                m.seen ? "seenActive" : ""
              }`}
            >
              {m.seen ? "Seen" : "Sent"}
            </div>
          )}
        </div>
      ))}

      <div ref={messagesEndRef} />

    </div>
  );
}

export default MessageList;