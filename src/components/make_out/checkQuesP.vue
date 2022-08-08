//查看题目/试卷
<template>
  <div class="checkQuesP">
    <Heads></Heads>
    <div class="checkQP_title">
      <el-tooltip
        effect="dark"
        :content="content"
        placement="bottom"
        v-show="content != ''"
      >
        <p>{{ content }}</p>
      </el-tooltip>
      <el-image
        style="width: 100px; height: 100px"
        :src="file"
        :preview-src-list="srcList"
        v-show="file != null && file.search('.png') != -1"
      >
      </el-image>
      <audio
        :src="file"
        controls="controls"
        v-show="file != null && file.search('.mp3') != -1"
      ></audio>
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
import Heads from '@/components/heads'
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import checkQues from "@/views/make_out/material/checkQues.vue";
import checkPaper from "@/views/make_out/material/checkPaper.vue";
export default {
  name: "",
  components: {
    checkQues,
    checkPaper,
    Heads
  },
  props: {},
  data() {
    return {
      active_check: "first",
      file: "",
      content: "",
      srcList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
      Cookies.set("question_content","");
      Cookies.set("question_file","");
      Cookies.set("material_id","");
    },
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var query = new BaaS.Query();
      query.compare("id", "=", Cookie.get("material_id"));
      let Material = new BaaS.TableObject("question_content");
      Material.setQuery(query)
        .find()
        .then(
          (res) => {
            console.log(res);
            if (res.data.objects[0].content == null) {
              this.file = res.data.objects[0].file_url.path;
              console.log(this.file)
              this.srcList.push(this.file);
              Cookies.set("question_file", this.file);
            } else {
              this.content = res.data.objects[0].content;
              Cookies.set("question_content", this.content);
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.checkQuesP .checkQP_title,.checkQuesP .el-tabs {
  padding: 0 20px;
}
.checkQP_title {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.checkQP_title p {
  font-size: 20px;
  font-weight: 500;
  overflow: hidden;
  width: 60%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>