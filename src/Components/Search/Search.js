import React from 'react';
import './Search.css'

const Search = ({geturl, getState, onDetect, pasteClipboard}) => {
    return (
        <div className='search'>
            <input id="search-input" type='text' placeholder='Enter URL' size='60' onChange={geturl} onPaste={pasteClipboard}/>
            <button className='btn' onClick={onDetect}>Detect</button>
        </div>
    )
}

export default Search;