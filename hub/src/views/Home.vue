<template>
  <div class="home">
    <p v-for="light in lights" :key="light.ip">{{light.ip}}</p>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import $ from "jquery";
export default {
  name: "home",
  components: {
  },
  data() {
    return {
      lights: []
    };
  },
  methods: {
    refreshStates() {
      const self = this
      $.ajax({
        type: "GET",
        url: "/lights/",
        contentType: "application/json"
      })
        .done(function(response) {
          console.log(response);
          self.lights = response;
        })
        .fail(function(err) {
          console.log(err.responseText);
          alert(err.responseText);
        });
    }
  },
  mounted: function() {
    this.refreshStates()
    setInterval(this.refreshStates(), 2000)
  }
};
</script>
