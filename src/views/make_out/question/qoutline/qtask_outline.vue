//任务大纲
<template>
  <div class="qoutline">
    <h1>任务大纲</h1>
    <el-collapse>
      <el-collapse-item :title="t.title" v-for="t in task" :key="t.id">
        <div class="task_content" v-for="tasks in t.content" :key="tasks">
          {{ tasks }}
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      //   activeNames: ["1"],
      task: {},
    };
  },
  methods: {
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let Task = new BaaS.TableObject("task_outline");
      Task.find().then(
        (res) => {
          console.log(res);
          this.task = res.data.objects;
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style>
.task_content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 25px;
}
</style>