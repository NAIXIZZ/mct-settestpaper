//知识点、例题
<template>
  <div>
    <div class="kno_top">
      <i class="el-icon-back" @click="back" style="width: 100px"></i>
      <div class="kno_con">
        <p style="font-weight: bold">询问</p>
        <p>患者基本病情、前期治疗情况、检查数据、诊断结果、患者诉求等</p>
      </div>
      <el-select v-model="value" multiple placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="kno_ques">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="一 | 听力" name="1">
          <div></div>
        </el-collapse-item>
        <el-collapse-item title="二 | 阅读" name="2"> </el-collapse-item>
        <el-collapse-item title="三 | 写作" name="3"> </el-collapse-item>
      </el-collapse>
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
      options: [
        {
          value: "听力",
          label: "听力",
        },
        {
          value: "阅读",
          label: "阅读",
        },
        {
          value: "写作",
          label: "写作",
        },
      ],
      value: [],
      activeNames: ["1", "2", "3"],
    };
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
  created() {},
  mounted() {},
};
</script>
<style>
.kno_top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 40px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.kno_con {
  width: 400px;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  background-color: white;
  text-align: left;
  padding: 10px;
  margin-right: 10px;
}
.kno_ques {
  padding: 0 30px;
}
</style>