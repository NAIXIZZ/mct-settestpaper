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
            <div class="ques_type">{{ ex.secondary_ques_type }}</div>
            <div class="question">
              <!-- <audio :src="ex.file_url.path" controls="controls"></audio> -->
            </div>
            <div class="example_detail" v-for="q in ex.options_answer" :key="q">
              {{ q }}
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="二 | 阅读" name="2">
          <div class="example" v-for="ex in read" :key="ex.id">
            <div class="ques_type">{{ ex.secondary_ques_type }}</div>
            <!-- <div class="question">
              <iframe :src="ex.question.path" controls="controls"></iframe>
            </div> -->
            <div class="example_detail" v-for="q in ex.options_answer" :key="q">
              {{ q }}
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="三 | 写作" name="3"> </el-collapse-item>
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
      essay_sub: []
      },
      read: {
        read_word: [],
      read_phrase: [],
      read_material: [],
      read_essay: [],
      essay_sub: []
      },
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
            // console.log(res);
            this.data = res.data.objects;
            let Example = new BaaS.TableObject("questions_information");
            this.data[0].example_id.forEach((element) => {
              console.log(element);
              var query3 = new BaaS.Query();
              query3.compare("id", "=", element);
              Example.setQuery(query3)
                .find()
                .then(
                  (res) => {
                    console.log(res);
                    if (res.data.objects[0].secondary_ques_type == "听句子，判断对错") {

                      this.listen.listen_sentence.push(res.data.objects[0]);
                      console.log(this.listen);

                      // if (res.data.objects[0].sub_ques != null) {
                      //               let sub_Question = new BaaS.TableObject("questions_information");
                      //               var query4 = new BaaS.Query();
                      //               query4.in("id", res.data.objects[0].sub_ques);
                      //               sub_Question
                      //                 .setQuery(query4)
                      //                 .orderBy("sub_sequence")
                      //                 .find()
                      //                 .then(
                      //                   (res) => {
                      //                     // console.log(res);
                      //                     this.sub_question = res.data.objects;
                      //                     console.log(this.sub_question);
                      //                   },
                      //                   (err) => {
                      //                     console.log(err);
                      //                   }
                      //                 );
                      //             }
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            });
          },
          (err) => {
            console.log(err);
          }
        );

      // let query3 = new BaaS.Query();
      // query3.contains("primary_ques_type", "听力");
      // let andQuery2 = BaaS.Query.and(query1, query2, query3);
      // let Example = new BaaS.TableObject("examples");
      // Example.setQuery(andQuery2)
      //   .find()
      //   .then(
      //     (res) => {
      //       console.log(res);
      //       this.listen = res.data.objects;
      //     },
      //     (err) => {
      //       console.log(err);
      //     }
      //   );
      //   let query4 = new BaaS.Query();
      // query4.contains("primary_ques_type", "阅读");
      // let andQuery3 = BaaS.Query.and(query1, query2, query4);
      // let Example1 = new BaaS.TableObject("examples");
      // Example1.setQuery(andQuery3)
      //   .find()
      //   .then(
      //     (res) => {
      //       console.log(res);
      //       this.read = res.data.objects;
      //     },
      //     (err) => {
      //       console.log(err);
      //     }
      //   );
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
  /* border-bottom: 1px solid #cecccc; */
}
.ques_type {
  font-size: 16px;
  font-weight: 600;
  background-color: #dddbdb;
  line-height: 50px;
  margin-bottom: 10px;
  text-indent: 2em;
}
</style>