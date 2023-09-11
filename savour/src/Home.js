import CenterText from './CenterText.js';
import Button from './Button.js';
import './Home.css';

/**
 * Home
 * Props: none
 * Renders home page
*/
const Home = () => {

  const pgh1 = `Savour is a recipe app that is built to
    give the user access to recipes and tools to support recipes.
    With savour, a user may search/like/dislike/try/save/share a recipe,
    create a custom version of a recipe, create a recipelist with
    recipes for an occasion, create a shoppinglist, and more. Savour
    has recipes for beginners and experts also.`;

  const pgh2 = `lunch, breakfast, sweet treats,
    dinner, storecupboard, desserts, cheese,
    fish and seafood, pasta, vegan, kids' baking, meat, chicken,
    savoury pastries, keto, low calorie, salads, vegan, baking,
    bread, cakes, quick bakes, biscuits,
    high protein, free from baking, breakfast, dinner, smoothies,
    fitness & lifestyle, lunch.`;

  return (
    <>
    <h1 className="Home-h1">Welcome to Savour – The recipe app</h1>
    <div className="Home-p">
      <h2 className="Home-subtitle">What is Savour</h2>
      <CenterText text={pgh1} color="black" fontSize={23} />
    </div>
    <div className="Home-p">
      <h2 className="Home-subtitle">Recipe Categories</h2>
      <CenterText text={pgh2} color="black" fontSize={23} />
    </div>
    <div className="Home-button">
      <Button buttonText="RECIPES" link="/recipes" />
      <Button buttonText="CONTACT" link="/contact" />
    </div>
    </>
  );
}


export default Home;