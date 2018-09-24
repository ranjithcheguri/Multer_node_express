import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      selectedFile: '',
      imageView: [1,2]
    };
  }
  onChange = (e) => {
    if (e.target.name == 'selectedFile') {
      console.log("OnChnage", e.target.files);
      this.setState({
        selectedFile: e.target.files
      })
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    //console.log(this.state.selectedFile.length);
    const { description, selectedFile } = this.state;

    let formData = new FormData();
    let imageCount = this.state.selectedFile.length;
    for (let i = 0; i < imageCount; i++) {
      formData.append('description', description[i]);
      formData.append('selectedFile', selectedFile[i]);
    }

    console.log(formData);

    axios.post('http://localhost:3001/', formData)
      .then((response) => {
        // access results...
        console.log(response);
      });

  }

  handleGetPhoto = (e) => {
    console.log("Inside HandleGETPHOTO");
    var data = [];    
    //request for images
    axios.post('http://localhost:3001/download/', data)
      .then(response => {
        console.log("Imgae Res length : ", response.data.length);
        var imagePreview=[];
        response.data.forEach(element=>{
          imagePreview.push('data:image/jpg;base64, ' + element);
        })
        this.setState({
          imageView: imagePreview
        })
        // console.log("STATE IMAGES : ",this.state.imageView, imagePreview);
      });

  }


  render() {

    //IMAGES RENDERING LOGIC //
    const images = this.state.imageView.map(element=>{
      return (<div><img src={element}></img></div>)
  });
    //IMAGES RENDERING END //
    const { description, selectedFile } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit} encType="multipart/form-data" >
          <input
            type="text"
            name="description"
            value={description}
            onChange={this.onChange}
            multiple
          />
          <input
            type="file"
            name="selectedFile"
            onChange={this.onChange} multiple
          />
          <button type="submit">Submit</button>
        </form>
        <div>
          <button onClick={this.handleGetPhoto}>Get Photo</button>
        </div>
        <div class="image">
            {images}
        </div>
      </div>
    )
  }
}

export default App;
