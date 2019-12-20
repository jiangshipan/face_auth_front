<template>
    <div class="student">
        <div class="input-container">
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
            <el-table-column prop="create_time" label="生成时间" align="center"></el-table-column>
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
            studentClass: [
                '计科1606', '计科1607', '软件1601'
            ],
            get_record_url: base_url + 'record/get'
        }
    },
    mounted() {
        this.get_reocrd_list()
    },
    methods: {
      get_reocrd_list() {
        var url = this.get_record_url + '?page=' + this.currentPage;
        if (this.pro_class != '') {
            url += '&pro_class=' + this.pro_class;
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
    width: 300px;
    margin: 50px 0 10px 0;
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