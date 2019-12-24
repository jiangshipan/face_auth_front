<template>
    <div class="student">
        <el-table :data="class_list" style="width: 100%" border>
            <el-table-column label="序号" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pro_class" label="专业班级" align="center"></el-table-column>
            <el-table-column prop="total" label="班级人数" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 0" class="start_check" type="primary" @click="doOption('确认开始签到', scope.row.pro_class, 1)">开始签到</el-button>
                    <el-button v-if="scope.row.status == 1" class="start_check" type="danger" @click="doOption('确认结束签到', scope.row.pro_class, 2)">结束签到</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from 'axios'
import {base_url} from "../assets/js/base";
axios.defaults.withCredentials = true;


export default {
    name: 'ManageClass',
    data() {
        return {
            page: 1,
            pageSize: 10,
            class_list: [],
            get_class_url: base_url + 'face/get_class',
            start_check_url: base_url + 'face/start',
            end_check_url: base_url + 'face/end'
        }
    },
    mounted() {
        this.get_class_list()
    },
    methods: { 
      start_check(stu_class) {
          axios.get(this.start_check_url + '?stu_class=' + stu_class)
          .then(response => {
            var res = response.data;
            if (res.code == 0) {
                this.successMsg(stu_class + '已开始签到');
                this.class_list.length = 0;
                this.get_class_list();
            } else {
                this.errorMsg(res.msg);
            }
          })
          .catch(error => {
            this.errorMsg('网络错误, 暂时不能访问')
          })
      },
      end_check(stu_class) {
        axios.get(this.end_check_url + '?stu_class=' + stu_class)
        .then(response => {
            var res = response.data;
            if (res.code == 0) {
                this.successMsg(stu_class + '已结束签到');
                this.class_list.length = 0;
                this.get_class_list();
            } else {
                this.errorMsg(res.msg);
            }
        })
        .catch(error => {
            this.errorMsg('网络错误, 暂时不能访问')
        })
      },
      get_class_list() {
        axios.get(this.get_class_url)
        .then(response => {
            var res = response.data.data;
            var checked = res.checked;
            var unchecked = res.unchecked;
            if (response.data.code != 0) {
                this.errorMsg(response.data.msg);
                return;
            }
            for (var i = 0; i < checked.length; i ++) {  
                this.class_list.push({
                    'pro_class': checked[i],
                    'status': 1
                });
            }
            for (var i = 0; i < unchecked.length; i ++) {
                this.class_list.push({
                    'pro_class': unchecked[i],
                    'status': 0
                });
            }
            const map = new Map(Object.entries(res.sum))
            for (var i = 0; i < this.class_list.length; i ++) {
                this.class_list[i].total = map.get(this.class_list[i].pro_class);
            }
        })
        .catch(error => {
            this.errorMsg('网络错误, 暂时不能访问')
        })
      },
      doOption(msg, pro_class, type) {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (type == 1) {
              // 开始签到
              this.start_check(pro_class);
          } else {
              this.end_check(pro_class);
          }
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

</style>