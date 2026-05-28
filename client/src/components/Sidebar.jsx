function Sidebar({
  users,
  username,
  activeUser,
  openChat,
  lastMessage,
  unread,
}) {
  return (
    <div className="sidebar">

      <div className="brand">
        💬 Chat
      </div>

      {users
        .filter((u) => u.username !== username)
        .map((user) => (
          <div
            key={user.socketId}
            className={`user ${
              activeUser?.socketId === user.socketId
                ? "active"
                : ""
            }`}
            onClick={() => openChat(user)}
          >

            <div className="avatar">
              {user.username[0]?.toUpperCase()}
            </div>

            <div className="info">
              <div>{user.username}</div>

              <div className="preview">
                {lastMessage[user.username] ||
                  "No messages yet"}
              </div>
            </div>

            {unread[user.username] && (
              <div className="dot" />
            )}
          </div>
        ))}
    </div>
  );
}

export default Sidebar;