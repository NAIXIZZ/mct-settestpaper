//医学专业词汇大纲
<template>
  <div>
    <div class="medical_top">
      <h1>医学专业词汇大纲</h1>
      <div>
        <el-tooltip class="item" effect="dark" placement="right">
          <!-- <el-button type="primary" circle><i class="el-icon-info"></i></el-button> -->
          <div slot="content">
            词性标注原<br /><hr/>1.疾病名称统一标注为名词；疾病症状类词语以《现代汉语词典（第7版）》为准。
            <br />2.xxxx
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
        <!-- <i class="el-icon-info" slot="reference"></i> -->
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="word" label="词语" width="180"> </el-table-column>
      <el-table-column prop="speech" label="词性"> </el-table-column>
      <el-table-column prop="spell" label="拼音"> </el-table-column>
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
          word: "阿米巴病",
          speech: "名",
          spell: "āmǐbābìng",
        },
        {
          word: "阿司匹林",
          speech: "名",
          spell: "āsīpǐlín",
        },
        {
          word: "癌变",
          speech: "动",
          spell: "áibiàn",
        },
      ],
    };
  },
  methods: {},
};
</script>
<style>
.medical_top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.el-icon-info {
  color: #3eaeff;
}
</style>