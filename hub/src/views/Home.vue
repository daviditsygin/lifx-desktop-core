<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p v-for="light in lights" :key="light.ip">{{light.ip}}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import $ from 'jquery'
export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data() {
    return {
      lights: []
    }
  },
  mounted: function() {
    const self = this
    $.ajax({
      type: "GET",
      url: "/lights/",
      contentType: "application/json"
    })
    .done(function(response) {
      console.log(response)
      self.lights = response
    })
    .fail(function(err) {
      console.log(err.responseText)
      alert(err.responseText)
    })
  }
}
</script>
