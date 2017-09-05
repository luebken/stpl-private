import React, { Component } from 'react';
import { Input, Accordion, Icon, Segment, Image, Label } from 'semantic-ui-react'
import { GqlQuery } from './gql'

class Package extends Component {

  constructor() {
    super()
    console.log('Package.constructor()')
    this.setStateFromWindowLocationHash()
    this.getDataFromServer()
  }

  /*
componentWillUpdate() {
  console.log('Package.componentWillUpdate()')
  this.setStateFromWindowLocationHash()
}
*/

  render() {
    console.log('Package.render() State: ', this.state)
    var keywords = '';
    if (this.state.fullresult) {
      keywords = this.state.fullresult.npms.collected.metadata.keywords.map((keyword) =>
        <Label horizontal key={keyword}>{keyword}</Label>
      );
    }
    return (
      <div>
        <h2 style={{ 'display': 'inline-block', 'marginRight': '10px' }}>Package</h2>
        <InputSearch name={this.state.name} submitHandler={this.handleInputSubmit.bind(this)} />
        <br />
        <br />

        <Segment.Group style={{ 'display': this.state.name ? 'block' : 'none' }} >
          <Segment style={{ 'display': this.state.name ? 'block' : 'none' }} loading={this.state.loading}>
            <Image style={{ 'display': this.state.loading ? 'block' : 'none' }} src='paragraph.png' />
            <div>
              <p>Description: {this.state.description}</p>
              <div>Keywords: {keywords}</div>
            </div>
          </Segment>

          <Segment>
            <p>More:</p>
            <ul>
              <li><a href={'https://npms.io/search?q=' + this.state.name}>https://npms.io/search?q={this.state.name}</a></li>
              <li><a href={'https://api.npms.io/v2/package/' + this.state.name}>https://api.npms.io/v2/package/{this.state.name}</a></li>
              <li><a href={'https://snyk.io/vuln/npm:' + this.state.name}>https://snyk.io/vuln/npm:{this.state.name}</a></li>
              <li><a href={'https://libraries.io/npm/' + this.state.name}>https://libraries.io/npm/{this.state.name}</a></li>
              <li><a href={'https://www.versioneye.com/nodejs/' + this.state.name}>https://www.versioneye.com/nodejs/{this.state.name}</a></li>
              {/* TODO DavidDM */}
            </ul>
          </Segment>
          <Segment>
            <Accordion style={{ 'display': this.state.name ? 'block' : 'none' }}>
              <Accordion.Title>  <Icon name='dropdown' /> Debug </Accordion.Title>
              <Accordion.Content>
                <div><pre>{JSON.stringify(this.state.fullresult, null, 2)}</pre></div>
              </Accordion.Content>
            </Accordion>
          </Segment>
        </Segment.Group >


      </div >
    );
  }

  componentDidMount() {
    console.log('Package.componentDidMount()')
  }

  setStateFromWindowLocationHash() {
    var regEx = /#\/package\/(.*)\/(.*)/.exec(window.location.hash)
    if (regEx) {
      this.state = {
        ecosystem: regEx[1],
        name: regEx[2],
      };
    } else {
      this.state = {
        ecosystem: '',
        name: '',
      };
    }
  }

  handleInputSubmit(value) {
    console.log('Package.handleSubmit()')
    window.location.hash = '/package/npm/' + value
    this.setStateFromWindowLocationHash()
    this.getDataFromServer()
  }

  getDataFromServer() {
    if (this.state.name) {
      var that = this
      that.setState({
        loading: true
      });
      const variables = { 'name': this.state.name, 'ecosystem': this.state.ecosystem }
      GqlQuery(variables, true).then(respObject => {
        console.log("GqlQuery called. respObject: ", respObject)
        if (respObject) {
          that.setState({
            description: respObject.npms.collected.metadata.description,
            fullresult: respObject,
            loading: false
          });
        } else {
          console.log("err. respObject null.")
          that.setState({ description: 'dummy desc' });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }


}

// A simple search box.
class InputSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.name };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log('InputSearch.handleSubmit()')
    event.preventDefault();
    this.props.submitHandler(this.state.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ 'display': 'inline-block' }}>
        <Input autoFocus value={this.state.value} onChange={this.handleChange} onSubmit={this.handleSubmit} placeholder='NPM package name' icon="search" />
      </form>
    )
  }
}

export default Package;
