import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import axios from "axios";
import {connect} from 'react-redux';
import {addPost,getPostDetail} from '../../reducers/generalReducer';
import ReactQuill from 'react-quill';
import   'react-quill/dist/quill.snow.css';
import '../../styles/CreateBlog.css';
const frontenv = require('../../frontenv.js');
//const {Quill, Mixin,Toolbar } = ReactQuill;
/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
//const CustomButton =  (<span className="octicon octicon-star" />)
/*
 * Event handler to be attached using Quill toolbar module (see line 73)
 * https://quilljs.com/docs/modules/toolbar/
 */
var myQuill=null;
var speechRecognitionStart='';
function Dummy () {
  if (!myQuill)
     myQuill = this.quill; 
    console.log(this);
}
//demo
function insertStar (ref) {
      const range = myQuill.getSelection();
      myQuill.editor.insertEmbed(range.index, 'image', ref);
}

function onSpeechResult(event){
  console.log("DEBUG");
  console.log(event);
  console.log("global speechRecognitionStart")
  console.log(speechRecognitionStart);
  console.log("end  global")
  console.log("END")
  let text='';
  for (let i=0;i<event.results.length;i++){
    text += event.results[i][0].transcript;
  }    
  myQuill.setContents(speechRecognitionStart);
  let len = myQuill.getLength();
  myQuill.editor.insertText(len, text);
}
//end demo
/*
 * Custom toolbar component including insertStar button and dropdowns
 */
class CreateBlog extends Component{
  SpeechOnEnd(event){
    console.log("SpeechOnEnd");
    speechRecognitionStart = myQuill.getContents();
    if (this.state.listening)
     this.state.recognition.start();
  }
  CustomToolbar = () => (
    <div id="toolbar">
      <select className="ql-header" defaultValue="">
        <option value="1"/>
        <option value="2"/>
        <option value=""/>
      </select>
      <button className="ql-bold"/>
      <button className="ql-italic"/>
      <button className="ql-underline"/>
      <button className="ql-strike"/>
      <select className="ql-color" defaultValue="">
        <option value="red"/>
        <option value="green"/>
        <option value="blue"/>
        <option value="orange"/>
        <option value="violet"/>
        <option value="#d0d1d2"/>
        <option value=""/>
      </select>    
      <button className="ql-list" value="ordered"/>
      <button className="ql-list" value="bullet"/>
      <button className="ql-link" value="bullet"/>
      <button style={{position:"relative",width:"50px"}} className="ql-image">
        <Dropzone multiple={false} accept="image/*" onDrop={(e)=>this.handleFile(e,this.insertImage)}>
           <span style={{textAlign:"center",position:"absolute",top:"50%",left:"50%", transform: "translate(-50%, -50%)"}}>Image</span>
        </Dropzone>
      </button>
      {(this.state.listening)?(
        <button onClick={this.toggleListening} className="ql-toggleMicrophone">
          <i style={{fontSize:"2rem",color:"red"}} className="fa fa-microphone"/>
        </button>
      ):(
        <button onClick={this.toggleListening} className="ql-toggleMicrophone">
        <i style={{fontSize:"2rem",color:"black"}} className="fa fa-microphone"></i></button>
      )}
      <button onClick={this.saveBlog} className="ql-saveBlog">Save</button>  
    </div>
  )
  constructor(props) {
    console.log("CONSTRUCTOR - createBlog")
    super(props)
    this.state = { 
        text: '',
        quillImage:'',
        editorHtml:'',
        uploaded_uri:'',
        recognition:null,
        listening:false,
        loaded:false,
        header:'',
        mainImage:''
    } // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.insertImage = this.insertImage.bind(this);
    this.toggleListening = this.toggleListening.bind(this);
    this.saveBlog=this.saveBlog.bind(this);
    this.loadBlogDetails=this.loadBlogDetails.bind(this);
    this.SpeechOnEnd = this.SpeechOnEnd.bind(this);
    this.addMainImage = this.addMainImage.bind(this);
    this.loadBlogDetails = this.loadBlogDetails.bind(this);
    this.headerChange=this.headerChange.bind(this);
  }
  
  headerChange(event){
    this.setState({header:event.target.value});
  }

  addMainImage(newImageRef){
    console.log("addign main image " +  newImageRef);
    this.setState({mainImage:newImageRef});
  }

