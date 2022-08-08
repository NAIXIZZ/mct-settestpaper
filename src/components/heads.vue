<template>
  <div class="heads">
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-demo"
      mode="horizontal"
      router
      @select="handleSelect"
    >
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/outline">大纲</el-menu-item>
      <el-menu-item index="/kg">知识图谱</el-menu-item>
      <el-menu-item index="/statistic_analysis">统计分析</el-menu-item>
      <el-menu-item index="/makeout">MCT出卷</el-menu-item>
      <el-menu-item index="/visitor" @click.native="logout()">退出</el-menu-item>
    </el-menu>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
export default {
  name: '',
  components: {
  },
  Outlineops: {},
  data () {
    return {
      activeIndex: '',
    };
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath);
    },
    logout () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      BaaS.auth.logout().then(res => {
        console.log(res)
        // success
      }, err => {
        // err
        console.log(err)
      })
    }
  },
};
</script>
<style>
.heads .el-menu-demo {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.heads .el-menu-item {
  width: 100%;
  font-size: 16px;
}
</style>