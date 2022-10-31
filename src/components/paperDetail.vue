<template>
  <div>
    <el-row>
      <heads></heads>
    </el-row>
    <div class="main">
      <el-row style="padding-top:25px">
        <el-col :span="3"><span style="color:black;font-size:20px">查看试卷</span></el-col>
        <el-col
          :span="2"
          style="margin-left:50%"
        >
          <el-button
            type="success"
            @click="generate()"
          >试卷导出</el-button>
        </el-col>
        <el-col :span="2">
          <template>
            <el-checkbox
              v-model="isAnswer"
              style="margin-top:10px"
            >包含答案</el-checkbox>
          </template>
        </el-col>
        <el-col :span="2">
          <template>
            <el-checkbox
              v-model="isAnalysis"
              style="margin-top:10px"
            >包含解析</el-checkbox>
          </template>
        </el-col>
        <el-col :span="2">
          <el-button @click="returnHome">返回</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-divider></el-divider>
      </el-row>
      <el-row>
        <el-card class="box-card">
          <el-row><span style="font-size:25px">{{ paper_message.paper_title }}</span></el-row>
          <el-row style="margin-top:15px">
            <el-col
              :span="8"
              style="margin-left:34%"
            >
              <span style="font-size:15px">
                创建人：{{ paper_message.created_by }}
                <el-divider direction="vertical"></el-divider>
                题量：{{ paper_message.questions_num }}
                <el-divider direction="vertical"></el-divider>
                满分：{{ paper_message.points }}
              </span>
            </el-col>
            <el-col :span="2">
              <template>
                <el-checkbox v-model="showAnswer">显示答案</el-checkbox>
              </template>
            </el-col>
            <el-col :span="2">
              <template>
                <el-checkbox v-model="showAnalysis">显示解析</el-checkbox>
              </template>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
      <el-row>
        <el-card class="box-card">
          <div class="left">
            <div>
              <span class="first-title">听力</span>
              <div v-if="listen_sentence != null">
                <div class="title-bgc"><span class="second-title">听句子，判断对错</span></div>
                <div
                  v-for="item in listen_sentence"
                  :key="item.id"
                >
                  <audio
                    :src="item.content"
                    controls="controls"
                  ></audio>
                  <p class="ques-content">{{ item.sub_sequence }}.{{ item.question }}（{{ item.score }}分）</p>
                  <div
                    v-for="s in item.options"
                    :key="s.index"
                  >
                    <p class="options">{{ s.content }}</p>
                  </div>
                  <p
                    class="answer"
                    v-if="showAnswer"
                  >答案：{{ item.answer }}</p>
                  <p
                    class="analysis"
                    v-if="showAnalysis"
                  >解析：{{ item.analysis }}</p>
                </div>
              </div>

              <div v-if="listen_sdialogue != null">
                <div class="title-bgc"><span class="second-title">听短对话，选择正确答案</span></div>
                <div
                  v-for="item in listen_sdialogue"
                  :key="item.id"
                >
                  <audio
                    :src="item.content"
                    controls="controls"
                  ></audio>
                  <p class="ques-content">{{ item.sub_sequence }}.{{ item.question }}（{{ item.score }}分）</p>
                  <div
                    v-for="s in item.options"
                    :key="s.index"
                  >
                    <p class="options">{{ s.index }}.{{ s.content }}</p>
                  </div>
                  <p
                    class="answer"
                    v-if="showAnswer"
                  >答案：{{ item.answer }}</p>
                  <p
                    class="analysis"
                    v-if="showAnalysis"
                  >解析：{{ item.analysis }}</p>
                </div>
              </div>

              <div v-if="listen_ldialogue != null">
                <div class="title-bgc"><span class="second-title">听长对话，选择正确答案</span></div>
                <div
                  v-for="item in listen_ldialogue"
                  :key="item.id"
                >
                  <audio
                    :src="item.content"
                    controls="controls"
                  ></audio>
                  <p class="ques-content">{{ item.sub_sequence }}.（{{ item.score }}分）</p>
                  <div
                    v-for="s in item.options"
                    :key="s.index"
                  >
                    <p class="options">{{ s.index }}.{{ s.content }}</p>
                  </div>
                  <p
                    class="answer"
                    v-if="showAnswer"
                  >答案：{{ item.answer }}</p>
                  <p
                    class="analysis"
                    v-if="showAnalysis"
                  >解析：{{ item.analysis }}</p>
                </div>
              </div>

              <div v-if="listen_essay != null">
                <div class="title-bgc"><span class="second-title">听短文，选择正确答案</span></div>
                <div
                  v-for="item in listen_essay"
                  :key="item.id"
                >
                  <audio
                    :src="item.content"
                    controls="controls"
                  ></audio>
                  <div
                    v-for="ques in item.info"
                    :key="ques.id"
                  >
                    <p class="ques-content">{{ ques.sub_sequence }}.（{{ ques.score }}分）</p>
                    <div
                      v-for="s in ques.options"
                      :key="s.index"
                    >
                      <p class="options">{{ s.index }}.{{ s.content }}</p>
                    </div>
                    <p
                      class="answer"
                      v-if="showAnswer"
                    >答案：{{ ques.answer }}</p>
                    <p
                      class="analysis"
                      v-if="showAnalysis"
                    >解析：{{ ques.analysis }}</p>

                  </div>

                </div>
              </div>
            </div>

            <div>
              <div v-if="read_word != null">
                <span class="first-title">阅读</span>
                <div class="title-bgc"><span class="second-title">选择正确的词语填空</span></div>
                <div
                  v-for="item in read_word"
                  :key="item.id"
                >
                  <p class="ques-content">{{ item.content }}</p>
                  <div
                    v-for="ques in item.info"
                    :key="ques.id"
                  >
                    <p class="options">{{ ques.sub_sequence }}.（{{ ques.score }}分）</p>
                    <div
                      v-for="s in ques.options"
                      :key="s.index"
                    >
                      <p class="options">{{ s.index }}.{{ s.content }}</p>
                    </div>
                    <p
                      class="answer"
                      v-if="showAnswer"
                    >答案：{{ ques.answer }}</p>
                    <p
                      class="analysis"
                      v-if="showAnalysis"
                    >解析：{{ ques.analysis }}</p>
                  </div>
                </div>
              </div>

              <div v-if="read_phrase != null">
                <div class="title-bgc"><span class="second-title">阅读语段，选择与语段意思一致的一项</span></div>
                <div
                  v-for="item in read_phrase"
                  :key="item.id"
                >
                  <p class="ques-content">{{ item.sub_sequence }}.{{ item.content }}（{{ item.score }}分）</p>
                  <div
                    v-for="s in item.options"
                    :key="s.index"
                  >
                    <p class="options">{{ s.index }}.{{ s.content }}</p>
                  </div>
                  <p
                    class="answer"
                    v-if="showAnswer"
                  >答案：{{ item.answer }}</p>
                  <p
                    class="analysis"
                    v-if="showAnalysis"
                  >解析：{{ item.analysis }}</p>
                </div>
              </div>

              <div v-if="read_material != null">
                <div class="title-bgc"><span class="second-title">阅读材料，选择正确答案</span></div>
                <div
                  v-for="item in read_material"
                  :key="item.id"
                >
                  <img :src="item.content">
                  <div
                    v-for="ques in item.info"
                    :key="ques.id"
                  >
                    <p class="ques-content">{{ ques.sub_sequence }}.{{ ques.question }}（{{ ques.score }}分）</p>
                    <div
                      v-for="s in ques.options"
                      :key="s.index"
                    >
                      <p class="options">{{ s.index }}.{{ s.content }}</p>
                    </div>
                    <p
                      class="answer"
                      v-if="showAnswer"
                    >答案：{{ ques.answer }}</p>
                    <p
                      class="analysis"
                      v-if="showAnalysis"
                    >解析：{{ ques.analysis }}</p>
                  </div>
                </div>
              </div>

              <div v-if="read_essay != null">
                <div class="title-bgc"><span class="second-title">阅读短文，选择正确答案</span></div>
                <div
                  v-for="item in read_essay"
                  :key="item.id"
                >
                  <p class="ques-content">{{ item.content }}</p>
                  <div
                    v-for="ques in item.info"
                    :key="ques.id"
                  >
                    <p class="options">{{ ques.sub_sequence }}.{{ ques.question }}（{{ ques.score }}分）</p>
                    <div
                      v-for="s in ques.options"
                      :key="s.index"
                    >
                      <p class="options">{{ s.index }}.{{ s.content }}</p>
                    </div>
                    <p
                      class="answer"
                      v-if="showAnswer"
                    >答案：{{ ques.answer }}</p>
                    <p
                      class="analysis"
                      v-if="showAnalysis"
                    >解析：{{ ques.analysis }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div v-if="write != null">
                <span class="first-title">写作</span>
                <div class="title-bgc"><span class="second-title">根据一段长对话写门诊病历记录</span></div>
                <div
                  v-for="item in write"
                  :key="item.id"
                >
                  <p class="ques-content">{{ item.sub_sequence }}.{{ item.content }}（{{ item.score }}分）</p>
                  <p
                    class="answer"
                    v-if="showAnswer"
                  >答案：{{ item.answer }}</p>
                  <p
                    class="analysis"
                    v-if="showAnalysis"
                  >解析：{{ item.analysis }}</p>
                </div>
              </div>
            </div>

          </div>
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import Cookies from "js-cookie";
import Heads from './heads.vue'
import 'docxtemplater/build/docxtemplater.js'
import 'pizzip/dist/pizzip.js'
import 'pizzip/dist/pizzip-utils.js'
import 'file-saver'
export default {
  name: '',
  components: {
    Heads
  },
  props: {},
  data () {
    return {
      isAnswer: true,
      isAnalysis: true,
      showAnswer: true,
      showAnalysis: true,
      paper_message: {
        paper_title: "",
        created_user_id: "",
        questions_num: "",
        points: "",
      },
      questions_id: [],
      questions_detail: [],
      listen_sentence: [],
      listen_sdialogue: [],
      listen_ldialogue: [],
      listen_essay: [],
      read_word: [],
      read_phrase: [],
      read_material: [],
      read_essay: [],
      write: []
    };
  },
  mounted () {
    this.getData()
  },
  methods: {
    returnHome () {
      this.$router.go(-1)
    },
    getData () {
      const sortBy = (property) => {
        return function (a, b) {
          const val1 = a[property];
          const val2 = b[property];
          return val1 - val2;
        }
      }
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let question_content = new BaaS.TableObject("question_content")
      let test_paper = new BaaS.TableObject("test_paper")
      let queryTest = new BaaS.Query()
      queryTest.compare('id', '=', Cookies.get('home_paper_id'))
      test_paper.setQuery(queryTest).find().then(res => {
        this.paper_message.paper_title = res.data.objects[0].paper_title
        this.paper_message.questions_num = res.data.objects[0].questions_num
        this.paper_message.points = res.data.objects[0].points
        this.paper_message.created_by = 'huadazhiyu'
        var detail_obj = JSON.parse(res.data.objects[0].questions_detail)
        this.questions_detail = detail_obj
        let questions_information = new BaaS.TableObject("questions_information")
        for (let i = 0; i < this.questions_detail.length; i++) {
          let queryId = new BaaS.Query()
          queryId.compare('id', '=', this.questions_detail[i].id)
          questions_information.setQuery(queryId).find().then(res => {
            if (res.data.objects[0].secondary_ques_type == '听句子，判断对错') {
              var listen_sentence_info = {}
              listen_sentence_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              listen_sentence_info.options = obj
              listen_sentence_info.score = this.questions_detail[i].score
              listen_sentence_info.sub_sequence = this.questions_detail[i].sub_sequence
              let queryContentId = new BaaS.Query()
              queryContentId.compare('id', '=', listen_sentence_info.question_content_id)
              question_content.setQuery(queryContentId).find().then(res => {
                listen_sentence_info.content = res.data.objects[0].file_url.path
                this.$forceUpdate();
              }, err => {
                console.log(err)
              })
              this.listen_sentence.push(listen_sentence_info)
              this.listen_sentence.sort(sortBy('sub_sequence'))
            } else if (res.data.objects[0].secondary_ques_type == '听短对话，选择正确答案') {
              var listen_sdialogue_info = {}
              listen_sdialogue_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              listen_sdialogue_info.options = obj
              listen_sdialogue_info.score = this.questions_detail[i].score
              listen_sdialogue_info.sub_sequence = this.questions_detail[i].sub_sequence
              let queryContentId = new BaaS.Query()
              queryContentId.compare('id', '=', listen_sdialogue_info.question_content_id)
              question_content.setQuery(queryContentId).find().then(res => {
                listen_sdialogue_info.content = res.data.objects[0].file_url.path
                this.$forceUpdate();
              }, err => {
                console.log(err)
              })
              this.listen_sdialogue.push(listen_sdialogue_info)
              this.listen_sdialogue.sort(sortBy('sub_sequence'))
            } else if (res.data.objects[0].secondary_ques_type == '听长对话，选择正确答案') {
              var listen_ldialogue_info = {}
              listen_ldialogue_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              listen_ldialogue_info.options = obj
              listen_ldialogue_info.score = this.questions_detail[i].score
              listen_ldialogue_info.sub_sequence = this.questions_detail[i].sub_sequence
              let queryContentId = new BaaS.Query()
              queryContentId.compare('id', '=', listen_ldialogue_info.question_content_id)
              question_content.setQuery(queryContentId).find().then(res => {
                listen_ldialogue_info.content = res.data.objects[0].file_url.path
                this.$forceUpdate();
              }, err => {
                console.log(err)
              })
              this.listen_ldialogue.push(listen_ldialogue_info)
              this.listen_ldialogue.sort(sortBy('sub_sequence'))
            } else if (res.data.objects[0].secondary_ques_type == '听短文，选择正确答案') {
              var listen_essay_info = {}
              listen_essay_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              listen_essay_info.options = obj
              listen_essay_info.score = this.questions_detail[i].score
              listen_essay_info.sub_sequence = this.questions_detail[i].sub_sequence
              var isExist = false
              for (let i = 0; i < this.listen_essay.length; i++) {
                if (res.data.objects[0].question_content_id == this.listen_essay[i].question_content_id) {
                  isExist = true
                  this.listen_essay[i].info.push(listen_essay_info)
                  this.listen_essay[i].info.sort(sortBy('sub_sequence'))
                }
              }
              var temp_listen_essay_info = {}
              var info = []
              if (!isExist) {
                temp_listen_essay_info.question_content_id = res.data.objects[0].question_content_id
                let queryContentId = new BaaS.Query()
                queryContentId.compare('id', '=', res.data.objects[0].question_content_id)
                question_content.setQuery(queryContentId).find().then(res => {
                  temp_listen_essay_info.content = res.data.objects[0].file_url.path
                  this.$forceUpdate();
                }, err => {
                  console.log(err)
                })
                info.push(listen_essay_info)
                info.sort(sortBy('sub_sequence'))
                temp_listen_essay_info.info = info
                this.listen_essay.push(temp_listen_essay_info)
              }
            } else if (res.data.objects[0].secondary_ques_type == '选择正确的词语填空') {
              var read_word_info = {}
              read_word_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              read_word_info.options = obj
              read_word_info.score = this.questions_detail[i].score
              read_word_info.sub_sequence = this.questions_detail[i].sub_sequence
              var isExist = false
              for (let i = 0; i < this.read_word.length; i++) {
                if (res.data.objects[0].question_content_id == this.read_word[i].question_content_id) {
                  isExist = true
                  this.read_word[i].info.push(read_word_info)
                  this.read_word[i].info.sort(sortBy('sub_sequence'))
                }
              }
              var temp_read_word_info = {}
              var info = []
              if (!isExist) {
                temp_read_word_info.question_content_id = res.data.objects[0].question_content_id
                let queryContentId = new BaaS.Query()
                queryContentId.compare('id', '=', res.data.objects[0].question_content_id)
                question_content.setQuery(queryContentId).find().then(res => {
                  temp_read_word_info.content = res.data.objects[0].content
                  this.$forceUpdate();
                }, err => {
                  console.log(err)
                })
                info.push(read_word_info)
                info.sort(sortBy('sub_sequence'))
                temp_read_word_info.info = info
                this.read_word.push(temp_read_word_info)
              }
            } else if (res.data.objects[0].secondary_ques_type == '阅读语段，选择与语段意思一致的一项') {
              var read_phrase_info = {}
              read_phrase_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              read_phrase_info.options = obj
              read_phrase_info.score = this.questions_detail[i].score
              read_phrase_info.sub_sequence = this.questions_detail[i].sub_sequence
              let queryContentId = new BaaS.Query()
              queryContentId.compare('id', '=', read_phrase_info.question_content_id)
              question_content.setQuery(queryContentId).find().then(res => {
                read_phrase_info.content = res.data.objects[0].content
                this.$forceUpdate();
              }, err => {
                console.log(err)
              })
              this.read_phrase.push(read_phrase_info)
              this.read_phrase.sort(sortBy('sub_sequence'))
            } else if (res.data.objects[0].secondary_ques_type == '阅读材料，选择正确答案') {
              var read_material_info = {}
              read_material_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              read_material_info.options = obj
              read_material_info.score = this.questions_detail[i].score
              read_material_info.sub_sequence = this.questions_detail[i].sub_sequence
              var isExist = false
              for (let i = 0; i < this.read_material.length; i++) {
                if (res.data.objects[0].question_content_id == this.read_material[i].question_content_id) {
                  isExist = true
                  this.read_material[i].info.push(read_material_info)
                  this.read_material[i].info.sort(sortBy('sub_sequence'))
                }
              }
              var temp_read_material_info = {}
              var info = []
              if (!isExist) {
                temp_read_material_info.question_content_id = res.data.objects[0].question_content_id
                let queryContentId = new BaaS.Query()
                queryContentId.compare('id', '=', res.data.objects[0].question_content_id)
                question_content.setQuery(queryContentId).find().then(res => {
                  temp_read_material_info.content = res.data.objects[0].file_url.path
                  this.$forceUpdate();
                }, err => {
                  console.log(err)
                })
                info.push(read_material_info)
                info.sort(sortBy('sub_sequence'))
                temp_read_material_info.info = info
                this.read_material.push(temp_read_material_info)
              }
            } else if (res.data.objects[0].secondary_ques_type == '阅读短文，选择正确答案') {
              var read_essay_info = {}
              read_essay_info = res.data.objects[0]
              var obj = JSON.parse(res.data.objects[0].options)
              read_essay_info.options = obj
              read_essay_info.score = this.questions_detail[i].score
              read_essay_info.sub_sequence = this.questions_detail[i].sub_sequence
              var isExist = false
              for (let i = 0; i < this.read_essay.length; i++) {
                if (res.data.objects[0].question_content_id == this.read_essay[i].question_content_id) {
                  isExist = true
                  this.read_essay[i].info.push(read_essay_info)
                  this.read_essay[i].info.sort(sortBy('sub_sequence'))
                }
              }
              var temp_read_essay_info = {}
              var info = []
              if (!isExist) {
                temp_read_essay_info.question_content_id = res.data.objects[0].question_content_id
                let queryContentId = new BaaS.Query()
                queryContentId.compare('id', '=', res.data.objects[0].question_content_id)
                question_content.setQuery(queryContentId).find().then(res => {
                  temp_read_essay_info.content = res.data.objects[0].content
                  this.$forceUpdate();
                }, err => {
                  console.log(err)
                })
                info.push(read_essay_info)
                info.sort(sortBy('sub_sequence'))
                temp_read_essay_info.info = info
                this.read_essay.push(temp_read_essay_info)
              }
            } else if (res.data.objects[0].secondary_ques_type == '根据一段长对话写门诊病历记录') {
              var write_info = {}
              write_info = res.data.objects[0]
              write_info.score = this.questions_detail[i].score
              write_info.sub_sequence = this.questions_detail[i].sub_sequence
              let queryContentId = new BaaS.Query()
              queryContentId.compare('id', '=', write_info.question_content_id)
              question_content.setQuery(queryContentId).find().then(res => {
                write_info.content = res.data.objects[0].content
                this.$forceUpdate();
              }, err => {
                console.log(err)
              })
              this.write.push(write_info)
              this.write.sort(sortBy('sub_sequence'))
            }
          }, err => {
            console.log(err)
          })
        }
        // console.log(this.listen_sentence)
        // console.log(this.listen_sdialogue)
        // console.log(this.listen_ldialogue)
        // console.log(this.listen_essay)
        // console.log(this.read_word)
        // console.log(this.read_phrase)
        // console.log(this.read_material)
        // console.log(this.read_essay)
        // console.log(this.write)
      }, err => {
        console.log(err)
      })
    },
    loadFile (url, callback) {
      PizZipUtils.getBinaryContent(url, callback);
    },
    generate () {
      // 点击导出word
      var that = this;
      var wordName
      if (!this.isAnswer && !this.isAnalysis) {//无答案无解析
        wordName = "word0.docx"
      }
      else if (this.isAnswer && !this.isAnalysis) {//有答案无解析
        wordName = "word1.docx"
      }
      else if (!this.isAnswer && this.isAnalysis) {//无答案有解析
        wordName = "word2.docx"
      }
      else if (this.isAnswer && this.isAnalysis) {//有答案有解析
        wordName = "word3.docx"
      }
      this.loadFile(wordName, function (error, content) {
        if (error) {
          throw error
        };
        var zip = new PizZip(content);
        var doc = new window.docxtemplater().loadZip(zip)
        doc.setData({
          ...that.paper_message,
          listen_sentence: that.listen_sentence,
          listen_sdialogue: that.listen_sdialogue,
          listen_ldialogue: that.listen_ldialogue,
          listen_essay: that.listen_essay,
          read_word: that.read_word,
          read_phrase: that.read_phrase,
          read_material: that.read_material,
          read_essay: that.read_essay,
          write: that.write,
        });
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
        } catch (error) {
          var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
          }
          console.log(JSON.stringify({
            error: e
          }));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
        }
        var out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }) //Output the document using Data-URI
        saveAs(out, that.paper_message.paper_title + ".docx")
      })
    },
  },
};
</script>
<style scoped>
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 90%;
  margin: 24px 75px;
}
.box-card {
  width: 90%;
  margin-left: 75px;
  margin-top: 15px;
}
.left {
  text-align: left;
}
.title-bgc {
  background-color: #c0c0c0;
  height: 60px;
}
.first-title {
  font-size: 30px;
}
.second-title {
  font-size: 25px;
  line-height: 60px;
  margin-left: 10px;
}
.ques-content {
  font-size: 20px;
}
.options {
  font-size: 20px;
}
.answer {
  font-size: 20px;
}
.analysis {
  font-size: 20px;
}
</style>