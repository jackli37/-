// pages/myaccount/myaccount.js
 /**
   * 页面的初始数据
   */
  const app=getApp()
  const db = wx.cloud.database()
const user_col =db.collection('userData')
  Page({
    data: {
      user:[],
      activeIndex: 0, //默认选中第一个
      numArray: ['1', '5', '10', '20', '50','m']
    },
    onLoad: function (options) {
      this.loaduserData()
    },
    activethis: function (event) { //点击选中事件
      var thisindex = event.currentTarget.dataset.thisindex; //当前index
      this.setData({
        activeIndex: thisindex
      })
    },
    async loaduserData(){
    let res = await user_col.where({
      openid:app.globalData.openid
    }).get()
    this.setData({
      user:res.data[0]
    })
    console.log(this.data.user)
    },
    pay(){
    db.collection('daiban').add({
      data:{
        user :this.data.user.openid,
        username :this.data.user.name,
        paymoney :this.data.numArray[this.data.activeIndex],
        user_image :this.data.user.avatarUrl,
      }
    })
    } 
   })
 