  saveBlog(){
    console.log("SAVING? blog")
    console.log(this);
    if (! (this.props && this.props.general && this.props.general.user && this.props.general.user.users_id)){
      //access denied - not logged in.
      console.log("security error 1")
      return;
    }
    // CHANGE THIS FOR PRODUCTION (currently allowing anyone to edit.)
    if (false && this.props && this.props.general && this.props.general.postDetail && this.props.user && this.props.user.users_id 
    && this.props.general.postDetail && this.props.general.postDetail.users_id !==  this.props.general.user.users_id) {
      // access denied not the same user
      console.log("security error 2")
      return;
    }
    console.log("saving blog - debug 1")
    /*
    let {post_text,post_owner_id,post_title,post_id,imageref} = req.body.post;
    */
    let post_id = "New";
    let content = myQuill.root.innerHTML;
    console.log("content is")
    console.log(content);
    console.log(myQuill);
    console.log(myQuill.editor);
    if (this.props && this.props.general && this.props.general.postDetail)
      post_id= this.props.general.postDetail.post_id;
      let mypost = {
         post_id : post_id,
         post_text: JSON.stringify(content),
         users_id:this.props.general.user.users_id,
         post_title:this.state.header,
         imageref:this.state.mainImage
      }
      console.log("mypost");
      console.log(mypost);
      console.log("just before addPost")
      if (this.props && this.props.addPost){
         console.log("ADDING POST ")
         this.props.addPost(mypost);
      }
  }
  // START INSERTIMAGE
  insertImage(ref){
    //let imageElement=`<img src="${ref}" width="100%" />`;
    insertStar(ref);
  }
  // END insertIMAGE
  handleChange(content, delta, source, editor) {
    this.setState({ text:content,editorHtml: editor.getContents() })
  }
  loadBlogDetails(props) {
    if (props && props.general && props.general.postDetail && props.general.postDetail.redirect){
      // we added a post now redirect
      console.log("redirect to new blog edit page")
      this._reactInternalInstance._context.router.history.push('/createblog/' + props.general.postDetail.post_id);
    }
    //redirect if not a number and not 'new'
    if (props && props.match && isNaN(props.match.params.blogId)  && props.match.params.blogId !=='new')
      this._reactInternalInstance._context.router.history.push("/");
    console.log(props);
    if (props && props.getPostDetail && props.general ) {
      if (  props.match.params.blogId && !isNaN(props.match.params.blogId)  && (!props.general.postDetail || props.general.postDetail.post_id !== +props.match.params.blogId)){
        props.getPostDetail(props.match.params.blogId);
      }
    }
    //redirect if invalid data
    if (props && props.general && typeof props.general.postDetail === 'string')
      this._reactInternalInstance._context.router.history.push("/");
      if (props && props.general && props.general.postDetail && !this.state.loaded){
        this.setState({loaded:true,text:props.general.postDetail.quill_text,header:props.general.postDetail.post_title})
      }
      if(props && props.general && props.general.postDetail && props.general.postDetail.imageref && !this.state.imageref){
        this.setState({mainImage:props.general.postDetail.imageref});
      }      
      // Check to see if unauthorized page
      console.log("unauthorized check debug 0")
      console.log(this);
      console.log(props);
      if (props && props.general && typeof props.general.user === 'string') {
        // redirect because not logged 
        this._reactInternalInstance._context.router.history.push('/');
      }
      if (props && props.general && this.props.general.postDetail){
        if (!props.general.user || !props.general.user.users_id || (+props.general.postDetail.users_id != +props.general.user.users_id && props.general.user.user_type!=='Admin')) { 
        //redirect because not authorized
        this._reactInternalInstance._context.router.history.push('/');
      } 
    }
  }
  componentWillReceiveProps(newProps){    
    this.loadBlogDetails(newProps);
  }

  componentDidMount(){ 
    this.loadBlogDetails(this.props);
    if (!('webkitSpeechRecognition' in window) && ! this.state.recognition) {
    } else {
      const SpeechRecognition = window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition
      || window.oSpeechRecognition;
      if (SpeechRecognition != null) {
        var recognition = this.createRecognition(SpeechRecognition);
        recognition.lang='en-US';  
        this.setState({recognition:recognition});
        recognition.onresult = onSpeechResult;
        recognition.onend = this.SpeechOnEnd;
      } else {
        console.warn('The current browser does not support the SpeechRecognition API.');
      }
    }
  }

