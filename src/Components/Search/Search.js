import React from 'react';
import './Search.css'

const Search = ({geturl, getState, onButtonSubmit, pasteClipboard}) => {
    return (
        <div className='search'>
            <input type='text' placeholder='Enter URL' size='60' onChange={geturl} onPaste={pasteClipboard}/>
            <button className='btn' onClick={onButtonSubmit}>Detect</button>
        </div>
    )
}

export default Search;