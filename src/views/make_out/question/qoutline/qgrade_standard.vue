//等级标准
<template>
  <div class="qoutline">
    <h1>等级标准</h1>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="一 | 医学汉语能力总体描述" name="1">
        <el-table :data="grade_one" border style="width: 100%">
          <el-table-column prop="level" label="等级划分" width="180">
          </el-table-column>
          <el-table-column prop="description" label="总体描述">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="二 | 医学汉语口头理解能力（听）" name="2">
        <el-table :data="grade_two" border style="width: 100%">
          <el-table-column prop="level" label="等级划分" width="180">
          </el-table-column>
          <el-table-column prop="description" label="总体描述">
          </el-table-column>
          <el-table-column prop="task_examples" label="任务举例">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="三 | 医学汉语口头理解能力（说）" name="3">
        <el-table :data="grade_three" border style="width: 100%">
          <el-table-column prop="level" label="等级划分" width="180">
          </el-table-column>
          <el-table-column prop="description" label="总体描述">
          </el-table-column>
          <el-table-column prop="task_examples" label="任务举例">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="四 | 医学汉语口头理解能力（读）" name="4">
        <el-table :data="grade_four" border style="width: 100%">
          <el-table-column prop="level" label="等级划分" width="180">
          </el-table-column>
          <el-table-column prop="description" label="总体描述">
          </el-table-column>
          <el-table-column prop="task_examples" label="任务举例">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="五 | 医学汉语口头理解能力（写）" name="5">
        <el-table :data="grade_five" border style="width: 100%">
          <el-table-column prop="level" label="等级划分" width="180">
          </el-table-column>
          <el-table-column prop="description" label="总体描述">
          </el-table-column>
          <el-table-column prop="task_examples" label="任务举例">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
export default {
  name: "grade_standard",
  components: {},
  props: {},
  data() {
    return {
      activeNames: ["1"],
      grade_one: [],
      grade_two: [],
      grade_three: [],
      grade_four: [],
      grade_five: [],
    };
  },
  methods: {
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var one = new BaaS.Query();
      var two = new BaaS.Query();
      var three = new BaaS.Query();
      var four = new BaaS.Query();
      var five = new BaaS.Query();
      one.contains("title", "医学汉语能力总体描述");
      two.contains("title", "医学汉语口头理解能力（听）");
      three.contains("title", "医学汉语口头理解能力（说）");
      four.contains("title", "医学汉语口头理解能力（读）");
      five.contains("title", "医学汉语口头理解能力（写）");
      let Grade = new BaaS.TableObject("grade_standard");
      Grade.setQuery(one)
        .find()
        .then(
          (res) => {
            console.log(res);
            this.grade_one = res.data.objects;
          },
          (err) => {
            console.log(err);
          }
        );
      Grade.setQuery(two)
        .find()
        .then(
          (res) => {
            console.log(res);
            this.grade_two = res.data.objects;
          },
          (err) => {
            console.log(err);
          }
        );
      Grade.setQuery(three)
        .find()
        .then(
          (res) => {
            console.log(res);
            this.grade_three = res.data.objects;
          },
          (err) => {
            console.log(err);
          }
        );
      Grade.setQuery(four)
        .find()
        .then(
          (res) => {
            console.log(res);
            this.grade_four = res.data.objects;
          },
          (err) => {
            console.log(err);
          }
        );
      Grade.setQuery(five)
        .find()
        .then(
          (res) => {
            console.log(res);
            this.grade_five = res.data.objects;
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
.el-collapse-item__header {
  height: 51px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  padding-left: 20px;
}
.el-collapse-item__wrap {
  padding: 0 20px;
}
.qoutline {
  padding: 10px 20px;
}
.qgrade_head {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>