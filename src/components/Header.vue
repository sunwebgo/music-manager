<template>
  <div class="header">
    <!--    折叠图片-->
    <div class="collapse-btn" @click="collapseChange">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">imusic后台管理系统</div>
    <div class="header-right">
      <!--      全屏操作-->
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" placement="left-end" effect="light">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </div>
      <!--      用户头像-->
      <div class="user-photo">
        <img src="../assets/img/user.jpg">
      </div>
      <!--      下拉列表-->
      <el-dropdown :hide-on-click="false" class="user-name">
        <span class="el-dropdown-link">
          {{ adminName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
              <span @click="exitLogin">
                退出登录
              </span>
            </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      collapse: false,
      fullscreen: false
    }
  },
  computed:{
    adminName(){
      return localStorage.getItem('admin');
    }
  },
  methods: {
    //侧边栏折叠
    collapseChange() {
      this.collapse = !this.collapse;
      //触发全局事件总线，更改collapse的值
      this.$bus.$emit('collapse', this.collapse);
    },
    //全屏事件
    handleFullScreen() {
      //全屏变成非全屏
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } else {

        //变成全屏
        let element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen
    },
  //  退出登录
    exitLogin(){
    //  清除用户浏览器本地存储
      localStorage.removeItem('admin')
    //  跳转到根目录
      this.$router.replace("/")
    }
  }

}
</script>

<style scoped>
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #f0f0f0;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  line-height: 70px;
  margin-left: 100px;
}

.header-right {
  float: right;
  padding-right: 50px;
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  margin-right: 5px;
  font-size: 24px;
  transform: rotate(45deg);
}

.user-photo {
  margin-left: 20px;

}

.user-photo img {
  display: block;
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.user-name{
  margin-left: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>