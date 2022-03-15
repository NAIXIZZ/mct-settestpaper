//资料
<template>
  <div class="material">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="文本描述">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="文本标题" prop="title"> </el-table-column>
      <el-table-column label="文本类别" prop="type"> </el-table-column>
      <el-table-column label="文本ID" prop="id"> </el-table-column>
      <el-table-column label="模型支持" prop="model_support"> </el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="checkQuesP(scope.row.title)"
            >查看题目/试卷</el-button
          >
          <el-button type="primary" plain @click="handleSet(scope.row.id)"
            >出题</el-button
          >
          <el-button type="primary" plain>出卷</el-button>
          <el-button type="primary" plain @click="checkMaterial(scope.row.id)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="自动出题" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="题目数量：" :label-width="formLabelWidth">
          <el-input v-model="form.quesnum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目类型：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择题型"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setQues">保存到题库</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
// import Cookie from "js-cookie";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        quesnum: "",
      },
      formLabelWidth: "120px",
      ques_select: [
        {
          value: "听力题",
          label: "听力题",
          children: [
            {
              value: "听句子，判断对错",
              label: "听句子，判断对错",
            },
            {
              value: "听短对话，选择正确答案",
              label: "听短对话，选择正确答案",
            },
            {
              value: "听长对话，选择正确答案",
              label: "听长对话，选择正确答案",
            },
            {
              value: "听短文，选择正确答案",
              label: "听短文，选择正确答案",
            },
          ],
        },
        {
          value: "阅读题",
          label: "阅读题",
          children: [
            {
              value: "选择正确词语填空",
              label: "选择正确词语填空",
            },
            {
              value: "阅读语段，选择与语段意思一致的一项",
              label: "阅读语段，选择与语段意思一致的一项",
            },
            {
              value: "阅读材料，选择正确答案",
              label: "阅读材料，选择正确答案",
            },
            {
              value: "阅读短文，选出正确答案",
              label: "阅读短文，选出正确答案",
            },
          ],
        },
        {
          value: "写作题",
          label: "写作题",
        },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let Material = new BaaS.TableObject("material");
      Material.find().then(
        (res) => {
          console.log(res);
          this.tableData = res.data.objects;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    checkQuesP(val) {
      Cookies.set("material_title", val);
      this.$router.push("checkQuesP");
    },
    handleSet(val) {
      Cookies.set("material_id", val);
      this.dialogFormVisible = true;
    },
    setQues() {
      this.dialogFormVisible = false;
    },
    checkMaterial(val) {
      Cookies.set("material_id", val);
      this.$router.push("checkMaterial");
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.material .demo-table-expand {
  font-size: 0;
}
.material .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.material .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  margin-left: 57px;
}
.material .el-input {
  width: 300px;
}
</style>