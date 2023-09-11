import './CenterText.css';

/**
 * CenterText
 * Props: text, color, fontSize
 * Renders a paragraph element.
*/
const CenterText = ({ text, color, fontSize }) => {
  const styles = {
    color,
    fontSize
  };
  return (
    <p style={styles}>{text}</p>
  );
}

export default CenterText;