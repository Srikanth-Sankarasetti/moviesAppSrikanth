import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import './index.css'
import LoaderData from '../LoaderData'
import Header from '../Header'
import Contacts from '../Contacts'

const initialPopularApiStatus = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {
    popularList: [],
    popularApiStatus: initialPopularApiStatus.initial,
  }

  componentDidMount() {
    this.getPopularData()
  }

  getPopularData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({popularApiStatus: initialPopularApiStatus.progress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/popular-movies',
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const popularResult = data.results
      const filterPopularData = popularResult.map(each => ({
        posterPath: each.poster_path,
        id: each.id,
        title: each.title,
        overview: each.overview,
        backdropPath: each.backdrop_path,
      }))
      this.setState({
        popularList: filterPopularData,
        popularApiStatus: initialPopularApiStatus.success,
      })
    } else {
      this.setState({popularApiStatus: initialPopularApiStatus.failure})
    }
  }

  popularTryClicked = () => {
    this.getPopularData()
  }

  renderPopularLoader = () => (
    <div className="popular-loader">
      <LoaderData />
    </div>
  )

  renderPopularFailureData = () => (
    <div className="popular-failure-container">
      <img
        className="failure-image"
        src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675357761/Background-Complete_l4q3h3.png"
        alt="failure view"
      />
      <p className="popular-failure-para">
        Something went wrong. Please try again
      </p>
      <button
        className="popular-try-again"
        type="button"
        onClick={this.popularTryClicked}
      >
        Try Again
      </button>
    </div>
  )

  renderPopularData = () => {
    const {popularList} = this.state
    return (
      <>
        <ul className="popular-ul-list">
          {popularList.map(each => (
            <li key={each.id}>
              <Link to={`/movies/${each.id}`}>
                <img
                  className="popular-image"
                  src={each.posterPath}
                  alt={each.title}
                />
              </Link>
            </li>
          ))}
        </ul>
        <Contacts />
      </>
    )
  }

  renderPopularOnStatus = () => {
    const {popularApiStatus} = this.state
    switch (popularApiStatus) {
      case initialPopularApiStatus.progress:
        return this.renderPopularLoader()
      case initialPopularApiStatus.success:
        return this.renderPopularData()
      case initialPopularApiStatus.failure:
        return this.renderPopularFailureData()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-main-container">
        <Header />
        {this.renderPopularOnStatus()}
      </div>
    )
  }
}

export default Popular
