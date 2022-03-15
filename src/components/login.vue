//登录
<template>
  <div class="log_reg">
    <div class="login">
      <h1 class="log_title">MCT智能出卷系统</h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('ruleForm')" v-if="log_button"
            >登录</el-button
          >
          <el-button
            type="primary"
            @click="register('ruleForm')"
            v-if="reg_button"
            >注册</el-button
          >
          <!-- <el-button @click="resetForm('ruleForm')">用手机号登录</el-button> -->
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
        <el-form-item class="a">
          <el-button type="text" @click="handleRegister" v-if="log_button"
            >去注册</el-button
          >
          <el-button type="text" @click="handleLogin" v-if="reg_button"
            >去登录</el-button
          >
          <el-button type="text" @click="forgetPass" v-if="log_button"
            >忘记密码</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
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
    };
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (
        !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
          value
        )
      ) {
        callback(new Error("请输入正确的邮箱"));
      }
      callback();
    };
    return {
      log_button: true,
      reg_button: false,
      ruleForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [{ validator: validateEmail, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      BaaS.auth
        .getCurrentUser()
        .then((user) => {
          console.log(user);
          if (user._email_verified) {
            this.$router.push("/outline");
          } else {
            BaaS.auth
              .getCurrentUser()
              .then((user) => {
                return user.requestEmailVerification();
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                // HError
                alert(err);
              });
          }
        })
        .catch((err) => {
          if (err.code === 604) {
            console.log("用户未登录");
          }
        });
    },
    login(formName) {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          BaaS.auth
            .login(this.ruleForm)
            .then((user) => {
              console.log(user);
              if (user._email_verified) {
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                this.$router.push("/outline");
              } else {
                BaaS.auth
                  .getCurrentUser()
                  .then((user) => {
                    return user.requestEmailVerification();
                  })
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    // HError
                    alert(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              if (err == "Error: 400: Invalid username/email or password.") {
                this.$message("邮箱或密码错误");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleRegister() {
      this.log_button = false;
      this.reg_button = true;
    },
    handleLogin() {
      this.log_button = true;
      this.reg_button = false;
    },
    register(formName) {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          BaaS.auth
            .register(this.ruleForm)
            .then((user) => {
              BaaS.auth
                .getCurrentUser()
                .then((user) => {
                  return user.requestEmailVerification();
                })
                .then((res) => {
                  console.log(res);
                  if (user._email_verified) {
                    this.$message({
                      message: "注册成功",
                      type: "success",
                    });
                    this.$router.push("/outline");
                  }
                })
                .catch((err) => {
                  // HError
                  alert(err);
                });
            })
            .catch((err) => {
              console.log(err);
              if (err == "Error: 400: 'Email'lready exists.") {
                this.$message("邮箱已注册过");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    forgetPass() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      if (this.ruleForm.email == "") {
        this.$message("请先填写邮箱");
      }
      if (this.ruleForm.email != "") {
        this.$message("正在为您发送邮件");
        BaaS.auth
          .requestPasswordReset(this.ruleForm)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            if (err == "Error: 404: unknown error") {
              this.$message("邮箱未注册，请先注册");
            }
          });
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style>
.log_reg {
  display: flex;
  justify-content: center;
  padding: 172px;
}
.login {
  width: 350px;
  background-color: white;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  padding: 55px 0 10px 0;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.log_title {
  color: #27b148;
  margin-bottom: 20px;
}
.login .el-form-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.login .el-form-item__label {
  width: auto !important;
}
.login .el-form-item__content {
  margin-left: 0 !important;
}
.a .el-form-item__content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>