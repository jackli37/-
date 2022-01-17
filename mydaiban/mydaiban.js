// pages/mydaiban/mydaiban.js
const db = wx.cloud.database() 
const user_col =db.collection('userData')
import {ml_hideLoading,ml_showLoading,ml_showToast} from '../../utils/asyncWX.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    daiban:[],
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
   const LIMIT = 7
   //显示加载框
   await ml_showLoading()
    let res = await db.collection('daiban').limit(LIMIT).skip(_page*LIMIT).get()
    //隐藏加载框
    await ml_hideLoading()
    //手动关闭下拉刷新
    wx.stopPullDownRefresh()
  
    console.log('列表数据',res.data)
  
    this.setData({
    daiban :[...this.data.daiban,...res.data],
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
  async paysuccess(e) {
    let id = e.currentTarget.dataset.id
    let Openid = e.currentTarget.dataset.openid
    console.log(Openid)
    let ress= await user_col.where({
      openid:Openid
    }).get()
    console.log('信息',ress.data)
    let money = parseInt(ress.data[0].money) + parseInt(e.currentTarget.dataset.pay) 
    let re = db.collection('daiban').where({
      _id:id
    }).remove({
      success:function () {
        wx.showLoading({
          title: '处理成功！',
          duration:1000
        })
     let up = db.collection('userData').where({
          _openid : Openid
        }).update({
          data:{
            money :money
          }
        })
      },
      fail:function () {
        wx.showLoading({
          title: '处理失败！',
          duration:1000
        })
      }
    })
  },
  async payfailed(e){
    let id = e.currentTarget.dataset.id
    db.collection('daiban').where({
      _id:id
    }).remove({
      success:function () {
        wx.showLoading({
          title: '处理成功！',
          duration:1000
        })
      },
      fail:function () {
        wx.showLoading({
          title: '处理失败！',
          duration:1000
        })
      }
    })
  },
  onPullDownRefresh(){
    console.log('下拉刷新')
    this.setData({
      daiban:[],
      _page:0,
      hasMore:true
    })
    this.loadListData()
   },

   async onReachBottom(){
    if(!this.data.hasMore){
     await ml_showToast('别往下划了，没了！！！')
      return
    }
  console.log('上拉刷新')
  this.loadListData()
  },
 
})