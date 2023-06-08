<template>
	<view class="content">
		<search class="search"></search>
		<bookList></bookList>
	</view>
</template>

<script>
	import search from '@/components/search/search.vue'
	import bookList from '@/components/bookList/bookList.vue'
	export default {
		components:{
			search,bookList
		},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
		},
		methods: {
			to(){
				uni.navigateTo({
					url:'/pages/index/readbook/readbook'
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.search{
		position: sticky;
		z-index: 9;
		top: 42px;
	}
</style>
