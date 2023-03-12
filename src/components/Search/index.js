import {Component} from 'react'
import {Link} from 'react-router-dom'
import {HiOutlineSearch, HiOutlineMenu} from 'react-icons/hi'
import Cookies from 'js-cookie'

import './index.css'
import LoaderData from '../LoaderData'

const initialApiStatus = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Search extends Component {
  state = {
    searchList: [],
    isMenuActive: false,
    inputValue: '',
    inputString: '',
    isSearchListEmpty: false,
    searchApiStatus: initialApiStatus.initial,
    topRatedList: [],
    isListEmpty: true,
  }

  componentDidMount() {
    this.getTopRatedData()
  }

  menuUpdate = () => {
    this.setState(prevstate => ({
      isMenuActive: !prevstate.isMenuActive,
    }))
  }

  searchInputChange = event => {
    this.setState({inputValue: event.target.value})
  }

  searchButtonClicked = async () => {
    const {inputValue} = this.state
    this.setState({isListEmpty: false, isSearchListEmpty: false})
    if (inputValue !== '') {
      const jwtToken = Cookies.get('jwt_token')
      this.setState({searchApiStatus: initialApiStatus.progress})
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(
        `https://apis.ccbp.in/movies-app/movies-search?search=${inputValue}`,
        options,
      )
      if (response.ok === true) {
        const data = await response.json()
        const searchValue = data.results
        if (searchValue.length !== 0) {
          const filterSearchResult = searchValue.map(each => ({
            posterPath: each.poster_path,
            id: each.id,
            title: each.title,
            overview: each.overview,
            backdropPath: each.backdrop_path,
          }))
          this.setState({
            searchList: filterSearchResult,
            isSearchListEmpty: false,
            searchApiStatus: initialApiStatus.success,
          })
        } else {
          this.setState({
            isSearchListEmpty: true,
            searchApiStatus: initialApiStatus.initial,
            inputString: inputValue,
          })
        }
      } else {
        this.setState({searchApiStatus: initialApiStatus.failure})
      }
    } else {
      this.setState({
        searchList: [],
        isSearchListEmpty: false,
        isListEmpty: true,
      })
    }
  }

  getTopRatedData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({
      topRatedApiStatus: initialApiStatus.progress,
    })
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/top-rated-movies',
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const topRated = data.results
      const filterToprated = topRated.map(each => ({
        posterPath: each.poster_path,
        id: each.id,
        title: each.title,
        overview: each.overview,
        backdropPath: each.backdrop_path,
      }))
      this.setState({
        topRatedList: filterToprated,
      })
    }
  }

  searchTryClicked = () => {
    this.searchButtonClicked()
  }

  renderSearchHeader = () => {
    const {isMenuActive} = this.state
    const pad = isMenuActive ? 'sub' : ''
    const {match} = this.props
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
          <div className="search-and-profile-container1">
            <div className="search-container">
              <input
                className="inputData"
                type="search"
                placeholder="Search"
                onChange={this.searchInputChange}
              />
              <button
                type="button"
                className="search-button"
                testid="searchButton"
                onClick={this.searchButtonClicked}
              >
                <HiOutlineSearch color="#ffffff" size={10} />
              </button>
            </div>

            <Link to="/account">
              <img
                className="profile-image"
                src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675189771/Avatar_bj1bi3.png"
                alt="profile"
              />
            </Link>
            <button
              type="button"
              className="menu-button"
              onClick={this.menuUpdate}
            >
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

  renderSearchData = () => {
    const {searchList} = this.state
    return (
      <ul className="search-ul-list">
        {searchList.map(each => (
          <li key={each.id}>
            <Link to={`/movies/${each.id}`}>
              <img
                className="search-image"
                src={each.posterPath}
                alt={each.title}
              />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderLoaderData = () => (
    <div className="search-loader-container">
      <LoaderData />
    </div>
  )

  renderSearchFailureData = () => (
    <div className="search-failure-container">
      <img
        className="search-failure-image"
        src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675357761/Background-Complete_l4q3h3.png"
        alt="failure view"
      />
      <p className="search-failure-para">
        Something went wrong, Please try again.
      </p>
      <button
        className="search-try-button"
        type="button"
        onClick={this.searchTryClicked}
      >
        Try Again
      </button>
    </div>
  )

  rendSearchOnStatus = () => {
    const {searchApiStatus} = this.state
    switch (searchApiStatus) {
      case initialApiStatus.progress:
        return this.renderLoaderData()
      case initialApiStatus.success:
        return this.renderSearchData()
      case initialApiStatus.failure:
        return this.renderSearchFailureData()
      default:
        return null
    }
  }

  renderSearchNoMovies = () => {
    const {inputString} = this.state
    return (
      <div className="no-movie-container">
        <img
          className="no-movie-image"
          src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675364948/Group_7394_o5vlfg.png"
          alt="no movies"
        />
        <p className="no-movie-para">
          Your search for {inputString} did not find any matches.
        </p>
      </div>
    )
  }

  renderTopRatedData = () => {
    const {topRatedList} = this.state
    return (
      <div className="top-search-main-container">
        <h1 className="top-search-head">Top Search Movies</h1>
        <ul className="top-search-ul-list">
          {topRatedList.map(each => (
            <li key={each.id}>
              <Link to={`/movies/${each.id}`}>
                <img
                  className="top-search-movie-image"
                  src={each.posterPath}
                  alt={each.title}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {isSearchListEmpty, isListEmpty} = this.state
    return (
      <div className="search-main-header">
        {this.renderSearchHeader()}
        {isListEmpty && this.renderTopRatedData()}
        {this.rendSearchOnStatus()}
        {isSearchListEmpty && this.renderSearchNoMovies()}
      </div>
    )
  }
}

export default Search
