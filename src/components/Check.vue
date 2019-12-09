<template>
  <div class="check_face">
    <video id="video" autoplay="autoplay"/>
    <el-button id="take_photo" type="primary" @click="takePhoto()">点击拍照</el-button><br>
    <canvas id="canvas" style="display: none"/>
  </div>
</template>

<script>
  import axios from 'axios'
  import {base_url} from "../assets/js/base";
  export default {
    name: 'Check',
    data() {
      return {
        check_face_url: base_url + 'face/search'
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
        ctx.drawImage(video, 0, 0, 100, 100);
        var imageData = canvas.toDataURL();
        // 删除base64头信息
        var base64_code = imageData.replace(/^data:image\/\w+;base64,/, "")
        this.upload(base64_code)
      },
      upload(base64_code) {
        var data = {uid: $route.params.id, base64_code: base64_code}
        axios.post(this.check_face_url, data, {headers: {'Content-Type': 'application/json'}})
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style>
  #video, #canvas {
    width: 1000px;
    height: 600px;
    margin-left: 200px;
  }
</style>
