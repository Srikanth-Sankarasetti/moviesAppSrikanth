import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import {format} from 'date-fns'

import './index.css'
import Header from '../Header'
import LoaderData from '../LoaderData'

const initialApiStatus = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const MovieItemDetails = props => {
  const [profileDetails, setProfileData] = useState([])
  const [genersList, setGenerData] = useState([])
  const [spokenLanguageList, setLanguage] = useState([])
  const [similarMovies, setSimilarJobs] = useState([])
  const [apiStatus, setApiStatus] = useState(initialApiStatus.initial)
  const [idUpdate, setId] = useState('')

  const getMovieDetails = async () => {
    setApiStatus(initialApiStatus.progress)
    const {match} = props
    const {params} = match
    const {id} = params
    setId(id)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      `https://apis.ccbp.in/movies-app/movies/${id}`,
      options,
    )
    if (response.ok === true) {
      setApiStatus(initialApiStatus.success)
      const data = await response.json()
      const movieDetails = data.movie_details
      const runtimeHours = Math.floor(movieDetails.runtime / 60)
      const mints = movieDetails.runtime - runtimeHours * 60
      const filterMovieDetails = {
        backdropPath: movieDetails.backdrop_path,
        adult: movieDetails.adult,
        budget: movieDetails.budget,
        id: movieDetails.id,
        overview: movieDetails.overview,
        posterPath: movieDetails.poster_path,
        releaseDate: format(
          new Date(movieDetails.release_date),
          'do MMMM yyyy',
        ),
        year: format(new Date(movieDetails.release_date), 'yyyy'),
        runtime: `${runtimeHours}h ${mints}m`,
        title: movieDetails.title,
        voteAverage: movieDetails.vote_average,
        voteCount: movieDetails.vote_count,
      }
      const filterGener = movieDetails.genres.map(each => ({
        id: each.id,
        name: each.name,
      }))

      const filterSpokenLanguage = movieDetails.spoken_languages.map(each => ({
        englishName: each.english_name,
        id: each.id,
      }))
      const filterSimilarJob = movieDetails.similar_movies.map(each => ({
        backdropPath: each.backdrop_path,
        id: each.id,
        posterPath: each.poster_path,
        title: each.title,
      }))
      console.log(data)
      setProfileData(filterMovieDetails)
      setGenerData(filterGener)
      setLanguage(filterSpokenLanguage)
      setSimilarJobs(filterSimilarJob)
    } else {
      setApiStatus(initialApiStatus.failure)
    }
  }

  useEffect(() => {
    getMovieDetails()
  }, [idUpdate])

  useEffect(() => {
    const {match} = props
    const {params} = match
    const {id} = params
    setId(id)
  })

  const movieDetailsTryAgainClicked = () => {
    getMovieDetails()
  }

  const renderHeadMovieDetails = () => {
    const {
      backdropPath,
      title,
      runtime,
      adult,
      year,
      overview,
      releaseDate,
      voteCount,
      voteAverage,
      budget,
    } = profileDetails
    return (
      <>
        <div
          style={{
            backgroundImage: `url(${backdropPath})`,
            backgroundSize: 'cover',
            width: '100%',
            height: '72vh',
          }}
        >
          <Header />
          <div className="main-movieItem-container">
            <h1 className="movie-details-title">{title}</h1>
            <div className="movieItem-runtime-container">
              <p>{runtime}</p>
              {adult ? (
                <p className="certificate">A</p>
              ) : (
                <p className="certificate">U/A</p>
              )}
              <p>{year}</p>
            </div>
            <p className="over-view">{overview}</p>
            <button type="button" className="movie-item-play">
              Play
            </button>
          </div>
        </div>
        <div className="movie-details-container">
          <div className="movie-budget-container">
            <div>
              <h1 className="genres-head">Genres</h1>
              <ul className="genres-ul-list">
                {genersList.map(each => (
                  <li key={each.id}>{each.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="genres-head">Audio Available</h1>
              <ul className="genres-ul-list">
                {spokenLanguageList.map(each => (
                  <li key={each.id}>{each.englishName}</li>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="genres-head">Rating Count</h1>
              <p className="vote-count-para">{voteCount}</p>
              <h1 className="genres-head">Rating Average</h1>
              <p className="vote-count-para">{voteAverage}</p>
            </div>
            <div>
              <h1 className="genres-head">Budget</h1>
              <p className="vote-count-para">{budget}</p>
              <h1 className="genres-head">Release Date</h1>
              <p className="vote-count-para">{releaseDate}</p>
            </div>
          </div>
          <div>
            <h1 className="more-videos-head">More like this </h1>
            <ul className="similar-movie-ul">
              {similarMovies.map(each => (
                <li key={each.id}>
                  <Link to={`/movies/${each.id}`}>
                    <img
                      className="similar-movie-image"
                      src={each.posterPath}
                      alt={each.title}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  const renderLoaderData = () => (
    <>
      <div className="movie-loader-container">
        <Header />
        <div className="movie-details-loader">
          <LoaderData />
        </div>
      </div>
    </>
  )

  const renderMovieDetailsFailure = () => (
    <div className="movie-loader-container">
      <Header />
      <div className="movie-details-failure-container">
        <img
          className="movie-details-failure-image"
          src="https://res.cloudinary.com/ducrzzdqj/image/upload/v1675357761/Background-Complete_l4q3h3.png"
          alt="failure view"
        />
        <p className="movie-details-failure-para">
          Something went wrong. Please try again
        </p>
        <button
          className="movie-details-try-again-button"
          type="button"
          onClick={movieDetailsTryAgainClicked}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  const renderDataOnStatus = () => {
    switch (apiStatus) {
      case initialApiStatus.progress:
        return renderLoaderData()
      case initialApiStatus.success:
        return renderHeadMovieDetails()
      case initialApiStatus.failure:
        return renderMovieDetailsFailure()
      default:
        return null
    }
  }

  return <div>{renderDataOnStatus()}</div>
}

export default withRouter(MovieItemDetails)
