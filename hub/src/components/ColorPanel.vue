<template>
  <div style="transition: all 0.5s;">
    ColorPanel
    <p @click="close">Close</p>
  </div>
</template>

<script>
export default {
  name: "ColorPanel",
  props: {
    lightState: Object
  },
  computed: {
    color() {
      if (this.lightState.power == 1) {
        return {
          h: parseInt(this.lightState.color.hue * 360),
          s: parseInt(this.lightState.color.saturation * 100),
          l: parseInt(this.lightState.color.brightness * 60)
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
      interacted: false
    };
  },
  methods: {
    toggleLight() {
      // color slide should emit to the light so it talks back to the api
    },
    close(){
      this.$emit('close')
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
</style>
