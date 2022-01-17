// pages/addgoods/addgoods.js
const app=getApp()
const db = wx.cloud.database()
Page({
      data:{
        image:'',
        Typeindex:'',
        Degreeindex:'',
        tempFilePaths: '',
        Typearray: ["公共课","通信","计算机","生物","外国语","先进","软件","光电","自动化","经管",
        "理","传媒","安法","体育"],
        Degreearray:['全新未拆封','99新','9成新','7成新','残破不堪']
    },
    changeType(e){
      this.setData({
        Typeindex: e.detail.value
        });
    },
    changeDegree(e){
      this.setData({
        Degreeindex: e.detail.value
        });
        console.log(e.detail.value)
    },
  submitform: function(e) {
    let inputTitle = e.detail.value.inputTitle
    let inputPrice = e.detail.value.inputPrice
    let inputType =  this.data.Typearray[this.data.Typeindex]
    let image=this.data.image
    if(inputTitle=='' || inputPrice=='' || inputType==''|| image=='') { 
      wx.showToast({
        title: '关键信息不能为空',
        icon: 'false',
        duration: 1000
        }) 
        return false
    }else{
console.log(inputType)
      
      db.collection('goods').add({
        //数据赋值操作，微信小程序中“：”的意思就是赋值
        data: {
          title: e.detail.value.inputTitle,
          price: e.detail.value.inputPrice,
          type: inputType,
          describe: e.detail.value.inputDescribe,
          degree: this.data.Degreearray[this.data.Degreeindex],
          owner: app.globalData.openid,
          count: 0,
          imageSrc:image,
          status:'出售中'
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            userId: res._id,
          })
          wx.showToast({
            title: '商品上架成功',
            icon: 'success',
            duration: 2000,
            mask:true,
  success: function () {
    setTimeout(function () {
      //要延时执行的代码
      wx.navigateBack({
        delta: 1
       })
    }, 1000) //延迟时间
  }
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '商品上架失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }

  },

  chooseimage: function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
      }

    })
     
    
        

  },
 
  getimage:function () {
    // 取随机名
let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let randomStr = '';
let cloudPathPrefix= 'goods_image';
for (let i = 17; i > 0; --i) {
  randomStr += str[Math.floor(Math.random() * str.length)];
}
randomStr += new Date().getTime()

let suffix =/\.\w+$/.exec(this.data.tempFilePaths[0])[0]; //正则表达式返回文件的扩展名
let cloudPath = cloudPathPrefix + '/' + randomStr + suffix

console.log(cloudPath)

 wx.cloud.uploadFile({

      cloudPath: cloudPath,
      filePath: this.data.tempFilePaths[0],
      success:res=> {
      //上传成功后会返回永久地址
         console.log(res.fileID) 
         this.setData({
          image: res.fileID
         })
      }
    })

  },
  
})