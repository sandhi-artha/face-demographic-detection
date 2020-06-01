import React from 'react';
import './App.css';
import Search from './Components/Search/Search';
import Welcome from './Components/Search/Welcome';
import Face from './Components/Face/Face';
import Nav from './Components/Nav/Nav';
import Signin from './Components/User/Signin';
import Register from './Components/User/Register';
import Profile from './Components/Profile/Profile';


const initialState = {
  input: '',              // stores the value of the main input
  route: 'signin',        // handles parts of app that shows: signin, register, and main-content
  userImages: [],
  userPredictions: [],
  userProfile: '',
  currPredictions: [],    // prediction data of the selected image (either from new predict or history image)
  blobURL: [],            // contains objectURL converted from canvas crops
  isNewPredict: false,    // if true, then the user predicts a new image, false means the user clicks on a history image
  isImgClipboard: false,  // source of data from copied clipboard or from an image url
  blobClipboard: ''       // temporarily stores the blob data of a clipboard image to preview in Face component
}

const server = 'https://face-demographic-detection.herokuapp.com/';

class App extends React.Component{
  state = { ...initialState } // using spread operator prevents mutating the initialState

  render(){
    const geturl = (event) => { this.setState({ input: event.target.value}) }
    const getState = () => { console.log(this.state) }    // for debugging purpose, create a button in Search.js with onClick of this func

    const getPrediction = async (clipboard) => {
      if(clipboard){    // if data comes from a clipboard image, sends clipboard image and wait for the prediction results
        const form = new FormData();
        form.append("imgBlob", this.state.blobClipboard, "clipboardImage");
        form.append("userid", this.state.userProfile.userid);
        const response = await fetch(server+'predictclipboard', { method: 'post', body: form })
        const data = await response.json()
        return data
      } else {      // if data comes from a URL, sends image URL and wait for prediction results
        this.setState({isNewPredict: true});
        const response = await fetch(server+'predict', {
          method: 'post',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({"imgUrl": this.state.input, "userid": this.state.userProfile.userid})
        })
        const data = await response.json()
        return data
      }
    }

    // when user clicks on detect button
    const onDetect = async () => {
      document.querySelector('.face').classList.remove('hidden');
      const data = await getPrediction(this.state.isImgClipboard);
      document.querySelector(".face-image").src = server+data.images[0].imgurl;   // set to static url in server where the image was downloaded
      this.setState({     // appends the new prediction data to previous history
        currPredictions: data.predictions,
        userImages: this.state.userImages.concat(data.images),
        userPredictions: this.state.userPredictions.concat(data.predictions)
      });
      document.getElementById("search-input").value = '';   // clear the input url
      this.setState({isImgClipboard: false});   // reset to false again
    }

    // triggers when user clicks a history image
    const onClickProfileImg = (imgid) => {
      document.querySelector('.face').classList.remove('hidden');
      this.setState({isNewPredict: false})
      const imgObj = document.querySelector(".face-image");
      // find the selected image using imgid
      const images = this.state.userImages.filter(image => image.imgid === imgid);
      imgObj.src = server+images[0].imgurl;
      // grab predictions related to the imgid and map the data to state.predict, and local url to state.blobUrl
      const predictions = this.state.userPredictions.filter(predict => predict.imgid === imgid);
      this.setState({currPredictions: predictions});
    }

    // handles what content is shown: signin (home), register or main-content
    const onRouteChange = (newRoute) => {
      if(newRoute==='signin'){                                    // if returning to signin view (means user is signing out)
        revokeStateURL()                                          // revoke prev objectURL in state
        document.querySelector('.nav').classList.add('hidden');   // hide the signout nav
        this.setState(initialState);                              // reset to initialState
      }
      this.setState({route: newRoute});
    }

    // updates the user data
    const updateUser = (data) => { this.setState({
      userImages: data.images,
      userPredictions: data.predictions,
      userProfile: data.profile
    }) }

    // sends cropped face blobs using FormData
    const sendBlobs = (blobFile) => {
      console.log("sending blobs..");
      const form = new FormData();
      for (let i=0; i<blobFile.length; i++){    // loop through all predictions
        const id = this.state.currPredictions[i].predid;
        form.append("image", blobFile[i], id)   // id will be the originalname went sent to server
      }
      fetch(server+'blobs', { method: 'post', body: form })
      .then(resp => resp.json())
      .then(msg => console.log(msg))
      .catch(err => console.log(err))
    }

    // triggers when all blobs are drawn from canvas draw operation in Face.js
    const setSendBlob = (blobFile) => {
      revokeStateURL();
      this.setState({ blobURL: blob2imgArr(blobFile) });    // stores objectURL of face blobs
      if(this.state.isNewPredict){sendBlobs(blobFile)}      // if it's a new prediction, send the new blobs to server
    }

    //  convert new blobs into objectURL and returns the URL
    const blob2imgArr = (blobs) => blobs.map(blob => URL.createObjectURL(blob))

    // revoke previous objectURL
    const revokeStateURL = () => { this.state.blobURL.forEach(url => URL.revokeObjectURL(url)) }

    // check if clipboard contains images, if yes, return it as blob
    const getBlobClipboard = (pasteEvent, callback) => {
      const returnCb = (data) => { if(typeof(callback) === "function") callback(data) }   // make sure the callback is a function, if yes return data
      if(pasteEvent.clipboardData === false){ returnCb(undefined) };      // if no data is in clipboard, return callback(undefined)
      const items = pasteEvent.clipboardData.items;             // get clipboard data
      if(items === undefined){ returnCb(undefined) };           // if no items are present, return callback(undefined)
      // items is an array containing data of the clipboard, in case of droping objects may contain multiple data
      for (let i=0; i<items.length; i++) {
        if(items[i].type.indexOf("image") === -1) continue;     // indexOf returns -1 if it doesn't find a match, "continue" skips that loop
        const blob = items[i].getAsFile();                      // get image on clipboard as blob
        returnCb(blob);                                         // blob data is available in callback
      }
    }
    
    // when the user paste something to the input element, previews if its an image
    const pasteClipboard = (event) => {
      getBlobClipboard(event, blobClipboard => {
        revokeStateURL();
        this.setState({isImgClipboard: true, currPredictions: [], blobURL: []});
        const imgObj = document.querySelector(".face-image");
        imgObj.removeAttribute("onLoad");   // remove the onLoad function temporarily bcz it will trigger send
        if(blobClipboard){                  // if there's an image, display in canvas
          this.setState({blobClipboard});   // stores the clipboard blob to state
          document.querySelector('.face').classList.remove('hidden');   // reveal face component
          imgObj.src = URL.createObjectURL(blobClipboard);    // Convert the blob into an ObjectURL and preview it
        }
      })
    }

    const {currPredictions, blobURL, userImages, userProfile} = this.state;
    return (
      <div className="App">
        <Nav onRouteChange={onRouteChange}/>
        {
          this.state.route === 'signin'
          ? <Signin onRouteChange={onRouteChange} updateUser={updateUser} server={server} />
            : this.state.route === 'register'
              ? <Register onRouteChange={onRouteChange} updateUser={updateUser} server={server}/>
              : <div className="main-content">
                  <Welcome userProfile={userProfile}/>
                  <Search geturl={geturl} getState={getState} onDetect={onDetect} pasteClipboard={pasteClipboard}/>
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
