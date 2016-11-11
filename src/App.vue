<template>
  <div id="app">
    <img src="./assets/logo.png">
     <dropzone id="myVueDropzone" url="https://httpbin.org/post" v-on:vdropzone-success="showSuccess" v-on:vdropzone-fileAdded="fileAdded"></dropzone>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Dropzone from './components/Dropzone'

export default {
  name: 'app',
  components: {
    Dropzone
  },
  methods: {
      'fileAdded': function (file) {
        console.log('A file was added: ')
        console.log(file)
      },
      'showSuccess': function (file) {
        console.log('A file was successfully uploaded: ')
        console.log(file)
      }
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
