<template>
  <div class="main">
    <el-container>
      <el-header>
        <el-dropdown trigger="click" class="user-side">
          <span class="el-dropdown-link">
            你好 {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item v-for="user_op in user_ops" :key="user_op">{{user_op}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>          
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="1" @click="skipToStudent()">
              <i class="el-icon-user-solid"></i>
              <span slot="title">学生列表</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">签到记录</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view name="his"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        username: 'jiangshipan',
        user_ops: ['基本资料', '修改密码', '退出']
      }
    },
    methods: {
      skipToStudent() {
        // this.$router.push({ path: '/login' })
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
  .user-side {
    position:absolute;
    right: 2%
  }
  .main {
    display: flex;
    height: 100vh;
  }


</style>
