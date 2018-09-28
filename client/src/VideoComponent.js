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

  handleRoomNameChange = event => this.setState({ roomName: event.target.value });

  joinRoom = () => {
    const { roomName, previewTracks, token } = this.state;

    if (!roomName.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }

    console.log('joining room: ', roomName);

    const connectOptions = { name: roomName };
    if (previewTracks) {
      connectOptions.tracks = previewTracks;
    }

    Video.connect(
      token,
      connectOptions
    ).then(this.roomJoined, error => {
      console.error('Could not connect to Twilio: ', error.message);
    });
  };

  roomJoined = room => {
    const { identity } = this.state;
    console.log('Joined as', identity);

    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true
    });

    // Attach local participants tracks to DOM, if not already attached
    var previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }

    // Attach the tracks of the room's participants
    room.participants.forEach(participant => {
      console.log('Already in room ', participant.identity);
      var previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });

    room.on('participantConnected', participant => {
      console.log('Joining: ', participant.identity);
    });

    // Attach participant's track from DOM when they add a track
    room.on('trackSubscribed', (track, participant) => {
      console.log(participant.identity, ' added ', track.kind);
      var previewContainer = this.refs.remoteMedia;
      this.attachTracks([track], previewContainer);
    });

    // Detach a participant's track when they remove a track
    room.on('trackUnsubscribed', (track, participant) => {
      console.log(participant.identity, ' removed ', track.kind);
      this.detachTracks([track]);
    });

    // Detach all participants tracks when the leave a room
    room.on('disconnect', participant => {
      console.log(participant.identity, 'left the room');
      this.detatchParticipantTracks(participant);
    });
  };

  // Attach tracks to DOM
  attachTracks = (tracks, container) => {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  };

  attachParticipantTracks = (participant, container) => {
    const tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  };

  leaveRoom = () => {
    const { activeRoom } = this.state;
    activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
  };

  detachTracks = tracks => {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  };

  detatchParticipantTracks = participant => {
    const tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  };

  render() {
    const { localMediaAvailable, hasJoinedRoom } = this.state;

    const showLocalTrack = localMediaAvailable ? (
      <div>
        <div ref="localMedia" style={{ maxWidth: '100%', height: '100%' }} />
      </div>
    ) : null;

    const btnJoinLeave = hasJoinedRoom ? (
      <button onClick={this.leaveRoom}>Leave room</button>
    ) : (
      <button onClick={this.joinRoom}>Join room</button>
    );

    return (
      <div>
        <h1>Video Component</h1>
        <input type="text" onChange={this.handleRoomNameChange} />
        {btnJoinLeave}
        {showLocalTrack}
        <div ref="remoteMedia" />
      </div>
    );
  }
}
