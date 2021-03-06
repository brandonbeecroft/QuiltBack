import React from 'react';
import Parser from 'html-react-parser';
import * as types from '../actions/ActionTypes';
import initialState from './initialState'
import {apiGetAdminNotifications,apiGetAdminPosts,apiGetAdminUsers,apiAddPost,apiEditAccount,apiGetUsersPosts,apiGetUsersEvents,apiGetComments,apiAddComment,apiLogout,apiGetUser,apiGetEventPage,apiGetNextEventPage,apiGetNextPostPage,apiGetPostDetail,apiGetEventDetail,apiGetSubscribers,apiRemoveSubscriber,apiAddSubscriber,apiGetPosts,apiGetEvents, apiGetAddress} from '../services/apiServices';

export function addPost(post){
    return {
        type:types.ADD_POST,
        payload:apiAddPost(post)
    }
}
export function getAdminNotifications(){
    return {
        type:types.GET_ADMIN_NOTIFICATIONS,
        payload:apiGetAdminNotifications()
    }
}
export function getAdminPosts(){
    return {
        type:types.GET_ADMIN_POSTS,
        payload:apiGetAdminPosts()
    }
}
export function getAdminUsers(){
    console.log('TYPE!!!!')
    console.log(types.GET_ADMIN_USERS);
    return {
        type:types.GET_ADMIN_USERS,
        payload:apiGetAdminUsers()
    }
}

export function getComments(postId){
    console.log("REDUCER postid" +postId);
  return {
      type:types.GET_COMMENTS,
      payload:apiGetComments(postId)
  }

}
export function addComment(comment){
     return {
         type:types.ADD_COMMENT,
         payload:apiAddComment(comment)
     }
}


export function logout(){
    return{
        type:types.LOGOUT,
        payload:apiLogout()
    }
}

export function getUser(){
        return {
                type:types.GET_USER,
                payload:apiGetUser()
        }
}



export function getPostDetail(postId){
   return {
       type: types.GET_POST_DETAIL,
       payload: apiGetPostDetail(postId)
   }
}
export function getAddress(){
    console.log('inside reducer');
    return{
        type:types.GET_ADDRESS,
        payload: apiGetAddress()
    }
}

export function getEventPage(page,limit){
    return {
        type:types.GET_EVENT_PAGE,
        payload:apiGetEventPage(page,limit)
    }
}
export function getNextEventPage(page,limit){
    return {
        type:types.GET_NEXT_EVENT_PAGE,
        payload:apiGetNextEventPage(page,limit)
    }
}
export function getNextPostPage(page,limit){
    return {
        type:types.GET_NEXT_POST_PAGE,
        payload:apiGetNextPostPage(page,limit)
    }
}

export function getPosts(){
    return {
        type:types.GET_POSTS,
        payload:apiGetPosts()
    }
}

export function getEvents(){
    return {
        type:types.GET_EVENTS,
        payload:apiGetEvents()
    }
}

export function addSubscriber(email){
    console.log("will call api function with " +email);
      return {
          type:types.ADD_SUBSCRIBER,
          payload:apiAddSubscriber(email)
      }
}
export function getSubscribers(){
    return {
        type:types.GET_SUBSCRIBERS,
        payload:apiGetSubscribers()
    }
}
export function removeSubscriber(email){
    return {
        type:types.REMOVE_SUBSCRIBER,
        payload:apiRemoveSubscriber(email)
    }
}
export function getEventDetail(event_id){
    return {
        type:types.GET_EVENT_DETAIL,
        payload:apiGetEventDetail(event_id)
    }
}
export function getUsersEvents(users_id) {
    console.log('inside reducer')
    return {
        type:types.GET_USERS_EVENTS,
        payload:apiGetUsersEvents(users_id)
    }
}
export function getUsersPosts(users_id) {
    return {
        type:types.GET_USERS_POSTS,
        payload:apiGetUsersPosts(users_id)
    }
}
export function editAccount(users_id,nickname,contactemail,number,imageref){
    return{
        type:types.EDIT_ACCOUNT,
        payload:apiEditAccount(users_id,nickname,contactemail,number,imageref)
    }
}


