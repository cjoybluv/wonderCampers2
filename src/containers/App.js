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
  Menu,
  MenuItem, 
  FlatButton,
  IconButton,
  Dialog,
  TextField,
  Popover,
  Snackbar
} from 'material-ui';

import logo from '../images/REI-logo-transparent.png';
import './App.css';

import Home from './Home';
import DiscoverDisplay from './DiscoverDisplay';
import Trips from './Trips';
import Locations from './Locations';
import Activities from './Activities';
import Forms from './Forms';
import Documents from './Documents';

import {
  postUserSignup, postUserLogin
} from '../actions/appActions'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      anchorEl: null,
      userMenuOpen: false,
      signupOpen: false,
      snackbarOpen: false,
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

  componentWillReceiveProps(update) {
    this.setState({
      user: update.appProps.user,
      message: update.appProps.message
    });
    if (update.appProps.message) {
      this.setState({snackbarOpen: true});
    }
  }

  render() {
    const { 
      drawerOpen, 
      signupOpen, 
      loginOpen,
      userMenuOpen,
      anchorEl,
      snackbarOpen,
      user,
      message
    } = this.state;

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
                  iconElementRight={
                    <div>
                      {!!user && 
                        <span>Hello {user.firstName}</span>
                      }
                      <IconButton onClick={this.openUserMenu} >
                        <i className="material-icons md-36">person</i>
                      </IconButton>
                    </div>
                  }
                >
                  
                  <Drawer open={drawerOpen} >
                    <MenuItem onClick={this.toggleDrawer} >
                      <Link to="/">Home</Link>
                    </MenuItem>
                    <MenuItem onClick={this.toggleDrawer} >
                      <Link to="/discover">Discover</Link>
                    </MenuItem>
                    <MenuItem primaryText={'Plan'}
                      menuItems={[
                        <MenuItem onClick={this.toggleDrawer}><Link to="/trips">Trips</Link></MenuItem>,
                        <MenuItem onClick={this.toggleDrawer}><Link to="/locations">Locations</Link></MenuItem>,
                        <MenuItem onClick={this.toggleDrawer}><Link to="/activities">Activities</Link></MenuItem>,
                        <MenuItem onClick={this.toggleDrawer}><Link to="/forms">Forms</Link></MenuItem>,
                        <MenuItem onClick={this.toggleDrawer}><Link to="/documents">Documents</Link></MenuItem>
                      ]}
                    />
                    <MenuItem onClick={this.toggleDrawer} >Close</MenuItem>
                  </Drawer>
                  
                </AppBar>
                <Switch>
                  <Route path="/discover" component={DiscoverDisplay} />
                  <Route path="/trips" component={Trips} />
                  <Route path="/locations" component={Locations} />
                  <Route path="/activities" component={Activities} />
                  <Route path="/forms" component={Forms} />
                  <Route path="/documents" component={Documents} />
                  <Route exact path="/" component={Home} />
                  
                </Switch>
              </div>
            </Router>
            <Popover
              open={userMenuOpen}
              anchorEl={anchorEl}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              onRequestClose={this.closeUserMenu}
            >
              <Menu>
                {!user && 
                  <div>
                    <MenuItem primaryText="Signup" onClick={this.openSignup} />
                    <MenuItem primaryText="Login" onClick={this.openLogin} />
                  </div>
                }
                {user &&
                  <div>
                    <MenuItem primaryText="Logout" onClick={this.logout} />
                  </div>
                }
              </Menu>
            </Popover>
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
            {!!message &&
              <Snackbar
                open={snackbarOpen}
                message={message}
                autoHideDuration={4000}
                onRequestClose={this.closeSnackbar}
              />
            }
          </div>
        </MuiThemeProvider>
    );
  }

  logout = (e) => {
    e.preventDefault();
    this.setState({
      user: null,
      userMenuOpen: false
    });
  }

  openUserMenu = (e) => {
    e.preventDefault();
    this.setState({
      userMenuOpen: true,
      anchorEl: e.currentTarget,
    });
  }

  closeUserMenu = () => {
    this.setState({userMenuOpen: false});
  }

  closeSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      message: ''
    });
  }

  openSignup = () => {
    this.setState({
      signupOpen: true,
      userMenuOpen: false
    });
  }

  closeSignup = () => {
    this.setState({signupOpen: false});
  }

  handleSignupInput = (e) => {
    const userSignup = this.state.userSignup;
    userSignup[e.target.name] = e.target.value;
    this.setState({ userSignup });
  }

  submitSignup = (e) => {
    e.preventDefault();
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
            type="email"
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
    this.setState({
      loginOpen: true,
      userMenuOpen: false
    });
  }

  closeLogin = () => {
    this.setState({loginOpen: false});
  }

  handleLoginInput = (e) => {
    const userLogin = this.state.userLogin;
    userLogin[e.target.name] = e.target.value;
    this.setState({ userLogin });
  }

  submitLogin = (e) => {
    e.preventDefault();
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
            type="email"
          />
          <TextField 
            floatingLabelText="Password"
            floatingLabelFixed={true}
            value={password}
            name="password"
            onChange={this.handleLoginInput}
            type="password"
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