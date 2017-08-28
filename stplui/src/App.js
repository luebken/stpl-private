import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ScoreDisplay />
      </div>
    );
  }
}

class ScoreDisplay extends Component {
  constructor(props) {
    super(props);
    this.handleResultReturn = this.handleResultReturn.bind(this);

    this.state = { score: '-1' }
  }

  handleResultReturn(json) {
    this.setState({ score: json.score.final })
  }

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <p>The score is: {this.state.score}</p>
        <Button
          onResultReturn={this.handleResultReturn} />
      </div>
    );
  }
}

class Button extends Component {
  handleClick = () => {
    fetch('https://api.npms.io/v2/package/express').then(response => {
      response.json().then(json => {
        console.log(json)
        this.props.onResultReturn(json)
      })
    })
  }

  render() {
    return (
      <button onClick={this.handleClick}> hit
      </button>
    );
  }
}

export default App;
