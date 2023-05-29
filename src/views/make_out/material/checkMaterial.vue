//查看资料图谱
<template>
  <div class="checkMaterial">
    <div class="material_top">
      <div class="material_detail">文本ID：{{ showDetail }}</div>
      <el-button size="small" @click="back">返回</el-button>
    </div>
    <div class="material_content">
      <div class="content_detail"></div>
      <div class="content_atlas"></div>
    </div>
  </div>
</template>

<script>
// import Cookie from "js-cookie";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {
    showDetail() {
      // return Cookie.get("material_id");
      return sessionStorage.getItem("material_id");
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
  created() {},
  mounted() {},
};
</script>
<style>
.checkMaterial {
  padding: 20px;
}
.material_top {
  display: flex;
  justify-content: space-between;
}
.material_detail {
  display: flex;
}
.material_content {
  display: flex;
}
</style>