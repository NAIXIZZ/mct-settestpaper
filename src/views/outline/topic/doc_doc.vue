//医生-医生
<template>
  <div>
    <div class="top">
      <i class="el-icon-back" @click="back"></i>
      <h1 class="title">医生-医生</h1>
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="input"
        clearable
        class="input"
      >
      </el-input>
    </div>

    <div class="topic">
      <el-row>
        <el-col
          :span="10"
          v-for="(o, index) in 1"
          :key="o"
          :offset="index > 0 ? 4 : 0"
        >
          <div @click="pushto()">
            <el-card :body-style="{ padding: '0px' }" class="card">
              <!-- <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F04%2F86%2F5900eb6ec9c05_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647744585&t=10c30d93281603755b46d04b6a763544"
                class="image"
              /> -->
              <div class="el-card__content">
                <h2>询问</h2>
                <p>
                  患者基本病情、前期治疗情况、检查数据、诊断结果、患者诉求等
                </p>
                <!-- <span>医生-医生</span> -->
                <!-- <div class="bottom clearfix">
                <el-button type="text" class="button">操作按钮</el-button>
              </div> -->
              </div>
            </el-card>
          </div>
          <div @click="pushto()">
            <el-card :body-style="{ padding: '0px' }" class="card">
              <!-- <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F04%2F86%2F5900eb6ec9c05_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647744585&t=10c30d93281603755b46d04b6a763544"
                class="image"
              /> -->
              <div class="el-card__content">
                <h2>指令</h2>
                <p>操作指令、治疗指令、协助指令等</p>
                <!-- <span>医生-医生</span> -->
                <!-- <div class="bottom clearfix">
                <el-button type="text" class="button">操作按钮</el-button>
              </div> -->
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="10"
          v-for="(o, index) in 1"
          :key="o"
          :offset="index > 0 ? 4 : 0"
        >
          <div @click="pushto()">
            <el-card :body-style="{ padding: '0px' }" class="card">
              <!-- <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F04%2F86%2F5900eb6ec9c05_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647744585&t=10c30d93281603755b46d04b6a763544"
                class="image"
              /> -->
              <div class="el-card__content">
                <h2>交流</h2>
                <p>
                  病程沟通、病因分析、诊断与鉴别诊断、用药情况、用药后可能出现的不良反应、治疗效果、治疗方案等
                </p>
                <!-- <span>医生-医生</span> -->
                <!-- <div class="bottom clearfix">
                <el-button type="text" class="button">操作按钮</el-button>
              </div> -->
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
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
      input: "",
    };
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    pushto() {
      this.$router.push("/knowledge");
    },
  },
  created() {},
  mounted() {},
};
</script>
<style>
.top {
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.el-icon-back {
  width: 200px;
  font-size: 25px;
}
.title {
  width: 200px;
}
.input {
  width: 200px !important;
}
.card {
  height: 200px;
  width: 350px;
  text-align: left;
}
.card .el-card__body {
  height: 100%;
}
.el-card__content {
  padding: 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>