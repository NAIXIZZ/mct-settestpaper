<template>
  <div class="selectQues">
    <div class="back">
      <div class="top">
        <h2>题库选题</h2>
        <el-button plain @click="back">返回</el-button>
      </div>
      <div class="ques_select">
        <el-cascader
          v-model="type"
          :options="ques_select"
          :props="{
            multiple: true,
            expandTrigger: 'hover',
          }"
          clearable
          placeholder="请选择题型"
          @change="type_select"
        ></el-cascader>
        <div class="ques_search">
          <el-input
            v-model="input"
            placeholder="搜索题目或选项"
            clearable
            @clear="use_clear"
          ></el-input>
          <el-button type="success" @click="title_search(input)"
            >搜索</el-button
          >
        </div>
      </div>
      <div class="ques_list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" :index="indexMethod"> </el-table-column>
          <el-table-column
            prop="question_content_id"
            label="题目"
            show-overflow-tooltip
            width="300"
          >
            <template slot-scope="scope">
              <audio
                :src="scope.row.question_content_id"
                controls="controls"
                v-if="
                  scope.row.question_content_id &&
                  scope.row.question_content_id.search('.mp3') != -1
                "
                style="width: 250px"
              ></audio>
              <el-image
                :preview-src-list="srcList"
                :src="scope.row.question_content_id"
                v-else-if="
                  scope.row.question_content_id &&
                  (scope.row.question_content_id.search('.png') != -1 ||
                    scope.row.question_content_id.search('.jpg') != -1 ||
                    scope.row.question_content_id.search('.gif') != -1)
                "
                style="height: 90px"
              ></el-image>
              <p v-else>{{ scope.row.question_content_id }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="primary_ques_type" label="一级题型">
          </el-table-column>
          <el-table-column prop="secondary_ques_type" label="二级题型">
          </el-table-column>
          <el-table-column prop="created_at" label="创建日期" sortable>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="success"
                plain
                @click="check_edit(scope.row.id, scope.row.question_content_id)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next,jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div> -->
    </div>
    <div class="choose">
      <div class="text">
        <p>您已从文件夹中选择了</p>
        {{ selected }}
      </div>
      <div class="btn">
        <el-button type="success" plain @click="add">添加选题</el-button>
        <el-button type="primary" plain @click="cancel">取消选题</el-button>
      </div>
    </div>
  </div>
</template>

<script>
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
import Cookies from "js-cookie";
import Cookie from "js-cookie";
import global from "@/util/global.js";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      tinitial: [],
      initial: [],
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      input: "",
      type: "",
      selected: "0道题",
      listen: 0,
      read: 0,
      write: 0,
      srcList: [],
      catalog: [],
      ques_select: [
        {
          value: "听力题",
          label: "听力题",
          children: [
            {
              value: "听句子，判断对错",
              label: "听句子，判断对错",
            },
            {
              value: "听短对话，选择正确答案",
              label: "听短对话，选择正确答案",
            },
            {
              value: "听长对话，选择正确答案",
              label: "听长对话，选择正确答案",
            },
            {
              value: "听短文，选择正确答案",
              label: "听短文，选择正确答案",
            },
          ],
        },
        {
          value: "阅读题",
          label: "阅读题",
          children: [
            {
              value: "选择正确的词语填空",
              label: "选择正确的词语填空",
            },
            {
              value: "阅读语段，选择与语段意思一致的一项",
              label: "阅读语段，选择与语段意思一致的一项",
            },
            {
              value: "阅读材料，选择正确答案",
              label: "阅读材料，选择正确答案",
            },
            {
              value: "阅读短文，选出正确答案",
              label: "阅读短文，选出正确答案",
            },
          ],
        },
        {
          value: "写作题",
          label: "写作题",
          children: [
            {
              value: "根据一段长对话写门诊病历记录",
              label: "根据一段长对话写门诊病历记录",
            },
          ],
        },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      // let temp = sessionStorage.getItem("selcat")
      // for(let i=0;i<temp.length;i++){
      //     if(temp[i].catalog==Cookie.get("catalog_id")){
      //         this.tableData.push(temp[i])
      //     }
      // }
      this.tableData = global.selectQuesCatalog;
      if (global.totalSelect.length != 0) {
        global.totalSelect.forEach((element) => {
          if (element.name == Cookie.get("catalog_id")) {
            this.multipleSelection = element.sel;
            this.listen = element.listen;
            this.read = element.read;
            this.write = element.write;
            this.multipleSelection.forEach((item) => {
              this.tableData.forEach((items, index) => {
                if (item.id == items.id) {
                  this.$nextTick(() => {
                    this.$refs.multipleTable.toggleRowSelection(
                      this.tableData[index],
                      true
                    );
                  });
                }
              });
            });
          }
        });
      }
      if (this.listen != 0 && this.read == 0 && this.write == 0) {
        this.selected = this.listen + "道听力题";
      } else if (this.listen == 0 && this.read != 0 && this.write == 0) {
        this.selected = this.read + "道阅读题";
      } else if (this.listen == 0 && this.read == 0 && this.write != 0) {
        this.selected = this.write + "道写作题";
      } else if (this.listen != 0 && this.read != 0 && this.write == 0) {
        this.selected = this.listen + "道听力题，" + this.read + "道阅读题";
      } else if (this.listen != 0 && this.read == 0 && this.write != 0) {
        this.selected = this.listen + "道听力题，" + this.write + "道写作题";
      } else if (this.listen == 0 && this.read != 0 && this.write != 0) {
        this.selected = this.read + "道阅读题" + this.write + "道写作题";
      } else if (this.listen != 0 && this.read != 0 && this.write != 0) {
        this.selected =
          this.listen +
          "道听力题，" +
          this.read +
          "道阅读题，" +
          this.write +
          "道写作题";
      } else {
        this.selected = "0道题";
      }
      // if(global.multipleSelectionCat.length!=0){
      //   this.multipleSelection = global.multipleSelectionCat
      //   this.multipleSelection.forEach(element=>{
      //   this.tableData.forEach((item,index)=>{
      //     if(element.id==item.id){
      //       this.$nextTick(()=>{
      //         this.$refs.multipleTable.toggleRowSelection(this.tableData[index],true);
      //       })
      //     }
      //   })
      // })
      // }
      // if (
      //   Cookie.get("selectedCat") != "" &&
      //   Cookie.get("selectedCat") != undefined
      // ) {
      //   this.selected = Cookie.get("selectedCat");
      // }
      //   var query = new BaaS.Query();
      // query.compare("catalog", "=", Cookie.get("catalog_id"));
      // let Question = new BaaS.TableObject("questions_information");
      //   Question.orderBy("-created_at")
      //   .limit(1000)
      //   .offset(0)
      //   .setQuery(query)
      //   .find()
      //   .then(
      //     (res) => {
      //       res.data.objects.forEach((element) => {
      //         let date = new Date(element.created_at * 1000);
      //         let Y = date.getFullYear() + "-";
      //         let M =
      //           date.getMonth() + 1 < 10
      //             ? "0" + (date.getMonth() + 1) + "-"
      //             : date.getMonth() + 1 + "-";
      //         let D =
      //           date.getDate() < 10
      //             ? "0" + date.getDate() + " "
      //             : date.getDate() + " ";
      //         let h =
      //           date.getHours() < 10
      //             ? "0" + date.getHours() + ":"
      //             : date.getHours() + ":";
      //         let m =
      //           date.getMinutes() < 10
      //             ? "0" + date.getMinutes() + ":"
      //             : date.getMinutes() + ":";
      //         let s =
      //           date.getSeconds() < 10
      //             ? "0" + date.getSeconds()
      //             : date.getSeconds();
      //         element.created_at = Y + M + D + h + m + s;
      //         if (element.question_content_id != null) {
      //           var query2 = new BaaS.Query();
      //           query2.compare("id", "=", element.question_content_id);
      //           let findContent = new BaaS.TableObject("question_content");
      //           findContent
      //             .setQuery(query2)
      //             .find()
      //             .then(
      //               (res) => {
      //                 if (res.data.objects[0].content != null) {
      //                   element.question_content_id =
      //                     res.data.objects[0].content;
      //                 } else if (res.data.objects[0].file_url != null) {
      //                   element.question_content_id =
      //                     res.data.objects[0].file_url.path;
      //                   this.srcList.push(element.question_content_id);
      //                 }
      //               },
      //               (err) => {
      //                 console.log(err);
      //               }
      //             );
      //         }
      //       });
      //       this.tableData = res.data.objects;
      //       this.initial = this.tableData;
      //     },
      //     (err) => {
      //       console.log(err);
      //     }
      //   );
    },
    add() {
      this.$router.go(-1);
    },
    back() {
      for (let i = 0; i < global.totalSelect.length; i++) {
        if (global.totalSelect[i].name == Cookie.get("catalog_id")) {
          global.totalSelect.splice(i, 1);
          break;
        }
      }
      this.$router.go(-1);
    },
    cancel() {
      this.listen = 0;
      this.read = 0;
      this.write = 0;
      this.selected = "0道题";
      this.multipleSelection.forEach((item) => {
        this.tableData.forEach((items, index) => {
          if (item.id == items.id) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(
                this.tableData[index],
                false
              );
            });
          }
        });
      });
      for (let i = 0; i < global.totalSelect.length; i++) {
        if (global.totalSelect[i].name == Cookie.get("catalog_id")) {
          global.totalSelect.splice(i, 1);
          break;
        }
      }
      this.multipleSelection = [];
    },
    handleSelectionChange(val, row) {
      // console.log(this.tinitial)
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
      console.log(row);
      // global.multipleSelectionCat = this.multipleSelection;
      this.listen = 0;
      this.read = 0;
      this.write = 0;
      if (this.multipleSelection.length != 0) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].primary_ques_type == "听力") {
            this.listen += 1;
          } else if (this.multipleSelection[i].primary_ques_type == "阅读") {
            this.read += 1;
          } else if (this.multipleSelection[i].primary_ques_type == "写作") {
            this.write += 1;
          }
        }
        if (this.listen != 0 && this.read == 0 && this.write == 0) {
          this.selected = this.listen + "道听力题";
        } else if (this.listen == 0 && this.read != 0 && this.write == 0) {
          this.selected = this.read + "道阅读题";
        } else if (this.listen == 0 && this.read == 0 && this.write != 0) {
          this.selected = this.write + "道写作题";
        } else if (this.listen != 0 && this.read != 0 && this.write == 0) {
          this.selected = this.listen + "道听力题，" + this.read + "道阅读题";
        } else if (this.listen != 0 && this.read == 0 && this.write != 0) {
          this.selected = this.listen + "道听力题，" + this.write + "道写作题";
        } else if (this.listen == 0 && this.read != 0 && this.write != 0) {
          this.selected = this.read + "道阅读题" + this.write + "道写作题";
        } else if (this.listen != 0 && this.read != 0 && this.write != 0) {
          this.selected =
            this.listen +
            "道听力题，" +
            this.read +
            "道阅读题，" +
            this.write +
            "道写作题";
        }
      } else {
        this.selected = "0道题";
      }
      if (global.totalSelect.length != 0) {
        for (let i = 0; i < global.totalSelect.length; i++) {
          if (global.totalSelect[i].name == Cookie.get("catalog_id")) {
            global.totalSelect.splice(i, 1);
            break;
          }
        }
      }
      let temp = {
        name: Cookie.get("catalog_id"),
        sel: this.multipleSelection,
        listen: this.listen,
        read: this.read,
        write: this.write,
      };
      global.totalSelect.push(temp);
      // Cookies.set("selectedCat", this.selected);
    },
    indexMethod(index) {
      return index + 1;
    },
    type_select(type) {
      if (type == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var type_select = new Array();
        type.forEach((element) => {
          this.tableData.forEach((item) => {
            if (element[1] == item.secondary_ques_type) {
              type_select.push(item);
            }
          });
        });
        if (type_select.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + type_select.length + "项数据",
            type: "success",
          });
          this.tableData = type_select;
        }
      }
    },
    use_clear() {
      this.tableData = this.initial;
    },
    title_search(val) {
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var title_search = new Array();
        this.tableData.forEach((element) => {
          if (
            (element.question_content_id != null &&
              element.question_content_id.search(val) != -1) ||
            (element.question != null && element.question.search(val) != -1) ||
            (element.options != null && element.options.search(val) != -1)
          ) {
            title_search.push(element);
          }
        });
        if (title_search.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + title_search.length + "项数据",
            type: "success",
          });
          console.log(title_search);
          this.tableData = title_search;
        }
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    check_edit(id, question) {
      // sessionStorage.setItem('tableData',JSON.stringify(this.tableData))
      // sessionStorage.setItem('multipleSelection',JSON.stringify(this.multipleSelection))
      Cookies.set("ques_checkEdit", id);
      if (
        (question && question.search(".png") != -1) ||
        question.search(".mp3") != -1
      ) {
        Cookies.set("question_file", question);
      } else {
        Cookies.set("question_content", question);
      }
      Cookies.set("selectQues", true);
      this.$router.push("/ques_checkEdit");
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.selectQues {
  padding: 20px 50px 0 50px;
}
.selectQues .back {
  padding: 0 10px;
  background-color: white;
  /* max-height: 1000px; */
  min-height: 1500px;
}
.selectQues .top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d8d8d8;
  line-height: 60px;
  margin-bottom: 20px;
}
.selectQues .ques_list {
  max-height: 1200px;
  overflow-y: scroll;
}
.selectQues .choose {
  background-color: #e8e8e8;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top: 10px;
  position: fixed;
  bottom: 0;
  left: 50px;
  right: 50px;
  z-index: 1;
}
.selectQues .choose .text {
  display: flex;
  flex-direction: row;
}
</style>