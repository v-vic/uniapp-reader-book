<template>
	<view>
		<view class="dataInfo">
			<view class="dataList"  v-if="!loading">
				<view class="list">
					<image :src="article.image" :alt="article.imageTitle" mode="aspectFit"
						style="width: 130px;height: 170px;"></image>
					<view style="padding: 0 0 0 8px;">
						<view style="font-weight: 600;letter-spacing: 1px;">{{article.imageTitle}}</view>
						<view style="padding-top: 12px;">{{author}}</view>
						<view class="intro">{{article.intro || '暂无详情'}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order" v-if="!loading">
			<span :style="{color:orderIndex == 1 ? '#7e9bff' : ''}" @click="a_order">升序</span>
			<span :style="{color:orderIndex == 2 ? '#7e9bff' : ''}" @click="d_order">降序</span>
		</view>
		<view class="book_list" v-for="(i,index) in bookList" :key="index" :id="`index${index+1}`">
			<view class="title" v-if="i.title.indexOf('笔下文学') == -1" @click="toReader(i)">
				{{i.title}}
			</view>
		</view>

		<uni-icons class="top" v-if="topBtn" type="top" size="26" color="#464646" @click="toTop"></uni-icons>
		
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
</template>

<script>
	let observer = null
	import store from '@/store/index.js'
	export default {
		data() {
			return {
				bookList: [],
				loading: true,
				article: {},
				author: '',
				topBtn: false,
				orderIndex: 1,
			};
		},
		onLoad(option) {
			console.log(option);
			this.getList(option)
			// this.article = JSON.parse(decodeURIComponent(option.article));
			// this.author = option.author
			uni.setNavigationBarTitle({
				title: JSON.parse(decodeURIComponent(option.article)).title
			});
		},
		watch: {
			bookList(n, o) {
				if (n.length > 0) {
					observer = uni.createIntersectionObserver(this);
					observer.relativeTo('#index15').observe('.dataInfo', (res) => {
						if (res.intersectionRatio > 0 && this.topBtn) {
							this.topBtn = false;
						} else if (!res.intersectionRatio > 0 && !this.topBtn) {
							this.topBtn = true;
						}
					})
				}
			}
		},
		onUnload() {
			if (observer) {
				observer.disconnect()
			}
		},
		methods: {
			getList(option) {
				this.api('GET', this.url.getMore, {
					url: option.url
				}, res => {
					this.bookList = res.data.data.list
					this.article = res.data.data.intro
					this.author = option.author
					store.commit('saveArticle',res.data.data.list)
					this.loading = false
					console.log('获取更多', res);
				}, err => {
					console.log('获取失败', err);
				})
			},
			toTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			a_order() {
				if(this.orderIndex == 1) return
				this.bookList = this.bookList.reverse()
				this.orderIndex = 1
			},
			d_order() {
				if(this.orderIndex == 2) return
				this.bookList = this.bookList.reverse()
				this.orderIndex = 2
			},
			toReader(item) {
				console.log('文章详情', item);
				uni.navigateTo({
					url: '/pages/reader/reader?article=' + encodeURIComponent(JSON.stringify(item))
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
		// border-bottom: 1px solid #ccc;
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
			font-size: 0.8rem;
			font-weight: 300;
			overflow: hidden;
			text-overflow: ellipsis;
			padding-top: 12px;
			-webkit-line-clamp: 6;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}
	}

	.book_list {
		padding: 4px 2%;
		margin-bottom: 12px;
		background-color: #f0f0f0;
		font-weight: 600;

		.title {
			position: relative;
			padding-left: 1rem;

			&::before {
				content: '';
				display: block;
				width: 0.4rem;
				height: 0.4rem;
				background-color: #ea6b45;
				position: absolute;
				left: 0;
				top: 0.45rem;
				border-radius: 50%;
			}
		}
	}

	.top {
		position: fixed;
		bottom: 5vh;
		right: 40rpx;
		border-radius: 50%;
		width: 60rpx;
		height: 60rpx;
		background: rgba(190, 190, 190, 0.8);
		box-shadow: 0 0 5px #333;	
	}

	.order {
		padding: 0px 10px 12px;

		span {
			margin-right: 12px;
		}
	}
</style>