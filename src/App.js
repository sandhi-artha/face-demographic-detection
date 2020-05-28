import React from 'react';
import './App.css';
import Search from './Components/Search/Search';
import Face from './Components/Face/Face';
import Nav from './Components/Nav/Nav';
import Signin from './Components/User/Signin';


class App extends React.Component{
  state = {
    input: '',
    route: 'signin',
    data: []
  }

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

    const onRouteChange = (newRoute) => { this.setState({route: newRoute}) }
    const updateUser = (data) => { this.setState({data}) }

    return (
      <div className="App">
        <h1>Welcome!</h1>
        <Nav onRouteChange={onRouteChange}/>
        {
          this.state.route === 'signin'
          ? <Signin server={server} onRouteChange={onRouteChange} updateUser={updateUser} />
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
  1. create navigation, should be hidden before signin
  2. build routing for signin, register, and signout
  3. on signout, clear all state
  4. change fetch in all components to use a const instead
*/
