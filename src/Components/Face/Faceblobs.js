import React from 'react';
import './Faceblobs.css';

const Faceblobs = ({faceHighlight, blobURL}) => {
    return (
        <div className='faceblobs-div'>
            {
                blobURL.map((face,i) => {
                    return <div key={i}>
                        <img className="faceblobs-image" src={face} alt='face' width='40px' onClick={() => faceHighlight(i)}/>
                    </div>
                })
            }
        </div>
    )
}

export default Faceblobs;