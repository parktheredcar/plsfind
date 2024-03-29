<script setup lang="ts">

import { ref, computed, nextTick, onMounted } from 'vue'
import {wasBackspaceOrDeletePressed, wasEnterPressed} from '../lib/dom-util';

const minPlaylistLength = ref(100);
const maxPlaylistLength = ref(200);
const songTerms = ref(['']);
// const x: number = 5;
// const z = HTMLElement[] = [];

// const inner: Array<HTMLElement> = [];
const songInputFields = ref(<Array<HTMLElement>>[]);

const focusInput = async (index:number): Promise<void>  => {
  await nextTick();
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
  debugger;
  songTerms.value.splice(idx, 1)
  focusInput(Math.min(idx+1, songTerms.value.length-1));
}

const addSongTerm = (newTerm: string = '') => {
  songTerms.value.push(newTerm);
  focusInput(songTerms.value.length - 1);
}


const handleEnterPress = (e: KeyboardEvent) => {
  // If already on the last one then create new otherwise focus down
  if (!(e.target instanceof HTMLInputElement)) {
    return;
  }
  
  const targetIndex = songInputFields.value.indexOf(e.target);
  if (targetIndex === songTerms.value.length - 1) {
    if(e.target.value === '') {
      doSearch(e.ctrlKey)
    } else {
      addSongTerm();
    }
  } else {
    songInputFields.value[targetIndex+1].focus();
  }
}

const inputKeyDown = (e: KeyboardEvent) => {
  if (!(e.target instanceof HTMLInputElement)) {
    return;
  }
  if (wasEnterPressed(e.code)) {
    handleEnterPress(e)
  } else if (wasBackspaceOrDeletePressed(e.code) && e.target.value === '') {
    const targetIndex = songInputFields.value.indexOf(e.target);
    doRemove(targetIndex);
    e.preventDefault();
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

const generatedSearchTerm = computed(() => {
  return `"playlist by" site:open.spotify.com ${quotedSongs.value} ${minPlaylistLength.value}..${maxPlaylistLength.value} songs`
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

const getRef = (el: any, idx: number) => {
  // debugger;
  if(el instanceof HTMLElement) 
    songInputFields.value[idx] = el 
  }


</script>

<template>
  <div>
    <div class="p-2" v-for="(s, idx) in songTerms" :key="idx">
      <label>
        Song
        <input class="outline outline-offset-2 outline-1" v-model="songTerms[idx]" @keydown="inputKeyDown" :ref="(el) => getRef(el, idx)" />
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
