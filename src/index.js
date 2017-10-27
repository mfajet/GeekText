import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, hashHistory} from 'react-router';
import BookDetailed from './Components/bookDetailed';
import Login from './Components/login';
import Home from './Components/home';
import Profile from './Components/Profile';
import BookList from'./Components/bookList';
import Shopcart from './Components/shopcart';

ReactDOM.render(<Router history={hashHistory}>
                  <Route path="/" component={Login}/>
                  <Route component={App}>
                    <Route path="/home" component={Home}/>
                    <Route path="/books" component={BookList}/>
                    <Route path="/books/:id" component={BookDetailed}/>
                    <Route path="/profile/:username" component={Profile}/>
                    <Route path="/shopcart" component={Shopcart}/>
                  </Route>
                </Router>, document.getElementById('root'));
registerServiceWorker();
