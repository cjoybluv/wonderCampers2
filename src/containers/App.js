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
  postUserSignup, postUserLogin
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
      },
      loginOpen: false,
      userLogin: {
        email: '',
        password: ''
      }
    };
  }

  toggleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

  render() {
    const { drawerOpen, signupOpen, loginOpen } = this.state;

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
    
    const loginActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeLogin}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.submitLogin}
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
                  iconElementRight={<div><RaisedButton onClick={this.openSignup}>SignUp</RaisedButton><RaisedButton onClick={this.openLogin}>Login</RaisedButton></div>}
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
            <Dialog
              actions={loginActions}
              modal={false}
              open={loginOpen}
              onRequestClose={this.closeLogin}
              autoScrollBodyContent={true}
            >
              {this.renderLogin()}
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

  handleSignupInput = (e) => {
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
            onChange={this.handleSignupInput}
          />
          <TextField 
            floatingLabelText="Last Name"
            floatingLabelFixed={true}
            value={lastName}
            name="lastName"
            onChange={this.handleSignupInput}
          />
          <TextField 
            floatingLabelText="Email"
            floatingLabelFixed={true}
            value={email}
            name="email"
            onChange={this.handleSignupInput}
          />
          <TextField 
            floatingLabelText="Password"
            floatingLabelFixed={true}
            value={password}
            name="password"
            onChange={this.handleSignupInput}
          />
          <TextField 
            floatingLabelText="Confirm Password"
            floatingLabelFixed={true}
            value={passwordConfirm}
            name="passwordConfirm"
            onChange={this.handleSignupInput}
          />
      </div>
    )
  }

  openLogin = () => {
    this.setState({loginOpen: true});
  }

  closeLogin = () => {
    this.setState({loginOpen: false});
  }

  handleLoginInput = (e) => {
    const userLogin = this.state.userLogin;
    userLogin[e.target.name] = e.target.value;
    this.setState({ userLogin });
  }

  submitLogin = () => {
    console.log('submitLogin',this.state.userLogin);
    const { email, password } = this.state.userLogin;

    this.props.postUserLogin({ email, password });
    this.closeLogin();
  }

  renderLogin() {
    const { loginOpen } = this.state;
    const { email, password } = this.state.userLogin;
  
    if (!loginOpen) {
      return null;
    }

    return (
      <div className="modal">
        <h3>Login to wonderCampers!</h3>
          <TextField 
            floatingLabelText="Email"
            floatingLabelFixed={true}
            value={email}
            name="email"
            onChange={this.handleLoginInput}
          />
          <TextField 
            floatingLabelText="Password"
            floatingLabelFixed={true}
            value={password}
            name="password"
            onChange={this.handleLoginInput}
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
    postUserLogin: (user) => (
      dispatch(postUserLogin(user))
    ),
    dispatch: dispatch,
  }
);

const ConnectedApp = connect(
  mapStateToAppProps,
  mapDispatchToAppProps
)(App);

export default ConnectedApp;