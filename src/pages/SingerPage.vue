<template>
  <div class="table">

    <div class="container">
      <i class="singerManage">歌手管理</i>
      <i>搜索歌手：</i>
      <el-input v-model="select_word" size="mini" placeholder="请输入歌手名" class="handle-input"></el-input>
      <el-button type="primary" @click="addSinger" style="float: right" size="mini">添加歌手</el-button>
    </div>
    <el-table
        :data="data"
        style="width: 100%"
        border
        size="mini"
        height="489px"
    >
      <el-table-column
          prop="date"
          label="歌手图片"
          align="center"
          width="110">
        <template slot-scope="scope">
          <div class="singer-img">
            <!--               scope.row相当于当前行的数据对象-->
            <img :src="getUrl(scope.row.picture)" style="width: 100%">
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="110"></el-table-column>
      <el-table-column
          label="性别"
          align="center"
          width="110">
        <template slot-scope="scope">
          {{ changeGender(scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column
          label="出生日期"
          align="center"
          width="160">
        <template slot-scope="scope">
          {{ changeBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column
          prop="location"
          label="地址"
          align="center"
          width="110"></el-table-column>
      <el-table-column
          label="简介"
          align="center">
        <template slot-scope="scope">
          <p style="height: 100px">{{ scope.row.introduction }}</p>
        </template>
      </el-table-column>

      <el-table-column
          label="资源管理"
          align="center"
          width="100px">
        <template slot-scope="scope">
          <!--          上传图片-->
          <el-upload :action="uploadUrl(scope.row.id)" :on-success="uploadSuccess">
            <el-button size="mini">
              更新图片
            </el-button>
          </el-upload>
        </template>
      </el-table-column>

      <el-table-column
          label="歌曲管理"
          width="100"
          align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="songPage(scope.row.id,scope.row.name)">管理歌曲</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
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
                     :total="singerList.length"
                     @current-change="handleCurrentChange">

      </el-pagination>
    </div>

    <!--    添加歌手消息框-->
    <el-dialog title="添加歌手" :visible.sync="dialogFormVisible" width="400px" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="defaultGender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="3">组合</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日" prop="birth">
          <el-date-picker v-model="ruleForm.birth" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯" prop="location">
          <el-input v-model="ruleForm.location"></el-input>
        </el-form-item>
        <el-form-item label="歌手简介" prop="introduction">
          <el-input type="textarea" v-model="ruleForm.introduction"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--    修改歌手信息消息框-->
    <el-dialog title="修改歌手信息" :visible.sync="editVisible" width="400px" center>
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px" class="demo-updateForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="echoGender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="3">组合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="updateForm.birth" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯" prop="location">
          <el-input v-model="updateForm.location"></el-input>
        </el-form-item>
        <el-form-item label="歌手简介" prop="introduction">
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

export default {
  name: "SingerPage",
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      editVisible: false,
      singerList: [],
      tempDate: [],
      select_word: '',
      defaultGender: 1,
      echoGender: '1',
      pageSize: 4,
      currentPage: 1,

      //添加歌手的表单
      ruleForm: {     //添加消息框
        name: '',
        birth: '',
        picture: '/img/singer/歌手头像.jpg',
        location: '',
        introduction: ''
      },
      //更改歌手信息的表单
      updateForm: {    //修改消息框
        id: '',
        name: '',
        picture: '/img/singer/歌手头像.jpg',
        birth: '',
        location: '',
        introduction: ''
      },

      //表单校验规则
      rules: {
        name: [
          {required: true, message: '请输入歌手名', trigger: 'blur'},
        ],
        location: [
          {required: true, message: '请输入歌手籍贯', trigger: 'blur'},
        ],
        introduction: [
          {required: true, message: '请输入歌手简介', trigger: 'blur'},
        ],
        birth: [
          {required: true, message: '请选择日期', trigger: 'blur'},
        ]
      },
    };
  },

  computed: {
    //计算出每页现实的数据
    data() {
      return this.singerList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },

  methods: {

    //  添加歌手按钮
    addSinger() {
      this.dialogFormVisible = true
      //清除原始编辑样式
      this.$nextTick(function () {
        this.$refs['ruleForm'].clearValidate()
      })
      for (let key in this.ruleForm) {
        this.ruleForm[key] = ""
      }
    },

    //添加歌手对话框提交按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          //  转换日期格式
          let birth = this.ruleForm.birth;
          let datetime = birth.getFullYear() + '-' + (birth.getMonth() + 1) + '-' + birth.getDate();
          axios.post('/singer/add',
              //传递的参数
              {
                name: this.ruleForm.name,
                gender: this.defaultGender,
                picture: '/img/singer/歌手头像.jpg',
                birth: datetime,
                location: this.ruleForm.location,
                introduction: this.ruleForm.introduction
              }).then(
              response => {
                if (response.data.code == 1) {
                  //添加成功后刷新歌手列表
                  this.selectAllSinger()
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

    //  查询所有歌手
    selectAllSinger() {
      this.singerList = []
      this.tempDate = []
      //  发送axios请求
      axios.get("/singer/select").then(
          response => {
            //将从后端传回来的歌手对象数组存入数组中
            this.singerList = response.data.singerList
            this.tempDate = response.data.singerList
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
      return `${this.$store.state.HOST}/singer/updateImg?id=${id}`
    },

    //  上传图片成功之后的操作
    uploadSuccess(response) {
      if (response.code == 1) {
        this.selectAllSinger()
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


    //弹出修改页面
    handleEdit(row) {
      this.editVisible = true
      //数据回显
      this.echoGender = row.gender
      this.updateForm = {
        id: row.id,
        name: row.name,
        birth: row.birth,
        location: row.location,
        introduction: row.introduction
      }
    },

    //  保存修改页面
    updateSinger(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = false
          //  转换日期格式

          let birth = new Date(this.updateForm.birth);
          let datetime = birth.getFullYear() + '-' + (birth.getMonth() + 1) + '-' + birth.getDate();

          axios.post('/singer/update',
              //传递的参数
              {
                id: this.updateForm.id,
                name: this.updateForm.name,
                gender: this.echoGender,
                birth: datetime,
                location: this.updateForm.location,
                introduction: this.updateForm.introduction
              }).then(
              response => {
                if (response.data.code == 1) {
                  //修改成功后刷新歌手列表
                  this.selectAllSinger()
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
      this.$confirm('此操作将永久删除该歌手, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //发送axois请求
        axios.post('/singer/delete/' + id).then(
            response => {
              if (response.data.code == 1) {
                //刷新整个歌手页面
                this.selectAllSinger();
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
          message: '已取消删除',
          duration:1000
        });
      });
    },

  //  获取当前页
    handleCurrentChange(val){
      this.currentPage = val
    },

  //  转向歌曲管理页面
    songPage(id,name){
      this.$router.push({
        name:'song',
        query:{
          id,
          name
        }
      })
    },



  },
  created() {
    //当组件create时自动查询所有歌手信息
    this.selectAllSinger();
  },

  watch: {
    //  监控输入框
    select_word() {
      //当用户不输入时展示的就是全部数据
      if (this.select_word == '') {
        this.singerList = this.tempDate
      } else {
        //初始化歌手列表
        this.singerList = []
        //根据用户输入的内容添加到新的歌手列表中
        for (let item of this.tempDate) {
          if (item.name.includes(this.select_word)) {
            this.singerList.push(item)
          }
        }
      }
    }
  }

}
</script>

<style scoped>
.singer-img {
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
.singerManage{
  color: deepskyblue;
  font-size: larger;
  margin-right:30%;
}
</style>