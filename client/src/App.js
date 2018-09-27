import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(test => console.log(test));
    // .then(users => this.setState({ users }));
  }

  render() {
    const { users } = this.state;

    return (
      <div className="App">
        <h1>Users</h1>
        {users.map(user => (
          <div>{user.user}</div>
        ))}
      </div>
    );
  }
}

export default App;
