<template>
  <div class="main">
    <el-container>
      <el-header>
        <el-link class="el-link1" @click="redirect_input()">录入人脸</el-link>
        <el-link @click="redirect_check()">人脸签到</el-link>
        <el-dropdown trigger="click" class="user-side">
          <span class="el-dropdown-link">
            你好 {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changePassword()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>          
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="1">
              <i class="el-icon-user"></i>
              <router-link tag="span" slot="title" to="/student">学生列表</router-link>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-user-solid"></i>
              <router-link tag="span" slot="title" to="/manage_class">班级管理</router-link>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-notebook-2"></i>
              <router-link tag="span" slot="title" to="/record">签到记录</router-link>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import {base_url} from "../assets/js/base";
  axios.defaults.withCredentials = true;
  export default {
    name: 'Main',
    data() {
      return {
        user_id: '',
        username: '',
        get_user_url: base_url + 'user/get',
        logout_url: base_url + 'user/logout'
      }
    },
    mounted() {
      this.get_user_info();
    },
    methods: {
      get_user_info() {
        axios.get(this.get_user_url)
        .then(response => {
            var res = response.data;
            if (res.code == 0) {
              this.user_id = res.data.id;
              this.username = res.data.username;
            } else {
              this.errorMsg(res.msg)
            }
        })
        .catch(error => {
          this.errorMsg('网络错误, 暂时不能访问')
        })
      },
      logout() {
        axios.get(this.logout_url)
        .then(response => {
          var res = response.data;
          this.successMsg("注销成功");
          this.$router.push({ path: '/login' })
        })
        .catch(error => {
          this.errorMsg('网络错误, 暂时不能访问')
        })
      },
      changePassword() {
        this.errorMsg('暂不提供修改密码');
      },
      redirect_input() {
        this.$router.push({ path: '/input/' + this.user_id})
      },
      redirect_check() {
        this.$router.push({ path: '/face/check/' + this.user_id})
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

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    line-height: 60px;
  }
  .el-aside {
    text-align: center;
    background-color: #545c64
  }
  .el-main {
    padding: 0px;
  }
  .user-side {
    position:absolute;
    right: 2%
  }
  .main {
    display: flex;
    height: 100vh;
  }
  .el-menu {
    border-right: none;
  }
  .el-link1 {
    padding-left: 30px;
    padding-right: 30px;
  }


</style>
