<template>
  <div id="overview">
    <v-container fluid>
      <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        hide-default-footer
      >
        <template v-slot:header>
          <v-toolbar
            class="mb-2"
            color="indigo darken-5"
            dark
            flat
          >
            <v-toolbar-title>总览</v-toolbar-title>
          </v-toolbar>
        </template>

        <template>
          <v-row>
            <v-col
              v-for="item in items"
              :key="item.name"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card :to="item.route" :elevation="hover ? 8 : 2">
                  <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

                  <v-divider></v-divider>

                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>题目总数:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.problemNumber }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>最大分数:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.maxScore }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>当前最高分:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.currentMaxScore }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>选择(用户)人数:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.usersNumber }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>最多解出数:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.maxSolvedProblemNumber }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>最多解出题目:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.maxSolvedProblemTitle }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>最少解出数:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.minSolvedProblemNumber }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>最少解出题目:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.minSolvedProblemTitle }}</v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    itemsPerPage: 4,
    items: [
      {
        route: '#',
        name: '总览',
        problemNumber: 25,
        maxScore: 8200,
        currentMaxScore: 6600,
        usersNumber: 25,
        maxSolvedProblemNumber: 10,
        maxSolvedProblemTitle: 'Web 1',
        minSolvedProblemNumber: 1,
        minSolvedProblemTitle: 'Security 2',
      },
      {
        route: '/index/detail#web',
        name: 'Web',
        problemNumber: 6,
        maxScore: 1800,
        currentMaxScore: 1600,
        usersNumber: 8,
        maxSolvedProblemNumber: 7,
        maxSolvedProblemTitle: 'Web 1',
        minSolvedProblemNumber: 1,
        minSolvedProblemTitle: 'Web 4',
      },
      {
        route: '/index/detail#ui',
        name: 'UI',
        problemNumber: 4,
        maxScore: 1200,
        currentMaxScore: 1100,
        usersNumber: 6,
        maxSolvedProblemNumber: 6,
        maxSolvedProblemTitle: 'UI 1',
        minSolvedProblemNumber: 1,
        minSolvedProblemTitle: 'UI 3',
      },
      {
        route: '/index/detail#ml',
        name: '机器学习',
        problemNumber: 3,
        maxScore: 1000,
        currentMaxScore: 1000,
        usersNumber: 4,
        maxSolvedProblemNumber: 7,
        maxSolvedProblemTitle: 'ML 2',
        minSolvedProblemNumber: 1,
        minSolvedProblemTitle: 'ML 4',
      },
      {
        route: '/index/detail#dev',
        name: 'DevOps',
        problemNumber: 6,
        maxScore: 2200,
        currentMaxScore: 1400,
        usersNumber: 12,
        maxSolvedProblemNumber: 12,
        maxSolvedProblemTitle: 'Dev 1',
        minSolvedProblemNumber: 1,
        minSolvedProblemTitle: 'Dev 5',
      },
      {
        route: '/index/detail#security',
        name: '网络安全',
        problemNumber: 6,
        maxScore: 2000,
        currentMaxScore: 1500,
        usersNumber: 7,
        maxSolvedProblemNumber: 10,
        maxSolvedProblemTitle: 'Security 1',
        minSolvedProblemNumber: 1,
        minSolvedProblemTitle: 'Security 2',
      },
      {
        route: '/index/detail#basic',
        name: '基础',
        problemNumber: 7,
        maxScore: 2000,
        currentMaxScore: 1500,
        usersNumber: 7,
        maxSolvedProblemNumber: 10,
        maxSolvedProblemTitle: 'Basic 1',
        minSolvedProblemNumber: 1,
        minSolvedProblemTitle: 'Basic 7',
      }
    ],
  }),
  props:{
    message: Object
  },
  created: function(){
    let that = this;
    that.$request.get('/admin/index/overview').then( ret => {
      
      
    }).catch( err => {
      console.log(err);
    })
  }
}
</script>

<style>

</style>
