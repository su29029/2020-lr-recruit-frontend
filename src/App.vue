<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    screenWidth: document.body.clientWidth
  }),
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  watch: {
    screenWidth:function(newVal, oldVal){
      let that = this;
      if (newVal <= 1140) {
        if (oldVal > 1140){
          that.$store.state.drawer.isShow = false;
          that.$store.state.drawer.smallScreen = true;
        }  
      } else {
        that.$store.state.drawer.isShow = true;
        that.$store.state.drawer.smallScreen = false;
      }
    }
  },
};
</script>
