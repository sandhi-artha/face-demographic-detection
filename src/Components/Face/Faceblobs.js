import React from 'react';
import './Faceblobs.css';

const Faceblobs = ({faceSelect, blobURL}) => {
    return (
        <div className='faceblobs-div'>
            {
                blobURL.map((face,i) => {
                    const faceblobs = `faceblobs-image fb${i}`
                    return <div key={i}>
                        <img className={faceblobs} src={face} alt='face' width='40px' onClick={() => faceSelect(i)}/>
                    </div>
                })
            }
        </div>
    )
}

export default Faceblobs;