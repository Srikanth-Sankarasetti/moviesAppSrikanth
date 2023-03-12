import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: 'rahul',
    password: 'rahul@2021',
    isErrorInput: false,
    errorMsg: '',
    isShowPasswordActive: false,
  }

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  showPasswordClicked = event => {
    this.setState({isShowPasswordActive: event.target.checked})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccessSubmit = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    const {history} = this.props
    history.replace('/')
  }

  onFailureSubmit = error => {
    this.setState({isErrorInput: true, errorMsg: error})
  }

  formSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const details = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(details),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    if (response.ok === true) {
      const data = await response.json()
      this.onSuccessSubmit(data.jwt_token)
    } else {
      const data = await response.json()
      this.onFailureSubmit(data.error_msg)
    }
  }

  render() {
    const {
      username,
      password,
      isErrorInput,
      errorMsg,
      isShowPasswordActive,
    } = this.state
    const passwordText = isShowPasswordActive ? 'text' : 'password'
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-main-container">
        <img
          className="login-website-logo"
          src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675173753/Group_7399_btlhcd.png"
          alt="login website logo"
        />
        <form className="login-form-container" onSubmit={this.formSubmit}>
          <h1 className="login-head">Login</h1>
          <div className="login-input-container">
            <label className="username-label" htmlFor="username">
              USERNAME
            </label>
            <input
              className="username-input"
              type="text"
              placeholder="USERNAME"
              id="username"
              value={username}
              onChange={this.changeUsername}
            />
          </div>
          <div className="login-password-container">
            <label className="username-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="username-input"
              type={passwordText}
              placeholder="PASSWORD"
              id="password"
              value={password}
              onChange={this.changePassword}
            />
          </div>
          <div className="check-box-container">
            <input
              type="checkbox"
              id="checkbox"
              onChange={this.showPasswordClicked}
            />
            <label className="show-password-label" htmlFor="checkbox">
              Show Password
            </label>
          </div>
          {isErrorInput && <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
