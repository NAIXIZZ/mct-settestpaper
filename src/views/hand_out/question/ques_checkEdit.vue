//查看/编辑试卷
<template>
  <div class="ques_checkEdit">
    <div class="ques_check_top">
      <div class="ques_top_title">
        <div v-if="!edit">
          <span>预览题目</span>
          <i class="el-icon-edit-outline ques_edit" @click="quesEdit"></i>
        </div>
        <div v-else>
          <span>编辑题目</span>
          <i class="el-icon-view ques_edit" @click="quesCheck"></i>
        </div>
      </div>

      <el-button size="small" @click="back" class="back">返回</el-button>
    </div>
    <div class="ques_check_content" v-if="question[0]">
      <div class="ques_content_type">
        {{ question[0].primary_ques_type }}——{{
          question[0].secondary_ques_type
        }}
      </div>
      <div class="ques_content_details">
        <audio
          :src="question[0].file_url.path"
          controls="controls"
          v-if="question[0].primary_ques_type == '听力'"
        ></audio>
        <img
          :src="question[0].file_url.path"
          alt=""
          v-if="question[0].file_url != null"
        />
        <div class="details">
          <p class="details_ques_content">{{ question[0].ques_content }}</p>
          <div class="sub_ques" v-if="question[0].sub_ques != null">
            <div v-for="sub in sub_question" :key="sub.id">
              <p>{{ sub.sub_sequence }}.{{ sub.ques_content }}</p>
              <p>{{ sub.options }}</p>
              <div class="ques_answer">
                <p>答案：{{ sub.answer }}</p>
                <p>解析：{{ sub.analysis }}</p>
              </div>
            </div>
          </div>
          <div v-else>
            <p>{{ question[0].options }}</p>
            <div class="ques_answer">
              <p>答案：{{ question[0].answer }}</p>
              <p>解析：{{ question[0].analysis }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import Cookie from "js-cookie";
import Cookies from "js-cookie";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      question: [],
      sub_question: [],
      edit: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var query = new BaaS.Query();
      query.compare("id", "=", Cookie.get("ques_checkEdit"));
      let Question = new BaaS.TableObject("questions_infomation");
      Question.setQuery(query)
        .find()
        .then(
          (res) => {
            // console.log(res);
            this.question = res.data.objects;
            // console.log(this.question);
            if (this.question[0].sub_ques != null) {
              let sub_Question = new BaaS.TableObject("questions_infomation");
              var query1 = new BaaS.Query();
              query1.in("id", this.question[0].sub_ques);
              sub_Question
                .setQuery(query1)
                .orderBy("sub_sequence")
                .find()
                .then(
                  (res) => {
                    // console.log(res);
                    this.sub_question = res.data.objects;
                    console.log(this.sub_question);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    back() {
      Cookies.set("ques_checkEdit", "");
      this.$router.go(-1);
    },
    quesEdit() {
      console.log("edit");
      this.edit = true
    },
    quesCheck() {
      console.log("check");
      this.edit = false
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.ques_checkEdit {
  padding: 30px 70px;
}
.ques_check_top {
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
  border-bottom: 2px solid rgb(206, 206, 206);
  padding: 0 30px;
  margin-bottom: 20px;
}
.ques_top_title {
  font-size: 25px;
  font-weight: bold;
  align-self: flex-start;
}
.ques_edit:hover {
  cursor: pointer;
  color: #3a8ee6;
}
.back {
  align-self: flex-start;
}
.ques_check_content {
  border: 1px solid rgb(206, 206, 206);
  background-color: white;
}
.ques_content_type {
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
  background-color: #e2e2e2;
  text-align: left;
  color: #3a8ee6;
  padding: 0 20px;
  margin-bottom: 20px;
}
.ques_content_details {
  padding: 0 50px;
  /* text-align: left; */
}
.details {
  text-align: left;
}
.details p {
  font-size: 18px;
  line-height: 40px;
}
.details_ques_content {
  margin-bottom: 10px;
}
.ques_answer {
  border-top: 1px dashed #c0c4cc;
  border-bottom: 2px solid #747474;
  margin: 10px 0;
}
</style>