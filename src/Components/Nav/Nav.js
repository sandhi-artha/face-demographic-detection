import React from 'react';

const Nav = ({onRouteChange}) => {
    return (
        <div className='nav hidden'>
            <p className='btn' onClick={() => onRouteChange('signin')}>Sign Out</p>
        </div>
    )
}

export default Nav;