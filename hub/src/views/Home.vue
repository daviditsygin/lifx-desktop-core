<template>
  <div class="container mx-auto">
    <div class="px-3">
      <div v-for="(group, idx) in groups" :key="'group'+idx" class="mb-4 rounded-lg bg-gray-900 p-5">
        <h1 class="text-white text-4xl text-left">{{group.name}}</h1>
        <!-- <hr class="mr-64"> -->
        <div class="flex flex-wrap -mx-3 mt-3">
          <Light v-for="light in group.lights" :key="light.ip" :obj="light" @actionComplete="refreshStates" />
        </div>
      </div>
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
  computed: {
    groups() {
      let groups = {};
      this.lights.forEach(light => {
        if (groups[light.deviceInfo.group.label] == undefined) {
          groups[light.deviceInfo.group.label] = {};
          groups[light.deviceInfo.group.label].name =
            light.deviceInfo.group.label;
          groups[light.deviceInfo.group.label].lights = [];
        }
        groups[light.deviceInfo.group.label].lights.push(light);
      });
      let arr = [];
      for (let label in groups) {
        arr.push(groups[label]);
      }
      // console.log(groups);
      return arr;
    }
  },
  data() {
    return {
      lights: [],
      refreshRequest: null,
      toggleRequest: null,
      interval: null,
      refreshing: false
    };
  },
  methods: {
    refreshStates() {
      const self = this;
      if (this.refreshRequest && this.toggleRequest) {
        this.refreshRequest.abort();
        this.toggleRequest.abort();
      }
      if(self.refreshing){
        return
      }
      self.refreshing = true
      this.refreshRequest = $.ajax({
        type: "GET",
        url: "/lights/",
        contentType: "application/json"
      })
        .done(function(response) {
          // console.log(response);
          self.lights = response;
          self.refreshing = false
        })
        .fail(function(err) {
          console.log(err.responseText);
          self.refreshing = false
          // alert(err.responseText);
        });
    }
  },
  mounted: function() {
    this.refreshStates();
    this.interval = setInterval(this.refreshStates, 5000);
  }
};
</script>
