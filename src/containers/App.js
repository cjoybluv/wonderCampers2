import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';

// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { 
  AppBar, 
  Drawer, 
  MenuItem, 
  RaisedButton,
  FlatButton,
  Dialog,
  TextField
} from 'material-ui';

import logo from '../images/REI-logo-transparent.png';
import './App.css';

import Home from './Home';
import DiscoverDisplay from './DiscoverDisplay';
import Example from './Example';

import {
  postUserSignup
} from '../actions/appActions'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      signupOpen: false,
      userSignup: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    };
  }

  toggleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

  render() {
    const { drawerOpen, signupOpen } = this.state;

    const signupActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeSignup}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.submitSignup}
      />,
    ];
    

    return (
        <MuiThemeProvider>
          <div>
            <Router>
              <div className="App">
                <AppBar 
                  className="AppBar"
                  onLeftIconButtonClick={this.toggleDrawer}
                  title={<div><img src={logo} alt="logo" /><span className="app-title">wonderCampers</span></div>}
                  iconElementRight={<div><RaisedButton onClick={this.openSignup}>SignUp</RaisedButton><RaisedButton>Login</RaisedButton></div>}
                >
                  
                  <Drawer open={drawerOpen} >
                    <MenuItem onClick={this.toggleDrawer} >
                      <Link to="/">Home</Link>
                    </MenuItem>
                    <MenuItem onClick={this.toggleDrawer} >
                      <Link to="/discover">Discover</Link>
                    </MenuItem>
                    <MenuItem onClick={this.toggleDrawer} >
                      <Link to="/plan">Plan</Link>
                    </MenuItem>
                    <MenuItem onClick={this.toggleDrawer} >Close</MenuItem>
                  </Drawer>
                  
                </AppBar>
                <Switch>
                  <Route path="/discover" component={DiscoverDisplay} />
                  <Route path="/plan" component={Example} />
                  <Route exact path="/" component={Home} />
                  
                </Switch>
              </div>
            </Router>
            <Dialog
              actions={signupActions}
              modal={false}
              open={signupOpen}
              onRequestClose={this.closeSignup}
              autoScrollBodyContent={true}
            >
              {this.renderSignup()}
            </Dialog>
          </div>
        </MuiThemeProvider>
    );
  }

  openSignup = () => {
    this.setState({signupOpen: true});
  }

  closeSignup = () => {
    this.setState({signupOpen: false});
  }

  handleInput = (e) => {
    const userSignup = this.state.userSignup;
    userSignup[e.target.name] = e.target.value;
    this.setState({ userSignup });
  }

  submitSignup = () => {
    console.log('submitSignup',this.state.userSignup);
    const { firstName, lastName, email, password, passwordConfirm } = this.state.userSignup;
    if (password && (password === passwordConfirm)) {
      this.props.postUserSignup({firstName, lastName, email, password});
      this.closeSignup();
    }
  }

  renderSignup() {
    const { signupOpen } = this.state;
    const { firstName, lastName, email, password, passwordConfirm } = this.state.userSignup
  
    if (!signupOpen) {
      return null;
    }

    return (
      <div className="modal">
        <h3>Sign Up for wonderCampers!</h3>
          <TextField 
            floatingLabelText="First Name"
            floatingLabelFixed={true}
            value={firstName}
            name="firstName"
            onChange={this.handleInput}
          />
          <TextField 
            floatingLabelText="Last Name"
            floatingLabelFixed={true}
            value={lastName}
            name="lastName"
            onChange={this.handleInput}
          />
          <TextField 
            floatingLabelText="Email"
            floatingLabelFixed={true}
            value={email}
            name="email"
            onChange={this.handleInput}
          />
          <TextField 
            floatingLabelText="Password"
            floatingLabelFixed={true}
            value={password}
            name="password"
            onChange={this.handleInput}
          />
          <TextField 
            floatingLabelText="Confirm Password"
            floatingLabelFixed={true}
            value={passwordConfirm}
            name="passwordConfirm"
            onChange={this.handleInput}
          />
      </div>
    )
  }
}

// export default App;
const mapStateToAppProps = (state) => (
  {
    appProps: state.appProps
  }
);

const mapDispatchToAppProps = (dispatch) => (
  {
    postUserSignup: (user) => (
      dispatch(postUserSignup(user))
    ),
    dispatch: dispatch,
  }
);

const ConnectedApp = connect(
  mapStateToAppProps,
  mapDispatchToAppProps
)(App);

export default ConnectedApp;