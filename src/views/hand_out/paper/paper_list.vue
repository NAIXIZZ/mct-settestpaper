//试卷
<template>
  <div>
    <div class="paper_top">
        <el-button type="success" plain>创建试卷</el-button>
        <el-button type="success" plain>导入试卷</el-button>
        <el-button type="success" plain>导出全部</el-button>
        <el-button type="success" plain>导出选中</el-button>
    </div>
    <div class="ques_content">
      <div class="ques_num">
        <span>共</span>
        <span>份</span>
      </div>
      <div class="ques_list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" :index="indexMethod"> </el-table-column>
          <el-table-column
            prop="paper_title"
            label="题目"
          >
          </el-table-column>
          <el-table-column prop="paper_type" label="试卷类型">
          </el-table-column>
          <el-table-column prop="questions_num" label="题量" sortable>
          </el-table-column>
          <el-table-column prop="points" label="总分" sortable>
          </el-table-column>
          <el-table-column prop="created_by" label="创建者"> </el-table-column>
          <el-table-column prop="created_at" label="创建日期" sortable>
          </el-table-column>
          <el-table-column prop="released" label="发布状态">
          </el-table-column>
          <el-table-column label="操作" width="400">
            <el-button type="success" plain size="small">查看/编辑</el-button>
            <el-button type="warning" plain size="small">复制</el-button>
            <el-button type="danger" plain size="small">删除</el-button>
            <el-button type="info" plain size="small">封存</el-button>
            <el-button type="info" plain size="small">发布</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="paper_bottom">
      <el-button type="primary" icon="el-icon-delete">回收站</el-button>
    </div>
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
          paper_title: "MCT2022年1月练习题",
          paper_type: "练习",
          questions_num: "100",
          points: "300",
          created_by: "admin",
          created_at: "2021-01-01",
          released: "是"
        },
        {
          paper_title: "MCT2022年1月练习题",
          paper_type: "练习",
          questions_num: "100",
          points: "300",
          created_by: "admin",
          created_at: "2021-01-01",
          released: "是"
        },
        {
          paper_title: "MCT2022年1月练习题",
          paper_type: "练习",
          questions_num: "100",
          points: "300",
          created_by: "admin",
          created_at: "2021-01-01",
          released: "是"
        },
        {
         paper_title: "MCT2022年1月练习题",
          paper_type: "练习",
          questions_num: "100",
          points: "300",
          created_by: "admin",
          created_at: "2021-01-01",
          released: "是"
        },
        {
          paper_title: "MCT2022年1月练习题",
          paper_type: "练习",
          questions_num: "100",
          points: "300",
          created_by: "admin",
          created_at: "2021-01-01",
          released: "是"
        },
        {
          paper_title: "MCT2022年1月练习题",
          paper_type: "练习",
          questions_num: "100",
          points: "300",
          created_by: "admin",
          created_at: "2021-01-01",
          released: "是"
        },
      ],
      multipleSelection: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      indexMethod(index) {
      return index+1;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style>
/* .paper_top, .paper_bottom{
    display: flex;
    justify-content: end;
} */
</style>