<template>
  <div class="add_face">
    <canvas id="canvas" style="display: none"  width="250" height="150"/>
    <video id="video" autoplay="autoplay" width="1000" height="600"/>
    <el-button id="take_photo" type="primary" @click="takePhoto()">点击拍照</el-button><br>
  </div>
</template>

<script>
  import axios from 'axios'
  import {base_url} from "../assets/js/base";
  export default {
    name: 'FaceAdd',
    data() {
      return {
        add_face_url: base_url + 'face/add'
      }
    },
    mounted() {
      var video = document.getElementById("video");
      var constraints = {
        video: {width:1000, height:600},
        audio: false
      };
      var promise = navigator.mediaDevices.getUserMedia(constraints);
      promise.then(function (MediaStream) {
        video.srcObject = MediaStream;
        video.play();
      }).catch(function (PermissionDeniedError) {
        console.log(PermissionDeniedError);
      })
    },
    methods: {
      takePhoto() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, 250, 150)
        var imageData = canvas.toDataURL();
        // 删除base64头信息
        var base64_code = imageData.replace(/^data:image\/\w+;base64,/, "")
        this.upload(base64_code)
      },
      upload(base64_code) {
        var data = {
          user_id: this.$route.params.id, 
          face_name: this.$route.params.face_name, 
          face_class: this.$route.params.face_class,
          base64_code: base64_code
        }
        console.log(data)
        axios.post(this.add_face_url, data, {headers: {'Content-Type': 'application/json'}})
        .then(response => {
          var res = response.data;
          if (res.code == 0) {
            this.successMsg('录入成功')
          } else {
            this.errorMsg(res.msg);
          }
          console.log(res)
        })
        .catch(error => {
          this.errorMsg('网络错误,暂时不能访问')
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

<style scoped>
  .add_face {
    text-align: center;
  }
  #take_photo {
    display: block;
    margin: 0 auto;
  }
</style>
