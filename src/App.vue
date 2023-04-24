<template>
  <el-row :gutter="20">
      <el-col :span="4"><div class="grid-content ep-bg-purple" style="text-align:center;"/><head-vue /></el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />123123</el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />123123</el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />123123</el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />123123</el-col>
      <el-col :span="4"><div class="grid-content ep-bg-purple" />213131</el-col>
 </el-row>
  
</template>

<script>
// 这里导入其它文件  组件，工具，json文件，js插件，
//import  组件名称 from ' 组件路径'
// import { defineComponent } from '@vue/composition-api'
import HeadVue from './components/HeadVue.vue'

  export default {
      //import 引入的组件需要注入到对象中才能使用
    components:{HeadVue},
    }
</script>

<style>

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 10px;
}


</style>
