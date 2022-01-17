// pages/message/message.js
const app=getApp()
const db = wx.cloud.database()
//获取集合
const goods_col =db.collection('messages')
//引入异步
import {ml_hideLoading,ml_showLoading,ml_showToast} from '../../utils/asyncWX.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods :[],//列表数据
    _page:0,
    hasMore:true,
    delta:1,
    openid:'',
  },

  onLoad: function (options) {
    this.loadListData()
    this.setData({
      openid:app.globalData.openid
    })
  },
  //加载数据
async  loadListData(){
  let text=app.globalData.openid
  console.log(text)
  let {_page}=this.data
 const LIMIT = 10
 //显示加载框
 await ml_showLoading()
  let res = await goods_col.where({
    tag: {
      $regex: '.*' + text + '.*',
      $options: '1'
    }
  }).limit(LIMIT).skip(_page*LIMIT).get()
  //隐藏加载框
  await ml_hideLoading()
  //手动关闭下拉刷新
  wx.stopPullDownRefresh()

  console.log('列表数据',res.data)

  this.setData({
  goods :[...this.data.goods,...res.data],
  _page :++_page,
  hasMore:res.data.length === LIMIT
  })
},
 //上拉刷新
   /**
   * 页面上拉触底事件的处理函数
   */
async onReachBottom(){
  if(!this.data.hasMore){
   await ml_showToast('别往下划了，没了！！！')
    return
  }
console.log('上拉刷新')
this.loadListData()

},



 //下拉刷新
 onPullDownRefresh(){
  console.log('下拉刷新')
  this.setData({
    goods:[],
    _page:0,
    hasMore:true
  })
  this.loadListData()
 },

    delete(e){
      let item = e.currentTarget.dataset.item
      wx.showModal({
        title: '提示',
        content: '即将删除该聊天',
        success: function(res) {
          if (res.confirm) {
          console.log('用户点击确定')
          goods_col.where({
            _id:item._id
          }).remove({
            success:function () {
              console.log('删除成功')
              wx.showLoading({
                title: '删除成功！',
                duration:1000
              })
            },
            fail:function () {
              wx.showLoading({
                title: '删除失败！',
                duration:1000
              })
            }
          })
  
          } else if (res.cancel) {
          console.log('用户点击取消')
          
          }
        }
      })
     
    }

})
