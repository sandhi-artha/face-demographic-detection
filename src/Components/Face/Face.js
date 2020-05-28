import React from 'react';
import './Face.css';
import Faceblobs from './Faceblobs';
import Facepredicts from './Facepredicts';

const faceHighlight = (id) => {     // for showing prediction results for selected faces
    const unSelectPred = document.querySelectorAll(`.preds`);       // can have multiple images
    unSelectPred.forEach(el => el.classList.remove("highlight"))    // remove class "highlight" from all of them
    const selectPred = document.querySelector(`.preds${id}`);       // get the id of the face being clicked, then select the corresponding prediction element
    selectPred.classList.add("highlight");                          // show the prediction data
}

const Face = ({currPredictions, blobURL}) => {
    return (
        <div className='face'>
            <div>
                <div className="face-bboxes">
                    <img className="face-image" alt='face' src='' crossOrigin="anonymous"/>
                    {
                        currPredictions.map((pred,i) => {
                            let boxStyle = {top: pred.btop+'%', left: pred.bleft+'%', bottom: pred.bbot+'%', right: pred.bright+'%'}
                            return(
                                <div key={i} className="box" style={boxStyle}></div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="face-info">
                <h5>Face detected: {currPredictions.length}</h5>
                <div className="face-predictions">
                    <Faceblobs faceHighlight={faceHighlight} blobURL={blobURL}/>
                    <Facepredicts currPredictions={currPredictions}/>
                </div>
            </div>
        </div>
    )
}

export default Face;