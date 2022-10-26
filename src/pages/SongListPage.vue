<template>
  <div class="table">
    <div class="container">
      <i class="songManage">歌单管理</i>
      <i>搜索歌单：</i>
      <el-input v-model="select_word" size="mini" placeholder="请输入歌单名" class="handle-input"></el-input>
      <el-button type="primary" @click="addSongList" style="float: right" size="mini">添加歌单</el-button>
    </div>
    <!--    表格数据-->
    <el-table
        :data="date"
        style="width: 100%"
        border
        size="mini"
        height="476px"
    >
      <el-table-column
          prop="picture"
          label="歌单图片"
          align="center"
          width="110">
        <template slot-scope="scope">
          <div class="songList-img">
            <!--               scope.row相当于当前行的数据对象-->
            <img :src="getUrl(scope.row.picture)" style="width: 100%">
          </div>
        </template>
      </el-table-column>

      <el-table-column
          prop="title"
          label="标题"
          align="center"
          width="130"></el-table-column>
      <el-table-column
          prop="style"
          label="风格"
          align="center"
          width="130">
      </el-table-column>
      <el-table-column
          prop="introduction"
          label="简介"
          align="center"
          width="568"></el-table-column>

      <el-table-column
          label="歌曲管理"
          width="130"
          align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="songListSongPage(scope.row.id,scope.row.title)">歌曲管理</el-button>
        </template>
      </el-table-column>

      <el-table-column
          prop="date"
          label="资源管理"
          align="center"
          width="130">
        <template slot-scope="scope">
          <!--          上传图片-->
          <el-upload :action="uploadUrl(scope.row.id)" :on-success="uploadSuccess">
            <el-button size="mini">
              更新图片
            </el-button>
          </el-upload>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="170px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页条-->
    <div class="paging">
      <el-pagination background
                     layout="total,prev,pager,next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="playList.length"
                     @current-change="handleCurrentChange">

      </el-pagination>
    </div>

    <!--    添加歌单消息框-->
    <el-dialog title="添加歌单" :visible.sync="dialogFormVisible" width="400px" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="歌单标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="风格" prop="style">
          <el-select v-model="ruleForm.style" placeholder="请选择歌曲风格">
            <el-option label="国风" value="国风"></el-option>
            <el-option label="流行" value="流行"></el-option>
            <el-option label="摇滚" value="摇滚"></el-option>
            <el-option label="粤语" value="粤语"></el-option>
            <el-option label="欧美" value="欧美"></el-option>
            <el-option label="纯音乐" value="纯音乐"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input type="textarea" v-model="ruleForm.introduction"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--    修改歌曲信息消息框-->
    <el-dialog title="修改歌单信息" :visible.sync="editVisible" width="400px" center>
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px" class="demo-updateForm">
        <el-form-item label="歌单标题" prop="title ">
          <el-input v-model="updateForm.title"></el-input>
        </el-form-item>
        <el-form-item label="风格" prop="style">
          <el-input v-model="updateForm.style"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="updateForm.introduction"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateSinger('updateForm')">确定</el-button>
          <el-button @click="Cancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {mixin} from "../mixins/index";
import {mapGetters} from 'vuex';
import '../assets/js/iconfont'

