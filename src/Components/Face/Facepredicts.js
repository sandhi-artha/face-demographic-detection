import React from 'react';
import './Facepredicts.css'

const raceOptions = [
    "native hawaiian or pacific islander",
    "black or african american",
    "american indian or alaska native",
    "middle eastern or north african",
    "asian",
    "white",
    "hispanic, latino, or spanish origin"
]

const Facepredicts = ({currPredictions}) => {
    return (
        <div className='face-predicts'>
            {currPredictions.map((pred,i) => {
                const predClass = `preds preds${i}`;
                return (
                    <div key={i} className={predClass}>
                        <p className='preds-label'>Gender:</p>
                        <p className='preds-output'>{pred.gender}</p>
                        <p className='preds-label'>Age:</p>
                        <p className='preds-output'>{pred.age}</p>
                        <p className='preds-label'>Cultural:</p>
                        <p className='preds-output'>{raceOptions[pred.race]}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Facepredicts;