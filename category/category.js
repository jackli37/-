// pages/category/category.js
// 获取数据库
const db = wx.cloud.database()
//获取集合
const colleges_col =db.collection('colleges')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colleges: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCollegesData()
  },
  async  loadCollegesData(){
 
    let res = await colleges_col.get()
  
    console.log('列表数据',res.data)
  
    this.setData({
    colleges:res.data,
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})