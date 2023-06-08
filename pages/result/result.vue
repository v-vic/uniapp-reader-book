<template>
	<view>
		<view class="dataInfo">
			<view class="dataList" v-for="i in bookMap" @click="jump(i.moreUrl,i)">
				<view class="list">
					<image :src="i.image" :alt="i.title" mode="aspectFit" style="width: 130px;height: 170px;"></image>
					<view style="padding: 0 0 0 8px;">
						<view style="font-weight: 600;letter-spacing: 1px;">{{i.title}}</view>
						<view style="padding-top: 12px;">{{author}}</view>
						<view class="intro">{{i.introduce}}</view>
					</view>
				</view>
			</view>
			<view class="skeleton" v-if="loading" @touchmove.stop.prevent>
				<uv-skeleton rows="4" :loading="loading" avatar avatarShape="square" :title="true"
					style="margin-top:28rpx" />
				<uv-skeleton rows="4" :loading="loading" avatar avatarShape="square" :title="true"
					style="margin-top:28rpx" />
				<uv-skeleton rows="4" :loading="loading" avatar avatarShape="square" :title="true"
					style="margin-top:28rpx" />
				<uv-skeleton rows="4" :loading="loading" avatar avatarShape="square" :title="true"
					style="margin-top:28rpx" />
				<uv-skeleton rows="4" :loading="loading" avatar avatarShape="square" :title="true"
					style="margin-top:28rpx" />
				<uv-skeleton rows="4" :loading="loading" avatar avatarShape="square" :title="true"
					style="margin-top:28rpx" />
				<uv-skeleton rows="4" :loading="loading" avatar avatarShape="square" :title="true"
					style="margin-top:28rpx" />
			</view>
			<view style="margin: 20rpx auto;text-align: center;letter-spacing: 1px;padding-bottom: 30rpx;">
				到底啦~~
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	export default {
		data() {
			return {
				bookMap: [],
				author: '',
				loading: true
			};
		},
		onLoad(option) {
			if (option.word == store.state.author.author) {
				console.log('store', store.state.author.author);
				this.bookMap = store.state.author.list
				this.loading = false
			} else {
				this.getList(option)
			}
			this.author = option.word || store.state.author.author
		},
		methods: {
			getList(option) {
				console.log('request');
				this.api('GET', this.url.getSearch, {
					word: option.word
				}, res => {
					console.log('作者信息', res);
					this.bookMap = res.data.items
					store.commit('saveAuthor', {
						list: res.data.items,
						author: option.word
					})
					this.loading = false
				}, err => {
					console.log('作者', err);
				})
			},
			jump(url,item) {
				uni.navigateTo({
					url: '/pages/result/articleList?url=' + url + '&article=' + encodeURIComponent(JSON.stringify(item)) + '&author=' + this.author
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dataInfo {
		width: 95%;
		// display: flex;
		margin: 10rpx 2%;
	}

	.dataList {
		margin: 10rpx 2%;
		border-bottom: 1px solid #ccc;
	}

	.dataList:first-child {
		margin-left: 0;
	}

	.list {
		display: inline-flex;
		width: 100%;
		height: 180px;
		overflow: hidden;
		// background: #007AFF;
		// border: 1px solid red;

		.intro {
			width: 440rpx;
			// background: #666;
			white-space: normal;
			word-break: break-all;
			font-size: 0.9rem;
			overflow: hidden;
			text-overflow: ellipsis;
			padding-top: 12px;
			-webkit-line-clamp: 5;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}
	}
</style>