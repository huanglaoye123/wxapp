// pages/system/pact/auditPact.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.pendingList,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              toast.success('查询成功');
              _this.setData({
                  allData:res.data.data.records,
              })
            }
            else{
              toast.fail('查询失败');
            }
        }
      })
  },
  onSubmit: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    wx.request({
        url: config.service.approved,    
        method:"POST", 
        data:{
          id:e.target.dataset.id
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
            }
        }
      })
  },onReject: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    wx.request({
        url: config.service.denied,    
        method:"POST", 
        data:{
          id:e.target.dataset.id
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
        }
      })
  },onClosed: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    wx.request({
        url: config.service.closed,    
        method:"POST", 
        data:{
          id:e.target.dataset.id
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          if(!res.data?.data?.records){
            toast.success('关闭成功');
          };  
        }
      })
  },
  onShowList: function(e){
    console.log(e)
    let index = e.target.dataset.index;
    this.setData({
      details:this.data.allData[index],
      isShow:true
  })
  },
  onHidden: function(){
    this.setData({
      isShow:false
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