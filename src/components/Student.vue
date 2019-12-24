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
        <el-table :data="studentList" style="width: 100%" border size="medium">
            <el-table-column label="序号" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="学生姓名" width="180" align="center"></el-table-column>
            <el-table-column prop="stu_class" label="专业班级" width="180" align="center"></el-table-column>
            <el-table-column prop="belong" label="教师姓名" align="center"></el-table-column>
            <el-table-column label="人脸照片" align="center">
                <template slot-scope="scope">
                    <el-link type="primary" @click="find_face_img(scope.row.url)">查看人脸</el-link>
                </template>
            </el-table-column>
            <el-table-column label="签到状态" align="center">
                <template slot-scope="scope">
                    <p v-if="scope.row.status == 1" style="color:#67C23A">已签到</p>
                    <p v-if="scope.row.status == 0" style="color:#F56C6C">未签到</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button class="not_in" v-if="scope.row.status == 1" type="danger" @click="doOption('请确认未到场', scope.row.id, 0)">未到场</el-button>
                    <el-button class="in" v-if="scope.row.status == 0" type="success" @click="doOption('请确认已经到场', scope.row.id, 1)">已到场</el-button>
                    <el-button class="delete" type="danger" @click="doOption('此操作将从班级内移除该学生, 是否继续?', scope.row.id, 2)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination 
            @current-change="get_student_list" 
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalNum">
            </el-pagination>
        </div>
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
            currentPage: 1,
            pageSize: 10,
            totalNum: 1,
            face_name: '',
            stu_class: '',
            stu_status: '',
            image_url: '',
            studentList: [],
            studentClass: [],
            studentStatus: [
                {
                    value: 0,
                    label: '未签到'
                },{
                    value: 1,
                    label: '已签到'
                }
            ],
            get_stus_url: base_url + 'face/get',
            get_class_url: base_url + 'face/get_class',
            update_status_url: base_url + 'face/update'
        }
    },
    mounted() {
        this.get_student_list(),
        this.get_class_list()
    },
    methods: {
      get_student_list() {
        var url = this.get_stus_url + '?page=' + this.currentPage;
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
            if (res.code != 0) {
                this.errorMsg(response.data.msg);
                return;
            }
            this.studentList = res.data.data;
            this.totalNum = res.data.total;
        })
        .catch(error => {
            this.errorMsg("网络错误, 暂时不能访问")
        }) 
      },
      get_class_list() {
          axios.get(this.get_class_url)
          .then(response => {
              var res = response.data.data;
              if (response.data.code != 0) {
                  this.errorMsg(response.data.msg);
                  return;
              }
              var checked = res.checked;
              var unchecked = res.unchecked;
              for (var i = 0; i < checked.length; i++) {
                  this.studentClass.push(checked[i])
              }
              for (var i = 0; i < unchecked.length; i++) {
                  this.studentClass.push(unchecked[i])
              }
          })
          .catch(error => {
              this.errorMsg('网络错误, 暂时不能访问')
          })
      },
      update_status(id, status) {
          axios.get(this.update_status_url + '?id=' + id + '&status=' + status)
          .then(response => {
              var res = response.data;
              if (res.code == 0) {
                  this.get_student_list();
                  this.successMsg('操作成功');
              } else {
                  this.errorMsg(res.msg);
              }
          }) 
          .catch(error => {
              this.errorMsg('网络错误暂时不能访问')
          })
      },
      find_face_img(image_url) {
          window.open(image_url);
      },
      doOption(msg, id, status) {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.update_status(id, status)
        }).catch(() => {
          this.successMsg('已取消')     
        });
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
  .delete, .not_in, .in {
      width: 80px;
  }
  .block {
    margin: auto;
    width: 40%;
    margin-top: 10px;
  }

</style>