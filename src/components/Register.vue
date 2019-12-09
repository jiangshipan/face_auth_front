<template>
  <div class="register">
    <el-input v-model="username" placeholder="请输入用户名"/>
    <el-input v-model="password" placeholder="请输入密码" show-password/>
    <el-input v-model="email" placeholder="请输入邮箱"/>
    <div class="code-container">
      <el-input id="code" v-model="code" placeholder="请输入验证码"/>
      <el-button id="send_button" :disabled="is_forbidden" type="primary" @click="sendCode()">{{button_msg}}</el-button><br>
    </div>
    <el-button id="reg_button" type="primary" @click="reg()">立即注册</el-button>
  </div>

</template>

<script>
  import axios from 'axios'
  import {base_url} from "../assets/js/base";

  export default {
    name: 'Register',
    data () {
      return {
        username: '',
        password: '',
        email: '',
        code: '',
        code_url: base_url + 'user/code',
        reg_url: base_url + 'user/reg',
        button_msg: '发送验证码',
        is_forbidden: false, //按钮是否正常使用
      }
    },
    methods: {
      //禁用按钮60秒
      disableButton() {
        var num = 60;
        this.is_forbidden = true;
        var _this = this
        var timer = setInterval(function () {
          num--;
          _this.button_msg = '请等待' + num + 'S';
          if (num == 0) {
            _this.is_forbidden = false;
            _this.button_msg = '发送验证码';
            clearInterval(timer)
          }
        }, 1000)
      },
      //检查email格式
      checkEmail() {
        var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(this.email)) {
          return false;
        }
        return true;
      },
      //发送验证码
      sendCode() {
        var flag = this.checkEmail()
        if (!flag) {
          this.errorMsg("请输入正确的邮箱")
          return
        }
        axios.post(this.code_url, {email: this.email}, {headers: {'Content-Type': 'application/json'}})
        .then(response => {
          if (response.data.code != 0) {
            this.errorMsg(response.data.msg);
          }
        })
        .catch(error => {
          this.errorMsg("网络错误,暂时不能访问")
        })
        //禁用button60s
        this.disableButton();
      },
      //注册
      reg() {
        if (this.username == '' || this.password == '' || this.email == '' || this.code == '') {
          this.errorMsg("必填字段不能为空")
          return
        }
        var data = {username: this.username, password: this.password, email: this.email, code: this.code}
        axios.post(this.reg_url, data, {headers: {'Content-Type': 'application/json'}})
        .then(response => {
          if (response.data.code != 0) {
            this.errorMsg(response.data.msg);
          } else {
            this.successMsg("注册成功");
            this.$router.push({ path: '/login' })
          }
        })
        .catch(error => {
          console.log(error);
          this.errorMsg("网络错误,暂时不能访问");
        })
      },
      successMsg(msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'success',
          duration: 2000
        });
      },
      errorMsg(msg) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'error',
          duration: 2000
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .register {
    width: 300px;
    margin: 220px auto 0 auto;
  }
  #code {
    flex: 1;
  }
  .code-container {
    display: flex;
    justify-content: space-between;
  }
  #reg_button {
    width: 300px;
    margin-top: 10px;
  }
</style>
