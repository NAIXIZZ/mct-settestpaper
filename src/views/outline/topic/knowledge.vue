//知识点、例题
<template>
  <div>
    <div class="kno_top">
      <i class="el-icon-back" @click="back" style="width: 100px"></i>
      <div class="kno_con" v-if="data[0]">
        <p style="font-weight: bold">{{ second_title }}</p>
        <p v-for="con in data[0].content" :key="con.id">{{ con }}</p>
      </div>
    </div>
    <div class="kno_ques">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="一 | 听力" name="1">
          <div class="example" v-for="ex in listen" :key="ex.id">
            <div v-if="ex.question">
              <div class="ques_type">{{ ex.secondary_ques_type }}</div>
              <div v-for="d in ex.question" :key="d.id" style="border-bottom:1px dotted gray">
                <div class="question">
                  <audio
                    :src="d.file_url.path"
                    controls="controls"
                    v-if="d.file_url != null"
                  ></audio>
                  <p>{{ d.question_content_id }}</p>
                  <p>{{ d.question }}</p>
                  <div v-if="d.options != null">
                    <div v-if="d.secondary_ques_type == '听句子，判断对错'">
                      <p v-for="o in d.options" :key="o.id">{{ o.content }}</p>
                    </div>
                    <div v-else>
                      <p v-for="o in d.options" :key="o.id">
                        {{ o.index }}.{{ o.content }}
                      </p>
                    </div>
                    <p>答案：{{ d.answer }}</p>
                    <p>解析：{{ d.analysis }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="二 | 阅读" name="2">
          <div class="example" v-for="ex in read" :key="ex.id">
            <div v-if="ex.question">
              <div class="ques_type">{{ ex.secondary_ques_type }}</div>
              <div v-for="d in ex.question" :key="d.id" style="border-bottom:1px dotted gray">
                <div class="question">
                  <img
                    :src="d.file_url.path"
                    alt=""
                    v-if="d.file_url != null"
                  />
                  <p>{{ d.question_content_id }}</p>
                  <p>{{ d.question }}</p>
                  <div v-if="d.options != null">
                    <p v-for="o in d.options" :key="o.id">
                      {{ o.index }}.{{ o.content }}
                    </p>
                    <p>答案：{{ d.answer }}</p>
                    <p>解析：{{ d.analysis }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="三 | 写作" name="3">
          <div class="example" v-for="ex in write" :key="ex.id">
            <div v-if="ex.question">
              <div class="ques_type">{{ ex.secondary_ques_type }}</div>
              <div v-for="d in ex.question" :key="d.id" style="border-bottom:1px dotted gray">
                <div class="question">
                  <p>{{ d.question_content_id }}</p>
                  <p>{{ d.question }}</p>
                  <p>答案：{{ d.answer }}</p>
                  <p>解析：{{ d.analysis }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- <el-card class="box-card">
      <div class="left">
        <div v-for="(type, i) in ques_type" :key="type.index">
          <div class="primary">
            <div class="primary_title">
              <p v-if="i == 0">一、</p>
              <p v-else-if="i == 1">二、</p>
              <p v-else-if="i == 2">三、</p>
              <p v-else-if="i == 3">四、</p>
              <p v-else-if="i == 4">五、</p>
              <p v-else-if="i == 5">六、</p>
              <p v-else-if="i == 6">七、</p>
              <p v-else-if="i == 7">八、</p>
              {{ type.primary }}
            </div>
          </div>
          <div
            v-for="(stype, j) in type.secondary"
            :key="stype.start"
            class="stype"
          >
            <div class="secondary">
              <div class="secondary_title">
                <p v-if="j == 0">（一）</p>
                <p v-else-if="j == 1">（二）</p>
                <p v-else-if="j == 2">（三）</p>
                <p v-else-if="j == 3">（四）</p>
                {{ stype.type }}
              </div>
              <div>（共{{ stype.num }}题，共{{ stype.score }}分）</div>
            </div>
            <div v-for="item in questions" :key="item.sequence">
              <div
                v-if="
                  item.sequence - 1 >= stype.start &&
                  item.sequence - 1 <= stype.end
                "
              >
                <div class="question">
                  <audio
                    :src="item.audio"
                    controls="controls"
                    v-if="
                      item.audio != '' &&
                      (item.audio.search('.mp3') != -1 ||
                        item.audio.search('.wav') != -1 ||
                        item.audio.search('.ogg') != -1)
                    "
                  ></audio>
                  <img
                  width="1000px"
                    :src="item.file_url"
                    v-if="
                      item.file_url != '' &&
                      (item.file_url.search('.png') != -1 ||
                        item.file_url.search('.jpg') != -1 ||
                        item.file_url.search('.gif') != -1)
                    "
                  />
                  <p>{{ item.question_content }}</p>
                  <div v-for="s in item.sub_question" :key="s.actual_sequence">
                    <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                    <div v-for="o in s.options" :key="o.index">
                      <p
                        class="options"
                        v-if="item.secondary_ques_type == '听句子，判断对错'"
                      >
                        {{ o.content }}
                      </p>
                      <p class="options" v-else>
                        {{ o.index }}.{{ o.content }}
                      </p>
                    </div>
                    <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                    <p class="analysis" v-if="showAnalysis">
                      解析：{{ s.analysis }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card> -->
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
// import Cookies from "js-cookie";
// import Cookie from "js-cookie";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      second_title: "",
      data: {},
      listen: [
        {
          secondary_ques_type: "听句子，判断对错",
          question: [],
        },
        {
          secondary_ques_type: "听短对话，选择正确答案",
          question: [],
        },
        {
          secondary_ques_type: "听长对话，选择正确答案",
          question: [],
        },
        {
          secondary_ques_type: "听短文，选择正确答案",
          question: [],
        },
      ],
      lessay_sub: [],
      read: [ {
          secondary_ques_type: "选择正确的词语填空",
          question: [],
        },
         {
          secondary_ques_type: "阅读语段，选择与语段意思一致的一项",
          question: [],
        },
        {
          secondary_ques_type: "阅读材料，选择正确答案",
          question: [],
        },
         {
          secondary_ques_type: "阅读短文，选择正确答案",
          question: [],
        },
      ],
      word_sub: [],
      material_sub: [],
      ressay_sub: [],
      write: [{
        secondary_ques_type: "根据一段长对话写门诊病历记录",
        question: [],
      }],
      activeNames: ["1", "2", "3"],
    };
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    init() {
      // this.second_title = Cookie.get("second_title");
      this.second_title = sessionStorage.getItem("second_title");
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var query1 = new BaaS.Query();
      var query2 = new BaaS.Query();
      // query1.contains("first_title", Cookie.get("first_title"));
      // query2.contains("second_title", Cookie.get("second_title"));
      query1.contains("first_title", sessionStorage.getItem("first_title"));
      query2.contains("second_title", sessionStorage.getItem("second_title"));
      let andQuery = BaaS.Query.and(query1, query2);
      let Topic = new BaaS.TableObject("topic_outline");
      Topic.setQuery(andQuery)
        .find()
        .then(
          (res) => {
            console.log(res);
            this.data = res.data.objects;
            let Example = new BaaS.TableObject("questions_information");
            var query3 = new BaaS.Query();
            query3.in("id", this.data[0].example_id);
            Example.setQuery(query3)
              .find()
              .then(
                (res) => {
                  res.data.objects.forEach((element) => {
                    if (
                      element.options != null &&
                      element.options != "" &&
                      element.options != undefined &&
                      element.options != "无"
                    ) {
                      let str = element.options.replace(/\s*/g, "");
                      let tempa = -1;
                      let tempb = -1;
                      let tempc = -1;
                      let tempd = -1;
                      if (str.indexOf('","index":"A"') != -1) {
                        tempa = str.indexOf('","index":"A"');
                      } else if (str.indexOf("','index':'A'") != -1) {
                        tempa = str.indexOf("','index':'A'");
                      }
                      if (str.indexOf('","index":"B"') != -1) {
                        tempb = str.indexOf('","index":"B"');
                      } else if (str.indexOf("','index':'B'") != -1) {
                        tempb = str.indexOf("','index':'B'");
                      }
                      if (str.indexOf('","index":"C"') != -1) {
                        tempc = str.indexOf('","index":"C"');
                      } else if (str.indexOf("','index':'C'") != -1) {
                        tempc = str.indexOf("','index':'C'");
                      }
                      if (str.indexOf('","index":"D"') != -1) {
                        tempd = str.indexOf('","index":"D"');
                      } else if (str.indexOf("','index':'D'") != -1) {
                        tempd = str.indexOf("','index':'D'");
                      }
                      let a = "";
                      let b = "";
                      let c = "";
                      let d = "";
                      if (tempa != -1) {
                        while (str[tempa - 1] != '"' && str[tempa - 1] != "'") {
                          a += str[tempa - 1];
                          tempa--;
                        }
                        a = a.split("").reverse().join("");
                      }
                      if (tempb != -1) {
                        while (str[tempb - 1] != '"' && str[tempb - 1] != "'") {
                          b += str[tempb - 1];
                          tempb--;
                        }
                        b = b.split("").reverse().join("");
                      }
                      if (tempc != -1) {
                        while (str[tempc - 1] != '"' && str[tempc - 1] != "'") {
                          c += str[tempc - 1];
                          tempc--;
                        }
                        c = c.split("").reverse().join("");
                      }
                      if (tempd != -1) {
                        while (str[tempd - 1] != '"' && str[tempd - 1] != "'") {
                          d += str[tempd - 1];
                          tempd--;
                        }
                        d = d.split("").reverse().join("");
                      }
                      let o = [
                        {
                          content: a,
                          index: "A",
                        },
                        {
                          content: b,
                          index: "B",
                        },
                        {
                          content: c,
                          index: "C",
                        },
                        {
                          content: d,
                          index: "D",
                        },
                      ];
                      element.options = o;
                    }
                    element.file_url = null;
                    // var temp{};
                    if (element.secondary_ques_type == "听句子，判断对错") {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.listen[0].question.push(element);
                    } else if (
                      element.secondary_ques_type == "听短对话，选择正确答案"
                    ) {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.listen[1].question.push(element);
                    } else if (
                      element.secondary_ques_type == "听长对话，选择正确答案"
                    ) {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.listen[2].question.push(element);
                    } else if (
                      element.secondary_ques_type == "听短文，选择正确答案"
                    ) {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.listen[3].question.push(element);
                    } else if (
                      element.secondary_ques_type == "选择正确的词语填空"
                    ) {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.read[0].question.push(element);
                    } else if (
                      element.secondary_ques_type ==
                      "阅读语段，选择与语段意思一致的一项"
                    ) {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.read[1].question.push(element);
                    } else if (
                      element.secondary_ques_type == "阅读材料，选择正确答案"
                    ) {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.read[2].question.push(element);
                    } else if (
                      element.secondary_ques_type == "阅读短文，选择正确答案"
                    ) {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.read[3].question.push(element);
                    } else if (element.primary_ques_type == "写作") {
                      let findQuestionContent = new BaaS.TableObject(
                        "question_content"
                      );
                      var query4 = new BaaS.Query();
                      query4.compare("id", "=", element.question_content_id);
                      findQuestionContent
                        .setQuery(query4)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects[0].content != null) {
                              element.question_content_id =
                                res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.write[0].question.push(element);
                    }
                  });
                  for(let i=this.listen.length-1;i>=0;i--){
                    if(this.listen[i].question.length==0){
                      this.listen.splice(i,1)
                    }
                  }
                  for(let i=this.read.length-1;i>=0;i--){
                    if(this.read[i].question.length==0){
                      this.read.splice(i,1)
                    }
                  }
                  for(let i=this.write.length-1;i>=0;i--){
                    if(this.write[i].question.length==0){
                      this.write.splice(i,1)
                    }
                  }
                },
                (err) => {
                  console.log(err);
                }
              );
          },
          (err) => {
            console.log(err);
          }
        );
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.kno_top {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 40px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.kno_con {
  min-width: 400px;
  max-width: 900px;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  background-color: white;
  text-align: left;
  padding: 10px;
  margin-right: 10px;
}
.kno_ques {
  padding: 0 30px;
  text-align: left;
}
.example {
  padding: 10px;
}
.ques_type {
  font-size: 15px;
  font-weight: bold;
  background-color: #dddbdb;
  line-height: 50px;
  margin-bottom: 10px;
  text-indent: 2em;
}
</style>