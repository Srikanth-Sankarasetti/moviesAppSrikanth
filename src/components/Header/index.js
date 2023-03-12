import {useState} from 'react'
import {withRouter, Link} from 'react-router-dom'
import './index.css'
import {HiOutlineSearch, HiOutlineMenu} from 'react-icons/hi'

const Header = props => {
  const [isMenuActive, setMenuData] = useState(false)

  const menuUpdate = () => {
    setMenuData(prevState => !isMenuActive)
  }

  const searchButtonClicked = () => {
    const {history} = props
    history.replace('/search')
  }
  const pad = isMenuActive ? 'sub' : ''
  const {match} = props
  const {path} = match
  const homeColor = path === '/' ? 'tab-color-update' : ''
  const popularColor = path === '/popular' ? 'tab-color-update' : ''
  const accountColor = path === '/account' ? 'tab-color-update' : ''

  return (
    <nav className="header-main-container">
      <div className={`sub-container ${pad}`}>
        <div className="header-sub-container">
          <Link to="/">
            <img
              className="home-website-logo"
              src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675173753/Group_7399_btlhcd.png"
              alt="website logo"
            />
          </Link>
          <ul className="header-ul">
            <Link to="/" className={`header-link ${homeColor}`}>
              <li>Home</li>
            </Link>
            <Link to="/popular" className={`header-link ${popularColor}`}>
              <li>Popular</li>
            </Link>
          </ul>
        </div>
        <div className="search-and-profile-container">
          <div>
            <button
              type="button"
              className="button-search"
              testid="searchButton"
              onClick={searchButtonClicked}
            >
              <HiOutlineSearch color="#ffffff" size={18} />
            </button>
          </div>
          <Link to="/account">
            <img
              className="profile-image"
              src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675189771/Avatar_bj1bi3.png"
              alt="profile"
            />
          </Link>
          <button type="button" className="menu-button" onClick={menuUpdate}>
            <HiOutlineMenu color="#ffffff" size={18} />
          </button>
        </div>
      </div>
      {isMenuActive && (
        <div className="mobile-menu-container">
          <ul className="mobile-ul-list">
            <Link to="/" className={`header-link ${homeColor}`}>
              <li className="mobile-home-tab">Home</li>
            </Link>
            <Link to="/popular" className={`header-link ${popularColor}`}>
              <li className="mobile-home-tab">Popular</li>
            </Link>
            <Link to="/account" className={`header-link ${accountColor}`}>
              <li className="mobile-home-tab">Account</li>
            </Link>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default withRouter(Header)
