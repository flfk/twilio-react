import React, { Component } from 'react';
import Video from 'twilio-video';
import axios from 'axios';

export default class VideoComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      identity: null,
      token: null,
      roomName: '',
      roomNameErr: false,
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: null
    };
  }

  componentDidMount() {
    console.log('Video Component Mounted');
    this.loadToken();
  }

  loadToken = async () => {
    console.log('loading token');
    const response = await axios('/token');
    const data = response.data;
    const { identity, token } = data[0];
    // console.log(token, identity);
    this.setState({ identity, token });
  };

  render() {
    return <div>Video Component</div>;
  }
}
