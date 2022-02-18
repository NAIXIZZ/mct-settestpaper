//医生-护士
<template>
  <div>
    <div class="top">
      <i class="el-icon-back" @click="back"></i>
      <h1 class="title">医生-护士</h1>
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
                <p>
                  患者情况沟通：手术情况、术后恢复情况、用药情况、排尿排便情况、紧急状态病情全面描述、鼻饲管及尿道管等护理情况、卧床患者褥疮情况等
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
                <h2>指令</h2>
                <p>
                  检查事项、治疗步骤、治疗时间及特殊情况、护理注意事项、所需器械药物等
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