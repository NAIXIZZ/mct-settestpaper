//医生-患者
<template>
  <div>
    <div class="top">
      <i class="el-icon-back" @click="back"></i>
      <h1 class="title">医生-患者</h1>
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
                <h2>问诊</h2>
                <p>一般信息问询、普通病情问询、急诊患者问询</p>
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
                <h2>治疗</h2>
                <p>
                  日常护理、药物治疗、住院治疗、手术治疗、治疗方式、治疗方案
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
                <h2>诊断</h2>
                <p>
                  临床表现、诊断结果、常规检查、实验室检查、影像学检查、内窥镜检查、病理学检查
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
                <h2>主诉</h2>
                <p>
                  患病时间、症状描述（头痛、恶心、晕厥、发热、抽搐等病患常述症状）、症状加重时间或持续时间等
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
</style>