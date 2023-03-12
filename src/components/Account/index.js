import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'
import Header from '../Header'
import Contacts from '../Contacts'

const Account = props => {
  const logoutClicked = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="account-main-container">
      <Header />
      <div className="account-container">
        <div className="account-details">
          <h1 className="account-head">Account</h1>
          <hr />
          <div className="membership-container">
            <p className="membership-para">Member Ship</p>
            <div>
              <p className="gmail-para">learnnew0449@gmail.com</p>
              <p className="password-para">Password:***********</p>
            </div>
          </div>
          <hr />
          <div className="plan-details-container">
            <p className="membership-para">Plan Details</p>
            <div className="premium-container">
              <p className="gmail-para">Premium</p>
              <p className="ultra-para">Ultra HD</p>
            </div>
          </div>
          <hr />
        </div>
        <button type="button" className="logout-button" onClick={logoutClicked}>
          Logout
        </button>
      </div>
      <Contacts />
    </div>
  )
}

export default withRouter(Account)
