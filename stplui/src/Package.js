import React, { Component } from 'react';
import { Input } from 'semantic-ui-react'
import { GqlQuery } from './gql'

class Package extends Component {

  constructor() {
    super()
    console.log('Package constructor called. State: ', this.state)
    console.log('Package constructor called. Location: ', window.location.pathname)
    var componentRequest = /package\/(.*)\/(.*)/.exec(window.location.pathname)
    if (componentRequest) {
      this.state = {
        ecosystem: componentRequest[1],
        name: componentRequest[2],
      };
    } else {
      this.state = {
        ecosystem: '',
        name: '',
      };
    }
  }

  render() {
    console.log('Package render called. State: ', this.state)
    return (
      <div>
        <h2>Package</h2>

        <span>Hey I'm looking for information for package: </span>  <InputSearch name={this.state.name} />

        <p>Ecosystem: {this.state.ecosystem}</p>
        <p>Package: {this.state.name}</p>
        <p>Description: {this.state.description}</p>
      </div>
    );
  }

  componentDidMount() {
    var that = this

    const variables = { 'name': this.state.name, 'ecosystem': this.state.ecosystem }
    GqlQuery(variables, true).then(respObject => {
      console.log("GqlQuery called ", respObject)
      that.setState({ description: respObject.npms.collected.metadata.description });
    }).catch(err => {
      console.log(err)
    })
  }

}

// A simple search box. Changes window.location on change
class InputSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.name };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    console.log(event)
  }

  handleSubmit(event) {
    event.preventDefault();
    window.location = '/package/npm/' + this.state.value //TODO hackisch
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ 'display': 'inline-block' }}>
        <Input value={this.state.value} onChange={this.handleChange} onSubmit={this.handleSubmit} placeholder='NPM package name' />
        <Input type="submit" value="Search" />
      </form>
    )
  }
}

export default Package;
