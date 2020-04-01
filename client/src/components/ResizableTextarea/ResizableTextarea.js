import React, { useState, memo, useLayoutEffect, useRef } from "react";
import "./ResizableTextarea.css";

const TEXTAREA_LINE_HEIGHT = 22;
const MIN_ROWS = 1;
const MAX_ROWS = 10;
const TEXTAREA_STYLES = inputValue => ({
  resize: "none",
  lineHeight: 1,
  width: inputValue.length === 0 ? "100%" : "80%"
});

const ResizableTextarea = memo(({ setShouldSend, messageRef, ...props }) => {
  const [rows, setRows] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    if (inputValue !== "") {
      const newValue = textareaRef.current.value;
      const previousRows = textareaRef.current.rows;
      textareaRef.current.rows = MIN_ROWS; // reset number of rows in textarea

      let currentRows = Math.floor(
        textareaRef.current.scrollHeight / TEXTAREA_LINE_HEIGHT
      );

      const includesReturn = newValue.includes("\n");
      // reset to minRows when no content
      if (includesReturn) currentRows = MIN_ROWS;
      // if number of rows didn't change, reset to what it was
      if (currentRows === previousRows) textareaRef.current.rows = currentRows;
      // if content exceeds threshold, clip to maxrows
      if (currentRows >= MAX_ROWS) {
        textareaRef.current.rows = MAX_ROWS;
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
      // reset rows
      setRows(Math.min(currentRows, MAX_ROWS));
      // if content is valid to be sent, send it
      const isNotEmpty = newValue
        .split("")
        .some(letter => letter !== "\n" && letter !== " ");
      if (includesReturn && isNotEmpty) {
        messageRef.current = newValue;
        setInputValue("");
        setShouldSend(true);
      }
    }
  }, [inputValue, textareaRef, setRows, setShouldSend, messageRef]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      style={TEXTAREA_STYLES(inputValue)}
      rows={rows}
      value={inputValue}
      onChange={({ target: { value } }) => setInputValue(value)}
    />
  );
});

export default ResizableTextarea;
