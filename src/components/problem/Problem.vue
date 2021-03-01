<template>
    <div id="detail">
        <v-tabs
            fixed-tabs
            background-color="indigo"
            dark
            show-arrows
        >
            <v-tab @click="getData('0')" to="/index/problem#web">
            Web
            </v-tab>
            <v-tab @click="getData('1')" to="/index/problem#ui">
            UI
            </v-tab>
            <v-tab @click="getData('2')" to="/index/problem#ml">
            机器学习
            </v-tab>
            <v-tab @click="getData('3')" to="/index/problem#android">
            安卓
            </v-tab>
            <v-tab @click="getData('4')" to="/index/problem#security">
            网络安全
            </v-tab>
            <v-tab @click="getData('5')" to="/index/problem#basic">
            基础
            </v-tab>
        </v-tabs>
        <ProblemContent :items="items" :message="message"></ProblemContent>
    </div>
</template>

<script>
import ProblemContent from './ProblemContent';
export default {
    name: 'Problem',
    components: {
        ProblemContent
    },
    props:{
        message: Object
    },
    data: () => ({
        items:[],
        currentRoute: ''
    }),
    created: function(){
        let that = this;
        let url = "/api/admin/problem/getproblem/";
        that.currentRoute = that.$store.state.field[that.$route.hash.replace("#","")];
        url += that.currentRoute;
        that.$request.get(url).then( ret => {
            console.log(ret.data);
            console.log(ret.data.length);
            if(ret.data.length > 0) that.items = ret.data;
        }).catch( err => {
            
        })
    },
    methods: {
        getData:function(group){
            let that = this;
            that.items = [];
            let url = "/api/admin/problem/getproblem/" + group;
            if (that.currentRoute !== group){
                that.currentRoute = group;
                that.$request.get(url).then( ret => {
                    if(ret.data.length > 0) that.items = ret.data;
                }).catch( err => {
                    
                })
            }
        }
    },
}
</script>

<style>

</style>
