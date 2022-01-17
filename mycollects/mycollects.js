// pages/mycollects/mycollects.js
const app=getApp()
const db = wx.cloud.database()
import {ml_hideLoading,ml_showLoading,ml_showToast} from '../../utils/asyncWX.js'
Page({
  data: {
    goods :[],
    _page:0,
    hasMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadListData()
  },
  async  loadListData(){
    let {_page}=this.data
   const LIMIT = 10
   //显示加载框
   await ml_showLoading()
    let res = await db.collection('collects').where({
      collector:app.globalData.openid
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
  async onReachBottom(){
    if(!this.data.hasMore){
     await ml_showToast('别往下划了，没了！！！')
      return
    }
  console.log('上拉刷新')
  this.loadSwipersDate()
  this.loadListData()
  
  },
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
  }

})