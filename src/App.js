import React, { useState } from 'react'
import SpotifyLogin from 'react-spotify-login';
import { clientId, clientSecret, redirectUri } from './settings';
import Finder from './Finder'
import SpotifyApi from './Spotify';

function App() {
  const [spotifyApi, setSpotifyApi] = useState(null)
  const [ready, setReady] = useState(false)
  return (
    <div style={{backgroundImage: "url(./bg/background-1.png", backgroundRepeat: "no-repeat", height: "100vh", backgroundSize: "cover"}}>

      {ready ? <div className="container">
            <Finder spotifyApi={spotifyApi} ready={true}/> 
        </div> : <div className="container">
        <div className="row">
          <h1 className="my-5 display-3 text-white mx-auto">Welcome, please sign in.</h1>
        </div>
        <div className="row">
        <SpotifyLogin className="mx-auto btn btn-primary text-white" buttonText="Sign in to Spotify" clientId={clientId}
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
