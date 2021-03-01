<template>
    <div id="index">
        <Navigator id="navigator" v-on:showSnackBar="showSnackBar" :btn="navigator.btn" :loginStatus="navigator.message" :login="navigator.login" :isLogin="navigator.isLogin" :message="wsMessage" v-on:showMessageCard="showMessageCard"></Navigator>
        <v-navigation-drawer 
            :temporary="$store.state.drawer.smallScreen" 
            :permanent="$store.state.drawer.isShow && !$store.state.drawer.smallScreen" 
            dark 
            v-model="$store.state.drawer.isShow" 
            clipped
            :absolute="$store.state.drawer.smallScreen || $store.state.drawer.isShow" 
            style="width:270px;height:100vh;position:fixed;top:64px;"
        >
            <v-list nav>
                <v-subheader>选项</v-subheader>
                <v-list-item-group v-model="currentChoice" color="primary" mandatory>
                    <v-list-item v-for="(item, i) in items" :key="i" @mouseup="$router.push(item.route)" link>
                        <v-list-item-content>
                            <v-list-item-title v-text="item['text']"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        
        <div :style="currentContentStyle">
            <v-responsive max-width="1300px">
                <v-card tile>
                    <router-view 
                        v-on:showSnackBar="showSnackBar" 
                        v-on:showMessageCard="showMessageCard" 
                        v-on:sendMessage="webSocketSend" 
                        :message="wsMessage"
                    ></router-view>
                </v-card>
            </v-responsive>
        </div>
    
        <SnackBar v-on:closeSnackBar="closeSnackBar" :show="snackbar.show" :status="snackbar.status" :message="snackbar.message"></SnackBar>
        <MessageCard v-on:closeMessageCard="closeMessageCard" :show="message.show" :message="message.message"></MessageCard>
    </div>
</template>

<script>
import Navigator from './Navigator'
import SnackBar from './Snackbar'
import MessageCard from './MessageCard'
export default {
    name: 'Index',
    components:{
        Navigator,
        SnackBar,
        MessageCard
    },
    data: () => ({
        currentChoice: -1,
        items:[
            { text: '概览', route: '/index/overview', baseRoute: '/index/overview'},
            { text: '各方向做题情况分析', route: '/index/detail#web', baseRoute: '/index/detail'},
            { text: '创建与修改题目', route: '/index/problem#web', baseRoute: '/index/problem'},
            { text: '用户设置', route: '/index/users', baseRoute: '/index/users'}
        ],
        mainContentStyle:{
            bigScreen:{
                padding:"64px 50px 0 320px"
            },
            smallScreen:{
                padding:"64px 0 0 0"
            }
        },
        currentContentStyle:{
            padding:"64px 50px 0 320px"
        },
        navigator: {
            btn: '',
            message: '',
            login: '',
            isLogin: ''
        },
        snackbar: {
            show: false,
            status: '',
            message: ''
        },
        message:{
            show: false,
            // status: '',
            message: ''
        },
        ws: null,
        wsMessage: {},
        
    }),
    created: function(){
        let that = this;
        if (document.body.clientWidth <= 1300) {
            that.currentContentStyle = that.mainContentStyle.smallScreen;
            that.$store.state.drawer.isShow = false;
            that.$store.state.drawer.smallScreen = true;
        }
        else {
            that.currentContentStyle = that.mainContentStyle.bigScreen;
            that.$store.state.drawer.isShow = true;
            that.$store.state.drawer.smallScreen = false;
        }
        that.items.forEach((v, i) => {
            if (that.$route.path === v.baseRoute) that.currentChoice = i;
        })
        if (that.$store.state.user){
            that.btn = "退出登录";
            that.message = "欢迎你，" + that.$store.state.user;
            that.login = "";
            that.isLogin = 1;
        } else {
            that.$router.push('/login')
        }
        that.createWebSocket();
    },
    computed: {
        isSmallScreen(){
            return this.$store.state.drawer.smallScreen;
        },
        sidebarChoice(){
            return this.$route;
        }
    },
    watch: {
        isSmallScreen:function(newVal, oldVal){
            if (newVal === true && oldVal === false){
                this.currentContentStyle = this.mainContentStyle.smallScreen;
            } else if (newVal === false && oldVal === true){
                this.currentContentStyle = this.mainContentStyle.bigScreen;
            }
        },
        sidebarChoice:function(newVal, oldVal){
            this.items.forEach((v, i) => {
                if (newVal.path === v.baseRoute) this.currentChoice = i; 
            })
        }
    },
    methods:{
        showSnackBar: function(value) {
            this.snackbar.show = true;
            this.snackbar.status = value.status;
            this.snackbar.message = value.message;
        },
        closeSnackBar: function(value){
            this.snackbar.show = false;
            this.snackbar.status = "";
            this.snackbar.message = "";
        },
        showMessageCard: function(value){
            this.message.show = true;
            this.message.message = value.content;
        },
        closeMessageCard: function(){
            this.message.show = false;
            this.message.message = "";
        },
        createWebSocket: function(){
            this.ws = new WebSocket("wss://lr.admin.su29029.xyz/api/ws/connect/" + this.$store.state.user);
            this.ws.onopen = this.webSocketOnOpen;
            this.ws.onerror = this.webSocketOnError;
            this.ws.onmessage = this.webSocketOnMessage;
            this.ws.onclose = this.webSocketOnClose;
        },
        webSocketOnOpen: function(){
            setInterval(this.webSocketPing, 20000);
        },
        webSocketOnMessage: function(e){
            // data type:
            // {
                // type: 'messageType.NEW_UPLOAD' [提交] || 'messageType.NEW_FLAG_SUBMIT' [flag正确提交] || 'messageType:CORRECT_ANSWER' [提交赋分] || 'messageType.NEW_PROBLEM' [新题目/题目更新] ||"messageType.HEART_BEAT" [心跳包] || "messageType.ERROR" [错误]
                // messageData:{
                    // userID?: string
                    // message: string
                    // problemStatus?: {
                        // problemID: int
                        // problemField: int
                        // problemTitle: string
                        // originScore: int
                        // magnification: float64
                        // isFirstBlood: boolean
                    // }
                // }
            // }
            console.log(e);
            if (e.data.type == this.$store.state.messageType.ERROR) this.ws.close();
            else if (e.data.type != this.$store.state.messageType.HEART_BEAT) this.wsMessage = e.data;
        },
        webSocketOnError: function(){
            this.showSnackBar({status: 'error', message: '网络仿佛有点小问题。'});
            setTimeout(this.createWebSocket, 10000);
        },
        webSocketOnClose: function(){
            this.showSnackBar({status: 'error', message: '有些不对劲。'});
        },
        webSocketSend: function(msg) {
            if(msg.type >= -1 && msg.type <= 4) this.ws.send(msg);
        },
        webSocketPing: function(){
            let that = this;
            let msg = {
                type: that.$store.state.messageType.HEART_BEAT,
                messageData: {
                    msg: "ping"
                }
            }
            this.ws.send(JSON.stringify(msg));
        }
    }
}
</script>

<style>

</style>
