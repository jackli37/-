// pages/search/search.js
var text=''
const db = wx.cloud.database()
const goods_col = db.collection('goods')
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    goods:[]
  },
  see(){
    var that=this
    if(text.length==0){
      wx.showModal({
        title: '提示',
        content: '请输入关键字！',
        showCancel: false,
        success: function (res) { }
      })
      return;
    }
    
    // 数据库模糊查询
    goods_col.where({
      title: {
        $regex: '.*' + text + '.*',
        $options: '1'
      }
    }).get({
      success: res => {
        console.log('匹配', res)
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '暂时没找到对应内容',
            showCancel: false,
            success: function (res) { }
          })
          return;
        }else{
          that.setData({
            goods: res.data
          })
        }
      }
    })
  },
 
  input_p(e){
    text = e.detail.value
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('--------------1111')
    
  },
})
