import React, { Component } from 'react';
import $ from 'jquery';

export default class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      fileName: '',
      imagePreviewUrl: '',
      uploaded: false
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  _handleSubmit(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('uploads[]', this.state.file, "menu.png");
    let that = this;

    $.ajax({
      type: 'POST',
      url: '/store',
      contentType: false,
      processData: false,
      data: formData,
      success: function(data){
        that.setState({ uploaded: true })
      }
    })
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let fileName = file.name;

    let splitName = fileName.split(".").slice(-1)[0]
    if(splitName.toLowerCase() != "png")
    {
      alert("Upload only PNG files");
      return;
    }
    else {
      reader.onloadend = () => {
        this.setState({
          file: file,
          fileName: fileName,
          imagePreviewUrl: reader.result,
          uploaded: false
        });
      }
      reader.readAsDataURL(file)
    }
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    let uploadString = this.state.uploaded ? 'Much success!' : '';

    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="previewComponent">
        <h4>Menu Image</h4>
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} accept="image/x-png" />
          <button className="submitButton" type="submit" onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
        </form>
        <div className="menuPreview">
          {$imagePreview}
        </div>
        <p>{uploadString}</p>
      </div>
    )
  }
}

