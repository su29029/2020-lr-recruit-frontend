<template>
    <div id="nav">
        <v-app-bar color="primary accent-4" scroll-target="#scrolling-techniques-7" fixed style="height:64px;margin-top:0px;transform:translateY(0px);left:0px;right:0px;">
        <v-app-bar-nav-icon @click.stop="show" v-if="$store.state.drawer.smallScreen"></v-app-bar-nav-icon>

            <v-toolbar-title @click.stop="goIndex" style="cursor:pointer;color:white">凌睿招新后台管理系统</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-text text id="user" style="color:white;min-width=50px">{{loginStatus}}</v-text>
            <v-btn text @click.native="run(isLogin)" :to="login" style="color:white">
                {{btn}}
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name:"Navigator",
    props:{
        btn: String,
        loginStatus: String,
        login: String,
        message: Object,
        isLogin: Number
    },
    data:() => ({
        loginStatus:"你好，请先登录！",
        btn:"登录",
        login:"/login",
        isLogin:0,
    }),
    watch:{
        message: function(newVal, oldVal){
            let that = this;
            let content = {};
            switch (newVal.type) {
            case that.$store.state.messageType.NEW_UPLOAD:
                content.title = "新提交";
                content.message = "用户 " + newVal.messageData.userID + " 提交了题目 " + newVal.messageData.problemStatus.problemTitle + "。";
                that.$emit('showMessageCard', { content: content });
                break;
            case that.$store.state.messageType.NEW_PROBLEM:
                break;
            case that.$store.state.messageType.NEW_FLAG_SUBMIT:
                content.title = "新提交";
                if (newVal.messageData.problemStatus.isFirstBlood){
                    content.message = "恭喜用户 " + newVal.messageData.userID + " 获得" + that.$store.state.field[newVal.messageData.problemStatus.problemField] + "类题目 " + newVal.messageData.problemStatus.problemTitle + "一血！";
                } else {
                    content.message = "恭喜用户 " + newVal.messageData.userID + " 完成" + that.$store.state.field[newVal.messageData.problemStatus.problemField] + "类题目 " + newVal.messageData.problemStatus.problemTitle + "。";
                }
                that.$emit('showMessageCard', { content: content });
                break;
            case that.$store.state.messageType.CORRECT_ANSWER:
                content.title = "新提交";
                content.message = "恭喜用户 " + newVal.messageData.userID + " 完成" + that.$store.state.field[newVal.messageData.problemStatus.problemField] + "类题目 " + newVal.messageData.problemStatus.problemTitle + "。";
                that.$emit('showMessageCard', { content: content });
                break;
            case that.$store.state.messageType.ERROR:
                that.$emit('showSnackBar', { status: 'error', message: '有些不对劲。' });
                break;
            default:
                break; 
            }
            // console.log(newVal);
            // }
        }
    },
    created:function(){
        let that = this;
        if (this.$store.state.user) {
            this.loginStatus = "欢迎你，" + this.$store.state.user;
            this.isLogin = 1;
            this.btn = "退出登录";
            this.login = "";
        } else {
            this.$request.get('/api/admin/islogin').then(ret => {
                if (ret.data.msg === "pass"){
                    that.btn = "退出登录";
                    that.isLogin = 1;
                    that.login = "/logout";
                    that.loginStatus = "欢迎你，" + ret.data.user;
                    that.$store.state.user = ret.data.user;
                    if (that.$route.path === "/login") {
                        that.$router.push('/index');
                    }
                } else { 
                    that.$router.push('/login');
                }
            }).catch( err => {
                console.log(err);
                that.$router.push('/login');
            })
        }
    },
    methods: {
        run:function(isLogin){
            var that = this;
            that.login = "";
            if (isLogin){
                that.$request.post('/api/admin/logout',{ userID: that.$store.state.user }).then(ret => {
                    if (ret.data.msg === "success"){
                        that.$store.state.user = "";
                        sessionStorage.removeItem("user");
                        alert("您已成功退出！");
                        that.$router.push('/login').catch(err => {console.log(err)});
                    } else {
                        alert("退出失败");
                    }
                }).catch( err => {console.log(err)})
            }
        },
        show:function(){
            let that = this;
            if(that.$store.state.drawer.smallScreen){
                that.$store.state.drawer.isShow = !that.$store.state.drawer.isShow;
            }
        },
        goIndex:function(){
            let that = this;
            if (that.$store.state.user) that.$router.push('/index');
        }
    },
}
</script>

<style>
#nav {
    position: absolute;
    width: 100%;
}
#user {
    position: relative;
    padding-left: 10px;
}
</style>
