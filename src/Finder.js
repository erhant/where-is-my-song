import { useState } from 'react';
import { Jumbotron, Button, InputGroup, FormControl, Card } from 'react-bootstrap'

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

    // Get tracks of the playlist
    let ptracks
    try {
      ptracks = await Promise.all(ptmp.map(p => spotifyApi.getHref(p.tracks.href)))
    } catch (err) {reject(err)}
     
    console.log("Ptracks:", ptracks)

    for (let p = 0; p < userObject.playlists.length; p++) {
      userObject.playlists[p].tracks = []
      while (ptracks[p].body.next) {
        userObject.playlists[p].tracks = userObject.playlists[p].tracks.concat(ptracks[p].body.items)
        try {
          ptracks[p] = await spotifyApi.getHref(ptracks[p].body.next)
        } catch (err) {reject(err)}
        
      }
    }
    
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
    userObject.trackToPlaylistIds = t_p

    console.log(userObject)
    resolve(userObject)
    
  })
}

function parseTrackID(searchTrackURL) {
  if (searchTrackURL.length < 79) return null
  return searchTrackURL.slice(31, 31 + 22) // todo: very dangerous
}
function searchTrack(userObject, trackId) {
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
  const [trackObject, setTrackObject] = useState(null)
  const [playlistObjects, setPlaylistObjects] = useState([])

  if (ready && !userObject) {
    init(spotifyApi).then(userObj => setUserObject(userObj)).catch(err => console.log("Error!", err))
    return (<div className="row">
      <Jumbotron className="mt-5 mx-auto w-100" style={{backgroundColor: "rgba(255, 255, 255, 0.1)"}}>
        <h1 className="display-4 text-white text-center text-white">Fetching your playlists, please wait...</h1>
      </Jumbotron>
    </div>)
  } else if (ready) {
    return (
    <div className="row">
      <Jumbotron className="mt-5 mx-auto w-100" style={{backgroundColor: "rgba(255, 255, 255, 0.1)"}}>
        <h1 className="display-4 text-white text-center text-white">Welcome, {userObject.name}!</h1>
        <p className="lead text-white">
          Please enter a song URL below. Let's see which of your playlists have it!
        </p>
        <InputGroup>
          <FormControl
            style={{height: "50px"}} 
            placeholder="https://open.spotify.com/track/2qWn2E1zg2BVaoWRGYw3vE?si=8TcoSxf_Qoq5VCVZuXl_qw"
            aria-label="trackURL"
            aria-describedby="trackURL"
            onChange={event => {setTrackURL(event.target.value)}} 
            value={trackURL}
          />
          <InputGroup.Append>
            <Button style={{width: "70px", height: "50px"}} variant="primary" onClick={async e => {
              let trackId = parseTrackID(trackURL)
              if (trackId) {
                let foundIds = searchTrack(userObject, trackId)
                let trackObject = await spotifyApi.getTrack(trackId)
                console.log("Track: ",trackObject)
                setTrackObject(trackObject.body)
                if (!foundIds || foundIds.length === 0) {
                  setPlaylistObjects([])
                } else {
                  setPlaylistObjects(foundIds.map(pid => playlistIdToObject(userObject, pid)))
                }
              }              
            }}><img src="/icons/mg.svg" alt="find me button" style={{width: "100%", height: "120%"}}/></Button>
          </InputGroup.Append>
        </InputGroup>
      </Jumbotron>
      <div className="d-flex flex-row justify-content-between flex-wrap text-center mb-3">
        {trackObject ? <a className="text-decoration-none text-reset" target="_blank" rel="noopener noreferrer" href={trackObject.external_urls.spotify}>
          <Card className="bg-light rounded text-wrap mx-1 m-4" style={{height: "300px", width: "300px"}}>
            <Card.Img variant="top" className="mx-1 mt-1 rounded" src={trackObject.album.images[0].url} style={{width:"auto", height:"98%", objectFit:"cover"}}/>
            <Card.Body>
              <Card.Title className="text-white p-1 rounded" style={{backgroundColor: "rgba(255, 255, 255, 0.2"}}>{trackObject.name} - {trackObject.artists[0].name}</Card.Title>
            </Card.Body>
          </Card> 
        </a> : null}
        {playlistObjects.length > 0 ? playlistObjects.map((p, index) => 
        <a key={`p_${index}`}className="text-decoration-none text-reset" target="_blank" rel="noopener noreferrer" href={p.external_urls.spotify}>
          <Card className="bg-dark rounded text-wrap mx-1 mt-4 p-1 mb-5" style={{height: "300px", width: "300px"}}>
            <Card.Img variant="top" className="mx-1 mt-1 rounded" src={p.images[0].url} style={{width:"auto", height:"98%", objectFit:"cover"}}/>
            <Card.Body>
              <Card.Title className="text-white p-1 rounded" style={{backgroundColor: "rgba(255, 255, 255, 0.2"}}>{p.name}</Card.Title>
            </Card.Body>
          </Card> 
        </a>         
        ) : null}
      </div>
    </div>)
  }
    else return null
} 