//index.js

var cName = require('../../utils/currencyNames');

//获取应用实例
var app = getApp()
	Page({
	    data: {
	        progressTip: ''
	    },
		onLoad : function (options) {
		    // 页面初始化 options为页面跳转所带来的参数
		},
		onReady : function () {
		    // 页面渲染完成
		},
		onShow : function () {
		    // 页面显示


		    this.setData({
		        "progressTip": "正在刷新汇率列表..."
		    });

            //1.加载汇率列表
		    var that = this;
		    wx.request({
		        url: app.globalData.fixerApi,
		        data: {},
		        method: 'GET',
		        success: function (res) {
		            //如何解析yahoo api传回来的xml？？
		            // success
		            if (res.statusCode == 200) {

		                //补充一个USD做基准利率
		                res.data.rates.USD = 1.0000;

		                wx.setStorageSync('cRates', res.data.rates);

		                //2.加载货币名称列表
		                //TODO：可能要从其他api获取，這里暂时用静态文件代替
		                that.setData({
		                    "progressTip": "正在刷新货币名称..."
		                });
		                wx.setStorageSync('cNames', cName.names);

		                //3.读取用户本地存储的已选货币列表
		                //如果没有，就默认填入四个
		                that.setData({
		                    "progressTip": "检查已选货币..."
		                });
		                var selectCurrencyList = wx.getStorageSync('selectCurrencyList') || []
		                if (selectCurrencyList.length == 0) {
		                    selectCurrencyList = [
                                { id: 0, currencyNameEN: "CNY", currencyCal: "", currencyValue: 0, currencyNameCN: cName.names["CNY"] },
                                { id: 1, currencyNameEN: "HKD", currencyCal: "", currencyValue: 0, currencyNameCN: cName.names["HKD"] },
                                { id: 2, currencyNameEN: "USD", currencyCal: "", currencyValue: 0, currencyNameCN: cName.names["USD"] },
                                { id: 3, currencyNameEN: "JPY", currencyCal: "", currencyValue: 0, currencyNameCN: cName.names["JPY"] },
		                    ];

		                    wx.setStorageSync('selectCurrencyList', selectCurrencyList);
		                }
		                
		                //4.读取用户本地存储的默认选中货币Id
		                //如果没有，默认为2
		                var highlightedId = wx.getStorageSync('highlightedId') || 0;
		                if (highlightedId == 0) {
		                    highlightedId = 2;

		                    wx.setStorageSync('highlightedId', highlightedId);
		                }


		                //5.所有准备工作完成，redirect到main
		                that.setData({
		                    "progressTip": "正在载入首页..."
		                });
		                wx.redirectTo({
		                    url: '../main/main'
		                })

		            }
		            console.log(res);
		        },
		        fail: function () {
		            // fail
		        },
		        complete: function () {
		            // complete
		        }
		    })
		},
		onHide : function () {
			// 页面隐藏
		},
		onUnload : function () {
			// 页面关闭
		}
	})