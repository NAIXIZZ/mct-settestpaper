//侧边栏
<template>
  <div class="outer">
    <Heads></Heads>
    <el-tabs v-model="active_outline" tab-position="left" class="nav">
      <el-tab-pane label="等级标准" name="first"
        ><grade_standard></grade_standard
      ></el-tab-pane>
      <el-tab-pane label="话题大纲" name="second"
        ><topic_outline></topic_outline
      ></el-tab-pane>
      <el-tab-pane label="任务大纲" name="third"
        ><task_outline></task_outline
      ></el-tab-pane>
      <el-tab-pane label="医学专业词汇大纲" name="forth"
        ><medical_vocabulary></medical_vocabulary
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Heads from '@/components/heads'
// import Cookies from "js-cookie";
// import Cookie from "js-cookie";
import grade_standard from "@/views/outline/grade_standard.vue";
import topic_outline from "./topic_outline.vue";
import task_outline from "@/views/outline/task_outline.vue";
import medical_vocabulary from "@/views/outline/medical_vocabulary.vue";
export default {
  name: "",
  components: {
    grade_standard,
    topic_outline,
    task_outline,
    medical_vocabulary,
    Heads
  },
  props: {},
  data() {
    return {
      active_outline: "first",
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      // let current = Cookie.get("currentTab");
      let current = sessionStorage.getItem("currentTab");
      if (current == "second") {
        this.active_outline = "second";
        // Cookies.set("currentTab", "");
        sessionStorage.setItem("currentTab", "");
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
.outer {
  height: 100%;
}
.outer .el-tabs__nav {
  height: 100vh;
}

.outer .el-tabs--left .el-tabs__header.is-left {
  background-color: #545c64;
}
.outer .el-tabs__item.is-active {
  color: #ffd04b !important;
  background-color: #888787;
}
.outer .el-tabs__active-bar {
  background-color: #888787 !important;
}
.outer .el-tabs__item {
  color: white !important;
}
.outer .el-tabs__item:hover {
  color: #ffd04b !important;
}
.outer h1 {
  margin-bottom: 10px;
}
</style>