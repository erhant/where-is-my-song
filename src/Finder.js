import { useState } from 'react';
import { Jumbotron, Button, InputGroup, FormControl } from 'react-bootstrap'

function init(spotifyApi) {
  return new Promise(async (resolve, reject) => {
    // Get user
    let data
    try {
      data = await spotifyApi.getMe()
    } catch (err) {reject(err)}
    let userObject = {
        name : data.body.display_name,  
        url: data.body.external_urls.spotify,
        imageURL: data.body.images.length ? data.body.images[0].url : "",
        isPremium: data.body.product === "premium",
        id: data.body.id,
    }

    // Get playlists
    try {
      data = await spotifyApi.getMyPlaylists()
    } catch (err) {reject(err)}
    userObject.playlists = data.body.items

    let ptmp = userObject.playlists
    let ptracks = await Promise.all(ptmp.map(p =>  spotifyApi.getHref(p.tracks.href)))
    for (let p = 0; p < userObject.playlists.length; p++) {
      userObject.playlists[p].tracks = ptracks[p].body.items
    }
    console.log(userObject)
    resolve(userObject)
  })
}

function extractTrackToPlaylistIds(userObject) {
  let t_p = {}
  userObject.playlists.forEach(p => {
    p.tracks.forEach(t => {
      if (!!t_p[t.track.id]) {
        t_p[t.track.id].push(p.id)        
      } else {
        t_p[t.track.id] = [p.id]
      }
      
    })
  })
  return t_p
}

function searchTrack(userObject, searchTrackURL) {
  if (searchTrackURL.length < 79) return

  let trackId = searchTrackURL.slice(31, 31 + 22) // todo very dangerous
  console.log("Searching track id:", trackId)
  let resultingIds = userObject.trackToPlaylistIds[trackId] || []
  console.log("Found in:", resultingIds)
  return resultingIds
}

function playlistIdToObject(userObject, pid) {
  for (let p = 0; p < userObject.playlists.length; p++) {
    if (userObject.playlists[p].id === pid) {
      return userObject.playlists[p]
    }
  }
  return {}
}

export default function Finder({ spotifyApi, ready }) {
  const [userObject, setUserObject] = useState(null)
  const [trackURL, setTrackURL] = useState("")
  const [playlistObjects, setPlaylistObjects] = useState([])

  if (ready && !userObject) {
    init(spotifyApi).then(userObj => {
      let t_p = extractTrackToPlaylistIds(userObj)
      userObj.trackToPlaylistIds = t_p
      setUserObject(userObj)
    }).catch(err => console.log("Error!", err))
    return null
  } else if (ready) {
    return (
    <div>
      <Jumbotron>
        <h1 className="display-3 text-center">Welcome, {userObject.name}!</h1>
        <p className="lead">
          Please enter a song URL below. Let's see which of your playlists have it!
        </p>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Paste track URL here"
            aria-label="trackURL"
            aria-describedby="trackURL"
            onChange={event => {setTrackURL(event.target.value)}} 
            value={trackURL}
          />
          <InputGroup.Append>
            <Button variant="outline-success" onClick={e => {
              let foundIds = searchTrack(userObject, trackURL)
              if (foundIds.length === 0) {
                setPlaylistObjects([])
              } else {
                setPlaylistObjects(foundIds.map(pid => playlistIdToObject(userObject, pid)))
              }
            }}>Search a track!</Button>
          </InputGroup.Append>
        </InputGroup>
      </Jumbotron>
      {playlistObjects.length > 0 ? playlistObjects.map((p, index) => 
        <div className="bg-light mx-5 my-2">
          <p className="lead">{p.name}</p>
          <img src={p.images[0].url} alt="playlist" style={{width: "200px", height: "200px", objectFit: "cover"}}/>
        </div>
      ) : null}
    </div>)
  }
    else return null
} 