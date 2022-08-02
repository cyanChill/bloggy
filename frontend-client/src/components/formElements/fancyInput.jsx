import { useState, useEffect } from "react";

import styles from "./fancyInput.module.css";

const FancyInput = ({ className, value, inputConfig, inputLabel }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const inputConfigs = { type: "text", ...inputConfig };

  /* eslint-disable */
  useEffect(() => {
    if (!value) setIsFocused(false);
    else setIsFocused(true);
  }, []);

  const onInputFocus = () => {
    setIsFocused(true);
  };

  const onInputUnFocus = () => {
    if (!inputValue) {
      setIsFocused(false);
    }
  };

  return (
    <div className={`${styles.fancyInput} ${className}`}>
      <input
        {...inputConfigs}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={onInputFocus}
        onBlur={onInputUnFocus}
      />
      <label className={isFocused ? styles.focused : null}>{inputLabel}</label>
    </div>
  );
};

export default FancyInput;
