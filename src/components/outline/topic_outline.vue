//话题大纲
<template>
  <div>
    <h1>话题大纲</h1>
    <div class="topic">
      <el-row>
        <el-col
          :span="20"
          v-for="(o, index) in 1"
          :key="o"
          :offset="index > 0 ? 4 : 0"
        >
          <div @click="pushto('doc_doc')">
            <el-card :body-style="{ padding: '0px' }">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F04%2F86%2F5900eb6ec9c05_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647744585&t=10c30d93281603755b46d04b6a763544"
                class="image"
              />
              <div style="padding: 14px">
                <span>医生-医生</span>
                <!-- <div class="bottom clearfix">
                <el-button type="text" class="button">操作按钮</el-button>
              </div> -->
              </div>
            </el-card>
          </div>
          <div @click="pushto('doc_nur')">
            <el-card :body-style="{ padding: '0px' }">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F04%2F87%2F5900eb92a5608_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647744908&t=03d3c8fb4a51dc0849d62be414b0fb92"
                class="image"
              />
              <div style="padding: 14px">
                <span>医生-护士</span>
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
          :span="20"
          v-for="(o, index) in 1"
          :key="o"
          :offset="index > 0 ? 4 : 0"
        >
          <div @click="pushto('doc_pat')">
            <el-card :body-style="{ padding: '0px' }">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.sccnn.com%2Fbimg%2F338%2F54426.jpg&refer=http%3A%2F%2Fimg.sccnn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647744682&t=2a829ae8d8420b5dcdbe5dd5f6b1d3b8"
                class="image"
              />
              <div style="padding: 14px">
                <span>医生-患者</span>
                <!-- <div class="bottom clearfix">
                <el-button type="text" class="button">操作按钮</el-button>
              </div> -->
              </div>
            </el-card>
          </div>
          <div @click="pushto('pat_nur')">
            <el-card :body-style="{ padding: '0px' }">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqqpublic.qpic.cn%2Fqq_public%2F0%2F0-3099474540-14D423C8D06AC2DF6E2746DBBDA02946%2F0%3Ffmt%3Djpg%26size%3D45%26h%3D671%26w%3D900%26ppv%3D1.jpg&refer=http%3A%2F%2Fqqpublic.qpic.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647744744&t=46109442d48b3cd26f6a4f691503b51f"
                class="image"
              />
              <div style="padding: 14px">
                <span>患者-护士</span>
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
import Cookies from "js-cookie";

export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    pushto(val) {
      let currentTab = "second";
      Cookies.set("currentTab", currentTab);
      if (val == "doc_doc") {
        this.$router.push("/doc_doc");
      } else if (val == "doc_nur") {
        this.$router.push("/doc_nur");
      } else if (val == "doc_pat") {
        this.$router.push("/doc_pat");
      } else {
        this.$router.push("/pat_nur");
      }
    },
  },

  mounted() {},
};
</script>
<style>
.topic {
  display: flex;
  justify-content: space-evenly;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 300px;
  height: 250px;
  display: block;
}
.el-card {
  margin-bottom: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>