<template>
	<view class="page" :style="{'background':global_bg}" @touchstart="showBack = false" @touchend="showBack = true">
		<uni-icons v-show="showBack" type="back" size="26" color="#333" @click="back"
			style="position: fixed;top: 30rpx;left: 30rpx;z-index: 9;"></uni-icons>
		<view class="skeleton" v-if="loading" @touchmove.stop.prevent>
			<uv-skeleton rows="30" :loading="loading" :title="true" style="margin-top:28rpx" />
		</view>
		<view class="read_main_p">
			<p>{{articleTitle}}</p>
		</view>
		<view class="read_content"
			:class="[ziti_type=='mini'?'minipage':ziti_type=='small'?'smalloage':'biggerpage',{'read_content_night':isnight}]">
			<view class="read_main" @click="editread" v-html="nodes">
			</view>
		</view>
		<view class="pagechange flex-around" v-if="!loading">
			<!-- <view class="prev" @click="last">上一章</view> -->
			<view class="menu" @click="menu">菜单</view>
			<view class="next" @click="next">下一章</view>
		</view>
		<!-- 顶部选项 -->
		<view class="top_menu flex-around" v-if="show_edit">
			<text>分类</text>
			<text>榜单</text>
			<text>精选</text>
			<text>个人中心</text>
		</view>
		<!-- 底部设置 -->
		<view class="bot_edit" v-if="show_edit">
			<!-- 字体设置 -->
			<view class="flex ziti">
				<view>字体</view>
				<view class="ziti_tab flex">
					<view @click="changeziti(item.value,i)" :class="item.checked?'active_ziti':''"
						v-for="(item,i) of ziti_list" :key="i">{{item.name}}</view>
				</view>
			</view>
			<view class="background flex">
				<view>背景</view>
				<view class="bgtabs flex">
					<view class="bg_btn" @click="activebg(item.bg,i)" :style="{'background':item.bg}"
						v-for="(item,i) of bglist" :key='i'>
						<image v-if="item.checked" class="goubg" src="../../static/change.png" mode="widthFix">
						</image>
					</view>
					<view class="bg_btn">
						<image class="goubg" @click="changeDay"
							:src="isnight?'/../../static/night.png':'/../../static/sun.png'" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="bot_tabs flex-around">
				<view>
					<image class="bot_img" src="../../static/read.png" mode="aspectFit"></image>
					<view class="bot_val">
						目录
					</view>
				</view>
				<view>
					<image class="bot_img" src="../../static/bot_m.png" mode="aspectFit"></image>
					<view class="bot_val">
						最近阅读
					</view>
				</view>
				<view @click="backHome">
					<image class="bot_img" src="../../static/book.png" mode="aspectFit"></image>
					<view class="bot_val">
						首页
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="left" background-color="#fff">
			<scroll-view :scroll-y="true" class="scrollY">
				<view class="book_list" :style="{background:i.title == 'articleTitle' ? '#bcbcbc' : ''}" v-for="(i,index) in bookList" :key="index" :id="`index${index+1}`">
					<view class="title" v-if="i.title.indexOf('笔下文学') == -1" @click="toReader(i)">
						{{i.title}}
					</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				bglist: [{
						bg: "#F5F5F5",
						checked: false
					},
					{
						bg: '#dfedd6',
						checked: true
					},
					{
						bg: '#f8ceda',
						checked: false
					},
					{
						bg: '#f3cb9d',
						checked: false
					},
				],
				ziti_type: 'small',
				isnight: false,
				global_bg: '#dfedd6',
				tab_bg: "#dfedd6", //记录切换的背景颜色
				ziti_list: [{
						name: '小',
						checked: false,
						value: 'mini'
					},
					{
						name: '中',
						checked: true,
						value: 'small'
					},
					{
						name: '大',
						checked: false,
						value: 'bigger'
					}
				],
				show_edit: false, //设置
				nodes: "",
				loading: true,
				articleTitle: "",
				lastAndNext: [],
				showBack: true,
				bookList: [],
			};
		},
		onLoad(option) {
			this.configure() //缓存配置 ，字体背景大小
			let node = this.nodes
			this.nodes = this.nodes.replace(/\<p/gi, '<p class="nodep" '); //正则给img标签增加class
			this.article = JSON.parse(decodeURIComponent(option.article))
			this.getArticle(this.article)
		},
		computed: {
			...mapState({
				// 从state中拿到数据 箭头函数可使代码更简练
				articleList: state => state.articleList
			}),
		},
		methods: {
			getArticle(opt) {
				this.api('GET', this.url.getContent, {
					url: opt.url
				}, res => {
					console.log('获取文章详情', res);
					this.nodes = res.data.data
					this.articleTitle = res.data.title
					this.lastAndNext = res.data.last
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 100
					})
					this.loading = false
				}, err => {
					console.log('获取文章失败', err);
				})
			},
			last() {
				const opt = {
					url: this.lastAndNext[2].link + this.lastAndNext[1].link
				}
				this.getArticle(opt)
			},
			next() {
				const opt = {
					url: this.lastAndNext[2].link + this.lastAndNext[3].link
				}
				this.getArticle(opt)
			},
			menu() {
				console.log(this.articleList);
				this.bookList = this.articleList
				this.$refs.popup.open('left')
			},
			toReader(item){
				this.getArticle(item)
				this.$refs.popup.close()
			},
			back() {
				uni.navigateBack()
			},
			backHome() {
				uni.redirectTo({
					url: '../index/index'
				})
			},
			changeDay() {
				this.isnight = !this.isnight
				uni.setStorageSync('isnight', this.isnight)
				if (this.isnight) {
					this.global_bg = '#1d1d1f' //改背景颜色	
					uni.setStorageSync('global_bg', "#1d1d1f")
					uni.setStorageSync('tab_bg', this.tab_bg)
				} else {
					this.global_bg = this.tab_bg
					console.log(this.tab_bg)
					uni.setStorageSync('global_bg', this.tab_bg)
				}
			},
			editread() {
				this.show_edit = !this.show_edit
			},
			activebg(bg, idx) {
				for (let item of this.bglist) {
					item.checked = false
				}
				this.bglist[idx].checked = true
				this.global_bg = bg
				this.tab_bg = bg //为了记录切换黑夜模式切回
				this.isnight = false
				uni.setStorageSync('isnight', this.isnight)
				uni.setStorageSync('global_bg', bg)
				// this.ziti_type=type
			},
			changeziti(type, idx) {
				for (let item of this.ziti_list) {
					item.checked = false
				}
				this.ziti_list[idx].checked = true
				this.ziti_type = type
				uni.setStorageSync('ziti_type', type)
			},
			configure() {
				console.log(uni.getStorageSync('global_bg'));
				console.log(uni.getStorageSync('ziti_type'));
				console.log(uni.getStorageSync('isnight'));
				if (uni.getStorageSync('global_bg')) {
					this.global_bg = uni.getStorageSync('global_bg')
					this.tab_bg = uni.getStorageSync('tab_bg')
					//拿的同时还需要更改当前的设置
					for (let item of this.bglist) {
						if (item.bg == this.global_bg) {
							item.checked = true
						} else {
							item.checked = false
						}
					}
				}
				if (uni.getStorageSync('ziti_type')) {
					this.ziti_type = uni.getStorageSync('ziti_type')
					for (let item of this.ziti_list) {
						if (item.value == this.ziti_type) {
							item.checked = true
						} else {
							item.checked = false
						}
					}
				}
				if (uni.getStorageSync('isnight')) {
					this.isnight = true
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		color: #1d1b1b;
	}

	.page {
		// 7e8286
		padding-bottom: 40rpx;

	}

	.flex {
		display: flex;
	}

	.flex-around {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.minipage {}

	.read_main_p {
		text-align: center;
		padding-top: 30rpx;
		font-size: 42rpx;
	}

	.read_content {
		padding: 0 40rpx;
		font-size: 40rpx;
	}

	.minipage {
		font-size: 36rpx;
	}

	.smallpage {
		font-size: 40rpx;
	}

	.biggerpage {
		font-size: 44rpx;
	}

	.read_content /deep/ p {
		text-indent: 72rpx;
		margin: 20rpx 0;
		color: #1d1b1b;
		font-family: 'PingFang-SC-Regular';
		line-height: 1.8;
	}

	.read_content {
		text-indent: 72rpx;
		margin: 20rpx 0;
		color: #1d1b1b;
		font-family: 'PingFang-SC-Regular';
		line-height: 1.8;
	}

	.read_content .nodep {
		text-indent: 72rpx;
		margin: 20rpx 0;
		color: #1d1b1b;
		font-family: 'PingFang-SC-Regular';
		line-height: 1.8;
	}

	.read_content_night /deep/ p {
		color: #7e8286;
	}

	.read_content_night {
		color: #7e8286 !important;
	}

	.top_menu {
		background-color: rgba(34, 34, 34, 1);
		height: 90rpx;
		position: fixed;
		width: 100%;
		font-size: 30rpx;
		z-index: 10;
		top: 0;
		color: #fff;
		align-items: center;
	}

	.bot_edit {
		background-color: rgba(83, 84, 149, 1.0);
		height: 400rpx;
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 10;
		padding: 44rpx 30rpx 30rpx 25rpx;
		color: #FFFFFF;

		.ziti {
			line-height: 60rpx;
			margin-bottom: 44rpx;
		}

		.ziti_tab {
			font-size: 30rpx;
			line-height: 60rpx;
			margin-left: 20rpx;

			view {
				width: 180rpx;
				height: 60rpx;
				margin-left: 20rpx;
				text-align: center;
				border: 1rpx solid #4F4F4F;
				border-radius: 16rpx;
			}

			.active_ziti {
				border: 1rpx solid #FDAA36;
			}
		}

		.background {
			padding-bottom: 44rpx;
			line-height: 60rpx;
			border-bottom: 1rpx solid #4D4D4D;

			.bgtabs {
				margin-left: 44rpx;

				.bg_btn {
					width: 60rpx;
					height: 60rpx;
					margin-right: 55rpx;
					// background-color: #fff;
					border-radius: 50%;
					position: relative;
					border: 4rpx solid #FDAA36;

					/* #ifdef H5 */
					.goubg {
						position: absolute;
						width: 100%;
						height: 100%;
						top: 0;
						left: 0;
						border-radius: 50%;
					}

					/* #endif */

					/* #ifdef MP-WEIXIN */
					.goubg {
						position: absolute;
						width: 90%;
						height: 90%;
						top: 0;
						left: 0;
						border-radius: 50%;
						border: 4rpx solid #FDAA36
					}

					/* #endif */
				}
			}
		}
	}

	.bot_tabs {
		text-align: center;
		align-items: center;
		padding-top: 28rpx;
		padding-right: 15px;
	}

	.bot_img {
		width: 56rpx;
		height: 56rpx;
	}

	.pagechange {
		padding: 40rpx 0;

		view {
			border: 1px solid #FFB473;
			color: #FFB473;
			padding: 10rpx 50rpx;
			border-radius: 60rpx;
		}
	}

	.pagechange view:last-child {
		background: #FFB473;
		color: #fff;
	}

	.scrollY {
		overflow-y: auto;
		height: 100vh;
		
	}

	.book_list {
		margin: 30rpx 20rpx;
		padding: 20rpx 2%;
		margin-bottom: 12px;
		background-color: #f9f9f9;

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
</style>