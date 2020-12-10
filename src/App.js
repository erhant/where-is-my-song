import React, { useState } from 'react'
import SpotifyLogin from 'react-spotify-login';
import Finder from './Finder'
import SpotifyApi from './Spotify'; 

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI

function getRandomIntInclusive(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}

function App() {
  const [spotifyApi, setSpotifyApi] = useState(null)
  const [ready, setReady] = useState(false)
  
  return (
    <div style={{backgroundImage: `url(where-is-my-song/bg/background-${getRandomIntInclusive(10)}.png)`, backgroundRepeat: "no-repeat", height: "100vh", backgroundSize: "cover"}}>

      {ready ? <div className="container">
            <Finder spotifyApi={spotifyApi} ready={true}/> 
        </div> : <div className="container">
        <div className="row">
          <h1 className="my-5 display-3 text-white mx-auto">Welcome, please sign in.</h1>
        </div>
        <div className="row">
        <SpotifyLogin className="mx-auto btn btn-secondary btn-lg text-white" buttonText="Sign in to Spotify" clientId={clientId}
          redirectUri={redirectUri}
          onSuccess={(response) => {
            console.log("Connected: ",response)
            let spotifyApi = new SpotifyApi(clientId, clientSecret, redirectUri, response.access_token)
            setSpotifyApi(spotifyApi)
            setReady(true)
          }}
          onFailure={(response) => {
            console.log("Failure: ",response)
          }}/>
        </div>
        </div>
        
          }
    </div>
  );
}

export default App;
