<script setup lang="ts">
import { ref, computed } from 'vue'
import SpotifySearch from './SpotifySearch.vue';
import YoutubeSearch from './YoutubeSearch.vue';
// import Vue from 'vue'

const modes = {
  SPOTIFY: 'spotify',
  YOUTUBE: 'youtube'
};

defineProps<{ msg: string }>()

// const Component = Vue.extend({

// })

const mode = ref(modes.SPOTIFY)

</script>

<template>
  <!-- <div class="font-bold underline text-8xl">
    Hello
  </div>
  <div>
    {{msg}}
  </div> -->
<div>
  <label>
    <img class="inline-block" src='../assets/spotify.png'>
    <input type="radio" :value="modes.SPOTIFY" v-model="mode">
  </label>
  <label>
    <img class="inline-block" src='../assets/youtube.png'>
    <input type="radio" :value="modes.YOUTUBE" v-model="mode">
  </label>
</div>
<SpotifySearch v-if="mode === modes.SPOTIFY" />
<YoutubeSearch v-if="mode === modes.YOUTUBE" />

</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
