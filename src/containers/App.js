import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';

// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, Drawer, MenuItem } from 'material-ui';

import logo from '../images/REI_logo.gif';
import './App.css';

import Home from './Home';
import DiscoverDisplay from './DiscoverDisplay';
import Example from './Example';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
        <MuiThemeProvider>
          <Router>
            <div className="App">
              <AppBar 
                onLeftIconButtonClick={this.handleToggle}
                title="wonderCampers">
                <Drawer open={this.state.open} >
                  <MenuItem onClick={this.handleToggle} >
                    <Link to="/">Home</Link>
                  </MenuItem>
                  <MenuItem onClick={this.handleToggle} >
                    <Link to="/discover">Discover</Link>
                  </MenuItem>
                  <MenuItem onClick={this.handleToggle} >
                    <Link to="/plan">Plan</Link>
                  </MenuItem>
                  <MenuItem onClick={this.handleToggle} >Close</MenuItem>
                </Drawer>
                <img src={logo} alt="logo" />
              </AppBar>
              <Switch>
                <Route path="/discover" component={DiscoverDisplay} />
                <Route path="/plan" component={Example} />
                <Route exact path="/" component={Home} />
                
              </Switch>
            </div>
          </Router>
        </MuiThemeProvider>
    );
  }
}

export default App;
