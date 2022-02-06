import React, { useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";

const Togglable = React.forwardRef((props, ref) => {
  const { children, buttonText } = props;
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonText}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  children: PropTypes.element.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default Togglable;
