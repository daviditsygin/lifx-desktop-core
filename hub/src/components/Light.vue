<template>
  <div
    class="md:w-1/4 w-1/2"
    :class="interacted ? 'px-6' : 'px-3'"
    style="transition: all 0.2s; margin-bottom: 20px;"
  >
    <div
      :class="[obj.lightState.power == 1 ? ['text-white'] : ['text-gray-500'], interacted ? 'py-4 mt-1 shadow' : 'py-5 shadow-md']"
      class="rounded-lg cursor-pointer"
      :style="{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }"
      style="transition: all 0.5s;"
    >
      <div v-if="view == 'Main'" @click="toggleLight(obj)">
        <p class="font-bold">{{obj.deviceInfo.label}}</p>
        <p class="font-mono text-xs opacity-50">{{obj.ip}}</p>
        <div class="relative bg-gray-600">
          <div
            class="absolute mr-2 mb-2 float-right"
            style="bottom: -25px; right: 5px;"
            @click.stop="view = 'Color'"
            @close="changeView('Color')"
          >...</div>
        </div>
      </div>
      <div v-else-if="view == 'Color'">
        <ColorPanel :lightState="obj.lightState" @close="changeView('Main')" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import ColorPanel from "@/components/ColorPanel.vue";
export default {
  name: "Light",
  props: {
    obj: Object
  },
  components: { ColorPanel },
  computed: {
    color() {
      if (this.obj.lightState.power == 1) {
        return {
          h: parseInt(this.obj.lightState.color.hue * 360),
          s: parseInt(this.obj.lightState.color.saturation * 100),
          l: 20 + parseInt(this.obj.lightState.color.brightness * 40)
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
  data() {
    return {
      interacted: false,
      view: "Main"
    };
  },
  methods: {
    toggleLight(light) {
      this.interact();
      let self = this;
      this.toggleRequest = $.ajax({
        type: "GET",
        url: "/light/" + light.deviceInfo.label + "/toggle",
        contentType: "application/json"
      })
        .done(function(response) {
          console.log(response);
          // emit to refreshstates
          self.$emit("actionComplete");
        })
        .fail(function(err) {
          console.log(err.responseText);
        });
    },
    changeView(view) {
      // this.interact()
      this.view = view;
    },
    interact() {
      let self = this;
      console.log("interacted");
      this.interacted = true;
      setTimeout(function() {
        self.interacted = false;
        console.log("xd");
      }, 200);
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
