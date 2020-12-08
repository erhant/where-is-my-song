import axios from 'axios'

export default class SpotifyAPI {
  constructor(clientId, clientSecret, redirectUri, token) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
    this.token = token
    axios.defaults.headers.get['Authorization'] = "Bearer "+token
  }

  getMe() {
    return new Promise((resolve, reject) => {
      axios.get("https://api.spotify.com/v1/me").then(data => {
        resolve({
          body: data.data,
          statusCode: data.status,
          headers: data.headers
        })
      }).catch(err => reject(err))
    })
  }

  getMyPlaylists() {
    return new Promise((resolve, reject) => {
      axios.get("https://api.spotify.com/v1/me/playlists").then(data => {
        resolve({
          body: data.data,
          statusCode: data.status,
          headers: data.headers
        })
      }).catch(err => reject(err))
    })
  }

  getHref(href) {
    return new Promise((resolve, reject) => {
      axios.get(href).then(data => {
        resolve({
          body: data.data,
          statusCode: data.status,
          headers: data.headers
        })
      }).catch(err => reject(err))
    })
  }

  getTrack(trackId) {
    return new Promise((resolve, reject) => {
      axios.get("https://api.spotify.com/v1/tracks/"+trackId).then(data => {
        resolve({
          body: data.data,
          statusCode: data.status,
          headers: data.headers
        })
      }).catch(err => reject(err))
    })
  }
}