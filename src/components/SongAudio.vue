<template>
  <div class="song-audio">
    <audio ref="player"
           :src="url"
           controls="controls"
           preload="true"
           @canplay="startPlay"
           @ended="ended">

    </audio>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "SongAudio",
  computed: {
    //获取到vuex中state的值
    ...mapGetters([
      'url',
      'isPlay'
    ])
  },
  methods: {
    //获取链接后准备播放
    startPlay() {
      //获取到播放器
      let player = this.$refs.player;
      //  开始播放
      player.play();
    },
    //播放完触发停止播放
    ended() {
      this.isPlay = false
    },
    //  暂停开始播放方法
    togglePlay() {
      //获取到播放器
      let player = this.$refs.player;
      if (this.isPlay) {
        player.play();
      } else {
        player.pause();
      }
    },
  },
  watch: {
    //  监听播放还是暂停
    isPlay() {
      this.togglePlay();
    }
  }
}
</script>

<style scoped>
.song-audio {
  display: none;
}
</style>