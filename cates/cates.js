// pages/cates/cates.js
// 获取数据库
const app=getApp()
const db = wx.cloud.database()
//获取集合
const goods_col =db.collection('goods')
import {ml_hideLoading,ml_showLoading,ml_showToast} from '../../utils/asyncWX.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods :[],//商品列表数据
    Type:'',
    _page:0,
    hasMore:true,
    delta:1
  },

  onLoad: function (options) {
    this.setData({
      Type:options.name
    })
    this.loadListData()

  },
  //加载数据
async  loadListData(){
  let {_page}=this.data
  const LIMIT = 10
  //显示加载框
  await ml_showLoading()
  let res = await goods_col.limit(LIMIT).skip(_page*LIMIT).where({
    type:this.data.Type
  }).get()
  await ml_hideLoading()
  //手动关闭下拉刷新
  wx.stopPullDownRefresh()
console.log(this.data.Type)
  this.setData({
    goods :[...this.data.goods,...res.data],
    _page :++_page,
    hasMore:res.data.length === LIMIT
  })
},
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
 addCart(e){
  let item = e.currentTarget.dataset.item
      if(item.owner==app.globalData.openid){
        wx.showToast({
          title: '自己的商品',
          icon:'error',
          duration: 2000
        })
      }else{
  wx.navigateTo({
    url: '/pages/buy/buy?item='+JSON.stringify(item)
  })
}
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
