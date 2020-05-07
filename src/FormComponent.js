import React from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';

// ES Modules, e.g. transpiling with Babel

const USER_POOL_ID='<YOUR_USER_POOLID>';
const USER_POOL_WEB_CLIENT_ID = '<YOUR_WEB_CLIENT_ID>';
const REGION = '<YOUR_COGNITO_REGION>';
const OAUTH_DOMAIN = '<YOUR_OAUTH_DOMAIN>';
const COOKIE_DOMAIN ='<YOUR_COOKIE_DOMAIN>';

// For more options, check out this link https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
Amplify.configure({
    Auth: {
        region: REGION,
        userPoolId: USER_POOL_ID,
        userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,        
        mandatorySignIn: false,
        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            domain: COOKIE_DOMAIN,
        // OPTIONAL - Cookie path
            path: '/',
        // OPTIONAL - Cookie expiration in days
            expires: 365,
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
            secure: false
        },

        oauth: {
            domain: OAUTH_DOMAIN,
            scope: ['email', 'openid', 'profile'],
            redirectSignIn: 'http://localhost:3000',
            redirectSignOut: 'http://localhost:3000',
            responseType: 'token' 
        }
    }
});


export default class FormComponent extends React.Component {
    constructor(){
        super();
        this.state={
            username:"",
            email:"",
            password:"",
            new_password:"",
            code:"",
            stage:"SIGNIN",
            cognito_username : ""
        }
    }
    componentDidMount() {
        
        Auth.currentAuthenticatedUser()
        .then(user => {
            console.log(user);
            this.setState({stage:"SIGNEDIN", cognito_username:user.username});
            console.log(user.signInUserSession.accessToken.jwtToken);
            })
        .catch(() =>{
            console.log("Not signed in");
        });
      }
    signUp = async () =>{
        let self = this;
        try {
            const user = await Auth.signUp({
                username: self.state.email,
                password: self.state.password,
                attributes: {
                    email:self.state.email,          // optional
                    name:self.state.username
                }
            });
            self.setState({stage:"VERIFYING"})
        } catch (error) {
            console.log('error signing up:', error);
        }
    }
    signOut = async () => {
        try {
            await Auth.signOut();
            window.location.href="/";
            
        } catch(error){
            console.log('error signing out: ', error);
        }
    }
    signIn = async () =>{
        let self = this;
        try {
            const user = await Auth.signIn({
                username: self.state.email,
                password: self.state.password});
                this.setState({stage:"SIGNEDIN", cognito_username:user.username});
        } catch (error) {
            console.log('error signing in', error);
            if (error.code == "UserNotConfirmedException"){
                await Auth.resendSignUp(self.state.email);   
                this.setState({stage:"VERIFYING"});
                
            }
        }
    }
    
    confirm = async () =>{
        let self = this;
        console.log(self.state.code);
        let username = self.state.email;
        let code = self.state.code;
        try {
            await Auth.confirmSignUp(username,code);
            //바로로그인?
            this.signIn();
          } catch (error) {
              console.log('error confirming sign up', error);
          }
    }
    changePassword = async () =>{
        let self = this;
        Auth.currentAuthenticatedUser()
        .then(user => {
            return Auth.changePassword(user, self.state.password, self.state.new_password);
        })
        .then(data => console.log(data))
        .catch(error => console.log(error));
    }
    changePasswordForgot = async () => {
        let self = this;
        Auth.forgotPasswordSubmit(self.state.email, self.state.code, self.state.new_password)
            .then(data => {
                console.log("SUCCESS");
            })
            .catch(error => {
                console.log("err",error);
            });

    }
    resendCode = async () =>{
        let self = this;
        try {
            await Auth.resendSignUp(self.state.email);
            console.log('code resent succesfully');
        } catch (error) {
            console.log('error resending code: ', error);
        }
    }
    sendCode = async () => {
        let self = this;
        Auth.forgotPassword(self.state.email)
        .then(data => {

            console.log(data);
        })
        .catch(error => console.log(error));
    }
    gotoSignUp = () =>{
        this.setState({stage:"SIGNUP"});
    }
    gotoSignIn = () =>{
        this.setState({stage:"SIGNIN"});
    }
    gotoPasswordRest = () =>{
        this.setState({stage:"FORGOT"});
    }
    
