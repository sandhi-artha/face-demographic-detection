import React from 'react';
import './Profilecards.css';


const Cards = ({image, onClickProfileImg, server}) => {
    return (
        <div className='card-div'>
            <img src={server+image.imgurl} className='card-image'
             alt='people' width='150' height='100' onClick={() => onClickProfileImg(image.imgid)}/>
            <div className='card-text'>
                <a className='card-link' href={image.oriurl}>URL</a>
                <p>{image.face}</p>
            </div>
        </div>
    )
}

export default Cards;