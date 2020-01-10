<template>
    <div class="student">
        <div class="input-container">
            <el-date-picker type="date" class="date_start" placeholder="开始日期" v-model="date_start"></el-date-picker>
            <el-date-picker type="date" class="date_end" placeholder="结束日期" v-model="date_end"></el-date-picker>
            <el-select class="stu_class" v-model="pro_class" placeholder="请选择班级" clearable>
                <el-option
                v-for="item in studentClass" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <el-button class="search" type="primary" @click="get_reocrd_list()">搜索</el-button>
        </div>
        <el-table :data="recordList" style="width: 100%" border>
            <el-table-column label="序号" width="180" align="center">
              <template slot-scope="scope">
                    <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="belong" label="教师姓名" width="180" align="center"></el-table-column>
            <el-table-column prop="pro_class" label="专业班级" align="center"></el-table-column>
            <el-table-column prop="unchecked" label="未签到学生" align="center"></el-table-column>
            <el-table-column prop="create_time" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="end_time" label="结束时间" align="center"></el-table-column>
        </el-table>
        <div class="block">
            <el-pagination 
            @current-change="get_reocrd_list" 
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
axios.defaults.withCredentials = true;


export default {
    name: 'Record',
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            totalNum: 1,
            face_name: '',
            pro_class: '',
            recordList: [],
            studentClass: [],
            get_record_url: base_url + 'record/get',
            get_class_url: base_url + 'face/get_class',
            date_start: '',
            date_end: ''

        }
    },
    mounted() {
        this.get_class_list(),
        this.get_reocrd_list()
    },
    methods: {
      get_reocrd_list() {
        var url = this.get_record_url + '?page=' + this.currentPage;
        if (this.pro_class != '') {
            url += '&pro_class=' + this.pro_class;
        }
        if (this.date_start != '' && this.date_start != '1970-01-01') {
            var str = this.dateToString(new Date(this.date_start))
            url += '&create_time=' + str;
        }
        if (this.date_end != '' && this.date_end != '1970-01-01') {
            var str = this.dateToString(new Date(this.date_end))
            url += '&end_time=' + str;
        }
        if (new Date(this.date_start).getTime() > new Date(this.date_end).getTime()) {
          this.errorMsg("开始时间不能大于结束时间");
          return
        }
        axios.get(url)
        .then(response => {
            var res = response.data;
            if (res.code != 0) {
                this.errorMsg(response.data.msg);
                return;
            }
            this.recordList = res.data.data;
            for (var i = 0; i < this.recordList.length; i ++) {
              if (this.recordList[i].unchecked.length == 0) {
                this.recordList[i].unchecked.push('无')
              }
            }
            this.totalNum = res.data.total;
        })
        .catch(error => {
            console.log(error)
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
      dateToString(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString();
        var day = (date.getDate()).toString();
        if (month.length == 1) {
          month = '0' + month;
        }
        if (day.length == 1) {
          day = '0' + day;
        }
        var datetime = year + '-' + month + '-' + day;
        return datetime;
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
  .date_start, .date_end, .stu_class {
    width: 300px;
    margin-right: 5px;
  }
  .search {
      margin-left: 5px;
      width: 95px;
  }
  .block {
    margin: auto;
    width: 40%;
    margin-top: 10px;
  }

</style>