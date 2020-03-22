import React from "react";
import "./Bubble.css";

import { USER, THINKING } from "../../Constants";

const Bubble = ({ type, message }) => {
  // const getStyles = () => {};
  const renderClassic = () => (
    <div
      className="bubble"
      style={{
        backgroundColor: type === USER ? "#4949e7" : "#f2f2f2",
        color: type === USER ? "white" : "black",
        alignSelf: type === USER ? "flex-end" : "flex-start",
        wordBreak: message.includes(" ") ? "normal" : "break-all"
      }}
    >
      <p className="bubble-text">{message}</p>
    </div>
  );
  const renderThinking = () => (
    <div
      className="bubble"
      style={{
        backgroundColor: "#f2f2f2",
        alignSelf: "flex-start",
        minWidth: "30px",
        minHeight: "12px"
      }}
    >
      <div className="thinker t1" />
      <div className="thinker t2" />
      <div className="thinker t3" />
    </div>
  );
  return type !== THINKING ? renderClassic() : renderThinking();
};

export default Bubble;
