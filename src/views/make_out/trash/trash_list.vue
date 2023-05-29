<template>
  <div class="handout trash">
    <h1>回收站</h1>
    <div class="back">
      <el-button @click="back">返回</el-button>
    </div>
    <el-tabs v-model="active_out">
      <el-tab-pane label="题干资料" name="first"
        ><contents></contents
      ></el-tab-pane>
      <el-tab-pane label="题库" name="second"
        ><questions></questions
      ></el-tab-pane>
      <el-tab-pane label="试卷" name="third"><paper></paper></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import Cookie from "js-cookie";
// import Cookies from "js-cookie";
import contents from "@/views/make_out/trash/contents";
import questions from "@/views/make_out/trash/questions";
import paper from "@/views/make_out/trash/paper";
export default {
  name: "",
  components: {
    contents,
    questions,
    paper,
  },
  props: {},
  data() {
    return {
      active_out: "first",
    };
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
      // Cookies.set("trash", "");
      sessionStorage.setItem("trash", "");
    },
    init() {
      // let current = Cookie.get("trash");
      let current = sessionStorage.getItem("trash");
      if (current == "content") {
        this.active_out = "first";
        // Cookies.set("trash", "");
        sessionStorage.setItem("trash", "");
      } else if (current == "questions") {
        this.active_out = "second";
        // Cookies.set("trash", "");
        sessionStorage.setItem("trash", "");
      } else if (current == "paper") {
        this.active_out = "third";
        // Cookies.set("trash", "");
        sessionStorage.setItem("trash", "");
      }
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.trash {
  padding: 20px;
}
.trash .back {
  display: flex;
  justify-content: flex-end;
}
.trash .el-tabs {
  padding: 0px;
}
</style>