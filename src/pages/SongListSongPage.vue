<template>
  <div class="table">
    <div class="container">
      <i class="songManage">歌单歌曲管理</i>
      <i>搜索歌曲：</i>
      <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
      <el-button type="primary" @click="addSong" style="float: right" size="mini">添加歌曲</el-button>
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
          prop="date"
          label="歌曲图片"
          align="center"
          width="110">
        <template slot-scope="scope">
          <div class="song-img">
            <!--               scope.row相当于当前行的数据对象-->
            <img :src="getUrl(scope.row.picture)" style="width: 100%">
          </div>

          <!--          播放暂停按钮-->
          <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
            <!--              暂停图标，即此时toggle是当前歌曲，再次点击当前歌曲会暂停-->
            <div v-if="toggle == scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-zanting"></use>
              </svg>
            </div>
            <!--            播放图标-->
            <div v-if="toggle != scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-bofanganniu"></use>
              </svg>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
          prop="name"
          label="歌名"
          align="center"
          width="110"></el-table-column>
      <el-table-column
          prop="style"
          label="风格"
          align="center"
          width="110">
      </el-table-column>
      <el-table-column
          prop="album"
          label="专辑"
          align="center"
          width="110"></el-table-column>
      <el-table-column
          label="歌词"
          prop="lyric"
          align="center">
        <template slot-scope="scope">
          <ul style="height: 100px;overflow: scroll">
            <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">
              {{ item }}
            </li>
          </ul>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>-->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">移除歌曲</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页条-->
    <div class="paging">
      <el-pagination background
                     layout="total,prev,pager,next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="playListSong.length"
                     @current-change="handleCurrentChange">

      </el-pagination>
    </div>

    <!--    添加歌曲消息框-->
    <el-dialog title="添加歌曲" :visible.sync="dialogFormVisible" width="400px" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="歌名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
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
  name: "SongListSongPage",
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      editVisible: false,
      playListSong: [],
      tempDate: [],
      select_word: '',
      pageSize: 4,
      currentPage: 1,
      playListId: '',     //从SongListPage获取到的参数歌单id和name
      playListTitle: '',
      toggle: false,  //播放器的显示图标状态默认值为false

      //添加歌曲的表单
      ruleForm: {     //添加消息框
        name: ''
      },

      //表单校验规则
      rules: {
        name: [
          {required: true, message: '请输入歌曲名', trigger: 'blur'},
        ]
      },
    };
  },

  computed: {
    //计算出每页现实的数据
    date() {
      return this.playListSong.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    ...mapGetters([
      'isPlay'
    ])
  },

  methods: {

    //在添加页面删除文件时的提示信息
    beforeRemove() {
    },

    //清除上次传输的文件
    clearFile() {
      this.$refs.mp3Upload.clearFiles();
    },


    //  添加歌曲按钮
    addSong() {
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
          axios.post('/playList_song/add',
              //传递的参数
              {
                songListId: this.playListId,
                name: this.ruleForm.name,
              }).then(
              response => {
                if (response.data.code == 1) {
                  //添加成功后刷新歌手列表
                  this.selectAllSong()
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

    //  查询歌单内的所有歌曲
    selectAllSong() {
      this.playListSong = []
      this.tempDate = []
      //  发送axios请求
      axios.get("/playList_song/select/" + this.playListId).then(
          response => {
            //将从后端传回来的歌单对象数组存入数组中
            this.playListSong = response.data.playListSong
            this.tempDate = response.data.playListSong
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

    //  移除歌曲操作
    handleDelete(id) {
      this.$confirm('此操作将移除该歌曲, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //发送axois请求
        axios.post('/playList_song/remove/' + id).then(
            response => {
              if (response.data.code == 1) {
                //刷新整个歌曲页面
                this.selectAllSong();
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

    //  解析歌词
    parseLyric(text) {
      let lines = text.split("\n");
      //定义正则，除去[00:13:42]
      let pattern = /\[\d{2}:\d{2}.(\d{2}|\d{3})\]/g;
      let result = [];
      for (let item of lines) {
        let value = item.replace(pattern, '');
        result.push(value)
      }
      return result;
    },
    //切换播放歌曲
    setSongUrl(url, name) {
      /* url是当前歌曲在磁盘中的相对路径
      *  name是当前歌曲名*/

      //此时如果toggle不等于传入的歌名（点击了播放按钮），则播放此歌曲，否则暂停此歌曲
      if (this.toggle != name) {
        //将当前歌曲名赋值给toggle
        this.toggle = name;
        this.$store.commit('setUrl', this.$store.state.HOST + url);
        //播放
        this.$store.commit('setIsPlay', true);
      } else {
        this.toggle = false;
        this.$store.commit('setIsPlay', false);
      }
    }
  },

  created() {
    //获取到从SongListPage传来的参数
    //歌单id
    this.playListId = this.$route.query.id
    //歌单名
    this.playListTitle = this.$route.query.title
    //当组件create时自动查询所有歌手信息
    this.selectAllSong();
  },
  destroyed() {
    this.$store.commit('setIsPlay', false)
  },

  watch: {
    //  监控输入框
    select_word() {
      //当用户不输入时展示的就是全部数据
      if (this.select_word == '') {
        this.playListSong = this.tempDate
      } else {
        //初始化歌手列表
        this.playListSong = []
        //根据用户输入的内容添加到新的歌手列表中
        for (let item of this.tempDate) {
          if (item.name.includes(this.select_word)) {
            this.playListSong.push(item)
          }
        }
      }
    }
  }

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