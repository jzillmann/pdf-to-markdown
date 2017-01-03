<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      Uploaded: {{state.uploaded}}
    </div>
    <div v-for="line in state.pages">
    <textarea :value="line" rows="50" cols="150"></textarea>
    </div>
  </div>
</template>

<script>
import store from '../store.js'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your!! Vue.js App',
      state: store.state
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
