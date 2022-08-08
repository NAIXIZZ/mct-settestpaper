<template>
  <div>
    <el-row>
      <heads></heads>
    </el-row>
    <el-row class="button">
      <el-col
        :span="2"
        style="margin-left:1500px"
      >
        <el-button type="success">导出表格数据</el-button>
      </el-col>
      <el-col :span="1">
        <el-button @click="returnHome">返回</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-card class="box-card">
        <el-row class="title">
          <span>已做人数：{{ did_num }}</span>
        </el-row>
        <el-row class="title">
          <span>各等级分布人数</span>
        </el-row>
        <el-row class="title">
          <span>各大题得分情况</span>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import Heads from '@/components/heads.vue';
export default {
  name: '',
  components: {
    Heads
  },
  props: {},
  data () {
    return {
      did_num: "",
      activeName: 'paperAnalysis'
    };
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    },
    returnHome () {
      this.$router.go(-1)
    },
    getData () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let released_paper = new BaaS.TableObject("released_paper")
      let query = new BaaS.Query()
      query.compare('id', '=', this.GLOBAL.PAPER_ANALYSIS_ID)
      released_paper.setQuery(query).select(['did_num']).find().then(res => {
        this.did_num = res.data.objects[0].did_num
      }, err => {
        console.log(err)
      })
    }
  },
};
</script>
<style scoped>
.button {
  padding-top: 20px;
}
.title {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  margin-right: 85%;
}
.box-card {
  width: 95%;
  margin-left: 2%;
  margin-top: 1%;
}
</style>