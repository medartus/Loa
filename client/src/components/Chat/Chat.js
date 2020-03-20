import React, { useState, useEffect } from "react";
import "./Chat.css";

import { IoMdSend } from "react-icons/io";
import ResizableTextarea from "../ResizableTextarea";
import Bubble from "../Bubble";

import axios from "axios";

import logo from "../../assets/logo.png";
import { BOT, USER, THINKING, BOT_WRITE_TIME } from "../../Constants";

const testBubbles = [
  {
    type: BOT,
    message:
      "Hi, I'm Loa, a new friend of yours that will help you choose among thousands of restaurants in the US! 🤤"
  }
];

const Chat = ({userLocation,setRestaurants}) => {
  const [inputValue, setInputValue] = useState("");
  const [bubbles, setBubbles] = useState(testBubbles);
  const [shouldSend, setShouldSend] = useState(false);
  const [botResponse, setBotResponse] = useState(null);

  useEffect(() => {
    const send = async () => {
      if (shouldSend) await handleSend();
    };
    send();
  }, [shouldSend]);

  useEffect(() => {

    const callApi = () => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue, user :{coordinates:userLocation} })
      };
      console.log(requestOptions)
    return fetch('https://loa-bot.herokuapp.com/v1/message/', requestOptions)
  }

    const handleBubbles = async () => {
      if (bubbles.length > 1) {
        const { type } = bubbles[0];
        console.log(type);
        // user has sent last message, we stop thinking the previous ones ane push thinking to last
        if (type === THINKING) {
          // const prevMessage = bubbles[1];
          callApi().then( response => response.json())
                   .then( data => {
                      setBotResponse(data.message)
                      setRestaurants(data.results)
                    })
                   .catch(e => console.log(e)) 
        }
      }
    };
    handleBubbles(inputValue);
    setInputValue("")
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
        color="#4949e7"
        size={32}
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
