<template>
    <div>
      <Header></Header>
      <Menu></Menu>
      <div class="content-box" :class="{'content-collapse':collapse}">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
import Header from "@/components/Header";
import Menu from "@/components/Menu";
export default {
  name: "Index",
  components:{
    Header,
    Menu
  },
  data(){
    return{
      collapse:false
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
</style>