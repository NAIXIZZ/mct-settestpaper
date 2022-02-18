//资料
<template>
  <div class="material">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="文本描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="文本标题" prop="title"> </el-table-column>
      <el-table-column label="文本类别" prop="type" width="180px"> </el-table-column>
      <el-table-column label="文本ID" prop="id" width="180px"> </el-table-column>
      <el-table-column label="模型支持" prop="model" width="180px"> </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="small">查看题目/试卷</el-button>
        <el-button type="primary" plain size="small">出题</el-button>
        <el-button type="primary" plain size="small">出卷</el-button>
        <el-button type="primary" plain size="small">查看</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      tableData: [
        {
          title: "脑梗死患者电子病历标注",
          type: "电子病历",
          id: "00001",
          model: "AAAAA",
          desc: "xxxxxxx",
        },
        {
          title: "新型冠状病毒诊疗分析",
          type: "诊疗分析",
          id: "00002",
          model: "BBBBB",
          desc: "xxxxxxx",
        },
        {
          title: "脑梗死",
          type: "脑梗死",
          id: "00003",
          model: "CCCCC",
          desc: "xxxxxxx",
        },
      ],
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
/* .material .el-table{
    text-align: center;
} */
</style>