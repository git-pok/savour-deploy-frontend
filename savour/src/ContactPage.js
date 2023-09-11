import './ContactPage.css';

/**
 * ContactPage
 * Props: none.
 * Renders the contact page.
*/
const ContactPage = () => {

  return (
    <>
      <h1 className="ContactPage-h1">App Creator and Developer Information</h1>
      <div className="ContactPage">
        <div className="ContactPage-div">
          <h2 className="ContactPage-subtitle">Name</h2>
          <p className="ContactPage-short-text">Vincent</p>
          <h2 className="ContactPage-subtitle">Nickname</h2>
          <p className="ContactPage-short-text">Fvin</p>
          <h2 className="ContactPage-subtitle">Email</h2>
          <p className="ContactPage-short-text">vincent.impreveduto.work@gmail.com</p>
          <h2 className="ContactPage-subtitle">Location</h2>
          <p className="ContactPage-short-text">Tampa Florida</p>
        </div>
      </div>
    </>
  );
}

export default ContactPage;