import Vue from "vue";
//引入Vuex插件
import Vuex from 'vuex'
Vue.use(Vuex)

//准备actions,用于响应组件中的动作
const actions = {
}

//准备mutations,用于操作数据
const mutations = {
    setIsPlay:(state,isPlay) => {state.isPlay = isPlay},
    setUrl:(state,url) => {state.url = url},
}
//准备state，用于存储数据
const state = {
    // 存储后台地址
    HOST:'http://43.143.117.57:8090',
    isPlay:false,   //是否播放中
    url:'',         //歌曲地址
}

//类似于vue中的computed，进行缓存，对于Store中的数据进行加工处理形成新的数据
const getters = {
    isPlay: state => state.isPlay,
    url: state => state.url,
    id: state =>state.id
}

export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters

})