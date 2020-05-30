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
  blobURL: [],
  isNewPredict: false,
  isImgClipboard: false,
  blobClipboard: ''
}

const server = 'http://localhost:5000/';

class App extends React.Component{
  state = { ...initialState } // using spread operator prevents mutating the initialState

  render(){
    const geturl = (event) => { this.setState({ input: event.target.value}) }
    const getState = () => { console.log(this.state) }
    const onButtonSubmit = () => {
      this.setState({isNewPredict: true});
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

    const onClickProfileImg = (imgid) => {
      // if the first thing a user does is clicking profile image, then the FaceImage comp needs to show up
      // document.querySelector('.face').classList.remove('hidden');
      this.setState({isNewPredict: false})
      const imgObj = document.querySelector(".face-image");
      // find the selected image using imgid
      const images = this.state.userImages.filter(image => image.imgid === imgid);
      imgObj.src = server+images[0].imgurl;
      // grab predictions related to the imgid and map the data to state.predict, and local url to state.blobUrl
      const predictions = this.state.userPredictions.filter(predict => predict.imgid === imgid);
      this.setState({currPredictions: predictions});
    }

    const setSendBlob = (blobFile) => {
      revokeStateURL();
      this.setState({ blobURL: blob2imgArr(blobFile) });
      if(this.state.isNewPredict){
        console.log("sending blobs..");
        sendPrediction(blobFile);
      }
    }

    //  convert new blobs into objectURL and returns the URL
    const blob2imgArr = (blobs) => blobs.map(blob => URL.createObjectURL(blob))

    // revoke previous objectURL
    const revokeStateURL = () => { this.state.blobURL.forEach(url => URL.revokeObjectURL(url)) }

    const getBlobClipboard = (pasteEvent, callback) => {
      // make sure the callback is a function, if yes return data
      const returnCb = (data) => { if(typeof(callback) === "function") callback(data) }
      // if no data is in clipboard, return callback(undefined)
      if(pasteEvent.clipboardData === false){ returnCb(undefined) };
      // get clipboard data
      const items = pasteEvent.clipboardData.items;
      // if no items are present, return callback(undefined)
      if(items === undefined){ returnCb(undefined) };
      // items is an array containing data of the clipboard, in case of droping objects: may contain multiple data
      for (let i=0; i<items.length; i++) {
        // indexOf returns -1 if it doesn't find a match, "continue" skips that loop
        if(items[i].type.indexOf("image") === -1) continue;
        // get image on clipboard as blob
        const blob = items[i].getAsFile();
        returnCb(blob);
      }
    }
    
    const pasteClipboard = (event) => {
      getBlobClipboard(event, imageBlob => {
        // if there's an image, display in canvas
        if(imageBlob){
          // Convert the blob into an ObjectURL
          console.log(URL.createObjectURL(imageBlob));
          // imgObj.src = URLObj.createObjectURL(imageBlob);
        }
      })
    }

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
                  <Search geturl={geturl} getState={getState} onButtonSubmit={onButtonSubmit} pasteClipboard={pasteClipboard}/>
                  <Face currPredictions={currPredictions} blobURL={blobURL} setSendBlob={setSendBlob}/>
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
      - rearrange drawFaceBlobs to fit in the Face components, maybe    DONE
        hey, you don't have to call drawFaceBlobs all the time, everytime face-image has a new image, its .onload function will be called and draw the blobs automatically!
      - create userBlobs state, store a blob with it's predid, remove blobURL and use userBlobs instead   NOT USED
      - only revoke object url on signout   NOT USED
  15. add clipboard paste function  DONE
  16. add clipboard stateFlag is the detected object pasted clipboard or not
*/
