import React from 'react';
import './Face.css'

const Face = ({userPredictions, currPredictions}) => {
    return (
        <div className='face'>
            <div className='face-div'>
                <div className="face-bounding-boxes">
                    <img className="face-image" alt='face' src='' crossOrigin="anonymous"/>
                    {
                        currPredictions.map((pred,i) => {
                            let boxStyle = {top: pred.btop+'%', left: pred.bleft+'%', bottom: pred.bbot+'%', right: pred.bright+'%'}
                            return(
                                <div key={i} className="bounding-box" style={boxStyle}></div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="face-info">
                <div className="face-predictions"></div>
            </div>
        </div>
    )
}

export default Face;