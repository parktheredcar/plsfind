<script setup lang="ts">

import { ref, computed, nextTick, onMounted } from 'vue'
import {wasBackspaceOrDeletePressed, wasEnterPressed} from '../lib/dom-util';

const minPlaylistLength = ref(100);
const maxPlaylistLength = ref(200);
const songTerms = ref(['']);
const songInputFields = ref([]);

const focusInput = (index:number): void  => {
  songInputFields.value[index].focus();
}

onMounted(() => {
  focusInput(0)
})

const addClicked = async () => {
  addSongTerm()
}

const removeClicked = (idx: number) => {
  doRemove(idx);
}

const doRemove = (idx: number) => {
  if (songTerms.value.length === 1) {
    return;
  }

  songTerms.value.splice(idx, 1)
  focusInput(Math.min(idx+1, songTerms.value.length));
}

const addSongTerm = async (newTerm: string = '') => {
  songTerms.value.push(newTerm);
  await nextTick();
  focusInput(songTerms.value.length - 1);
}


const handleEnterPress = (e: KeyboardEvent) => {
  // If already on the last one then create new otherwise focus down
  const targetIndex = songInputFields.value.indexOf(e.target);
  if (targetIndex === songTerms.value.length - 1) {
    if(e.target?.value === '') {
      doSearch(e.ctrlKey)
    } else {
      addSongTerm();
    }
  } else {
    songInputFields.value[targetIndex+1].focus();
  }
}

const inputKeyDown = (e: KeyboardEvent) => {
  if (wasEnterPressed(e.code)) {
    handleEnterPress(e)
  } else if (wasBackspaceOrDeletePressed(e.code) && e.target.value === '') {
    const targetIndex = songInputFields.value.indexOf(e.target);
    doRemove(targetIndex);
  }
}


const doSearch = (newTab:boolean) : void => {
      if (newTab) {
        window.open(searchLink.value)?.focus();
      } else {
        window.open(searchLink.value, '_self')
      }
}


// "playlist by" site:open.spotify.com "looking for me" "paul woolford" 100..200 songs
// https://www.google.com/search?q=%22playlist+by%22+site%3Aopen.spotify.com+%22looking+for+me%22+%22paul+woolford%22+100..200+songs


// inurl:youtube.com/playlist?list= "last updated on" "signum"  "coming on strong" 100..200 videos
// https://www.google.com/search?q=inurl%3Ayoutube.com%2Fplaylist%3Flist%3D+%22last+updated+on%22+%22signum%22++%22coming+on+strong%22+100..200+videos&
const generatedSearchTerm = computed(() => {
  return `inurl:youtube.com/playlist?list= "last updated on" ${quotedSongs.value} ${minPlaylistLength.value}..${maxPlaylistLength.value} videos`
});

const quotedSongs = computed (() => {
  return songTerms.value
  .filter(s => s.length > 0)
  .map(s => `"${s}"`)
  .join(' ');
});

const encodedSearchTerm = computed(() => {
  return encodeURIComponent(generatedSearchTerm.value).replace(/%20/g, '+');
});

const searchLink = computed(() => {
  return 'https://www.google.com/search?q=' + encodedSearchTerm.value;
});

</script>

<template>
  <div>
    <div class="p-2" v-for="(s, idx) in songTerms" :key="idx">
      <label>
        Video
        <input class="outline outline-offset-2 outline-1" v-model="songTerms[idx]" @keydown="inputKeyDown" :ref="(el) => {if(el) songInputFields[idx] = el }" />
        <!-- https://heroicons.com/ -->
      </label>        
      <svg v-if="idx === songTerms.length - 1" @click="addClicked" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg> 
      <svg v-if="songTerms.length > 1" @click="removeClicked(idx)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

    </div>
    <div class="p-2">
      <label>
        pls-min
        <input v-model="minPlaylistLength"  />      
      </label>
    </div>
    <div class="p-2">      
      <label>   
        pls-max
        <input v-model="maxPlaylistLength" />      
      </label>
    </div> 
    <div>
      {{generatedSearchTerm}}
    </div>
    <div>
      <a :href="searchLink">{{searchLink}}</a>
    </div>
  </div>  
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
