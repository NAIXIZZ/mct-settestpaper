//菜单栏
<template>
  <div class="handout">
    <Heads></Heads>
    <el-tabs v-model="active_out">
      <el-tab-pane label="试卷" name="first"
        ><paper_list></paper_list
      ></el-tab-pane>
      <el-tab-pane label="题库" name="second"
        ><ques_list></ques_list
      ></el-tab-pane>
      <el-tab-pane label="题干资料" name="third"
        ><material_list></material_list
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Heads from "@/components/heads";
import material_list from "@/views/make_out/material/material_list";
import ques_list from "@/views/make_out/question/ques_list";
import paper_list from "@/views/make_out/paper/paper_list";
import Cookie from "js-cookie";
import Cookies from "js-cookie";

export default {
  name: "",
  components: {
    material_list,
    ques_list,
    paper_list,
    Heads,
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
    init() {
      let current = Cookie.get("make_out");
      if (current == "second") {
        this.active_out = "second";
        Cookies.set("make_out", "");
      } else if (current == "third") {
        this.active_out = "third";
        Cookies.set("make_out", "");
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
.handout .el-tabs {
  padding: 20px;
}
</style>