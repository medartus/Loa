import React, { useState, useEffect } from "react";
import "./Chat.css";

import { IoMdSend } from "react-icons/io";
import ResizableTextarea from "../ResizableTextarea";
import Bubble from "../Bubble";

// import axios from "axios";

import logo from "../../assets/logo.png";
import { BOT, USER, THINKING, INIT_BUBBLES } from "../../Constants";

const NO_LOCATION_MESSAGE =
  "Oh, I can't access your location. Please allow me to access it so I can help you.";
const ICON_COLOR = "#4949e7";
const ICON_SIZE = 32;

const Chat = ({ userLocation, setRestaurants, setLoading, loading }) => {
  const [inputValue, setInputValue] = useState("");
  const [bubbles, setBubbles] = useState(INIT_BUBBLES);
  const [shouldSend, setShouldSend] = useState(false);
  const [botResponse, setBotResponse] = useState(null);

  useEffect(() => {
    const send = async () => {
      if (shouldSend) await handleSend();
    };
    send();
  }, [shouldSend]);

  useEffect(() => {
    const callApi = input => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          user: { coordinates: userLocation }
        })
      };
      return fetch("http://localhost:4000/v1/message/", requestOptions);
    };

    if (loading && userLocation !== null) {
      const input = inputValue.substr(0, inputValue.length - 1); // Remove '\n' caracter at the end
      setInputValue("");
      callApi(input)
        .then(response => response.json())
        .then(data => {
          const results = data.results !== null ? data.results : [];
          setBotResponse(data.message);
          setRestaurants(results);
          setLoading(false);
        })
        .catch(e => console.log(e));
    } else if (inputValue !== "" && userLocation === null) {
      setBotResponse(NO_LOCATION_MESSAGE);
      setInputValue("");
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (bubbles.length > 1) {
      const { type } = bubbles[0];
      // user has sent last message, we stop thinking the previous ones ane push thinking to last
      if (type === THINKING) setLoading(true);
    }
  }, [bubbles]);

  useEffect(() => {
    if (botResponse !== null) {
      setBubbles([
        { type: BOT, message: botResponse },
        ...bubbles.filter(b => b.type !== THINKING)
      ]);
      setBotResponse(null);
    }
  }, [botResponse]);

  const handleSend = async () => {
    setBubbles([
      { type: THINKING, message: null },
      { type: USER, message: inputValue },
      ...bubbles.filter(b => b.type !== THINKING)
    ]);
    setShouldSend(false);
  };

  const renderHeader = () => (
    <div className="header-chat">
      <img src={logo} alt="Loa" className="header-logo" />
      <p className="header-chat-text">Loa</p>
    </div>
  );
  const renderBubbleContainer = () => (
    <div className="bubbles-container">
      {bubbles.map((b, i) => (
        <Bubble key={i} {...b} />
      ))}
    </div>
  );
  const renderInput = () => (
    <div className="chat-input-container">
      <ResizableTextarea
        className="chat-input"
        placeholder="Send a message..."
        inputValue={inputValue}
        setInputValue={setInputValue}
        setShouldSend={setShouldSend}
      />
      <IoMdSend
        className="send-logo"
        onClick={() => handleSend()}
        color={ICON_COLOR}
        size={ICON_SIZE}
      />
    </div>
  );
  return (
    <div className="chat-container">
      {renderHeader()}
      {renderBubbleContainer()}
      {renderInput()}
    </div>
  );
};

export default Chat;
