import React from 'react';
import './Signin.css';

const onSubmitSignIn = (server, onRouteChange, updateUser) => {
    const signInEmail = document.getElementById("email-address").value;
    const signInPassword = document.getElementById("pass").value;
    fetch(server+'signin', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: signInEmail,
            password: signInPassword
        })
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.profile){       // means if the data has a property of id, differentiating from the error message
            console.log(data);
            updateUser(data);
            onRouteChange('content');
        }
    })
}

const Signin = ({server, onRouteChange, updateUser}) => {
    return (
        <div className='Signin'>
            <h1>Sign In</h1>
            <label htmlFor="email-address">Email</label>
            <input type="email" name="email-address" id="email-address"/>
            <label htmlFor="pass">Password</label>
            <input type="password" name="pass" id="pass"/>
            <input className="submit" type="submit" value="Sign In" onClick={() => onSubmitSignIn(server, onRouteChange, updateUser)}/>
            <input className="register" type="submit" value="Register" onClick={() => onRouteChange('register')}/>
        </div>
    )
}

export default Signin;