export default function rootReducer(state=initialState,action){
// console.log("action type: " + action.type);

 switch(action.type){
    case types.ADD_POST + types.FULFILLED:
       return Object.assign({},state,{postDetail:action.payload});

    case types.GET_COMMENTS + types.FULFILLED:
      return Object.assign({},state,{comments:action.payload});
    case types.ADD_COMMENT + types.FULFILLED:
     return Object.assign({},state,{comments:action.payload});

 case types.LOGOUT + types.FULFILLED:
    return Object.assign({},state,{user:null});
 case types.GET_USER + types.FULFILLED:

           return Object.assign({},state,{user:action.payload});

     case types.GET_EVENT_PAGE + types.FULFILLED:
       return Object.assign({},state,{postDetail:null,eventDetail:null,postPage:0,events:action.payload});
   
     case types.GET_NEXT_EVENT_PAGE + types.FULFILLED:
       return Object.assign({},state,{postDetail:null,eventDetail:null,eventPage:state.eventPage +1,postPage:0,events:action.payload});
     case types.GET_NEXT_POST_PAGE + types.FULFILLED:
       return Object.assign({},state,{postDetail:null,eventDetail:null,postPage:state.postPage +1,eventPage:0,posts:action.payload});

     case types.GET_POST_DETAIL + types.FULFILLED:
      
      
       let newpayload=action.payload;
       if (newpayload){
        newpayload.quill_text=JSON.parse(newpayload.post_text);
        newpayload.post_text=Parser(newpayload.quill_text);
       }
       else
         newpayload="";
        
        return Object.assign({},state,{postDetail:newpayload});
   

     case types.GET_EVENT_DETAIL + types.FULFILLED:
        let eventpayload=action.payload;
        if (!action.payload) eventpayload={empty:true};
         let newState= Object.assign({},state,{eventDetail:Object.assign({},eventpayload)});
         return newState;

    case types.ADD_SUBSCRIBER + types.FULFILLED:
    console.log("apiAddSubscriber FULFILLED");
        return Object.assign({},state,{subscriberEmail:action.payload});
    case types.REMOVE_SUBSCRIBER +types.PENDING:
      return Object.assign({},state,{subscriberEmail:'pending'})
    case types.REMOVE_SUBSCRIBER + types.FULFILLED:
         return Object.assign({},state,{subscriberEmail:''});
    case types.GET_SUBSCRIBERS + types.FULFILLED:
         return Object.assign({},state,{emailList:action.payload})


    case types.GET_EVENTS + types.FULFILLED:
        return Object.assign({},state,{events:action.payload});
     
    case types.GET_POSTS + types.FULFILLED:
         let newposts = action.payload.map(post=>{
            post.quill_text=JSON.parse(post.post_text);
            post.post_text = Parser(post.quill_text);
            
            return post;
        });
        return Object.assign({},state,{posts:newposts});

    case types.GET_USERS_EVENTS + types.FULFILLED:
    return Object.assign({},state,{userEvents:action.payload});
    case types.GET_USERS_POSTS + types.FULFILLED:
        return Object.assign({},state,{userPosts:action.payload});
    case types.EDIT_ACCOUNT + types.FULFILLED:
          return Object.assign({},state,{usersInfo: action.payload})
    
    case types.GET_ADMIN_NOTIFICATIONS + types.FULFILLED:
        return Object.assign({},state,{adminNotifications:action.payload})
    case types.GET_ADMIN_POSTS + types.FULFILLED:
        return Object.assign({},state,{adminPosts:action.payload})
    case types.GET_ADMIN_USERS + types.FULFILLED:
        return Object.assign({},state,{adminUsers:action.payload})

        
     default:return state;
 }


}
