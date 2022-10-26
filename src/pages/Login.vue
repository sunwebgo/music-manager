<template>
  <div id="login-img">
    <div class="login-box">
      <h2>imusic 后台管理系统</h2>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item class="login-field" prop="username">
          <el-input type="text" v-model="ruleForm.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item class="login-field" prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm" style="margin-left: 40%">登录</el-button>
      </el-form>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: 'admin',
        password: '123'
      },
      //rules	表单验证规则
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    submitForm() {
      axios.get("/admin/login/"+this.ruleForm.username+"/"+this.ruleForm.password).then(
          response =>{
            //请求成功
            if (response.data.code == 1){
              //将用户信息存入浏览器本地存储
              localStorage.setItem('admin',this.ruleForm.username)
              this.$router.push({name:'infoPage'})
              this.$message({
                type: 'success',
                message:"登录成功",
                duration:1000
              });
            }else{
              this.$message({
                type: 'error',
                message:"用户名或密码错误",
                duration:1000
              });
            }
          },
      )
    }
  }
}
</script>

<style scoped>

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  padding: 40px;
  background: rgba(0, 0, 0, .8);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .5);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  text-align: center;
  color: #fff;
}

#login-img{
  margin: 0;
  padding: 0;
  width:100%;
  height:100%;
  font-family: sans-serif;
  background: url(../assets/img/login_back2.png)  no-repeat center 0px;
  background-size: cover;
  background-position: center 0;
  background-repeat: no-repeat;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -o-background-size: cover;
  -moz-background-size: cover;
  -ms-background-size: cover;
}


</style>