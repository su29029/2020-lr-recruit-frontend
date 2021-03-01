<template>
    <div id="detail">
        <v-tabs
            fixed-tabs
            background-color="indigo"
            dark
            show-arrows
        >
            <v-tab to="/index/detail#web" @click="getData('0')">
            Web
            </v-tab>
            <v-tab to="/index/detail#ui" @click="getData('1')">
            UI
            </v-tab>
            <v-tab to="/index/detail#ml" @click="getData('2')">
            机器学习
            </v-tab>
            <v-tab to="/index/detail#android" @click="getData('3')">
            安卓
            </v-tab>
            <v-tab to="/index/detail#security" @click="getData('4')">
            网络安全
            </v-tab>
            <v-tab to="/index/detail#basic" @click="getData('5')">
            基础
            </v-tab>
        </v-tabs>
        <DetailContent :items="items" :overview="overview" :message="message"></DetailContent>
    </div>
</template>

<script>
import DetailContent from './DetailContent'
export default {
    name: 'Detail',
    components: {
        DetailContent
    },
    data: () => ({
        overview: {
            name: '',
            problemNumber: 0,
            maxScore: 0,
            currentMaxScore: 0,
            chosenUserNumber: 0,
            maxSolved: 0,
            maxSolvedProblemTitle: '',
            minSolved: 0,
            minSolvedProblemTitle: ''
        },
        items:[],
        currentRoute: '0'
    }),
    props:{
        message: Object
    },
    created: function(){
        let that = this;
        let url = "/api/admin/detail/";
        that.currentRoute = that.$store.state.field[that.$route.hash.replace("#","")];
        url += that.currentRoute;
        that.$request.get(url).then( ret => {
            that.overview = ret.data.overview;
            that.overview.name = that.$route.hash.replace("#", "").replace(/^\S/, s => s.toUpperCase());
            that.items = ret.data.detail;
        }).catch( err => {
            
        })
    },
    methods: {
        getData:function(group){
            let that = this;
            let url = "/api/admin/detail/" + group;
            if (that.currentRoute !== group){
                that.currentRoute = group;
                that.$request.get(url).then( ret => {
                    that.overview = ret.data.overview;
                    that.overview.name = that.$route.hash.replace("#", "").replace(/^\S/, s => s.toUpperCase());
                    that.items = ret.data.detail;
                }).catch( err => {
                    
                })
            }
        }
    }
}
</script>

<style>

</style>
