//登录
<template>
  <div>
    <div class="login">
      <h1>MCT智能出卷系统</h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="ruleForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">登录</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <input
                v-model="loginForm.email"
                type="email"
                class="form-control"
                aria-describedby="emailHelp"
                placeholder="请输入邮箱"
              />
            </div>
            <div class="form-group">
              <input
                v-model="loginForm.password"
                type="password"
                class="form-control"
                placeholder="请输入密码"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="openRegisterModal"
              data-dismiss="modal"
            >
              去注册
            </button>
            <button type="button" class="btn btn-primary" @click="handleLogin">
              登录
            </button>
          </div>
        </div>
      </div>
    </div>
    注册模态框
    <div
      class="modal fade"
      id="registerModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">注册</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <input
                v-model="registerForm.email"
                type="email"
                class="form-control"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            <div class="form-group">
              <input
                v-model="registerForm.password"
                type="password"
                class="form-control"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="openLoginModal"
              data-dismiss="modal"
            >
              去登录
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleRegister"
            >
              注册
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script src="index.js"></script>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } 
      callback();
      // else {
      //   if (this.ruleForm.pass !== "") {
      //     this.$refs.ruleForm.validateField("pass");
      //   }
      //   callback();
      // }
    };
    return {
      // loginForm: {
      //   email: "",
      //   password: "",
      // },
      // registerForm: {
      //   email: "",
      //   password: "",
      // },
      ruleForm: {
        email: "",
        password: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let BaaS = window.BaaS;
console.log(this.ruleForm)
      window.BaaS.auth.login(this.ruleForm).then(() => {
        // $("#loginModal").modal("hide");
        // this.init();
        this.$router.push("/");
      });
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // openLoginModal() {
    //   $("#loginModal").modal();
    // },
    // openRegisterModal() {
    //   $("#registerModal").modal();
    // },
    // handleLogin() {
    //   // let BaaS = window.BaaS;

    //   window.BaaS.auth.login(this.loginForm).then(() => {
    //     $("#loginModal").modal("hide");
    //     this.init();
    //   });
    // },
    // handleRegister() {
    //   // let BaaS = window.BaaS;

    //   window.BaaS.auth.register(this.registerForm).then(() => {
    //     $("#registerModal").modal("hide");
    //     this.init();
    //   });
    // },
  },
  mounted() {
    var BaaS = require('minapp-sdk')
    let clientID = '395062a19e209a770059'
    BaaS.init(clientID)
    // let BaaS = window.BaaS;
    // let cacheKey = "ifanrx_clientID";
    // if (!localStorage.getItem(cacheKey)) {
    //   while (true) {
    //     let clientID = window.prompt("请输入 clientID"); // 从 BaaS 后台获取 ClientID
    //     if (clientID && clientID.match(/\w{20}/)) {
    //       localStorage.setItem(cacheKey, clientID); // 若输入了错误的 clientID，可以清空 localStorage
    //       break;
    //     }
    //   }
    // }
    // BaaS.init(localStorage.getItem(cacheKey));
    BaaS.auth
      .getCurrentUser()
      .then(() => {
        // this.init();
        this.$router.push("/");
      })
      .catch((e) => {
        // this.openLoginModal();
        console.log("ccc")
      });
  },
};
</script>
<style>
</style>