import React, { memo } from "react";
import "./Bubble.css";

import { USER, THINKING } from "../../Constants";

const USER_BUBBLE_COLOR = "#4949e7";
const BOT_BUBBLE_COLOR = "#f2f2f2";
const USER_INK_COLOR = "#fff";
const BOT_INK_COLOR = "#000";

const TEXT_BUBBLE_STYLES = (type, content) => ({
  backgroundColor: type === USER ? USER_BUBBLE_COLOR : BOT_BUBBLE_COLOR,
  color: type === USER ? USER_INK_COLOR : BOT_INK_COLOR,
  alignSelf: type === USER ? "flex-end" : "flex-start",
  wordBreak: content.includes(" ") ? "normal" : "break-all"
});

const GIF_BUBBLES_STYLES = {
  backgroundColor: "transparent",
  alignSelf: "flex-start"
};

const THINKING_BUBBLES_STYLES = {
  backgroundColor: BOT_BUBBLE_COLOR,
  alignSelf: "flex-start",
  minWidth: "30px",
  minHeight: "12px"
};

const Bubble = memo(({ type, bubbleType, content }) => {
  const renderText = () => (
    <div className="bubble" style={TEXT_BUBBLE_STYLES(type, content)}>
      <p className="bubble-text">{content}</p>
    </div>
  );
  const renderThinking = () => (
    <div className="bubble" style={THINKING_BUBBLES_STYLES}>
      <div className="thinker t1" />
      <div className="thinker t2" />
      <div className="thinker t3" />
    </div>
  );

  const renderGif = () => (
    <div className="bubble" style={GIF_BUBBLES_STYLES}>
      <img src={content} alt="gif bot" className="gif-img" />
    </div>
  );

  return type !== THINKING
    ? bubbleType === "text"
      ? renderText()
      : renderGif()
    : renderThinking();
});

export default Bubble;
