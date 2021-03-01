import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer:{
      isShow: true,
      smallScreen: false
    },
    field:{
      "web": 0,
      "ui": 1,
      "ml": 2,
      "android": 3,
      "security": 4,
      "basic": 5
    },
    messageType:{   
      NEW_UPLOAD: 0,
      NEW_FLAG_SUBMIT: 1,
      CORRECT_ANSWER: 2,
      NEW_PROBLEM: 3,
      HEART_BEAT: 4,
      ERROR: -1
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
