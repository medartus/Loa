import React, {
  useEffect,
  useContext,
  useReducer,
  useCallback,
  memo,
  useRef
} from "react";
import "./Chat.css";

import { IoMdSend } from "react-icons/io";
import ResizableTextarea from "../ResizableTextarea";
import Bubble from "../Bubble";

import logo from "../../assets/logo.png";
import {
  BOT,
  USER,
  THINKING,
  INIT_BUBBLES,
  ERROR_BUBBLES
} from "../../Constants";
import Context from "../../Context";

const ICON_COLOR = "#4949e7";
const NO_LOCATION_MESSAGE =
  "Oh, I can't access your location. 📍 Please allow me to access it so I can help you.";
const ICON_SIZE = 32;

// reducer and init state for the Chat component
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BUBBLES":
      return { ...state, bubbles: action.payload };
    case "SET_SHOULD_SEND":
      return { ...state, shouldSend: action.payload };
    case "SET_BOT_RESPONSE":
      return { ...state, botResponse: action.payload };
    default:
      return state;
  }
};

const initialState = {
  bubbles: INIT_BUBBLES,
  shouldSend: false,
  botResponse: null
};

// helper functions
const filteredThinking = bubbles => [
  ...bubbles.filter(b => b.type !== THINKING)
];

const callApi = (input, userLocation) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: input,
      user: { coordinates: userLocation }
    })
  };
  const endpoint = process.env.REACT_APP_API_ENDPOINT;
  return fetch(`${endpoint}/api/v1/message/`, requestOptions);
};

// memoizing the two presentational components
const Header = memo(() => (
  <div className="header-chat">
    <img src={logo} alt="Loa" className="header-logo" />
    <p className="header-chat-text">Loa</p>
  </div>
));

const BubbleContainer = memo(({ bubbles }) => (
  <div className="bubbles-container">
    {bubbles.map((b, i) => (
      <Bubble key={i} {...b} />
    ))}
  </div>
));

const Chat = () => {
  const [{ bubbles, shouldSend, botResponse }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // this ref will contain the message from the user
  const messageRef = useRef("");
  // get location and restaurants setter from Context
  const { userLocation, setRestaurants } = useContext(Context);

  const handleSend = () => {
    dispatch({
      type: "SET_BUBBLES",
      payload: [
        { type: THINKING, content: null, bubbleType: "text" },
        {
          type: USER,
          content: messageRef.current,
          bubbleType: "text"
        },
        ...filteredThinking(bubbles)
      ]
    });
    dispatch({ type: "SET_SHOULD_SEND", payload: false });
  };

  // wrapped in useCallback to not change on every render as a useEffect dependency (see below)
  const handleSendMemo = useCallback(handleSend, [bubbles, dispatch]);

  useEffect(() => {
    if (shouldSend) handleSendMemo();
  }, [shouldSend, handleSendMemo]);

  const fetchRestaurantsMemo = useCallback(() => {
    const inputValue = messageRef.current;
    if (inputValue && inputValue !== "") {
      if (userLocation !== null) {
        const input = inputValue.substr(0, inputValue.length - 1); // Remove '\n' caracter at the end
        // fetch restaurants
        callApi(input, userLocation)
          .then(response => response.json())
          .then(data => {
            const results = data.results !== null ? data.results : [];
            dispatch({ type: "SET_BOT_RESPONSE", payload: data.message });
            setRestaurants(results);
          })
          .catch(e => {
            console.log(e);
            dispatch({ type: "SET_BOT_RESPONSE", payload: ERROR_BUBBLES });
            setRestaurants([]);
          });
      } else {
        dispatch({
          type: "SET_BOT_RESPONSE",
          payload: [{ type: "text", content: NO_LOCATION_MESSAGE }]
        });
      }
    }
  }, [userLocation, dispatch, setRestaurants, messageRef]);

  useEffect(() => {
    if (bubbles.length > 1) {
      const { type } = bubbles[0];
      // user has sent last message, we stop thinking the previous ones ane push thinking to last (fetch restaurants)
      if (type === THINKING) fetchRestaurantsMemo();
    }
  }, [bubbles, fetchRestaurantsMemo]);

  // we received bots responses, and reset the bubbles
  useEffect(() => {
    if (botResponse !== null) {
      let newBubbles = botResponse.map(b => ({
        type: BOT,
        bubbleType: b.type,
        content: b.content
      }));
      newBubbles.push(...filteredThinking(bubbles));
      dispatch({ type: "SET_BUBBLES", payload: newBubbles });
      dispatch({ type: "SET_BOT_RESPONSE", payload: null });
    }
  }, [botResponse]);

  // wrapped in callbakc because passed to ResizableTextarea, and shouldn't change on every render
  const setShouldSendMemo = useCallback(
    payload => dispatch({ type: "SET_SHOULD_SEND", payload }),
    [dispatch]
  );

  const renderInput = () => (
    <div className="chat-input-container">
      <ResizableTextarea
        className="chat-input"
        placeholder="Send a message..."
        messageRef={messageRef}
        setShouldSend={setShouldSendMemo}
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
      <Header />
      <BubbleContainer bubbles={bubbles} />
      {renderInput()}
    </div>
  );
};

export default Chat;
