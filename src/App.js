import React, { useState } from 'react'
import SpotifyLogin from 'react-spotify-login';
import { clientId, clientSecret, redirectUri } from './settings';
import Finder from './Finder'
import SpotifyWebApi from 'spotify-web-api-node';

function App() {
  const [spotifyApi, setSpotifyApi] = useState(null)
  const [ready, setReady] = useState(false)
  return (
    <div>
      <SpotifyLogin buttonText="Click here to login." clientId={clientId}
        redirectUri={redirectUri}
        onSuccess={(response) => {
          console.log("Connected: ",response)
          let spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
          spotifyApi.setAccessToken(response.access_token)
          setSpotifyApi(spotifyApi)
          setReady(true)
        }}
        onFailure={(response) => {
          console.log("Failure: ",response)
        }}/>
        {ready ? <Finder spotifyApi={spotifyApi} ready={true}/> : null}
    </div>
  );
}

export default App;
