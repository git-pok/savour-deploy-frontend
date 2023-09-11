import { Link } from 'react-router-dom';
import './Button.css';

/**
 * Button
 * Creates a link button.
 * Props: buttonText, link
 * Renders a button that is a link.
*/
const Button = ({ buttonText, link }) => {
  return (
    <div className="Button">
      <Link exact="true" to={link}>
        <button className="Button-button">{buttonText}</button>
      </Link>
    </div>
  );
}

export default Button;