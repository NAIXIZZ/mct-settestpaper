<template>
  <div class="visitorHead">
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-demo"
      mode="horizontal"
      router
      @select="handleSelect"
    >
      <el-menu-item index="/visitor">首页</el-menu-item>
      <el-menu-item index="/visitor_outline">大纲</el-menu-item>
      <el-menu-item index="/visitor_kg">知识图谱</el-menu-item>
      <el-menu-item index="/login">登录注册</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
    };
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath);
    }
  },
};
</script>
<style>
.visitorHead .el-menu-demo {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.visitorHead .el-menu-item {
  width: 100%;
  font-size: 16px;
}
</style>