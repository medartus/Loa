import React from "react";
import "./Bubble.css";

import { USER, THINKING } from "../../Constants";

const Bubble = ({ type, bubbleType, content }) => {
  const renderText = () => (
    <div
      className="bubble"
      style={{
        backgroundColor: type === USER ? "#4949e7" : "#f2f2f2",
        color: type === USER ? "white" : "black",
        alignSelf: type === USER ? "flex-end" : "flex-start",
        wordBreak: content.includes(" ") ? "normal" : "break-all"
      }}
    >
      <p className="bubble-text">{content}</p>
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

  const renderGif = () => (
    <div
      className="bubble"
      style={{
        backgroundColor: "transparent",
        alignSelf: "flex-start"
      }}
    >
      <img src={content} alt="gif bot" className="gif-img" />
    </div>
  );

  return type !== THINKING
    ? bubbleType === "text"
      ? renderText()
      : renderGif()
    : renderThinking();
};

export default Bubble;
