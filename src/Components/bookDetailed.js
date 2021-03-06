import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import API from '../API';
import PubSub from 'pubsub-js';
import BookList from './bookList';
import CommentBox from './CommentBox';
import Lightbox from 'react-image-lightbox';

class BookDetailed extends Component {
  constructor(supplied) {
      super(supplied);
      this.state={
        book:{id:0,src:""},
        myRating:0,
        lightboxIsOpen: false
      }
      this.addItemToCart = this.addItemToCart.bind(this);
  }
  componentWillMount(){
    var bookID = this.props.params.id;
    console.log(bookID);
    var _this = this;
    API.getRequest('/books/' + bookID).then(function(data){
      _this.setState({book:data});
    })
    var payload ={
      "token": window.sessionStorage.token,
      "book_id": bookID
    };
    API.postRequest(payload, "/books/rate/mine").then((jsonRes)=>{
      _this.setState({myRating:jsonRes.rating})
    })
  }
  componentWillReceiveProps(newProps){
    var bookID = newProps.params.id;
    console.log(bookID);
    var _this = this;
    API.getRequest('/books/' + bookID).then(function(data){
      console.log(data);
      _this.setState({book:data});
    })
    var payload ={
      "token": window.sessionStorage.token,
      "book_id": bookID
    };
    API.postRequest(payload, "/books/rate/mine").then((jsonRes)=>{
      _this.setState({myRating:jsonRes.rating})
    })
  }
  addItemToCart (event) {
    PubSub.publish('cart.added', this.state.book);
  }
  rate(rating){
    this.setState({myRating:rating})
    var payload ={
      "rating": rating,
      "book_id": this.state.book.id,
      "token": window.sessionStorage.token
    };
    var _this = this;
    API.postRequest(payload,"/books/rate").then((jsonRes)=>{
        if(jsonRes.status===200){
          var book = this.state.book;
          book["rating"] = jsonRes.newRating;
          _this.setState({"book":book})
        }
    })
  }

  changeLightBox(){
    this.setState({lightboxIsOpen:!this.state.lightboxIsOpen})
  }

  render() {
    return (
      <div>
        <div style={styles.containerDiv}>
          <div style={styles.leftDiv}>
            <div style={styles.leftInnerDiv}>

              <img style={styles.imgStyle} onClick={()=>this.changeLightBox()} src={this.state.book.imageSrc} alt="cover"/>
              {this.state.lightboxIsOpen &&
                <Lightbox onCloseRequest={()=>this.changeLightBox()} mainSrc={this.state.book.imageSrc}/>
              }

              <button className={'btn btn-primary'} onClick={this.addItemToCart}> {'Add to cart'}</button>
            </div>
            <div style={styles.bookInfo}>
              <h1><b>{this.state.book.title}</b></h1>
              <p><b>Author:</b> <a href={"/#/books/author/" + encodeURIComponent(this.state.book.author)}>{this.state.book.author}</a></p>
              <p><b>Genre: </b>{this.state.book.genre}</p>
              <p><b>Price:</b> ${this.state.book.price}</p>
              <p><b>Release Date: </b> {this.state.book.releaseDate}</p>
              <p><b>Publisher: </b> {this.state.book.pubInfo}</p>
              <p>{this.state.book.description}</p>
              <div style={styles.ratingDiv}>
                <p>Rating: </p>
                <StarRatingComponent
                          name="rate1"
                          editing={false}
                          starCount={5}
                          value={this.state.book.rating}
                          />
              </div>
              <div style={styles.ratingDiv}>
                <p>Your Rating: </p>
                <StarRatingComponent
                          name="rate2"
                          editing={true}
                          onStarClick={(newRating,oldRating,name)=>this.rate(newRating)}
                          starCount={5}
                          value={this.state.myRating}
                          />
              </div>
            </div>
          </div>
          <div style={styles.rightDiv}>
              <h1><small>Other <i>{this.state.book.genre}</i> Titles</small></h1>
              <BookList hideSort={true}
                        genre={this.state.book.genre}
                        minimal={true}
                        hidePage={true}
                        pageSize={3}
                        skipID={this.props.params.id}/>

          </div>

        </div>
        <CommentBox pollInterval={1000} bookID={this.state.book.id}/>
      </div>
    );
  }
}
var styles ={
  containerDiv:{
    display: "flex"
  },
  leftDiv:{
    display: "flex",
    width:"50%",
    marginRight:"auto",
    marginLeft:"auto"
  },
  leftInnerDiv:{
    display: "block",
    width:"50%",
    marginRight:"3%"
  },
  rightDiv:{
    width:"50%"
  },
  imgStyle:{
    width:"100%"
  },
  ratingDiv:{
      display: "flex",
      justifyContent: "auto",
      alignItems: "auto",
      height:"19px",
      marginRight:"auto"
  }
}
export default BookDetailed;
