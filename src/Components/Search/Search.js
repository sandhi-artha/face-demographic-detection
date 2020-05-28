import React from 'react';

const Search = ({geturl, getState, onButtonSubmit}) => {
    return (
        <div className='search'>
            <p>https://samples.clarifai.com/face-det.jpg</p>
            <input type='text' placeholder='Enter URL' size='60' onChange={geturl}/>
            <button className='btn' onClick={onButtonSubmit}>Detect</button>
            <button onClick={getState}>Check State</button>
            <img className='supp' src='' alt='test'/>
        </div>
    )
}

export default Search;