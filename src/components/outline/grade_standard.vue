//等级标准
<template>
  <div>
    <h1>等级标准</h1>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="一 | 医学汉语能力总体描述" name="1">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="grade" label="等级划分" width="180"> </el-table-column>
          <el-table-column prop="des" label="总体描述"> </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="二 | 医学汉语口头理解能力（听）" name="2">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="grade" label="等级划分" width="180"> </el-table-column>
          <el-table-column prop="des" label="总体描述"> </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="三 | 医学汉语口头理解能力（说）" name="3">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="grade" label="等级划分" width="180"> </el-table-column>
          <el-table-column prop="des" label="总体描述"> </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="四 | 医学汉语口头理解能力（读）" name="4">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="grade" label="等级划分" width="180"> </el-table-column>
          <el-table-column prop="des" label="总体描述"> </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="五 | 医学汉语口头理解能力（写）" name="5">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="grade" label="等级划分" width="180"> </el-table-column>
          <el-table-column prop="des" label="总体描述"> </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "grade_standard",
  components: {},
  props: {},
  data() {
    return {
      activeNames: ["1"],
      tableData: [
        {
          grade: "一级",
          des: "能够大体理解与医院日常交际场景相关的、基本的语言材料。能够就病情进行简单的交流与沟通，能对疾病的基本情况进行简单描述。汉语水平能够基本满足医院实习的要求。医学专业词汇量为400左右。",
        },
        {
          grade: "二级",
          des: "能够基本理解与医院日常交际场景相关的、较为具体的语言材料。能够就病情进行较为复杂的交流与沟通，能对疾病的主要情况进行较为具体的描述。汉语水平能够总体满足医院实习的要求。医学专业词汇量为800左右。",
        },
        {
          grade: "三级",
          des: "能够完全理解与医院日常交际场景相关的绝大部分语言材料。能够就病情进行复杂的交流与沟通，能对疾病的整体情况进行详细描述。汉语水平能够完全满足医院实习的要求。医学专业词汇量为1500左右。",
        },
      ],
    };
  },
  methods: {

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
</style>