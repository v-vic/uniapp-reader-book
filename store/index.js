// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		"bookList": [],
		"author": {
			authorList:[],
			author:"",
		},
		"articleList":[]
	},
	mutations: {
		saveBook(state, value) {
			// 变更状态
			state.bookList = value
		},
		saveAuthor(state, value) {
			state.author.authorList = value.list
			state.author.author = value.author
		},
		saveArticle(state,val){
			state.articleList = val
		}
	}
})
export default store