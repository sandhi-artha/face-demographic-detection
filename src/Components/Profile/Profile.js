import React from 'react';
import './Profile.css';
import Profilecards from './Profilecards';

const Profile = ({userImages, onClickProfileImg, server}) => {
    return (
        <div className='profile-div'>
            <h3 className='profile-title'>History</h3>
            <div className='profile-img'>
                {userImages.map((image, i) => {
                    return <Profilecards key={i} image={image} onClickProfileImg={onClickProfileImg} server={server}/>
                })}
            </div>
        </div>
    )
}

export default Profile;