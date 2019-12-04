<template>
  <div
    style="transition: all 0.5s;"
    :style="{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }"
  >
    <photoshop-picker v-model="colors" />
    <p class="font-mono text-xs opacity-50" @click="close">Close</p>
  </div>
</template>

<script>
import { Slider } from 'vue-color'
export default {
  name: "ColorPanel",
  props: {
    lightState: Object
  },
  components: {
    'photoshop-picker': Slider
  },
  computed: {
    color() {
      if (this.lightState.power == 1) {
        return {
          h: parseInt(this.lightState.color.hue * 360),
          s: parseInt(this.lightState.color.saturation * 100),
          l: 20 + parseInt(this.lightState.color.brightness * 40)
        };
      } else {
        return {
          h: 300,
          s: 0,
          l: 17
        };
      }
    },
    brightness() {
      return 2*((20 + parseInt(this.lightState.color.brightness * 40))/100);
    },
    saturation() {
      return this.lightState.color.saturation;
    }
  },
  data() {
    return {
      interacted: false,
      colors: { h: this.lightState.color.hue, s: this.lightState.color.saturation, l: this.lightState.color.brightness }
    };
  },
  methods: {
    toggleLight() {
      // color slide should emit to the light so it talks back to the api
    },
    close() {
      this.$emit("close");
    },
    interact() {
      let self = this;
      console.log("interacted");
      this.interacted = true;
      setTimeout(function() {
        self.interacted = false;
        console.log("xd");
      }, 300);
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
.vc-slider-swatches {
    display: flex;
    margin-top: 10px !important;
}
.vc-slider {
    position: relative;
    width: 100%;
}
</style>
