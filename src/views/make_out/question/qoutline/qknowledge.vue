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
            <div v-for="d in ex" :key="d.id">
              <div class="ques_type">{{ d.secondary_ques_type }}</div>
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
        </el-collapse-item>
        <el-collapse-item title="二 | 阅读" name="2">
          <div class="example" v-for="ex in read" :key="ex.id">
            <div v-for="d in ex" :key="d.id">
              <div class="ques_type">{{ d.secondary_ques_type }}</div>
              <div class="question">
                <img :src="d.file_url.path" alt="" v-if="d.file_url != null" />
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
        </el-collapse-item>
        <el-collapse-item title="三 | 写作" name="3">
          <div class="example" v-for="ex in write" :key="ex.id">
            <div class="ques_type">{{ ex.secondary_ques_type }}</div>
            <div class="question">
              <p>{{ ex.question_content_id }}</p>
              <p>{{ ex.question }}</p>
              <p>答案：{{ ex.answer }}</p>
              <p>解析：{{ ex.analysis }}</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import Cookies from "js-cookie";
import Cookie from "js-cookie";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      second_title: "",
      data: {},
      listen: {
        listen_sentence: [],
        listen_sdialogue: [],
        listen_ldialogue: [],
        listen_essay: [],
      },
      lessay_sub: [],
      read: {
        read_word: [],
        read_phrase: [],
        read_material: [],
        read_essay: [],
      },
      word_sub: [],
      material_sub: [],
      ressay_sub: [],
      write: [],
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
      this.second_title = Cookie.get("second_title");
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var query1 = new BaaS.Query();
      var query2 = new BaaS.Query();
      query1.contains("first_title", Cookie.get("first_title"));
      query2.contains("second_title", Cookie.get("second_title"));
      let andQuery = BaaS.Query.and(query1, query2);
      let Topic = new BaaS.TableObject("topic_outline");
      Topic.setQuery(andQuery)
        .find()
        .then(
          (res) => {
            this.data = res.data.objects;
            let Example = new BaaS.TableObject("questions_information");
            var query3 = new BaaS.Query();
            query3.in("id", this.data[0].example_id);
            Example.setQuery(query3)
              .find()
              .then(
                (res) => {
                  res.data.objects.forEach((element) => {
                    element.options = JSON.parse(element.options);
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
                      this.listen.listen_sentence.push(element);
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
                      this.listen.listen_sdialogue.push(element);
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
                      this.listen.listen_ldialogue.push(element);
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
                      this.listen.listen_essay.push(element);
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
                      this.read.read_word.push(element);
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
                              element.question_content_id = res.data.objects[0].content;
                            } else {
                              element.file_url = res.data.objects[0].file_url;
                              element.question_content_id = null;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      this.read.read_phrase.push(element);
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
                      this.read.read_material.push(element);
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
                      this.read.read_essay.push(element);
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
                      this.write.push(element);
                    }
                  });
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