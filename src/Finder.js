import { useState } from 'react';
import { Jumbotron, Button } from 'react-bootstrap'

function Welcome({ name, imageUrl }) {
  return (<Jumbotron>
    <h1>Welcome, {name}!</h1>
    <img src={imageUrl} alt="profile"/>
    <p>
      Please enter a song URL below. Let's see which playlist has it!
    </p>
    <p>
      <Button variant="secondary">Learn more</Button>
    </p>
  </Jumbotron>)
}

export default function Finder({ spotifyApi, ready }) {
  const [userInfo, setUserInfo] = useState(null)

  if (ready && !userInfo) {
    spotifyApi.getMe()
    .then(function(data) {
      console.log('Some information about the authenticated user', data.body);
      setUserInfo(data.body)
    }, function(err) {
      console.log('Something went wrong!', err);
    });
    return null
  } else if (ready) {
    return <div><Welcome name={userInfo.display_name} imageUrl={userInfo.images[0].url}/></div>
  }
    else return null
} 