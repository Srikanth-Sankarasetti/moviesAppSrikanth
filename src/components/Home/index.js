import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import {FaExclamationTriangle} from 'react-icons/fa'

import HomeTitle from '../HomeTitle'
import Contacts from '../Contacts'
import LoaderData from '../LoaderData'

import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const initialApiStatus = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    trendingList: [],
    topRatedList: [],
    originalsList: [],
    trendingApiStatus: initialApiStatus.initial,
    topRatedApiStatus: initialApiStatus.initial,
    originalApiStatus: initialApiStatus.initial,
  }

  componentDidMount() {
    this.getTrendingData()
    this.getTopRatedData()
    this.getOriginalsData()
  }

  getTrendingData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({trendingApiStatus: initialApiStatus.progress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/trending-movies',
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const trending = data.results
      const filterTrendingData = trending.map(each => ({
        posterPath: each.poster_path,
        id: each.id,
        title: each.title,
        overview: each.overview,
        backdropPath: each.backdrop_path,
      }))
      this.setState({
        trendingList: filterTrendingData,
        trendingApiStatus: initialApiStatus.success,
      })
    } else {
      this.setState({trendingApiStatus: initialApiStatus.failure})
    }
  }

  trendingTryAgainClicked = () => {
    this.getTrendingData()
  }

  getTopRatedData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({topRatedApiStatus: initialApiStatus.progress})
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
        topRatedApiStatus: initialApiStatus.success,
      })
    } else {
      this.setState({topRatedApiStatus: initialApiStatus.failure})
    }
  }

  topTrendTryAgainClicked = () => {
    this.getTopRatedData()
  }

  getOriginalsData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({originalApiStatus: initialApiStatus.progress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/originals',
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const Original = data.results
      const filterOriginalsData = Original.map(each => ({
        posterPath: each.poster_path,
        id: each.id,
        title: each.title,
        overview: each.overview,
        backdropPath: each.backdrop_path,
      }))
      this.setState({
        originalsList: filterOriginalsData,
        originalApiStatus: initialApiStatus.success,
      })
    } else {
      this.setState({originalApiStatus: initialApiStatus.failure})
    }
  }

  originalTryAgainClicked = () => {
    this.getOriginalsData()
  }

  renderTrendingData = () => {
    const {trendingList} = this.state
    return (
      <div className="trending-ul">
        <Slider {...settings}>
          {trendingList.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <img
                className="trending-image"
                src={each.posterPath}
                alt={each.title}
              />
            </Link>
          ))}
        </Slider>
      </div>
    )
  }

  renderTrendingLoader = () => (
    <div className="trending-loader">
      <LoaderData />
    </div>
  )

  renderTrendingFailureData = () => (
    <div className="trending-loader">
      <FaExclamationTriangle color="red" size={20} />
      <p className="main-poster-overview">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.trendingTryAgainClicked}
      >
        Try Again
      </button>
    </div>
  )

  renderTopRatedFailureData = () => (
    <div className="trending-loader">
      <FaExclamationTriangle color="red" size={20} />
      <p className="main-poster-overview">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.topTrendTryAgainClicked}
      >
        Try Again
      </button>
    </div>
  )

  renderOriginalFailureData = () => (
    <div className="trending-loader">
      <FaExclamationTriangle color="red" size={20} />
      <p className="main-poster-overview">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.originalTryAgainClicked}
      >
        Try Again
      </button>
    </div>
  )

  renderTrendingOnStatus = () => {
    const {trendingApiStatus} = this.state
    switch (trendingApiStatus) {
      case initialApiStatus.progress:
        return this.renderTrendingLoader()
      case initialApiStatus.success:
        return this.renderTrendingData()
      case initialApiStatus.failure:
        return this.renderTrendingFailureData()
      default:
        return null
    }
  }

  renderTopRatedData = () => {
    const {topRatedList} = this.state
    return (
      <div className="trending-ul">
        <Slider {...settings}>
          {topRatedList.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <img
                className="trending-image"
                src={each.posterPath}
                alt={each.title}
              />
            </Link>
          ))}
        </Slider>
      </div>
    )
  }

  renderTopRatedOnStatus = () => {
    const {topRatedApiStatus} = this.state
    switch (topRatedApiStatus) {
      case initialApiStatus.progress:
        return this.renderTrendingLoader()
      case initialApiStatus.success:
        return this.renderTopRatedData()
      case initialApiStatus.failure:
        return this.renderTopRatedFailureData()
      default:
        return null
    }
  }

  renderOriginalData = () => {
    const {originalsList} = this.state
    return (
      <div className="trending-ul">
        <Slider {...settings}>
          {originalsList.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <img
                className="trending-image"
                src={each.posterPath}
                alt={each.title}
              />
            </Link>
          ))}
        </Slider>
      </div>
    )
  }

  renderOriginalDataOnSuccess = () => {
    const {originalApiStatus} = this.state
    switch (originalApiStatus) {
      case initialApiStatus.progress:
        return this.renderTrendingLoader()
      case initialApiStatus.success:
        return this.renderOriginalData()
      case initialApiStatus.failure:
        return this.renderOriginalFailureData()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="trending-and-container">
          <HomeTitle />
          <div className="trending-container">
            <h1 className="trending-head">Trending Now</h1>
            {this.renderTrendingOnStatus()}
          </div>
          <div className="trending-container">
            <h1 className="trending-head">Top Rated</h1>
            {this.renderTopRatedOnStatus()}
          </div>
          <div className="trending-container">
            <h1 className="trending-head">Originals</h1>
            {this.renderOriginalDataOnSuccess()}
          </div>
          <Contacts />
        </div>
      </>
    )
  }
}

export default Home
