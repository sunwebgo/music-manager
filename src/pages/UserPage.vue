<template>
  <div class="table">
    <div class="container">
      <i class="songManage">用户信息</i>
      <i>搜索用户：</i>
      <el-input v-model="select_word" size="mini" placeholder="请输入用户名" class="handle-input"></el-input>
    </div>
    <!--    表格数据-->
    <el-table
        :data="date"
        style="width: 100%"
        border
        size="mini"
        height="489px"
    >
      <el-table-column
          prop="picture"
          label="用户头像"
          align="center"
          width="110">
        <template slot-scope="scope">
          <div class="song-img">
            <!--               scope.row相当于当前行的数据对象-->
            <img :src="getUrl(scope.row.picture)" style="width: 100%">
          </div>
        </template>
      </el-table-column>

      <el-table-column
          prop="username"
          label="用户名"
          align="center"
          width="258"></el-table-column>
      <el-table-column
          prop="gender"
          label="性别"
          align="center"
          width="160">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话"
          align="center"
          width="280"></el-table-column>
      <el-table-column
          label="邮箱"
          prop="email"
          align="center"
          width="280">
      </el-table-column>
      <el-table-column
          prop="birth"
          label="生日"
          align="center"
          width="280">
        <template slot-scope="scope">
          {{changeBirth(scope.row.birth)}}
        </template>
      </el-table-column>
    </el-table>
    <!--    分页条-->
    <div class="paging">
      <el-pagination background
                     layout="total,prev,pager,next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="userList.length"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {mixin} from "../mixins/index";
import '../assets/js/iconfont'

export default {
  name: "SongPage",
  mixins: [mixin],
  data() {
    return {
      userList: [],
      tempDate: [],
      select_word: '',
      pageSize: 4,
      currentPage: 1,
      ruleForm:{
        username:'',
        picture:'',
        birth:'',
        phone:'',
        email:'',
        introduction:''
      }
    };
  },

  created() {
    //当组件create时自动查询所有用户信息
    this.selectAllUser();
  },

  computed: {
    //计算出每页现实的数据
    date() {
      return this.userList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
  },

  methods: {

    //  查询所有用户
    selectAllUser() {
      this.userList = []
      this.tempDate = []
      //  发送axios请求
      axios.get("/user/select").then(
          response => {
            //将从后端传回来的歌手对象数组存入数组中
            this.userList = response.data.userList
            this.tempDate = response.data.userList
          }
      )
    },


    //获取图片访问地址
    getUrl(url) {
      //this.$store.state.HOST-> http:localhost:8888
      return `${this.$store.state.HOST}${url}`
    },

    //  更新图片访问地址
    uploadUrl(id) {
      return `${this.$store.state.HOST}/song/updateImg?id=${id}`
    },

    //  获取当前页
    handleCurrentChange(val){
      this.currentPage = val
    },
  },

  watch: {
    //  监控输入框
    select_word() {
      //当用户不输入时展示的就是全部数据
      if (this.select_word == '') {
        this.userList = this.tempDate
      } else {
        //初始化歌手列表
        this.userList = []
        //根据用户输入的内容添加到新的歌手列表中
        for (let item of this.tempDate) {
          if (item.username.includes(this.select_word)) {
            this.userList.push(item)
          }
        }
      }
    }
  },

}
</script>

<style scoped>
.song-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}

.handle-input {
  width: 200px;
  display: inline-block;
  margin-right: 15px;
}

.paging {
  display: flex;
  margin-top: 50px;
  justify-content: center;
}

.songManage{
  color: deepskyblue;
  font-size: larger;
  margin-right:30%;
}


</style>