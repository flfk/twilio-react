import React, { Component } from 'react';

import VideoComponent from './VideoComponent';

class App extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    // fetch('/users')
    // .then(res => res.json())
    // .then(test => console.log(test));
    // .then(users => this.setState({ users }));
  }

  // <h1>Users</h1>
  //       {users.map(user => (
  //         <div>{user.user}</div>
  //       ))}

  render() {
    const { users } = this.state;

    return (
      <div className="App">
        <VideoComponent />
      </div>
    );
  }
}

export default App;
