<template>
  <div id="app">
    <SongAudio></SongAudio>
    <router-view></router-view>
  </div>
</template>

<script>
import SongAudio from "@/components/SongAudio";
export default {
  name: 'app',
  components: {
    SongAudio
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}



</style>
