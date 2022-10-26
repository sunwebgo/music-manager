<template>
  <div class="table">
    <div class="container">
      <i class="songManage">歌曲管理</i>
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
          width="110"></el-table-column>
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
              {{item}}
            </li>
          </ul>
        </template>
      </el-table-column>

      <el-table-column
          prop="date"
          label="资源管理"
          align="center"
          width="110">
        <template slot-scope="scope">
          <!--          上传图片-->
          <el-upload :action="uploadUrl(scope.row.id)" :on-success="uploadSuccess">
            <el-button size="mini">
              更新图片
            </el-button>
          </el-upload>
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
                     :total="songList.length"
                     @current-change="handleCurrentChange">

      </el-pagination>
    </div>

    <!--    添加歌曲消息框-->
    <el-dialog title="添加歌曲" :visible.sync="dialogFormVisible" width="400px" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="歌名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="专辑" prop="album">
          <el-input v-model="ruleForm.album"></el-input>
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
        <el-form-item label="歌词" prop="lyric">
          <el-input type="textarea" v-model="ruleForm.lyric"></el-input>
        </el-form-item>
        <el-form-item label="歌曲文件">
          <template>
            <el-upload
                :action="`${this.$store.state.HOST}/song/upload`"
                :before-remove="beforeRemove"
                :before-upload="beforeAvatarUpload"
                 name="file"
                 ref="mp3Upload"
                :limit="1">
              <el-button size="small" type="primary">点击上传</el-button>
              <i class="file-upload" size="small">只能上传map3文件</i>
            </el-upload>
          </template>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--    修改歌曲信息消息框-->
    <el-dialog title="修改歌曲信息" :visible.sync="editVisible" width="400px" center>
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px" class="demo-updateForm">
        <el-form-item label="歌名" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="风格" prop="style">
          <el-input v-model="updateForm.style"></el-input>
        </el-form-item>
        <el-form-item label="专辑">
          <el-input v-model="updateForm.album"></el-input>
        </el-form-item>
        <el-form-item label="歌词">
          <el-input type="textarea" v-model="updateForm.lyric"></el-input>
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
  name: "SongPage",
  mixins: [mixin],
  data() {
    return {
      dialogFormVisible: false,
      editVisible: false,
      songList: [],
      tempDate: [],
      select_word: '',
      pageSize: 4,
      currentPage: 1,
      singerId:'',     //从SingerPage获取到的参数歌手id和name
      singerName:'',
      toggle:false,  //播放器的显示图标状态默认值为false

      //添加歌曲的表单
      ruleForm: {     //添加消息框
        name: '',
        singerName:'',
        album: '',  //专辑
        style:'',
        lyric: '',  //歌词
        picture: '/img/song/歌曲图片.jpg',
      },
      //更改歌手信息的表单
      updateForm: {    //修改消息框
        id:'',
        name: '',
        style:'',
        album: '',  //专辑
        lyric: '',  //歌词
      },

      //表单校验规则
      rules: {
        name: [
          {required: true, message: '请输入歌曲名', trigger: 'change'},
        ],
        album: [
          {required: true, message: '请输入专辑名', trigger: 'change'},
        ],
        lyric: [
          {required: true, message: '请填写歌词', trigger: 'change'},
        ],
        style: [
          {required: true, message: '请填写歌曲风格', trigger: 'change'},
        ],
      },
    };
  },

  computed: {
    //计算出每页现实的数据
    date() {
      return this.songList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
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
    clearFile () {
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
          //清除上一次上传的文件
          this.clearFile()
          axios.post('/song/add',
              //传递的参数
              {
                name: this.ruleForm.name,
                singerId:this.singerId,     //歌手id
                album: this.ruleForm.album, //专辑
                lyric:this.ruleForm.lyric,  //歌词
                style:this.ruleForm.style,
                picture: '/img/song/歌曲图片.jpg',
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

    //  查询所有歌手
    selectAllSong() {
      this.songList = []
      this.tempDate = []
      //  发送axios请求
      axios.get("/song/select/" + this.singerId).then(
          response => {
            //将从后端传回来的歌手对象数组存入数组中
            this.songList = response.data.songList
            this.tempDate = response.data.songList
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

    //  上传图片成功之后的操作
    uploadSuccess(response) {
      if (response.code == 1) {
        this.selectAllSong()
        this.$message({
          type: 'success',
          center: true,
          message: '更改成功'
        });
      } else {
        this.$message({
          type: 'error',
          center: true,
          message: '更改失败'
        });
      }
    },


    //弹出修改页面和数据回显
    handleEdit(row) {
      this.editVisible = true

      //数据回显
      this.updateForm = {
        id: row.id,
        name: row.name,
        style:row.style,
        lyric: row.lyric,
        album: row.album,
      }
    },

    //  保存修改页面
    updateSinger(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = false

          axios.post('/song/update',
              //传递的参数
              {
                id: this.updateForm.id,
                name: this.updateForm.name,
                album: this.updateForm.album,
                style: this.updateForm.style,
                lyric: this.updateForm.lyric
              }).then(
              response => {
                if (response.data.code == 1) {
                  //修改成功后刷新歌手列表
                  this.selectAllSong()
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
        axios.post('/song/delete/' + id).then(
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
    handleCurrentChange(val){
      this.currentPage = val
    },

    //判断上传的文件是否是mp3格式
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = testmsg === 'mp3'
      if(!extension){
        this.$message({
          message:"上传文件只能是mp3格式！",
          type:'error',
          duration:1000
        })
      }
      return extension;
    },

  //  解析歌词
    parseLyric(text){
      let lines = text.split("\n");
      //定义正则，除去[00:13:42]
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
      let result = [];
      for (let item of lines){
        let value = item.replace(pattern,'');
        result.push(value)
      }
      return result;
    },

  //切换播放歌曲
    setSongUrl(url,name){
      /* url是当前歌曲在磁盘中的相对路径
      *  name是当前歌曲名*/

      //此时如果toggle不等于传入的歌名（点击了播放按钮），则播放此歌曲，否则暂停此歌曲
      if(this.toggle != name){
        //将当前歌曲名赋值给toggle
        this.toggle = name;
        this.$store.commit('setUrl',this.$store.state.HOST + url);
        //播放
        this.$store.commit('setIsPlay',true);
      }else{
        this.toggle = false;
        this.$store.commit('setIsPlay',false);
      }
    }


  },
  created() {
    //获取到从SingerPage传来的参数
    this.singerId = this.$route.query.id
    this.singerName = this.$route.query.name
    //当组件create时自动查询所有歌手信息
    this.selectAllSong();
  },
  destroyed() {
    this.$store.commit('setIsPlay',false)
  },

  watch: {
    //  监控输入框
    select_word() {
      //当用户不输入时展示的就是全部数据
      if (this.select_word == '') {
        this.songList = this.tempDate
      } else {
        //初始化歌手列表
        this.songList = []
        //根据用户输入的内容添加到新的歌手列表中
        for (let item of this.tempDate) {
          if (item.name.includes(this.select_word)) {
            this.songList.push(item)
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

.songManage{
  color: deepskyblue;
  font-size: larger;
  margin-right:30%;
}

.file-upload{
  font-size: small;
  margin-left: 5px;

}

.play{
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

.icon{
  width: 2em;
  height: 2em;
  color: black;
  fill: currentColor;
  overflow: hidden;
}

</style>