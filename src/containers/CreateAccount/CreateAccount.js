import React, {Component} from 'react';
import Axios from 'axios';
import {ADDRESS} from '../../herokuProxy';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class CreateAccount extends Component {

    componentDidMount(){
        document.querySelector('#button1').disabled = true;
    }

    componentDidUpdate(){
        if(this.state.firstName !== '' && this.state.lastName !== '' && this.state.Email !== '' && this.state.Phone !== '' && this.state.Password !== ''){
            document.querySelector('#button1').disabled = false;
        }
        else{
            document.querySelector('#button1').disabled = true;
        }
    }

    state = {
        firstName: '',
        lastName: '',
        Email: '',
        Phone: '',
        Password: '',
        button1: false
    }

    handleChange = (e) => {
        this.setState({
           ...this.state,
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        let myURL;

        if( process.env.NODE_ENV === 'production'){
        myURL = ADDRESS + '/api/createUser';
        }
        else {
            myURL = '/api/createUser';
        }
        
        try{
            //console.log("im create account....", process.env.NODE_ENV)
            //if you try to create duplicate User, token.data will equal to ""
            const user = await Axios.post(myURL,{
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                Email: this.state.Email,
                Phone: this.state.Phone,
                Password: this.state.Password,
                rewardPoints: 0
            });

            if(user.data.token === ""){
                alert("Duplicate Email account !");
            }
            else if(user.data.email){
                this.props.setToken(user.data.token);
                this.props.setUser(user.data.firstName)

                //login is from App()
                this.props.login();

                this.props.history.push('/');
            }
            else if(!user.data.email){
                alert("Wrong Email format !");
            }
        }
        catch(err){
            console.log("From CreateAccount(), handleSubmit()????????im hereee....",err)
            //console.log("im hereee....")
        }
    };

    render(){
        return(
            <div className="container bg-background col-md-10 col-lg-8 col-xl-6 d-flex flex-column p-0 mt-5 genericClasses">
                <div className="align-self-end"><Link to="/"><span className="badge  x-button">X</span></Link></div>
                <div className="CreateAccount p-5">
                    <div className="title">
                        <h2>Create Your Account</h2>
                        <hr></hr>
                    </div>
                    <form className="form" autoComplete="off" method="POST" onSubmit={(e) => this.handleSubmit(e)}>
                        <label htmlFor="Email">First Name *</label>
                        <input type="text" name="firstName" value={this.state.firstName}
                                onChange={(e) => this.handleChange(e)} />

                        <label htmlFor="Email">Last Name *</label>
                        <input type="text" name="lastName" value={this.state.lastName}
                                onChange={(e) => this.handleChange(e)} />

                        <label htmlFor="Email">Email *</label>
                        <input type="text" name="Email" value={this.state.Email}
                                onChange={(e) => this.handleChange(e)} />

                        <label htmlFor="Email">Phone *</label>
                        <input type="text" name="Phone" value={this.state.Phone}
                                onChange={(e) => this.handleChange(e)} />

                        <label htmlFor="Password">Password *</label>
                        <input type="password" name="Password" value={this.state.Password}
                                onChange={(e) => this.handleChange(e)} />
                        <button className="btn inputButton border mb-4" id="button1" value="Submit">Create Your Account</button>      
                    </form>
                </div>
            </div>
        )
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setToken: (newToken) => dispatch({type: 'SET-TOKEN', value: newToken}),
        setUser: (firstName) => dispatch({type:'SET-USER', value: firstName})
    }
}

const mapStateToProps = state =>{
    
    return {
        token: state.token,
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateAccount));



