// pages/chat/chat.js
const app=getApp()
const db = wx.cloud.database()
var util = require('../../utils/util.js');

Page({
  data: {
    isShowUserName: true,
    userInfo:"",
    textInputValue:"",
    chats:[],
    seller:"",
    openid:'',
    roomname:''
  },
  onLoad:function (options){
    let params = options.roomname;
    this.setData({
      roomname: params,
      openid: app.globalData.openid
    })
    console.log(this.data.roomname)
    this.getuser()
  },

 onReady(){
   var roomname=this.data.roomname
  console.log(roomname)
   db.collection(roomname).watch({
     onChange:this.onChange.bind(this),
     onError(err){
       console.log(err)
     }
   })
 },

 onChange(e){
   console.log(e)
   let that = this
  if(e.type=="init"){
    that.setData({
      chats:[
        ...that.data.chats,
        ...[...e.docs]
      ]
    })
  }else{
    const chats = [...that.data.chats]
    for(const docChange of e.docChanges){
      switch(docChange.queueType){
        case 'enqueue':
        chats.push(docChange.doc)
        break
      }
    }
    that.setData({
      chats:chats
    })
  }
 },
  sendMsg(){
    let that = this
    var roomname=this.data.roomname
      if(!that.data.textInputValue){
          return
      }
      const doc = {
        avatar: that.data.userInfo.avatarUrl,
        nickName:that.data.userInfo.nickName,
        msgText:"text",
        textContent:that.data.textInputValue,
        sendTime: util.formatTime(new Date())
      }
      db.collection(roomname).add({
        data:doc
      })
      that.setData({
        textInputValue:"" 
      })
  },

  getContent(e){
      this.data.textInputValue=e.detail.value
  },
 async getuser(){
   await db.collection('userData').where({
      openid:app.globalData.openid
    }).get().then(res=>{
      this.setData({
        userInfo:res.data[0]
      }) 
    })
 
  },
})
