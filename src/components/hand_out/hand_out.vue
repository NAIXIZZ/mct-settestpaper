//菜单栏
<template>
  <div class="handout">
    <el-tabs v-model="active_out">
      <el-tab-pane label="资料" name="first"><material_list></material_list></el-tab-pane>
      <el-tab-pane label="题库" name="second"><ques_list></ques_list></el-tab-pane>
      <el-tab-pane label="试卷" name="third"><paper_list></paper_list></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import material_list from '@/views/hand_out/material/material_list'
import ques_list from '@/views/hand_out/question/ques_list'
import paper_list from '@/views/hand_out/paper/paper_list'
import Cookie from "js-cookie";
import Cookies from "js-cookie";

export default {
  name: "",
  components: {
      material_list,
      ques_list,
      paper_list
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
      let current = Cookie.get("is_ques");
      if (current == "second") {
        this.active_out = "second";
        Cookies.set("is_ques", "");
      }
    },
  },
  created() {},
  mounted() {
    this.init()
  },
};
</script>
<style>
.handout{
    padding: 20px;
}
</style>