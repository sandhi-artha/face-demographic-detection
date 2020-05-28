import React from 'react';
import './App.css';
import Search from './Components/Search/Search';
import Face from './Components/Face/Face';
import Nav from './Components/Nav/Nav';
import Signin from './Components/User/Signin';
import Register from './Components/User/Register';


const initialState = {
  input: '',
  route: 'signin',
  data: []
}

class App extends React.Component{
  state = { ...initialState } // using spread operator prevents mutating the initialState

  render(){
    const geturl = (event) => { this.setState({ input: event.target.value}) }
    const getState = () => { console.log(this.state) }
    const server = 'http://localhost:5000/';

    const onButtonSubmit = () => {
      document.querySelector(".face-image").src = this.state.input;
      fetch(server+'predict', {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"url": this.state.input})
      })
      .then(resp => resp.json())
      .then(response => console.log(response))
      .catch(err => console.log(err));
    }

    const onRouteChange = (newRoute) => {
      // if returning to signin view (means user is signing out), hide the signout nav and reset to initialState
      if(newRoute==='signin'){
        document.querySelector('.nav').classList.add('hidden')
        this.setState(initialState);
      }
      this.setState({route: newRoute})
    }
    const updateUser = (data) => { this.setState({data}) }

    return (
      <div className="App">
        <h1>Welcome!</h1>
        <Nav onRouteChange={onRouteChange}/>
        {
          this.state.route === 'signin'
          ? <Signin onRouteChange={onRouteChange} updateUser={updateUser} server={server} />
            : this.state.route === 'register'
              ? <Register onRouteChange={onRouteChange} updateUser={updateUser} server={server}/>
              : <div className="main-content">
                  <Search geturl={geturl} getState={getState} onButtonSubmit={onButtonSubmit}/>
                  <Face />
                </div>
        }
        
      </div>
    )
  }
}

export default App;

/*  TODO
  1. create navigation, should be hidden before signin  DONE
  2. build routing for signin, register, and signout  DONE
  3. on signout, clear all state
  4. change fetch in all components to use a const instead  DONE
*/
