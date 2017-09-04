import React, { Component } from 'react';
import { Card, Icon, Divider } from 'semantic-ui-react'


class Home extends Component {
  render () {
      return (
        <div>
          <h2 style={{ 'textAlign': 'center', 'padding': '50px' }}> The shazam for apps </h2>

          <p style={{ 'textAlign': 'center', 'padding': '50px', 'fontSize': 'large' }}>
          It’s time to get sanity back into software development. <br/>
          Choose the right packages and build up sustainable, secure and compliant applications.
          </p>

        <Divider style={{ 'margin': '50px' }}/>

        <Card.Group>
          {/* hack */}
          <Card href='#' style={{ 'marginLeft': '35px' }}>
            <Card.Content>
              <Card.Header> Vulnerabilty <Icon name='tag' /> </Card.Header>
              <Card.Meta> Subheading </Card.Meta>
              <Card.Description> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </Card.Description>
            </Card.Content>
          </Card>

          <Card href='#'>
            <Card.Content>
              <Card.Header> Vulnerabilty <Icon name='tag' /> </Card.Header>
              <Card.Meta> Subheading </Card.Meta>
              <Card.Description> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </Card.Description>
            </Card.Content>
          </Card>
          
          <Card href='#'>
            <Card.Content>
              <Card.Header> Vulnerabilty <Icon name='tag' /> </Card.Header>
              <Card.Meta> Subheading </Card.Meta>
              <Card.Description> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </Card.Description>
            </Card.Content>
          </Card>

        </Card.Group>


        <Divider style={{ 'margin': '50px' }}/>


        <p>
          TODO show some top level components from github here
        </p>
        </div>
      );
    }
}

export default Home;
