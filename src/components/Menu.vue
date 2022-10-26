<template>
  <div class="sidebar">
    <el-menu class="sidebar-menu"
              :collapse="collapse"
              background-color="#334265"
              text-color="#ffffff"
              active-text-color="#20a0ff"
              router>
<!--      是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
      <template v-for="item in items">
        <template>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            {{item.title}}
          </el-menu-item>
        </template>
      </template>

    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      //菜单折叠属性
      collapse: false,
      items: [
        {
          icon: 'el-icon-document',
          index: 'infoPage',
          title: '系统首页'
        },
        {
          icon: 'el-icon-document',
          index: 'user',
          title: '用户信息'
        },{
          icon: 'el-icon-document',
          index: 'singer',
          title: '歌手管理'
        },
        {
          icon: 'el-icon-document',
          index: 'songList',
          title: '歌单管理'
        },

      ]
    }
  },
  methods:{
    collapseChange(collapse){
      this.collapse = collapse
    }
  },
  created() {
    //定义全局事件总线，用于切换collapse的值
    this.$bus.$on('collapse',this.collapseChange)
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0px;
  background-color: #334265;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar{
    width: 0;
}

.sidebar-menu:not(.el-menu--collapse){
  width: 150px;
}

.sidebar > ul{
  height: 100%;
}
</style>