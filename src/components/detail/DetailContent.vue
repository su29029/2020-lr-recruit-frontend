<template>
  <div id="detail-web">
    <v-container fluid>
      <v-row>
        <v-col
          cols="12"
          sm="12" 
          md="12"
          lg="12"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card id="overview" style="position:relative;" :elevation="hover ? 8 : 2">
              <v-card-title class="subheading font-weight-bold">{{ overview.name }}</v-card-title>
              
              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content>题目总数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.problemNumber }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>最大分数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.maxScore }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>当前最高分:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.currentMaxScore }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>选择(用户)人数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.chosenUserNumber }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>最多解出数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.maxSolved }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>最多解出题目:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.maxSolvedProblemTitle }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>最少解出数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.minSolved }}</v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>最少解出题目:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ overview.minSolvedProblemTitle }}</v-list-item-content>
                </v-list-item>
              </v-list> <!-- overview -->
            </v-card>
          </v-hover>
        </v-col>
        <v-col
          v-for="item in items"
          :key="item.name"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card :elevation="hover ? 8 : 2"> 
              <v-card-title class="subheading font-weight-bold">题目名:{{ item.problemTitle }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content>原始分数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.problemScore }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>当前分数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.currentScore }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>解出人数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.problemSolved }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>一血:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.firstBlood }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-hover> <!-- item -->
        </v-col>  
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-hover v-slot:default="{ hover }">
            <v-card height="100%" :elevation="hover ? 8 : 2">
              <v-card-text class="font-weight-medium text-center " style="font-size:24px;margin-bottom:20px">
                编辑题目
              </v-card-text>
              <div class="text-center" style="margin-top:30px;">
                <v-btn
                  color="cyan accent-2"
                  dark
                  x-large
                  fab
                  class="mx-2"
                  @click="goProblemEdit"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MarkDown from 'vue-meditor';
export default {
  name: 'DetailContent',
  data: () => ({
    
  }),
  props:{
    overview: Object,
    items: Array,
    message: Object
  },
  watch: {
    message:function(newVal, oldVal){
      let that = this;
      switch(newVal.type) {
      case that.$store.state.messageType.NEW_UPLOAD:
        break;
      case that.$store.state.messageType.NEW_PROBLEM:
        break;
      case that.$store.state.messageType.NEW_FLAG_SUBMIT:
        break;
      case that.$store.state.messageType.CORRECT_ANSWER:
        break;
      default:
        break;
      }
    }
  },
  methods:{
    goProblemEdit:function(){
      this.$router.push(this.$route.path.replace("detail", "problem") + this.$route.hash);
    }
  }
}
</script>

<style>

</style>
