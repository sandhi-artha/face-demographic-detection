import React from 'react';
import './Face.css';
import Faceblobs from './Faceblobs';
import Facepredicts from './Facepredicts';

class Face extends React.Component{
    render(){
        const {currPredictions, blobURL, setSendBlob} = this.props;
        const faceSelect = (id) => {     // showing prediction data, show border for face blobs, and highlight bounding box on image
            // showing prediction data
            const unSelectPred = document.querySelectorAll(`.preds`);       // can have multiple images
            unSelectPred.forEach(el => el.classList.remove("highlight"))    // remove class "highlight" from all of them
            const selectPred = document.querySelector(`.preds${id}`);       // get the id of the face being clicked, then select the corresponding prediction element
            selectPred.classList.add("highlight");                          // show the prediction data
            // show border
            const unSelectFace = document.querySelectorAll(".faceblobs-image")
            unSelectFace.forEach(el => el.classList.remove("faceblobs-selected"))
            const selectFace = document.querySelector(`.fb${id}`);       
            selectFace.classList.add("faceblobs-selected");              
            // highlight bounding box
            const unSelectBox = document.querySelectorAll(".box")
            unSelectBox.forEach(el => el.classList.remove("box-select"))
            const selectBox = document.querySelector(`.box${id}`);       
            selectBox.classList.add("box-select"); 
        }

        const drawFaceBlobs = () => {
            const canvas = document.getElementById("myCanvas");
            const ctx = canvas.getContext('2d');
            const imgObj = document.querySelector(".face-image");
            let blobFile = [];    // where blobs will be appended to
            let blobCount = 0;     // keep track of completed blobs (bcz it's asynchronous)
            // grab original width and height of image (no matter how it scales in browser, croping with ctx.drawImage still uses the original props of image)
            const width = imgObj.naturalWidth;
            const height = imgObj.naturalHeight;
            currPredictions.forEach(pred => {
                // calculating crop area around detected faces
                const sx = width * pred.bleft / 100;
                const sy = height * pred.btop / 100;
                const sWidth = (width * (100 - pred.bright))/100 - sx;
                const sHeight = (height * (100 - pred.bbot))/100 - sy;
                const targetImageSize = 80;     // output face blob resolution
                canvas.width = canvas.height = targetImageSize;
                ctx.drawImage(imgObj, sx, sy, sWidth, sHeight, 0, 0, targetImageSize, targetImageSize);
                canvas.toBlob(blob => {         // .toBlob doesn't return immediate value, but the blob will show in a callback once it finish loading (async)
                    blobFile.push(blob);        // store each blob in an array
                    blobCount++;
                    if(blobCount === currPredictions.length){
                        setSendBlob(blobFile) }   // when all the blobs have been collected
                }, 'image/jpeg', 0.95);
            })
        }

        return (
            <div className='face hidden'>
                <div className='face-whole'>
                    <div className="face-bboxes">
                        <img className="face-image" alt='face' src='' crossOrigin="anonymous" onLoad={drawFaceBlobs}/>
                        {
                            currPredictions.map((pred,i) => {
                                const boxname = `box box${i} btn`;
                                let boxStyle = {top: pred.btop+'%', left: pred.bleft+'%', bottom: pred.bbot+'%', right: pred.bright+'%'}
                                return(
                                    <div key={i} className={boxname} style={boxStyle} onClick={() => faceSelect(i)}></div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="face-info">
                    <h5>Face detected: {currPredictions.length}</h5>
                    <div className="face-predictions">
                        <Faceblobs faceSelect={faceSelect} blobURL={blobURL}/>
                        <Facepredicts currPredictions={currPredictions}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Face;