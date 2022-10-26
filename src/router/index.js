/*
* 该文件专门用于创建整个应用的路由器
* */
import VueRouter from 'vue-router';

//引入组件
import Index from '../pages/Index'
import Login from '../pages/Login'
import InfoPage from "@/pages/InfoPage";
import UserPage from "../pages/UserPage"
import SingerPage from "../pages/SingerPage"
import SongPage from "../pages/SongPage"
import SongListPage from "../pages/SongListPage"
import SongListSongPage from "@/pages/SongListSongPage";
import Vue from "vue";

Vue.use(VueRouter)
//创建并暴露一个路由器
export default new VueRouter({
    mode:'history',
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/index',
            name: 'index',
            component: Index,
            children:[
                {
                    path:'infoPage',
                    name:'infoPage',
                    component:InfoPage
                },
                {
                    path:'user',
                    name:'user',
                    component:UserPage
                },
                {
                    path:'singer',
                    name:'singer',
                    component:SingerPage
                },
                {
                    path:'song',
                    name:'song',
                    component:SongPage
                },
                {
                    path:'songList',
                    name:'songList',
                    component:SongListPage
                },
                {
                    path:'songListSong',
                    name:'songListSong',
                    component: SongListSongPage
                }
            ]
        },


    ]
})