<template>
    <div class="student">
        <el-table :data="class_list" style="width: 100%" border>
            <el-table-column label="序号" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pro_class" label="专业班级" align="center"></el-table-column>
            <el-table-column prop="options" label="操作" align="center">
                <el-button class="start_check" type="primary">开始签到</el-button>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from 'axios'
import {base_url} from "../assets/js/base";
axios.defaults.withCredentials =true;


export default {
    name: 'ManageClass',
    data() {
        return {
            page: 1,
            pageSize: 10,
            class_list: [{
                'pro_class': '计科1606',
            }]
        }
    },
}
</script>

<style scoped>

</style>