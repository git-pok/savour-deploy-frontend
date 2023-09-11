import CenterText from './CenterText.js';
import useToggleState from './hooks/useToggleState.js';
import './PageNotFound.css';

/**
 * PageNotFound
 * Props: none
 * Renders page not found.
*/
const PageNotFound = () => {
  return (
    <div className="PageNotFound">
      <div className="PageNotFound-text">
        <CenterText text={"Page Not Found"} color="black" fontSize={60} />
        <CenterText text={"Click back button or a menu tab!"} color="black" fontSize={23} />
      </div>
    </div>
  );
}

export default PageNotFound;