export default {
  name: "SongListPage",
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      editVisible: false,
      tempDate: [],
      playList: [],
      select_word: '',
      pageSize: 4,
      currentPage: 1,

      //添加歌单的表单
      ruleForm: {     //添加消息框
        picture: '/img/song/歌曲图片.jpg',
        title: '',
        style:'',
        introduction: ''
      },
      //更改歌单信息的表单
      updateForm: {    //修改消息框
        id:'',
        title: '',
        style:'',
        introduction: ''
      },

      //表单校验规则
      rules: {
        title: [
          {required: true, message: '请输入歌单标题', trigger: 'change'},
        ],
        style: [
          {required: true, message: '请输入歌单风格', trigger: 'change'},
        ],
        introduction: [
          {required: true, message: '请输入歌单简介', trigger: 'change'},
        ],
      },
    };
  },

  computed: {
    //计算出每页现实的数据
    date() {
      return this.playList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    ...mapGetters([
      'isPlay'
    ])
  },

  methods: {

    //在添加页面删除文件时的提示信息
    beforeRemove() {
    },


    //  添加歌单按钮
    addSongList() {
      this.dialogFormVisible = true
      //清除原始编辑样式
      this.$nextTick(function () {
        this.$refs['ruleForm'].clearValidate()
      })
      for (let key in this.ruleForm) {
        this.ruleForm[key] = ""
      }
    },

    //添加歌曲对话框提交按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          axios.post('/songList/add',
              //传递的参数
              {
                title: this.ruleForm.title,
                style: this.ruleForm.style,
                introduction: this.ruleForm.introduction,
                picture: '/img/songList/歌单图片.jpg',
              }).then(
              response => {
                if (response.data.code == 1) {
                  //添加成功后刷新歌手列表
                  this.selectAllSongList()
                  this.$message({
                    type: 'success',
                    center: true,
                    message: response.data.message,
                    duration:1000
                  });
                } else {
                  this.$message({
                    type: 'error',
                    center: true,
                    message: response.data.message,
                    duration:1000
                  });
                }
              },
          )

          //清除原始编辑样式
          this.$nextTick(function () {
            this.$refs[formName].clearValidate()
          })
          for (let key in this.ruleForm) {
            this.ruleForm[key] = ""
          }
        } else {
          return false;
        }
      });
    },

    //添加歌手对话框重置按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //  查询所有歌单
    selectAllSongList() {
      this.playList = []
      this.tempDate = []
      //  发送axios请求
      axios.get("/songList/select").then(
          response => {
            //将从后端传回来的歌手对象数组存入数组中
            this.playList = response.data.playList
            this.tempDate = response.data.playList
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
      return `${this.$store.state.HOST}/songList/updateImg?id=${id}`
    },

    //  上传图片成功之后的操作
    uploadSuccess(response) {
      if (response.code == 1) {
        this.selectAllSongList()
        this.$message({
          type: 'success',
          center: true,
          message: '更改成功',
          duration:1000
        });
      } else {
        this.$message({
          type: 'error',
          center: true,
          message: '更改失败',
          duration:1000
        });
      }
    },


    //弹出修改页面和数据回显
    handleEdit(row) {
      this.editVisible = true
      //数据回显
      this.updateForm = {
        id: row.id,
        title: row.title,
        style: row.style,
        introduction: row.introduction,
      }
    },

    //  保存修改页面
    updateSinger(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = false

          axios.post('/songList/update',
              //传递的参数
              {
                id: this.updateForm.id,
                title: this.updateForm.title,
                introduction: this.updateForm.introduction,
                style: this.updateForm.style,
              }).then(
              response => {
                if (response.data.code == 1) {
                  //修改成功后刷新歌单列表
                  this.selectAllSongList()
                  //定位当前页是第一页
                  this.handleCurrentChange(1)
                  this.$message({
                    type: 'success',
                    center: true,
                    message: response.data.message,
                    duration:1000
                  });
                } else {
                  this.$message({
                    type: 'error',
                    center: true,
                    message: response.data.message,
                    duration:1000
                  });
                }
              },
          )

          //清除原始编辑样式
          this.$nextTick(function () {
            this.$refs[formName].clearValidate()
          })
          for (let key in this.updateForm) {
            this.updateForm[key] = ""
          }
        } else {
          return false;
        }
      });
    },
    //  取消操作
    Cancle() {
      this.editVisible = false
    },
    //  删除操作
    handleDelete(id) {
      this.$confirm('此操作将永久删除该歌曲, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //发送axois请求
        axios.post('/songList/delete/' + id).then(
            response => {
              if (response.data.code == 1) {
                //刷新整个歌曲页面
                this.selectAllSongList();
                this.handleCurrentChange(1)
                this.$message({
                  type: 'success',
                  message: response.data.message,
                  duration:1000
                });

              } else {
                this.$message({
                  type: 'error',
                  message: response.data.message,
                  duration:1000
                });
              }
            }
        )

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //  获取当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },

    //判断上传的文件是否是mp3格式
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'mp3'
      if (!extension) {
        this.$message({
          message: "上传文件只能是mp3格式！",
          type: 'error',
          duration:1000
        })
      }
      return extension;
    },

  //  跳转到本歌单歌曲管理页面
    songListSongPage(id,title){
      this.$router.push({
        name:'songListSong',
        query:{
          id, //歌单id
          title, //歌单名
        }
      })
    }

  },
  created() {
    //当组件create时自动查询所有歌手信息
    this.selectAllSongList();

    this.singerId = this.$route.query.id
    this.singerName = this.$route.query.name
  },
  destroyed() {
    this.$store.commit('setIsPlay', false)
  },

  watch: {
    //  监控输入框
    select_word() {
      //当用户不输入时展示的就是全部数据
      if (this.select_word == '') {
        this.playList = this.tempDate
      } else {
        //初始化歌手列表
        this.playList = []
        //根据用户输入的内容添加到新的歌手列表中
        for (let item of this.tempDate) {
          if (item.title.includes(this.select_word)) {
            this.playList.push(item)
          }
        }
      }
    }
  }

}
</script>

<style scoped>
. {
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

.songManage {
  color: deepskyblue;
  font-size: larger;
  margin-right: 30%;
}

.file-upload {
  font-size: small;
  margin-left: 5px;

}

.play {
  position: absolute;
  z-index: 100;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  top: 18px;
  left: 15px;
}

.icon {
  width: 2em;
  height: 2em;
  color: black;
  fill: currentColor;
  overflow: hidden;
}

</style>