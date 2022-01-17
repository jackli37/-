// index.js
// 获取数据库
const app=getApp()
const db = wx.cloud.database()
//获取集合
const goods_col =db.collection('goods')
//引入异步
import {ml_hideLoading,ml_showLoading,ml_showToast} from '../../utils/asyncWX.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods :[],//商品列表数据
    swipers : [],
    _page:0,
    hasMore:true,
    delta:1,
  },

  onLoad: function (options) {
    this.loadSwipersDate()
    this.loadListData()
  },
  //加载轮播图数据
  async loadSwipersDate(){
    let res = await goods_col.orderBy('count','desc').limit(3).get()
    console.log('轮播图',res)
    this.setData({
      swipers : res.data
    })
  },
  //加载数据
async  loadListData(){
  let {_page}=this.data
 const LIMIT = 7
 //显示加载框
 await ml_showLoading()
  let res = await goods_col.where({
    status:'出售中'
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
this.loadSwipersDate()
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
      
    }

})
