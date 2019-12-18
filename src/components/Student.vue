<template>
    <div class="student">
        <div class="input-container">
            <el-input class="stu_name" v-model="face_name" placeholder="请输入姓名"></el-input>
            <el-select class="stu_class" v-model="stu_class" placeholder="请选择班级" clearable>
                <el-option
                v-for="item in studentClass" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <el-select class="stu_status" v-model="stu_status" placeholder="请选择状态" clearable>
                <el-option
                v-for="item in studentStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button class="search" type="primary" @click="get_student_list()">搜索</el-button>
        </div>
        <el-table :data="studentList" style="width: 100%" border>
            <el-table-column prop="id" label="id" width="180" align="center"></el-table-column>
            <el-table-column prop="name" label="学生姓名" width="180" align="center"></el-table-column>
            <el-table-column prop="stu_class" label="专业班级" width="180" align="center"></el-table-column>
            <el-table-column prop="belong" label="教师姓名" align="center"></el-table-column>
            <el-table-column label="人脸照片" align="center">
                <el-link type="primary">查看人脸</el-link>
            </el-table-column>
            <el-table-column label="签到状态" align="center">
                <template slot-scope="scope">
                    <p v-if="scope.row.status == 1" style="color:#67C23A">已签到</p>
                    <p v-if="scope.row.status == 0" style="color:#F56C6C">未签到</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <el-link type="danger">删除</el-link>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from 'axios'
import {base_url} from "../assets/js/base";
axios.defaults.withCredentials =true;


export default {
    name: 'Student',
    data() {
        return {
            face_name: '',
            stu_class: '',
            stu_status: '',
            studentList: [],
            studentClass: [
                '计科1606', '计科1607', '软件1601'
            ],
            studentStatus: [
                {
                    value: 0,
                    label: '未签到'
                },{
                    value: 1,
                    label: '已签到'
                }
            ],
            get_stus_url: base_url + 'face/get'
        }
    },
    mounted() {
        axios.get(this.get_stus_url)
        .then(response => {
            var res = response.data;
            this.studentList = res.data;
            console.log(res)
        })
        .catch(error => {
            this.errorMsg("网络错误, 暂时不能访问")
        }) 

    },
    methods: {
      get_student_list() {
        var url = this.get_stus_url + '?1=1';
        if (this.face_name != '') {
            url += '&face_name=' + this.face_name;
        } 
        if (this.stu_class != '') {
            url += '&stu_class=' + this.stu_class;
        }
        if (this.stu_status != '') {
            url += '&status=' + this.stu_status;
        }
        axios.get(url)
        .then(response => {
            var res = response.data;
            this.studentList = res.data;
            console.log(res)
        })
        .catch(error => {
            this.errorMsg("网络错误, 暂时不能访问")
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
  .input-container {
    display: flex;
    justify-content: space-between;
    width: 1000px;
    margin: 50px 0 10px 0;
  }
  .search {
      margin-left: 5px;
      width: 95px;
  }
  .stu_name, .stu_class, .stu_status {
      width: 300px;
      margin-right: 5px;
  }

</style>