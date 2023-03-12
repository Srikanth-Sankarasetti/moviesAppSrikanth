import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaExclamationTriangle} from 'react-icons/fa'
import {withRouter} from 'react-router-dom'

import Header from '../Header'
import LoaderData from '../LoaderData'
import './index.css'

const initialApiStatus = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class HomeTitle extends Component {
  state = {
    posterDetails: [],
    apiStatus: initialApiStatus.initial,
  }

  componentDidMount() {
    this.getPosterDetails()
  }

  getPosterDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: initialApiStatus.progress})
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
      const value = Math.floor(Math.random() * data.results.length)
      const poster = data.results[value]
      const filterPosterDetails = {
        posterPath: poster.poster_path,
        id: poster.id,
        title: poster.title,
        overview: poster.overview,
        backdropPath: poster.backdrop_path,
      }
      this.setState({
        posterDetails: filterPosterDetails,
        apiStatus: initialApiStatus.success,
      })
    } else {
      this.setState({apiStatus: initialApiStatus.failure})
    }
  }

  tryAgainClicked = () => {
    this.getPosterDetails()
  }

  playButtonClicked = () => {
    const {posterDetails} = this.state
    const {id} = posterDetails
    const {history} = this.props
    history.replace(`/movies/${id}`)
  }

  renderHeaderDetails = () => {
    const {posterDetails} = this.state
    const {overview, title, backdropPath} = posterDetails
    return (
      <div
        style={{
          backgroundImage: `url(${backdropPath})`,
          backgroundSize: 'cover',
          minWidth: '100%',
          height: '70vh',
        }}
      >
        <Header />
        <div className="poster-title-container">
          <h1 className="main-poster-head">{title}</h1>
          <p className="main-poster-overview">{overview}</p>
          <button
            type="button"
            className="play-button"
            onClick={this.playButtonClicked}
          >
            Play
          </button>
        </div>
      </div>
    )
  }

  renderProgressDetails = () => (
    <>
      <div className="loader-main-container">
        <Header />
        <div className="loader-container">
          <LoaderData />
        </div>
      </div>
    </>
  )

  renderFailureDetails = () => (
    <div className="loader-main-container">
      <Header />
      <div className="loader-container">
        <FaExclamationTriangle color="red" size={25} />
        <p className="error-para">Something went wrong. Please try again</p>
        <button
          type="button"
          className="try-again-button"
          onClick={this.tryAgainClicked}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  renderHeadDataOnStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialApiStatus.progress:
        return this.renderProgressDetails()
      case initialApiStatus.success:
        return this.renderHeaderDetails()
      case initialApiStatus.failure:
        return this.renderFailureDetails()
      default:
        return null
    }
  }

  render() {
    return this.renderHeadDataOnStatus()
  }
}

export default withRouter(HomeTitle)
