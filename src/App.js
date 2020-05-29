import React from 'react';
import './App.css';
import Search from './Components/Search/Search';
import Face from './Components/Face/Face';
import Nav from './Components/Nav/Nav';
import Signin from './Components/User/Signin';
import Register from './Components/User/Register';


const initialState = {
  input: '',
  route: 'signin',
  userImages: [],
  userPredictions: [],
  userProfile: '',
  currPredictions: [],
  blobURL: []
}

const server = 'http://localhost:5000/';

class App extends React.Component{
  state = { ...initialState } // using spread operator prevents mutating the initialState

  render(){
    const geturl = (event) => { this.setState({ input: event.target.value}) }
    const getState = () => { console.log(this.state) }

    const onButtonSubmit = () => {
      document.querySelector(".face-image").src = this.state.input;
      fetch(server+'predict', {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"imgUrl": this.state.input, "userid": this.state.userProfile.userid})
      })
      .then(resp => resp.json())
      .then(response => {
        this.setState({
          currPredictions: response.predictions,
          userImages: this.state.userImages.concat(response.images),
          userPredictions: this.state.userPredictions.concat(response.predictions)
        });
        drawFaceBlobs();
      })
      .catch(err => console.log(err));
    }

    const onRouteChange = (newRoute) => {
      if(newRoute==='signin'){                                    // if returning to signin view (means user is signing out)
        document.querySelector('.nav').classList.add('hidden');   // hide the signout nav
        this.setState(initialState);                              // reset to initialState
      }
      this.setState({route: newRoute});
    }

    const updateUser = (data) => { this.setState({
      userImages: data.images,
      userPredictions: data.predictions,
      userProfile: data.profile
    }) }

    // called when all face blobs are gathered, send blobs along with prdiction data
    const sendPrediction = (blobFile) => {
      const form = new FormData();
      for (let i=0; i<blobFile.length; i++){
        const id = this.state.currPredictions[i].predid;
        form.append("image", blobFile[i], id)   // id will be the originalname went sent to server
      }
      fetch(server+'blobs', { method: 'post', body: form })
      .then(resp => resp.json())
      .then(msg => console.log(msg))
      .catch(err => console.log(err))
    }

    const drawFaceBlobs = () => {
      const canvas = document.getElementById("myCanvas");
      const ctx = canvas.getContext('2d');
      const imgObj = document.querySelector(".face-image");
      imgObj.onload = () => {
        let blobFile = [];    // where blobs will be appended to
        let blobCount = 0;    // keep track of completed blobs
        // grab original width and height of image (no matter how it scales in browser, croping with ctx.drawImage still uses the original props of image)
        const width = imgObj.naturalWidth;
        const height = imgObj.naturalHeight;
        const predicts = this.state.currPredictions;
        predicts.forEach(pred => {
          // calculating crop area around detected faces
          const sx = width * pred.bleft / 100;
          const sy = height * pred.btop / 100;
          const sWidth = (width * (100 - pred.bright))/100 - sx;
          const sHeight = (height * (100 - pred.bbot))/100 - sy;
          const targetImageSize = 80;   // output face blob resolution
          canvas.width = canvas.height = targetImageSize;
          ctx.drawImage(imgObj, sx, sy, sWidth, sHeight, 0, 0, targetImageSize, targetImageSize);
          canvas.toBlob(blob => {     // .toBlob doesn't return immediate value, but the blob will show in a callback once it finish loading (async)
            blobFile.push(blob);
            blobCount++;
            // if(blobCount === predicts.length){ sendPrediction(blobFile) }   // store blob in array and triggers the send function without when all blobs completed
            if(blobCount === predicts.length){   // when all the blobs have been collected
              this.setState({ blobURL: blob2imgArr(blobFile)});
              console.log("sending blobs..")
              sendPrediction(blobFile);
            }
          }, 'image/jpeg', 0.95);
        })
      }
    }

    // convert blobs into objectURL
    const blob2imgArr = (blobs) => {
      // state.forEach(url => URL.revokeObjectURL(url))} 
      return blobs.map(blob => URL.createObjectURL(blob))
    }

    const {currPredictions, blobURL} = this.state;
    return (
      <div className="App">
        <h1>Welcome!</h1>
        <Nav onRouteChange={onRouteChange}/>
        {
          this.state.route === 'signin'
          ? <Signin onRouteChange={onRouteChange} updateUser={updateUser} server={server} />
            : this.state.route === 'register'
              ? <Register onRouteChange={onRouteChange} updateUser={updateUser} server={server}/>
              : <div className="main-content">
                  <Search geturl={geturl} getState={getState} onButtonSubmit={onButtonSubmit}/>
                  <Face currPredictions={currPredictions} blobURL={blobURL}/>
                  <canvas id='myCanvas'></canvas>
                </div>
        }
        
      </div>
    )
  }
}

export default App;

/*  TODO
  1. create navigation, should be hidden before signin  DONE
  2. build routing for signin, register, and signout  DONE
  3. on signout, reset to initial state   DONE
  4. change fetch in all components to use a const instead  DONE
  5. onButtonSubmit: grab newPrediction and store it in state   DONE
  6. create state holding new prediction  DONE
  7. draw bounding box on main image  DONE
  8. draw faceblobs using canvas and convert to blobURL   DONE
  9. show the blobURLs in face-info   DONE
  10. show prediction results in face-info  DONE
  11. remember to revoke object url
  12. create mockup data to simulate history images
  13. create history and its card components
  14. when user clicks on a history image, it will sent that data to currPrediction
*/
