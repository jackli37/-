// pages/myorders/myorders.js
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
    let res = await db.collection('order').where(db.command.and([
      {
      buyer :app.globalData.openid
      },
      {
        status :'进行中'
      }
    ])).get()
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
      _openid :this.data.order[index].seller
    }).update({
      data:{
        money :newmoney
      }
    })
    db.collection('goods').where({
      _id :this.data.order[index].good._id
    }).update({
      data:{
        status :'已售出'
      }
    })
    wx.showToast({
      title: '处理成功',
      icon: 'success',
      duration: 2000
    })
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadListData()
  },

 
})