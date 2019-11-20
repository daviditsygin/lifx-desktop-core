<template>
  <div class="w-1/4 px-3">
    <div
      :class="obj.lightState.power == 1 ? ['bg-gray-400', 'text-white'] : ['bg-gray-900', 'text-gray-500']"
      class="rounded-lg p-5 shadow-md"
      :style="{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }"
      style="transition: all 0.5s;"
      @click="toggleLight(obj)"
    >
      <p class="font-bold">{{obj.deviceInfo.label}}</p>
      <p>{{obj.ip}}</p>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "Light",
  props: {
    obj: Object
  },
  computed: {
    color() {
      if (this.obj.lightState.power == 1) {
        return {
          h: parseInt(this.obj.lightState.color.hue * 360),
          s: parseInt(this.obj.lightState.color.saturation * 100),
          l: parseInt(this.obj.lightState.color.brightness * 100)
        };
      } else {
        return {
          h: 300,
          s: 0,
          l: 17
        };
      }
    }
  },
  methods: {
    toggleLight(light) {
      light.lightState.power == 1
        ? (light.lightState.power = 0)
        : (light.lightState.power = 1);
      if (this.refreshRequest && this.toggleRequest) {
        this.refreshRequest.abort();
        this.toggleRequest.abort();
      }
      this.toggleRequest = $.ajax({
        type: "GET",
        url: "/light/" + light.deviceInfo.label + "/toggle",
        contentType: "application/json"
      })
        .done(function(response) {
          console.log(response);
          // emit to refreshstates
        })
        .fail(function(err) {
          console.log(err.responseText);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
