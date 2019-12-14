<template>
  <div class="input-container">
    <div class="input_face">
      <el-input v-model="face_name" placeholder="请输入你的姓名"></el-input>
      <el-input v-model="face_class" placeholder="请输入你的专业班级"></el-input>
      <el-button id="check_button" type="primary" @click="checkInput()">确定</el-button>
    </div>
  </div>    
</template>
<script>
  export default {
    name: 'Input',
    data() {
      return {
        face_name: '',
        face_class: ''
      }
    },
    methods: {
      checkInput() {
        if (this.face_name == '' || this.face_class == '') {
          this.errorMsg('相关参数不能为空');
        } else {
          var params = {
            id: this.$route.params.id, 
            face_name: this.face_name, 
            face_class: this.face_class
          }
          this.$router.push({ name: 'FaceAdd', params: params})
        }
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
  .input_face {
    text-align: center;
    width: 300px;
  }
  #check_button {
    width: 300px;
    margin-top: 10px;
  }
  .input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: url("../assets/images/background.jpeg") no-repeat center center;
    background-size: cover;
  }
</style>