  createRecognition = (SpeechRecognition) => {
    const defaults = {
      continuous: false,
      interimResults: false,
      lang: 'en-US'
    }
    const options = Object.assign({}, defaults, this.props)
    let recognition = new SpeechRecognition()
    recognition.continuous = options.continuous
    recognition.interimResults = options.interimResults
    recognition.lang = options.lang
    return recognition
 
  }
  componentWillUnmount(){
    if (this.state.listening){
      this.state.listening=false;
      this.state.recognition.stop();
    }
  }
  toggleListening(){
    if (this.state.listening){
      this.state.recognition.stop();
      this.setState({listening:false})
    }
    else {
     speechRecognitionStart = this.state.editorHtml;
     this.setState({listening:true});
     this.state.recognition.start();
    }
  }

  handleFile(fileArray,callback) {
    let that=this;
    const reader = new FileReader();
    const file = fileArray[0];
    this.setState({
      processing: true
    });
    reader.onload = (upload) => {
      let fileType=upload.currentTarget.result.replace(/data:([^;]*);.*$/,"$1");
      let pic={
        imageBody:upload.currentTarget.result,
        imageName: file.name,
        imageExtension: fileType
      }
      axios.post(frontenv.BACKEND_HOST + '/api/upload',{pic:pic}).then(function(data){
        if (callback){
          callback(data.data.Location);
        } else {      
          that.setState({mainImage:data.data.Location})
        }
      }).catch(err=>{
        console.log("UPLOAD ERROR");
        console.log(err);
      })
    };
    reader.readAsDataURL(file);
  }
  render() { 
    let imageStyle={};
    console.log("render");
    console.log(this.state.header);
    console.log(this.props);
    console.log("state");
    console.log(this.state);
    if (this.state.mainImage) {
     imageStyle={
         backgroundImage:"url('" + this.state.mainImage + "')",
         backgroundRepeat:"no-repeat",
         backgroundSize:"cover",
         backgroundPosition: 'center center'
         
       }
    }
    return (
      <div className="createBlog">
        <Dropzone className="CreateBlogMainImageContainer" multiple={false} accept="image/*" onDrop={(e)=>this.handleFile(e,this.addMainImage)}>
          <div className='create-blog-main-image-image' style={imageStyle}>
            <span className="CreateBlogAddMainImageText">Change Image</span>
            <span className="CreateBlogAddMainImageicon">
              <i className="fa fa-camera" aria-hidden="true"/> 
            </span>
            <br/>
          </div>
        </Dropzone> 
        <div className="create-blog-header" >
          <span className="create-blog-header-title">Heading</span>
          <input className='create-blog-header-input' type="text" value={this.state.header} onChange={(e)=>this.headerChange(e)}  size="80"/>
        </div>
        <div className='create-blog-editor-container'>

          <div className="text-editor">   
            <this.CustomToolbar />
              <ReactQuill 
                onChange={this.handleChange} 
                placeholder={this.props.placeholder}
                modules={CreateBlog.modules}
                formats={CreateBlog.formats}
                theme={"snow"} // pass false to use minimal theme
                value={this.state.text}>
                <div key="editor" ref="editor" className="quill-contents"/>
              </ReactQuill>
          </div>
        </div>
        <div style={{visibility:"hidden"}}>
          <Dropzone
            multiple={false}
            accept="image/*"
            style={{width:"10px",height:"10px"}}
            onDrop={(e)=>this.handleFile(e,this.insertImage)}
            >
            <span style={{textAlign:"center",color:"red"}}>Image</span>
          </Dropzone>
        </div>
      </div>
    );
  }
}

CreateBlog.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color'
]

CreateBlog.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      "insertImage": Dummy,
      "toggleMicrophone" :Dummy,
      "saveBlog" : Dummy,
    }
  }
}

function mapStateToProps(state,ownProps){
    if (ownProps && ownProps.history && !(state && state.history))
      return Object.assign({},state,{history:ownProps.history});
    return state;
}
export default connect(mapStateToProps,{addPost:addPost,getPostDetail:getPostDetail})(CreateBlog);
