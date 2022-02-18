//菜单栏
<template>
  <div class="handout">
    <el-tabs v-model="active_out">
      <el-tab-pane label="资料" name="first"><material_list></material_list></el-tab-pane>
      <el-tab-pane label="题库" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="试卷" name="third">角色管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import material_list from '@/components/hand_out/material_list'
export default {
  name: "",
  components: {
      material_list
  },
  props: {},
  data() {
    return {
      active_out: "first",
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style>
.handout{
    padding: 20px;
}
</style>