<template>
	<view class="content">
		<input class="uni-input" v-model="inputVal" placeholder-style="color:#666666" placeholder="搜索书名或者作者" />
		<view class="doSearch" :class="isDoSearch ? 'deepSearch' : ''" @click="toSearch()">
			查询
		</view>
	</view>
</template>

<script>
	export default {
		name:"search",
		data() {
			return {
				isDoSearch:false,
				inputVal:'',
				resultData:[]
			};
		},
		methods:{
			toSearch(){
				uni.navigateTo({
					url: '/pages/result/result?word=' + this.inputVal,
					success: () => {
						this.inputVal = ""
					}
				})
				return
				this.isDoSearch = true
				const data = {
					word:this.inputVal
				}
				this.api('GET',this.url.search,data,res => {
					console.log('请求',res)
					this.resultData = res.data
				},err => {
					console.log('失败',err)
				})
				
				setTimeout(()=>{
					this.isDoSearch = false
				},400)
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	position: relative;
	width: 100%;
	background-color: #fff;
	padding-bottom: 0.8rem;
}
.uni-input{
	background-color: #e6e6e6;
	width: 90%;
	margin:0 auto;
	padding: 10rpx 14rpx 10rpx 32rpx;
	border-radius: 12rpx;
}
.doSearch{
	position: absolute;
	top:8rpx;
	right: 4%;
	color: $main_title;
	padding: 4rpx 12rpx;
}
.deepSearch{
	background-color: rgba(138, 138, 138, 0.3);	
	color: #2facff;
	padding: 4rpx 12rpx;
	margin-left: 8px;
	border-radius: 8rpx;
}
</style>