<template>
  <div id="users">
    
    <v-data-table
      :headers="headers"
      :items="contents"
      :search="search"
      sort-by="no"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>All Users</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            outlined
            hide-details
          ></v-text-field>

          <v-dialog v-model="dialog.edit.isShow" max-width="700px">
            <v-form v-model="dialog.edit.isFormValid">
              <v-card :disabled="!dialog.edit.isFormEditable">
                <v-progress-linear indeterminate color="green" absolute v-if="dialog.edit.isShowProgress"></v-progress-linear>
                <v-card-title>
                  <span class="headline">Edit</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <p>username: {{dialog.edit.editedItem.userID}}</p>
                        <p>Total Score:{{ dialog.edit.editedItem.totalScore }}</p>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.number="dialog.edit.editedItem.webScore" label="Web Score" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.number="dialog.edit.editedItem.uiScore" label="UI Score" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.number="dialog.edit.editedItem.androidScore" label="Android Score" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.number="dialog.edit.editedItem.mlScore" label="ML Score" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.number="dialog.edit.editedItem.securityScore" label="Security Score" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.number="dialog.edit.editedItem.basicScore" label="Basic Score" readonly></v-text-field>
                      </v-col>
                      <br>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="dialog.edit.changingProblem"
                          :items="dialog.edit.problemItem"
                          item-text="problemTitle"
                          item-value="problemTitle"
                          :rules="[v => !!v || 'Problem name is required']"
                          label="Problem Name"
                          required
                          return-object
                        >
                          <template v-slot:selection="data">
                            <!-- HTML that describe how select should render selected items -->
                            {{ data.item.problemID }} - {{ fieldItem[data.item.problemField] }} - {{data.item.problemTitle}}
                          </template>
                          <template v-slot:item="data">
                            <!-- HTML that describe how select should render items when the select is open -->
                            {{ data.item.problemID }} - {{ fieldItem[data.item.problemField] }} - {{data.item.problemTitle}}
                          </template></v-select>
                      </v-col>
                      <v-col cols="12">
                        <p>当前题目分数: {{ dialog.edit.changingProblem.currentScore }}</p>
                        <p>赋分: {{ parseInt(dialog.edit.changingProblem.currentScore * dialog.edit.percent * 0.01) }}</p>
                        <v-slider
                          v-model="dialog.edit.percent"
                          label="score percents"
                          class="align-center"
                          :max="150"
                          :min="10"
                          thumb-label="always"
                        >
                          <template v-slot:append>
                            <v-text-field 
                              v-model="dialog.edit.percent"
                              class="mt-0 pt-0"
                              hide-details 
                              single-line 
                              label="Problem Score" 
                              type="number" 
                              style="width: 50px"
                            ></v-text-field> 
                            <p>%</p>
                          </template>
                        </v-slider>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="saveChanges" :disabled="!dialog.edit.isFormValid">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>

          <v-dialog v-model="dialog.delete.isShow" max-width="350px">
            <v-card>
              <v-card-title>
                <span class="headline">Delete</span>
              </v-card-title>

              <v-card-text>
                <p>Are you sure to delete user <strong>{{ dialog.delete.deletingItem.userID }}</strong>？</p>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">No</v-btn>
                <v-btn color="blue darken-1" text @click="deleteUser">Yes</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog.upload.isShow" max-width="600px" min-height="300px">
            <v-card>
              <v-card-title>
                <span class="headline">Uploads By <strong>{{dialog.upload.uploadUser}}</strong></span>
              </v-card-title>
              <v-card-text>
                <v-row v-for="field in fieldItem" :key="field">
                  <v-col cols="12">
                    <p>{{field}}</p>
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="2" v-for="problem in dialog.edit.problems[field]" :key="problem.problemID" style="text-align: center">
                    <v-icon large @click="download(problem)" style="cursor: pointer">mdi-file</v-icon>
                    <p :style="problem.submitIndicator">{{ problem.problemTitle }}</p>
                    <v-chip class="ma-2" color="green" text-color="white" v-if="problem.isNewUpload" left>new</v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog.profile.isShow" max-width="600px" min-height="300px">
            <v-card>
              <v-card-title>
                <span class="headline">Profile of <strong>{{ dialog.profile.userID }}</strong></span>
              </v-card-title>
              <v-card-text>
                <v-row v-for="profileItem in dialog.profile.profile" :key="profileItem.key">
                  <v-col cols="12">
                    <div>{{ profileItem.key + ': ' + profileItem.value }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
        <v-icon
          small
          @click="showAllUploads(item)"
        >
          mdi-file
        </v-icon>
      </template>
      <template v-slot:[`item.userID`]="{ item }">
        <div @click="showUserProfile(item)" :style="item.submitIndicator">{{ item.userID }}</div>  <!-- 如果有提交则加粗，如果有新提交则加new标签，点击则显示用户的基本信息 -->
        <v-chip class="ma-2" color="green" text-color="white" v-if="item.hasNewUpload" left>new</v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'users',
  data: () => ({
    search: '',
    dialog: {
      edit: {
        isShow: false,
        isFormValid: true,
        isShowProgress: false,
        isFormEditable: true,
        changingProblem: {
          problemID: 0,
          problemTitle: '',
          problemField: 0,
          problemScore: 0,
          currentScore: 0
        },
        editedItem: {
          userID: '',
          totalScore: 0,
          webScore: 0,
          uiScore: 0,
          androidScore: 0,
          mlScore: 0,
          securityScore: 0,
          basicScore: 0
        },
        defaultItem: {
          userID: '',
          totalScore: 0,
          webScore: 0,
          uiScore: 0,
          androidScore: 0,
          mlScore: 0,
          securityScore: 0,
          basicScore: 0
        },
        percent: 0,
        problemItem: [],
        problems: { // 某个用户上传的题目数据
          web: [],
          ui: [],
          ml: [],
          android: [],
          security: [],
          basic: []
        }, 
      },
      delete:{
        isShow: false,
        deletingItem: {},
      },
      upload:{
        isShow: false,
        uploadUser: ''
      },
      profile:{
        isShow: false,
        userID: '',
        profile: []
      }
    },
    
    headers: [
      { text: 'username', value: 'userID', sortable: false },
      { text: 'Total Score', value: 'totalScore', filterable: false },
      { text: 'Web Score', value: 'webScore', filterable: false },
      { text: 'UI Score', value: 'uiScore', filterable: false },
      { text: 'Android Score', value: 'androidScore', filterable: false },
      { text: 'ML Score', value: 'mlScore', filterable: false },
      { text: 'Security Score', value: 'securityScore', filterable: false },
      { text: 'Basic Score', value: 'basicScore', filterable: false },
      { text: 'Operate', value: 'actions', sortable: false, filterable: false }
    ],
    contents: [], // 所有用户的数据
    fieldItem: [
      'web',
      'ui',
      'ml',
      'android',
      'security',
      'basic'
    ]
  }),
  props:{
    message: Object
  },
  watch: {
    message:function(newVal, oldVal){
      this.initialize();
    }
  },

  created: function(){
    this.initialize();
  },

  methods: {
    initialize: function() {
      let that = this;
      that.$request.get('/api/admin/users/getallusers').then( ret => {
        for(let user of ret.data) {
          if(user.hasUpload) {
            user.submitIndicator = { fontWeight: 800 };
          }
        }
        that.contents = ret.data;
      }).catch( err => {
        console.log(err);
      })
    },
    editItem: function(item) {
      let that = this;
      that.editedIndex = that.contents.indexOf(item);
      that.dialog.edit.editedItem = Object.assign({}, item);
      that.dialog.edit.isShow = true;
      that.dialog.edit.problemItem = [];
      for(let field in that.dialog.edit.problems) that.dialog.edit.problems[field] = [];
      that.$request.get("/api/admin/users/getalluploads/" + item.userID).then( ret => {
        for(let problem of ret.data) that.dialog.edit.problems[that.fieldItem[problem.problemField]].push(problem);
        for(let field in that.dialog.edit.problems) {
          // problem: web ui ml android ...
          // dialog.edit.problems[problem]: Array of dialog.edit.problems in this field
          that.dialog.edit.problemItem.push({ header: field });
          for(let problem of that.dialog.edit.problems[field]) {
            that.dialog.edit.problemItem.push(problem);
          }
          that.dialog.edit.problemItem.push({ divider: true });
        }
        that.dialog.edit.problemItem.pop() // pop the last divider
      }).catch( err => {
        console.log(err);
      })
    },

    deleteItem: function(item) {
      this.dialog.delete.deletingItem = item;
      this.dialog.delete.isShow = true;
    },

    showAllUploads: function(item) {
      let that = this;
      that.dialog.upload.isShow = true;
      that.dialog.edit.isShowProgress = true;
      that.dialog.upload.uploadUser = item.userID;
      for(let field in that.dialog.edit.problems) that.dialog.edit.problems[field] = [];
      that.$request.get("/api/admin/users/getalluploads/" + item.userID).then( ret => {
        that.dialog.edit.isShowProgress = false;
        for(let problem of ret.data) {
          if(problem.isNewUpload) problem.submitIndicator = { fontWeight: 800 };
          that.dialog.edit.problems[that.fieldItem[problem.problemField]].push(problem);
        }
      }).catch( err => {
        
      })
    },
    showUserProfile:function(item){
      let that = this;
      that.dialog.profile.isShow = true;
      that.dialog.profile.userID = item.userID;
      that.dialog.profile.profile = [];
      that.$request.get("/api/admin/users/getallprofile/" + item.userID).then( ret => {
        for(let item in ret.data) {
          if (ret.data[item].value == null) { 
            ret.data[item].value = "";
          } else if (typeof ret.data[item].value == "string") { 
            ret.data[item].value = decodeURIComponent(escape(window.atob(ret.data[item].value)));
          }
        }
        that.dialog.profile.profile = ret.data;
        console.log(ret);
      }).catch( err => {
        console.log(err);
      })
    },
    download: function(problem) {
      let that = this;
      that.$request({
        method: "get",
        url: "/api/admin/users/download/" + that.dialog.upload.uploadUser + "/" + problem.problemID,
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
        problem.isNewUpload = 0;
        problem.submitIndicator = {};
      }).catch( err => {
        console.log(err);
      })
    },

    close: function() {
      this.dialog.edit.isShow = false
      this.dialog.delete.isShow = false
      this.$nextTick(() => {
        this.dialog.edit.editedItem = Object.assign({}, this.dialog.edit.defaultItem);
      })
    },

    saveChanges: function() {
      let that = this;
      that.dialog.edit.isShowProgress = true;
      that.dialog.edit.isFormEditable = false;
      const previous = {
        userID: that.dialog.edit.editedItem.userID,
        totalScore: that.dialog.edit.editedItem.totalScore,
        webScore: that.dialog.edit.editedItem.webScore,
        uiScore: that.dialog.edit.editedItem.uiScore,
        mlScore: that.dialog.edit.editedItem.mlScore,
        androidScore: that.dialog.edit.editedItem.androidScore,
        securityScore: that.dialog.edit.editedItem.securityScore,
        basicScore: that.dialog.edit.editedItem.basicScore
      };
      that.$request.post('/api/admin/users/updatescore', {
          userID: that.dialog.edit.editedItem.userID,
          problemID: that.dialog.edit.changingProblem.problemID,
          problemField: that.dialog.edit.changingProblem.problemField, 
          magnification: that.dialog.edit.percent * 0.01
      }).then( ret => {
        that.initialize();
        that.dialog.edit.isShowProgress = false;
        that.dialog.edit.isFormEditable = true;
        
        Object.assign(that.contents[that.editedIndex], ret.data);
        that.dialog.edit.changingProblem = {};
        that.dialog.edit.percent = 0;
        that.close();
      }).catch( err => {
        that.dialog.edit.isShowProgress = false;
        that.dialog.edit.isFormEditable = true;
        that.dialog.edit.changingProblem = {};
        that.dialog.edit.percent = 0;
        
        that.dialog.edit.editedItem = previous;
      })
    },

    deleteUser: function() {
      let that = this;

      that.$request.post('/api/admin/users/deleteuser', that.dialog.delete.deletingItem.userID).then (ret => {
        const index = this.contents.indexOf(that.dialog.delete.deletingItem)
        this.contents.splice(index, 1)
        
        that.close();
      }).catch( err => {
        
      }) 
    }
  }
}
</script>

<style>

</style>



