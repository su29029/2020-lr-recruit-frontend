<template>
    <div id="login">
        <Navigator id="navigator" :btn="navigator.btn" :message="navigator.message" :login="navigator.login" :isLogin="navigator.isLogin"></Navigator>
        <v-snackbar v-model="vSnackbar.snackbar" timeout="4500" :color="vSnackbar.status" rounded="pill">
            {{vSnackbar.loginResult}}
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="white"
                    text
                    v-bind="attrs"
                    @click="vSnackbar.snackbar = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        
        <v-container style="margin-top:160px">
      
            <v-card class="mx-auto" outlined width="400" height="470" :disabled="vContainer.vCard.isButtonLoading">
                <v-progress-linear indeterminate color="green" absolute v-if="vContainer.vCard.vProgressLinear.isShowProgress"></v-progress-linear>
            
                <v-card-text>
                    <p class="text-center" style="margin-top:30px;font-size:22px;">登录</p>
                </v-card-text>

                <v-form ref="form" class="mx-auto" align="center">
                    <v-col align="center">
                        <v-row align="center" style="width: 80%;margin-top:10px;">
                            <v-text-field 
                                color="blue" 
                                label="请输入用户名" 
                                hint="3-20 characters" 
                                :rules="vContainer.vCard.vForm.rules" 
                                v-model="vContainer.vCard.vForm.username" 
                                @keyup.enter="login"
                                class="username" 
                                clearable
                                outlined
                                dense
                            ></v-text-field>
                        </v-row>
                        <v-row align="center" style="width: 80%;margin-top:10px;margin-bottom:10px">
                            <v-text-field 
                                color="blue" 
                                label="请输入密码" 
                                :append-icon="vContainer.vCard.vForm.show1 ? 'mdi-eye' : 'mdi-eye-off'" 
                                :type="vContainer.vCard.vForm.show1 ? 'text' : 'password'" 
                                hint="3-20 characters"
                                :rules="vContainer.vCard.vForm.rules" 
                                @click:append="vContainer.vCard.vForm.show1 = !vContainer.vCard.vForm.show1" 
                                @keyup.enter="login"
                                v-model="vContainer.vCard.vForm.password" 
                                class="password" 
                                clearable
                                outlined
                                dense
                            ></v-text-field>
                        </v-row>
                        <v-row align="center" style="width: 80%;margin-top:10px;margin-bottom:10px">
                            <div id="grecaptcha"></div>
                        </v-row>
                    </v-col>
                    <div style="margin: 0 auto; left: 0; right: 0">
                        <v-btn color="success" @click="login" class="login" :disabled="!vContainer.vCard.vForm.isLoginEnabled">登录</v-btn>
                    </div>
                </v-form>
                
            </v-card>
        </v-container>
    </div>
</template>

<script>
import Navigator from './Navigator'
export default {
    name: 'Login',
    components: {
        Navigator
    },
    data:() => ({
        navigator: {
            btn: "登录",
            message: "你好，请先登录！",
            login: "/login",
            isLogin: 0
        },
        
        vSnackbar:{
            snackbar: false,
            status: "",
            loginResult:""
        },
        vContainer: {
            vCard: {
                isButtonLoading: false,
                vProgressLinear:{
                    isShowProgress: false
                },
                vCardText: {

                },
                vForm: {
                    rules: [
                        value => !!value || 'Required.',
                        value => (value || '').length <= 20 || 'Max 20 characters.',
                        value => (value || '').length >= 3 || 'Min 3 characters.'
                    ],
                    username: '',
                    password: '',
                    show1: false,
                    isLoginEnabled: true
                }
            }
        },
        sitekey: "6LchkscZAAAAAJ92xk9py9sh19QMcBJ9Ct7AzN92",
        token: ''
    }),
    mounted: function(){
        this.loadCaptcha();
    },
    methods: {
        captchaPass: function(token) {
            this.token = token;
        },
        captchaExpired: function(token) {
            that.vSnackbar.snackbar = true;
            that.vSnackbar.status = "error";
            that.vSnackbar.message = "验证已过期，请重新验证";
        },
        captchaError: function(token) {
            that.vSnackbar.snackbar = true;
            that.vSnackbar.status = "error";
            that.vSnackbar.message = "Something error. Please check your network and try again.";
        },
        loadCaptcha: function(){
            try {
                window.grecaptcha.render("grecaptcha", {
                    'size': 'normal',
                    'sitekey': this.sitekey,
                    'callback': this.captchaPass,
                    'expired-callback': this.captchaExpired,
                    'error-callback': this.captchaError
                });
            } catch {
                setTimeout(this.loadCaptcha, 500);
            }
        },
        login:function(){
            let that = this;
            let username = that.vContainer.vCard.vForm.username;
            let password = that.vContainer.vCard.vForm.password;
            if (username.length < 3 || username.length > 20) {
                that.vSnackbar.snackbar = true;
                that.vSnackbar.status = 'error';
                that.vSnackbar.loginResult = 'Invalid username,the length must between 3 characters and 20 characters.';
            } else if (password.length < 3 || password.length > 20) {
                that.vSnackbar.snackbar = true;
                that.vSnackbar.status = 'error';
                that.vSnackbar.loginResult = 'Invalid password,the length must between 3 characters and 20 characters.';
            } else if (!that.token) {
                that.vSnackbar.snackbar = true;
                that.vSnackbar.status = 'error';
                that.vSnackbar.loginResult = '请完成人机验证';
            } else {
                that.vContainer.vCard.vProgressLinear.isShowProgress = true;
                that.vContainer.vCard.isButtonLoading = true;
                that.$request.post('/api/admin/login', {userID: username, passwd: password, token: that.token}).then( ret => {
                    that.vContainer.vCard.vProgressLinear.isShowProgress = false;
                    that.vContainer.vCard.isButtonLoading = false;
                    that.vSnackbar.snackbar = true;
                    if (ret.data.msg === "auth_error") {
                        that.vSnackbar.status = 'error';
                        that.vSnackbar.message = "验证失败，请重试";
                    } else if (ret.data.msg === 'succeed_login'){
                        that.vSnackbar.status = 'success';
                        that.vSnackbar.loginResult = '登录成功';
                        that.vContainer.vCard.vForm.isLoginEnabled = false;
                        that.$store.state.user = username;
                        setTimeout(() => {
                            that.navigator.btn = "退出登录";
                            that.navigator.message = "欢迎你" + username;
                            that.navigator.login = "";
                            that.navigator.isLogin = 1;
                            that.$router.push('/index');
                        },1500)
                    } else {
                        that.vSnackbar.status = 'error';
                        that.vSnackbar.loginResult = '用户名或密码错误';
                    }
                }).catch( err => {
                    console.log(err);
                    that.vContainer.vCard.vProgressLinear.isShowProgress = false;
                    that.vContainer.vCard.isButtonLoading = false;
                    that.vSnackbar.snackbar = true;
                    that.vSnackbar.status = 'error';
                    that.vSnackbar.loginResult = 'Something error.Please check your network and try again.';    
                });
            }
        }
    },
}
</script>

<style>

</style>
