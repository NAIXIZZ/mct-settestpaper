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
                src="doc_doc.jpg"
                class="image"
              />
              <div style="padding: 14px">
                <span>医生-医生</span>
              </div>
            </el-card>
          </div>
          <div @click="pushto('doc_nur')">
            <el-card :body-style="{ padding: '0px' }">
              <img
                src="doc_nur.jpg"
                class="image"
              />
              <div style="padding: 14px">
                <span>医生-护士</span>
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
                src="doc_pat.jpg"
                class="image"
              />
              <div style="padding: 14px">
                <span>医生-患者</span>
              </div>
            </el-card>
          </div>
          <div @click="pushto('pat_nur')">
            <el-card :body-style="{ padding: '0px' }">
              <img
                src="pat_nur.jpg"
                class="image"
              />
              <div style="padding: 14px">
                <span>患者-护士</span>
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
        Cookies.set('first_title','医生-医生')
      } else if (val == "doc_nur") {
        Cookies.set('first_title','医生-护士')
      } else if (val == "doc_pat") {
        Cookies.set('first_title','医生-患者')
      } else {
        Cookies.set('first_title','患者-护士')
      }
      this.$router.push("/outline_second");
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