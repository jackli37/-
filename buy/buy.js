// pages/buy/buy.js
const app=getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCode :'',
    good:[],
    user :[],
    owner:[],
  },
  async code(){
  function setTimeDateFmt(s) {  // 个位数补齐十位数
    return s < 10 ? '0' + s : s;
  }
    const now = new Date()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    month = setTimeDateFmt(month)
    day = setTimeDateFmt(day)
    hour = setTimeDateFmt(hour)
    minutes = setTimeDateFmt(minutes)
    seconds = setTimeDateFmt(seconds)
    let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
    console.log(orderCode)
    this.setData({
      orderCode :orderCode
   })
},
async lodeuserdata(){
let res=await db.collection('userData').where({
  _openid:app.globalData.openid
}).get()
this.setData({
  user:res.data
})
let ress=await db.collection('userData').where({
  openid:this.data.good.owner
}).get()

this.setData({
  owner:ress.data
})

},
async handleOrderPay(e){
let money = this.data.user[0].money
let price = this.data.good.price
if(money < price){
  wx.showToast({
    title: '余额不足！！！',
    icon:'error',
    duration: 2000
  })
}
else{
let newmoney = money - price
let res=await db.collection('userData').where({
  _openid:app.globalData.openid
}).update({
  data:{
    money:newmoney
  }
})
let ad = await db.collection('order').add({
  data:{
    orderCode :this.data.orderCode,
    seller :this.data.owner[0]._openid,
    buyer :this.data.user[0]._openid,
    good :this.data.good,
    status : '进行中',
  },
  success: res => {
    // 在返回结果中会包含新创建的记录的 _id
    this.setData({
      userId: res._id,
    })
    console.log('上传成功！id',userId)
    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
  },
  fail: err => {
    console.error('[数据库] [新增记录] 失败：', err)
    },

})
await db.collection('goods').where({
  _id:this.data.good._id
}).update({
  data:{
    status:'交易中'
  }
 
})
wx.showToast({
  title: '支付成功',
  icon:'success',
  duration: 2000,
  mask:true,
  success: function () {
    setTimeout(function () {
      //要延时执行的代码
      wx.navigateBack({
        delta: 2
       })
    }, 1000) //延迟时间
  }
})

}

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let delta = options.delta
    let params = options.item;
    if (params != '') {
      params = JSON.parse(options.item);
    }
    this.setData({
      good: params,
    })
    this.code()
    this.lodeuserdata()
    
  },

  
})