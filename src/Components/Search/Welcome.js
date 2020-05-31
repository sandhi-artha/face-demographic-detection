import React from 'react';

const Welcome = ({userProfile}) => {
    return (
        <div className="welcome">
            <h1>Welcome <span className="username">{userProfile.name}</span>!</h1>
            <h4>Provide a face to detect. Paste an image URL or take a screenshot, paste in the input below, and hit detect!</h4>
        </div>
    )
}

export default Welcome;