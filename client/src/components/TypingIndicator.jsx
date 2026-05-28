function TypingIndicator({ typingUser }) {

  if (!typingUser) return null;

  return (
    <div className="typing">

      {typingUser} is typing

      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>
  );
}

export default TypingIndicator;