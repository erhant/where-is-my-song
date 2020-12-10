# where-is-my-song
When you know you have added the song somewhere in your playlist, but not sure how to find it.

The code is written extemely hastily (over a time of 1 day at most) so there are lots of refactors and considerations to go over.

## Deployment
The code is built and deployed to `main` branch, everytime there is a push to the `dev` branch. Then, it is hosted by GitHub Pages using `main`. 

## TODOs
- Regex check for song url
- Better styling
- Multiple redundant requests are made at the start?
- Add a song to a playlist if wanted
- css paths have where-is-my-song/ at their start, I should not staticly write that