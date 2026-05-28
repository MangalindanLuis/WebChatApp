import { useEffect } from "react";

export function useSocket({
  socket,
  activeUser,
  username,
  setUsers,
  setMessagesByUser,
  setLastMessage,
  setUnread,
  setTypingUser,
}) {

  useEffect(() => {

    socket.on("users", setUsers);

    // RECEIVE MESSAGE
    socket.on(
      "receive_private_message",
      ({ from, message }) => {

        setMessagesByUser((prev) => ({
          ...prev,
          [from]: [
            ...(prev[from] || []),
            {
              from,
              message,
              seen: true,
            },
          ],
        }));

        setLastMessage((prev) => ({
          ...prev,
          [from]: message,
        }));

        // AUTO SEEN
        if (activeUser?.username === from) {

          socket.emit("message_seen", {
            to: activeUser.socketId,
            from: username,
          });

          setUnread((prev) => ({
            ...prev,
            [from]: false,
          }));

        } else {

          setUnread((prev) => ({
            ...prev,
            [from]: true,
          }));
        }
      }
    );

    // TYPING
    socket.on("user_typing", ({ from }) => {

      if (activeUser?.username === from) {
        setTypingUser(from);
      }
    });

    socket.on(
      "user_stop_typing",
      ({ from }) => {

        setTypingUser((prev) =>
          prev === from ? null : prev
        );
      }
    );

    // SEEN
    socket.on("messages_seen", ({ from }) => {

      setMessagesByUser((prev) => {

        const updated = { ...prev };

        if (!updated[from]) return prev;

        updated[from] = updated[from].map(
          (msg) => {

            if (msg.from === username) {
              return {
                ...msg,
                seen: true,
              };
            }

            return msg;
          }
        );

        return updated;
      });
    });

    return () => {
      socket.off("users");
      socket.off("receive_private_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("messages_seen");
    };

  }, [activeUser, username]);
}