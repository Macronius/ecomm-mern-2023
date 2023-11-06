import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  return (
  <Alert variant={variant}>{children}</Alert>)
};

// set default values
Message.defaultProps = {
  variant: "info",
};

export default Message;
