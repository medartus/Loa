import React, { useState } from "react";
import "./ResizableTextarea.css";

const ResizableTextarea = ({
  inputValue,
  setInputValue,
  setShouldSend,
  ...rest
}) => {
  const [state, setState] = useState({
    rows: 1,
    minRows: 1,
    maxRows: 10
  });

  const handleChange = event => {
    const textareaLineHeight = 20;
    const { minRows, maxRows } = state;
    const newValue = event.target.value;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    let currentRows = Math.floor(
      event.target.scrollHeight / textareaLineHeight
    );
    if (newValue.includes("\n")) currentRows = minRows;

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }
    // reset auto rows
    setState({
      ...state,
      rows: Math.min(currentRows, maxRows)
    });
    // if content is valid to be sent
    if (
      newValue.includes("\n") &&
      newValue.split("").some(letter => letter !== "\n" && letter !== " ")
    ) {
      setShouldSend(true);
    }

    setInputValue(newValue);
  };

  return (
    <textarea
      {...rest}
      style={{
        resize: "none",
        width: inputValue.length === 0 ? "100%" : "80%"
      }}
      rows={state.rows}
      value={inputValue}
      onChange={e => handleChange(e)}
    />
  );
};

export default ResizableTextarea;
