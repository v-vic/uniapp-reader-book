const baseUrl = 'http://localhost:3000/'

export const api = function(methods = 'GET', url, data, success, fail) {
	uni.showLoading({
		title: '正在连接网络'
	})
	uni.request({
		url: baseUrl + url, //仅为示例，并非真实接口地址。
		methods: methods,
		data,
		success,
		fail,
		complete() {
			//请求成功与否都关闭loading
			uni.hideLoading()
		}
	});
}

export default api