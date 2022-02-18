//患者-护士
<template>
  <div>
    <div class="top">
      <i class="el-icon-back" @click="back"></i>
      <h1 class="title">患者-护士</h1>
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
                <h2>交流</h2>
                <p>就医前、就医中</p>
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
                <h2>咨询</h2>
                <p>就医咨询、护理咨询、后期咨询等</p>
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
                <h2>指令</h2>
                <p>指引、用药、关键时间节点、解答疑问、办理出入院手续等</p>
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