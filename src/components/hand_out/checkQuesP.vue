//查看题目/试卷
<template>
  <div class="checkQuesP">
    <div class="checkQP_title">
      <p>{{ showName }}</p>
      <el-button size="small" @click="back">返回</el-button>
      <!-- <i class="el-icon-back" @click="back"></i> -->
    </div>
    <el-tabs v-model="active_check">
      <el-tab-pane label="题目" name="first"
        ><checkQues></checkQues
      ></el-tab-pane>
      <el-tab-pane label="试卷" name="second"
        ><checkPaper></checkPaper
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import checkQues from "@/views/hand_out/material/checkQues.vue";
import checkPaper from "@/views/hand_out/material/checkPaper.vue";
export default {
  name: "",
  components: {
    checkQues,
    checkPaper,
  },
  props: {},
  data() {
    return {
      active_check: "first",
    };
  },
  watch: {},
  computed: {
    showName() {
      return Cookie.get("material_title");
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
.checkQuesP {
  padding: 20px;
}
.checkQP_title {
  display: flex;
  justify-content: space-between;
}
.checkQP_title p {
  font-size: 20px;
  font-weight: 500;
}
</style>