import React from 'react';
import './App.css';
import Search from './Components/Search/Search';
import Face from './Components/Face/Face';
import Nav from './Components/Nav/Nav';
import Signin from './Components/User/Signin';
import Register from './Components/User/Register';
import Profile from './Components/Profile/Profile';


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
      fetch(server+'predict', {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"imgUrl": this.state.input, "userid": this.state.userProfile.userid})
      })
      .then(resp => resp.json())
      .then(response => {
        document.querySelector(".face-image").src = server+response.images[0].imgurl;   // set to static url in server where the image was downloaded
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
        revokeStateURL()                                          // revoke prev objectURL in state
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
            blobFile.push(blob);      // store each blob in an array
            blobCount++;
            if(blobCount === predicts.length){   // when all the blobs have been collected
              revokeStateURL();
              this.setState({ blobURL: blob2imgArr(blobFile)});
              console.log("sending blobs..")
              sendPrediction(blobFile);
            }
          }, 'image/jpeg', 0.95);
        })
      }
    }

    const onClickProfileImg = (imgid) => {
      // if the first thing a user does is clicking profile image, then the FaceImage comp needs to show up
      // document.querySelector('.face').classList.remove('hidden');
      const imgObj = document.querySelector(".face-image");
      // if user previously predicts an image, the main img will have onload function that draws blob elements, profile images uses saved
      imgObj.removeAttribute("onload");
      // find the selected image using imgid
      const images = this.state.userImages.filter(image => image.imgid === imgid);
      imgObj.src = server+images[0].imgurl;
      // grab predictions related to the imgid and map the data to state.predict, and local url to state.blobUrl
      const predictions = this.state.userPredictions.filter(predict => predict.imgid === imgid);
      this.setState({currPredictions: predictions});
    }

    // revoke previous objectURL
    const revokeStateURL = () => { this.state.blobURL.forEach(url => URL.revokeObjectURL(url)) }

    //  convert new blobs into objectURL
    const blob2imgArr = (blobs) => blobs.map(blob => URL.createObjectURL(blob))

    const {currPredictions, blobURL, userImages} = this.state;
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
                  <Profile userImages={userImages} onClickProfileImg={onClickProfileImg} server={server}/>
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
  11. remember to revoke object url   DONE

  focus: limiting the image/canvas size (css) so the blobs are correct
         dealing with CORS policy, remove crossOrigin in img el, instead of fetching the img from original source, get it from the downloaded server
         bug, on first predict, drawFaceBlobs was not executed. possible sol: setState is asnyc, so the state hasn't been update yet when drawFaceBlobs was executed


  12. create profile and its card components  DONE
  13. when user clicks on a profile image, it will sent that data to currPrediction   DONE
  14. show faceblobs of a profile image, use drawFaceBlobs, and don't revoke the object url yet, use it if later the user clicks an image again
      - rearrange drawFaceBlobs to fit in the Face components, maybe
      - create userBlobs state, store a blob with it's predid
      - only revoke object url on signout
*/
