import './index.css'

const NotFound = props => {
  const goToHomeClicked = () => {
    const {history} = props
    history.replace('/')
  }
  return (
    <div className="notfound-main-Container">
      <h1 className="not-found-head">Lost Your Way ?</h1>
      <p className="notfound-para">
        we are sorry the page you requested could not be found Please go back to
        the homepage.
      </p>
      <button
        type="button"
        className="notfound-button"
        onClick={goToHomeClicked}
      >
        Go to Home
      </button>
    </div>
  )
}

export default NotFound
