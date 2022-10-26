<template>
  <div>
    <!--    数量统计-->
    <el-row :gutter="20" class="mgb20">
      <el-col :span="6">
        <el-card>
          <div class="userSum">
            <i>{{ userSum }}</i>
            <span>用户数量</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="userSum">
            <i>{{ songSum }}</i>
            <span>歌曲数量</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="userSum">
            <i>{{ singerSum }}</i>
            <span>歌手数量</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="userSum">
            <i>{{ songListSum }}</i>
            <span>歌单数量</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mgb20">
      <!--    用户性别比例-->
      <el-col :span="12">
        <el-card>
          <h3>用户性别比例</h3>
          <div>
            <ve-pie :data="userGender" :theme="genderOption"></ve-pie>
          </div>
        </el-card>
      </el-col>
      <!--    歌单风格比例-->
      <el-col :span="12">
        <el-card>
          <h3>歌单风格数量统计</h3>
          <div>
            <ve-histogram :data="songListStyle" :settings="chartSettings1"></ve-histogram>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <!--    歌手性别比例-->
      <el-col :span="12">
        <el-card>
          <h3>歌手性别比例</h3>
          <div>
            <ve-pie :data="singerGender" :theme="singerGenderOption"></ve-pie>
          </div>
        </el-card>
      </el-col>
      <!--    歌曲风格比例-->
      <el-col :span="12">
        <el-card>
          <h3>歌曲风格数量统计</h3>
          <div>
            <ve-histogram :data="songStyle" :settings="chartSettings2"></ve-histogram>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "infoPage",
  data() {
    //更改柱状图颜色
    this.chartSettings1 = {
      itemStyle: {
        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
        color: function (params) {
          var colorList = ['#fc737f', '#4CD0DD', '#ffc9db', '#86a9ec', '#ffae63', '#A0EEE1'];
          return colorList[params.dataIndex];
        }
      }
    };
    this.chartSettings2 = {
      itemStyle: {
        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
        color: function (params) {
          var colorList = ['#A0EEE1', '#fc737f', '#4CD0DD', '#ffc9db', '#86a9ec', '#ffae63',];
          return colorList[params.dataIndex];
        }
      }
    };
    return {
      userSum: 0,
      songSum: 0,
      singerSum: 0,
      songListSum: 0,
      //统计用户性别
      userGender: {
        columns: ['性别', '总数'],
        rows: [
          {'性别': '男', '总数': 0},
          {'性别': '女', '总数': 0}
        ]
      },
      //统计歌手性别
      singerGender: {
        columns: ['性别', '总数'],
        rows: [
          {'性别': '男', '总数': 0},
          {'性别': '女', '总数': 0},
          {'性别': '组合', '总数': 0}
        ]
      },
      //统计歌单风格
      songListStyle: {
        columns: ['风格', '总数'],
        rows: [
          {'风格': '国风', '总数': 0},
          {'风格': '摇滚', '总数': 0},
          {'风格': '流行', '总数': 0},
          {'风格': '粤语', '总数': 0},
          {'风格': '欧美', '总数': 0},
          {'风格': '纯音乐', '总数': 0},
        ]
      },
      //统计歌单风格
      songStyle: {
        columns: ['风格', '总数'],
        rows: [
          {'风格': '国风', '总数': 0},
          {'风格': '摇滚', '总数': 0},
          {'风格': '流行', '总数': 0},
          {'风格': '粤语', '总数': 0},
          {'风格': '欧美', '总数': 0},
          {'风格': '纯音乐', '总数': 0},
        ]
      },
      //用户性别颜色选择
      genderOption: {
        color: ['#87cefa', '#ffc0cb']
      },
      //歌手性别颜色选择
      singerGenderOption: {
        color: ["#99CC99", '#FF9900', '#CCCCFF']
      }
    }
  },


  methods: {
    //  获取到所有用户数量
    getUserSum() {
      axios.get('/user/select').then(
          response => {
            this.userSum = response.data.userList.length
            let man = 0;
            let woman = 0;
            //遍历对象数组，计算性别
            for (let item of response.data.userList) {
              if (item.gender == 1) {
                man++;
              } else {
                woman++;
              }
            }
            this.userGender.rows[0]['总数'] = man
            this.userGender.rows[1]['总数'] = woman
          }
      )
    },


    //  获取到所有歌曲数量
    getSongSum() {
      axios.get('/song/select').then(
          response => {
            this.songSum = response.data.songList.length
            for (let item of response.data.songList){
              this.getBySongStyle(item.style)
            }
          }
      )
    },
    //  获取到所有歌手数量
    getSingerSum() {
      axios.get('/singer/select').then(
          response => {
            let man = 0;
            let woman = 0;
            let group = 0;
            this.singerSum = response.data.singerList.length
            for (let item of response.data.singerList) {
              if (item.gender == 1) {
                man++;
              } else if (item.gender == 2) {
                woman++;
              }else{
                group++;
              }
              this.singerGender.rows[0]['总数'] = man
              this.singerGender.rows[1]['总数'] = woman
              this.singerGender.rows[2]['总数'] = group
            }
          }
      )
    },

    //  计算到所有歌单数量
    getSongListSum() {
      axios.get('/songList/select').then(
          response => {
            this.songListSum = response.data.playList.length
            for (let item of response.data.playList) {
              this.getBySongListStyle(item.style);
            }
          }
      )
    },

    //  根据歌单风格增加数量
    getBySongListStyle(style) {
      for (let item of this.songListStyle.rows) {
        if (style.includes(item['风格'])) {
          item['总数']++;
        }
      }
    },
    //  根据歌曲风格增加数量
    getBySongStyle(style) {
      for (let item of this.songStyle.rows) {
        if (style.includes(item['风格'])) {
          item['总数']++;
        }
      }
    }
  },
  created() {
    this.getUserSum()
    this.getSongSum()
    this.getSingerSum()
    this.getSongListSum()
  },
}
</script>

<style scoped>
.userSum {
  height: 50px;
  color: #787070;
  text-align: center;
}

.userSum i {
  display: block;
  font-size: 30px;
}
</style>