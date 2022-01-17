// pages/mysells/mysells.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadListData()
  },
  async  loadListData(){
    let res = await db.collection('order').where({
      seller :app.globalData.openid
      }).get()
    console.log('列表数据',res.data)
    this.setData({
    order :res.data
    })
  },

  async paysuccess(e){
     let index= await e.currentTarget.dataset.index
     console.log(index)
     db.collection('order').where({
       _id:this.data.order[index]._id
     }).update({
       data:{
        status :"已完成"
       }
       
     })
     console.log(this.data.order[index].seller)
     let ress= await db.collection('userData').where({
      openid:this.data.order[index].seller
    }).get()
    console.log('信息',ress.data)
    let newmoney = parseInt(ress.data[0].money) + parseInt(this.data.order[index].good.price)
     db.collection('userData').where({
      _openid :this.data.order[index].good.seller
    }).update({
      data:{
        money :newmoney
      }
    })

  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadListData()
  },

 
})