<template>
	<view class="hand">
		<scroll-view class="scroll" :scroll-x="true" style="white-space: nowrap;">
			<view class="dataInfo">
				<view class="dataList" v-for="i in list" @click="jump(i.moreUrl,'top',i)">
					<view class="list">
						<image :src="i.image" mode="aspectFit" style="width: 130px;height: 170px;"></image>
						<view style="padding: 0 0 0 8px;">
							<view style="font-weight: 600;letter-spacing: 1px;">{{i.title}}</view>
							<view style="padding-top: 12px;color: #878787" @click.stop="jump(i.author,'author')">
								{{i.author}}</view>
							<view class="intro">{{i.introduce}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<uni-icons class="top" v-if="topBtn" type="top" size="26" color="#464646" @click="toTop"></uni-icons>

		<view :class="i.title.indexOf('笔下文学') == -1 ? 'book_list' : ''" v-for="(i,index) in bookMap" :key="index"
			:id="`index${index+1}`" @click="jump(i.moreUrl,'top',i)">
			<view class="title" v-if="i.title.indexOf('笔下文学') == -1">
				{{i.label ? i.label : '[推荐]'}} {{i.title}}
			</view>
			<view class="author" v-if="i.title.indexOf('笔下文学') == -1" @click.stop="jump(i.author,'author')">
				作者：{{i.author}}
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
</template>

<script>
	let observer = null
	import {
		mapState
	} from 'vuex' //引入mapState
	import store from '@/store/index.js'
	export default {
		name: "bookList",
		data() {
			return {
				list: [],
				bookMap: [],
				loading: true,
				topBtn: false,
			};
		},
		computed: {
			...mapState({
				// 从state中拿到数据 箭头函数可使代码更简练
				bookList: state => state.bookList
			}),
		},
		mounted() {
			if (this.bookList.length > 0) {
				setTimeout(() => {
					this.list = this.bookList.slice(0, 8)
					this.bookMap = this.bookList.slice(8)
					console.log('没有请求', JSON.stringify(this.list), this.bookMap);
					this.loading = false
				}, 800)
			} else {
				this.getlist()
			}
		},
		watch: {
			bookMap(n, o) {
				if (n.length > 0) {
					observer = uni.createIntersectionObserver(this);
					observer.relativeTo('#index15').observe('.scroll', (res) => {
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
			getlist() {
				this.api('GET', this.url.homeBookList, null, res => {
					setTimeout(() => {
						this.list = res.data.data.slice(0, 8)
						this.bookMap = res.data.data.slice(8)
						store.commit('saveBook', res.data.data)
						this.loading = false
					}, 800)
				}, err => {
					console.log('失败', err);
				})
			},
			jump(url, name, item) {
				if (name == 'author') {
					uni.navigateTo({
						url: '/pages/result/result?word=' + url
					})
				} else {
					uni.navigateTo({
						url: '/pages/result/articleList?url=' + url + '&article=' + encodeURIComponent(JSON
							.stringify(item)) + '&author=' + item.author
					})
				}
			},

			toTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hand {
		width: 95%;
		margin: 0 auto;
	}

	.scroll {
		/deep/ ::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
		}
	}

	.dataInfo {
		width: 100%;
		display: flex;
	}

	.dataList {
		margin: 10rpx;
	}

	.dataList:first-child {
		margin-left: 0;
	}

	.list {
		display: inline-flex;
		width: 300px;
		height: 180px;
		overflow: hidden;
		// background: #007AFF;
		// border: 1px solid red;

		.intro {
			width: 154px;
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

		.author {
			padding: 6px 1rem 0;
			color: #6b6b6b;
			display: inline-block;
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
</style>