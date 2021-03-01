<template>
  <div id="problem-web">
    <v-container fluid>
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
            <v-card :elevation="hover ? 8 : 2" style="height:100%"> 
              <v-card-title class="subheading font-weight-bold">题目名:{{ item.problemTitle }}</v-card-title>

              <v-divider></v-divider>
              
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>原始分数:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.problemScore }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>是否可见:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.problemIsShow }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>题目内容:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-btn text @click.stop="showPreviewProblemDialog(item)" >查看预览</v-btn>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>提交情况:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-btn text @click.stop="showUploadProblemDialog(item)" >点击查看</v-btn>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <div class="text-center" style="margin:20px;">
                <v-btn
                  color="indigo"
                  dark
                  fab
                  class="mx-2"
                  @click.stop="showChangeProblemDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="indigo"
                  dark 
                  fab
                  class="mx-2" 
                  @click.stop="showDeleteProblemDialog(item)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-hover>  
        </v-col> 
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-hover v-slot:default="{ hover }">
            <v-card height="100%" :elevation="hover ? 8 : 2">
              <v-card-text class="font-weight-medium text-center " style="font-size:24px;margin-bottom:20px">
                添加题目
              </v-card-text>
              <div class="text-center" style="margin-top:30px;">
                <v-btn
                  color="cyan accent-2"
                  dark
                  x-large
                  fab
                  class="mx-2"
                  @click="newProblem"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-hover>
        </v-col>
        <v-dialog v-model="dialog.change.dialogIsShow" max-width="1200px" min-height="600px" v-if="dialog.change.dialogIsShow">
          <v-form v-model="isEditingFormValid" :lazy-validation="editingFormLazy">  
            <v-card :disabled="!isEditable">
              <v-progress-linear indeterminate color="green" absolute v-if="isShowProgress"></v-progress-linear>
              <v-card-text>
                <v-text-field v-model="dialog.change.problemTitle" label="Title" style="padding-top:30px" :rules="rules1"></v-text-field>
                <p style="font-size:13px;margin-bottom:5px;">Content</p>
                <MarkDown v-model="dialog.change.problemContent" :autoSave="true" @on-save="handleOnSave" :interval="4000" />
                <v-row>
                  <v-text-field v-model="dialog.change.flag" label="flag" width="600px"></v-text-field>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="dialog.change.problemScore" label="problemScore" width="300px" :rules="rules2"></v-text-field>
                  <v-spacer></v-spacer>
                  <v-switch v-model="dialog.change.problemIsShow" label="isShow" class="ma-2"></v-switch>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="save(1)" :disabled="!isEditingFormValid">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <v-dialog v-model="dialog.preview.dialogIsShow" max-width="1200px">
          <v-card>
            <MarkDown v-model="dialog.change.problemContent" max-width="1200px" min-height="600px" isPreview/>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog.upload.dialogIsShow" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">题目名：{{ dialog.upload.problemTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="2" v-for="upload in uploads" :key="upload.problemID" style="text-align: center">
                  <v-icon large @click="download(upload)" style="cursor: pointer">mdi-file</v-icon>
                  <p>{{ upload.uploadUser }}</p>
                  <v-chip class="ma-2" color="green" text-color="white" v-if="upload.isNewUpload" left>new</v-chip>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog.delete.dialogIsShow" max-width="300px"> 
          <v-card>
            <v-card-title class="headline" >确认删除{{ dialog.delete.problemTitle }}？</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog.delete.dialogIsShow = false">取消</v-btn>
              <v-btn color="green darken-1" text @click="deleteProblem">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MarkDown from 'vue-meditor'
export default {
  name: 'ProblemContent',
  data: () => ({
    rules1:[
      value => !!value || 'Required.'
    ],
    rules2:[
      value => !!value || 'Required.',
      value => {
        const pattern = /^[1-9]{0,1}[0-9]{1,3}$/;
        return pattern.test(value) || 'Invalid.';
      },
    ],
    isEditingFormValid: true,
    editingFormLazy: false,
    isShowProgress: false,
    isEditable: true,
    uploads:[],
    dialog: {
      change: {
        dialogIsShow: false,
        problemID: 0,
        problemTitle: '',
        problemScore: 0,
        problemContent: '',
        flag: '',
        problemIsShow: false
      },
      delete: {
        dialogIsShow: false,
        problemID: 0,
        problemTitle: ''
      },
      preview: {
        dialogIsShow: false
      },
      upload: {
        dialogIsShow: false,
        problemID: 0,
        problemTitle: ''
      }
    }
  }),
  components:{
    MarkDown
  },
  props:{
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
  created:function(){

  },
  methods: {
    newProblem:function(){
      let that = this;
      let url = "/api/admin/problem/newproblem/" + that.$store.state.field[that.$route.hash.replace("#","")];
      that.$request.get(url).then( ret => {
        that.showChangeProblemDialog(ret.data);
      }).catch( err => {
        
      })
    },
    showChangeProblemDialog:function(item){
      let that = this;
      that.dialog.change.dialogIsShow = true;
      that.dialog.change.problemID = item.problemID || -1;
      that.dialog.change.problemTitle = item.problemTitle;
      that.dialog.change.problemContent = item.problemContent;
      that.dialog.change.problemScore = item.problemScore;
      that.dialog.change.flag = item.flag;
      that.dialog.change.problemIsShow = item.problemIsShow;
    },
    showPreviewProblemDialog:function(item){
      let that = this;
      that.dialog.preview.dialogIsShow = true;
      that.dialog.change.problemContent = item.problemContent;
    },
    showDeleteProblemDialog:function(item){
      let that = this;
      that.dialog.delete.dialogIsShow = true;
      that.dialog.delete.problemTitle = item.problemTitle;
      that.dialog.delete.problemID = item.problemID;
    },
    showUploadProblemDialog:function(item){
      let that = this;
      that.dialog.upload.dialogIsShow = true;
      that.dialog.upload.problemTitle = item.problemTitle;
      that.uploads = [];
      that.$request.get("/api/admin/problem/getproblemupload/" + item.problemID).then( ret => {
        that.uploads = ret.data;
      }).catch( err => {
        console.log(err);
      })

    },
    handleOnSave:function({value, theme}){ // 固定时间向服务器发送一次保存数据请求
      let that = this;
      that.dialog.change.problemContent = value;
      if (that.dialog.change.problemTitle && that.dialog.change.problemScore) that.saveChanges();
    },
    save:function(flag){ // 向服务器发送请求，保存数据
      let that = this;
      that.saveChanges(flag);
    },
    saveChanges:function(flag){
      let that = this;
      if (flag) {
        that.isShowProgress = true;
        that.isEditable = false;
      }
      that.$request.post('/api/admin/problem/savechanges',{
        problemID: that.dialog.change.problemID,
        problemTitle: that.dialog.change.problemTitle,
        problemContent: that.dialog.change.problemContent,
        problemScore: parseInt(that.dialog.change.problemScore),
        flag: that.dialog.change.flag,
        problemIsShow: that.dialog.change.problemIsShow
      }).then( ret => {
        if (flag) {
          flag = 0;
          for(let item in that.items) {
            if (that.items[item].problemID == that.dialog.change.problemID) {
              that.items[item].problemTitle = that.dialog.change.problemTitle;
              that.items[item].problemContent = that.dialog.change.problemContent;
              that.items[item].problemScore = parseInt(that.dialog.change.problemScore);
              that.items[item].problemIsShow = that.dialog.change.problemIsShow;
              that.items[item].flag = that.dialog.change.flag;
              flag = 1;
              break;
            }
          }
          if(!flag) {
            that.items.push({
              problemID: that.dialog.change.problemID,
              problemTitle: that.dialog.change.problemTitle,
              problemContent: that.dialog.change.problemContent,
              problemScore: parseInt(that.dialog.change.problemScore),
              problemIsShow: that.dialog.change.problemIsShow,
              flag: that.dialog.change.flag
            })
          }
          that.isShowProgress = false;
          that.isEditable = true;
          that.dialog.change.dialogIsShow = false;
        }
      }).catch( err => {
        if (flag) {
          that.isShowProgress = false;
          that.isEditable = true;
        }
        
      })
    },
    deleteProblem:function(){
      let that = this;
      that.$request.post('/api/admin/problem/deleteproblem',{
        problemID: that.dialog.delete.problemID
      }).then( ret => {
        if (ret.data.msg == "success") {
          for(let i in that.items) {
            if (that.items[i].problemID == that.dialog.delete.problemID) {
              that.items.splice(i, 1);
            }
          }
          that.dialog.delete.dialogIsShow = false;
        } else {
          
        }
      }).catch( err => {
        
      })
    },
    download:function(upload){
      let that = this;
      that.$request({
        method: "get",
        url: "/api/admin/users/download/" + upload.uploadUser + "/" + upload.problemID,
        responseType: "blob"
      }).then( ret => {
        let content = ret.data;
        let fileName = ret.headers.filename;
        const blob = new Blob([content]);
        const url = window.URL.createObjectURL(blob);
        console.log(url);
        let dom = document.createElement('a');
        dom.style.display = 'none';
        dom.href = url;
        dom.setAttribute('download',fileName);
        document.body.appendChild(dom);
        dom.click();
        document.body.removeChild(dom);
        upload.isNewUpload = 0;
      }).catch( err => {
        console.log(err);
      })
    }
  },
}
</script>

<style>

</style>
