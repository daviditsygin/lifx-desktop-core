<template>
  <div class="px-3">
    <div class="flex -mx-3">
      <Light v-for="light in lights" :key="light.ip" :obj="light" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import Light from "@/components/Light.vue";
import $ from "jquery";
export default {
  name: "home",
  components: { Light },
  data() {
    return {
      lights: [],
      refreshRequest: null,
      toggleRequest: null
    };
  },
  methods: {
    refreshStates() {
      const self = this;
      if (this.refreshRequest && this.toggleRequest) {
        this.refreshRequest.abort();
        this.toggleRequest.abort();
      }
      this.refreshRequest = $.ajax({
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
          // alert(err.responseText);
        });
    }
  },
  mounted: function() {
    this.refreshStates();
    setInterval(this.refreshStates(), 2000);
  }
};
</script>
