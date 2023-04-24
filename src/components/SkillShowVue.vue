<template>
  <!-- 技能总和 -->
    <div style="margin-top: 20px">
        <el-card class="box-card">
            <div v-for="item in FatherMsg" :key="item" class="text item" style="width:100%;">
                {{ 'Lv:'+item.level+ ' '+item.name}}
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    props:['FatherMsg'],
}
</script>

<style>

</style>