    handleEmailChange = (e) => {
        
        this.setState({email: e.target.value});
        
    }
    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
        
    }
    handleNewPasswordChange = (e) => {
        this.setState({new_password: e.target.value});
        
    }
    handleCodeChange = (e) => {
        this.setState({code: e.target.value});
    }
    handleUserNameChange = (e) => {
        this.setState({username: e.target.value});
    }
    render() {
        
        return (
            <div className="ui container">
                <h1 className="ui header">Cognito Auth</h1>
                <div className="ui placeholder segment">
                    
                    <div className="ui one column very relaxed stackable grid" style={{display: this.state.stage=="SIGNEDIN" ? 'block' : 'none' }}>
                        <div className="column">
                            <div className="ui form" >
                                <p className="ui center aligned segment">cognito username : {this.state.cognito_username}</p>
                                <div className="field">
                                    <label>Old Password</label>
                                    <div className="ui left icon input">
                                        <input type="password"  onChange={this.handlePasswordChange} />
                                        <i className="lock icon"></i>
                                    </div>
                                </div>
                                <div className="field">
                                    <label>New Password</label>
                                    <div className="ui left icon input">
                                        <input type="password"  onChange={this.handleNewPasswordChange} />
                                        <i className="lock icon"></i>
                                    </div>
                                </div>
                                <div className="ui blue submit button" onClick={this.changePassword} >Change Password</div>
                                <br/>
                                <div className="ui blue submit button" onClick={this.signOut} >SignOut</div>
                            </div>
                        </div>
                    </div>
                    <div className="ui two column very relaxed stackable grid" style={{display: this.state.stage=="SIGNEDIN" ? 'none' : 'block' }}>
                        <div className="column">
                        <div className="ui form" style={{display: this.state.stage=="VERIFYING" ? 'block' : 'none' }}>
                            <div className="field">
                            <label>Verfication Code</label>
                            <div className="ui left icon input">
                                <input type="text" placeholder="111111" value={this.state.code} onChange={this.handleCodeChange}/>
                                <i className="key icon"></i>
                            </div>
                            </div>
                            <div className="ui blue submit button" onClick={this.confirm} >Confirm Account</div>
                            <p className="ui center aligned segment"
                            >
                                Didn't receive a code?  <a href="#" onClick={this.resendCode}>Resend it</a>
                            </p>
                        </div>
                        <div className="ui form" style={{display: this.state.stage=="FORGOT" ? 'block' : 'none' }}>
                            <div className="field">
                                <label>Email</label>
                                <div className="ui left icon input">
                                    <input type="text" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}/>
                                    <i className="mail icon"></i>
                                </div>
                            </div>
                            <div className="ui blue submit button" onClick={this.sendCode}> Send Email</div>
                            <br/>
                            <div className="field">
                                <label>Verfication Code</label>
                                <div className="ui left icon input">
                                    <input type="text" placeholder="111111" value={this.state.code} onChange={this.handleCodeChange}/>
                                    <i className="key icon"></i>
                                </div>
                            </div>
                            <div className="field">
                                    <label>New Password</label>
                                <div className="ui left icon input">
                                    <input type="password"  onChange={this.handleNewPasswordChange} />
                                    <i className="lock icon"></i>
                                </div>
                            </div>
                            <div className="ui blue submit button" onClick={this.changePasswordForgot}> Change Password</div>
                        </div>
                        <div className="ui form" style={{display: this.state.stage=="SIGNIN" || this.state.stage=="SIGNUP"? 'block' : 'none' }}>
                            <div className="field" 
                                style={{display: this.state.stage=="SIGNUP" ? 'block' : 'none' }}
                            >
                                <label>Name</label>
                                <div className="ui left icon input">
                                    <input type="text" placeholder="John Behr" value={this.state.username} onChange={this.handleUserNameChange}/>
                                    <i className="user icon"></i>
                                </div>
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <div className="ui left icon input">
                                    <input type="text" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}/>
                                    <i className="mail icon"></i>
                                </div>
                            </div>
                            <div className="field">
                            <label>Password</label>
                            <div className="ui left icon input">
                                <input type="password"  onChange={this.handlePasswordChange} />
                                <i className="lock icon"></i>
                            </div>
                            </div>
                            

                            <div className="ui blue submit button" onClick={this.signIn} 
                                style={{display: this.state.stage=="SIGNIN" ? 'block' : 'none' }}
                            >Sign In</div>
                            <div className="ui blue submit button" onClick={this.signUp} 
                                style={{display: this.state.stage=="SIGNUP" ? 'block' : 'none' }}
                            >Sign Up</div>

                            <p className="ui center aligned segment" 
                                style={{display: this.state.stage=="SIGNIN" ? 'block' : 'none' }}>
                                Don't have an account? <a href="#" onClick={this.gotoSignUp}>Sign Up</a>
                            </p>
                            <p className="ui center aligned segment" 
                                style={{display: this.state.stage=="SIGNIN" ? 'block' : 'none' }}>
                                <a href="#" onClick={this.gotoPasswordRest}>Forgot your password?</a>
                            </p>
                            <p className="ui center aligned segment"
                            style={{display: this.state.stage=="SIGNUP" ? 'block' : 'none' }}>
                                Already have an account? <a href="#" onClick={this.gotoSignIn}>Sign In</a>
                            </p>
                            
                        </div>
                        </div>
                        <div className="middle aligned column">
                        <div className="App">
                            <button class="ui google plus button" onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Continue with Google <i class="google plus icon"></i></button>
                        </div>
                        </div>
                    </div>
                    <div className="ui vertical divider" style={{display: this.state.stage=="SIGNEDIN" ? 'none' : 'block' }}>
                        Or
                    </div>
                </div>
            </div>
        )
    }
}