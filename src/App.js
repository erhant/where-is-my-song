import React, { useState } from 'react'
import SpotifyLogin from 'react-spotify-login';
import { clientId, clientSecret, redirectUri } from './settings';
import Finder from './Finder'
import SpotifyApi from './Spotify';

function App() {
  const [spotifyApi, setSpotifyApi] = useState(null)
  const [ready, setReady] = useState(false)
  return (
    <div>
      {ready ? <Finder spotifyApi={spotifyApi} ready={true}/> :  <SpotifyLogin className="m-5 btn btn-success" buttonText="Sign in to Spotify" clientId={clientId}
        redirectUri={redirectUri}
        onSuccess={(response) => {
          console.log("Connected: ",response)
          let spotifyApi = new SpotifyApi(clientId, clientSecret, redirectUri, response.access_token)
          setSpotifyApi(spotifyApi)
          setReady(true)
        }}
        onFailure={(response) => {
          console.log("Failure: ",response)
        }}/>}
    </div>
  );
}

export default App;
