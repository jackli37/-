// pages/mygoods/mygoods.js
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
    _page:0,
    hasMore:true
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
    let res = await goods_col.orderBy('count','desc').limit(LIMIT).skip(_page*LIMIT).where(db.command.and([
      {
        owner:app.globalData.openid
      },
      {
        status:'出售中'
      }
    ])).get()
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

   deletegoods:function (e){
    let id =e.currentTarget.dataset.id
    console.log(id)
    wx.showModal({
			title: '提示',
			content: '即将下架该商品',
			success: function(res) {
				if (res.confirm) {
        console.log('用户点击确定')
        goods_col.where({
          _id:id
        }).remove({
          success:function () {
            console.log('删除成功')
            wx.showLoading({
              title: '下架成功！',
              duration:1000
            })
          },
          fail:function () {
            wx.showLoading({
              title: '下架失败！',
              duration:1000
            })
          }
        })

				} else if (res.cancel) {
        console.log('用户点击取消')
        
				}
			}
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