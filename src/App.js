import React from 'react';
import './App.css';
import Search from './Components/Search/Search';
import Face from './Components/Face/Face';


class App extends React.Component{
  state = {
    input: ''
  }

  render(){
    const geturl = (event) => { this.setState({ input: event.target.value}) }
    const getState = () => { console.log(this.state) }

    const onButtonSubmit = () => {
      document.querySelector(".face-image").src = this.state.input;
    }
    return (
      <div className="App">
        <h1>Welcome!</h1>
        <Search geturl={geturl} getState={getState} onButtonSubmit={onButtonSubmit}/>
        <Face />
      </div>
    )
  }
}

export default App;
