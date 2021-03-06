import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
const particleOptions = {
  particles: {
    number:{
        value:30,
        density:{
          enable: true,
          value_area: 800
        }
    }            
  }
}

const app = new Clarifai.App({
 apiKey: 'd95e9831c0ce4e059cec7eba11de91e6'
});



class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) =>{
     const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputImage');
     const width = Number(image.width);
     const height = Number(image.height);
     return{
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)

     }
  }  
  
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
      this.setState({input: event.target.value});
    }

  onSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))

  }

  onRouteChange = (route) =>{
    if(route === 'signout')
      this.setState({isSignedIn: false})
    else if(route === 'home')
      this.setState({isSignedIn: true})
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
       <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
      
       { this.state.route === 'home' 
          ?
          <div>
          
          <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit = {this.onSubmit}/>
          <FaceRecognition box = {this.state.box} image={this.state.imageUrl}/>
          <Logo /> 
          </div>
          :
          (
            this.state.route === 'signin'
            ?
            <SignIn onRouteChange = {this.onRouteChange}/> 
            : 
            <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
