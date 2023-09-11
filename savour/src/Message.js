import './Message.css';

/**
 * Message
 * Props: msgObj that has class and msg properties.
 * Renders message div.
*/
const Message = ({ msgObj }) => {

  return (
      <div className={`Message-${msgObj.class}`}>
        <p>{msgObj.msg}</p>
      </div>
  );
}

export default Message;