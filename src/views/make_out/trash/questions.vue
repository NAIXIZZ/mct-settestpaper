//资料
<template>
  <div class="material">
    <div class="top_button">
      <div class="ques_search">
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
        <el-input
          v-model="input"
          placeholder="搜索题目或选项"
          clearable
          @clear="use_clear"
        ></el-input>
        <el-button type="success" @click="title_search(input)">搜索</el-button>
      </div>
      <div>
        <el-button type="danger" plain @click="multipleDel">删除选中</el-button>
        <el-button type="primary" plain @click="multipleMove"
          >还原选中</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" :index="indexMethod"> </el-table-column>
      <el-table-column label="文件夹" prop="catalog">
        <template slot-scope="scope">
          <div class="folder" v-show="scope.row.catalog != null">
            <i class="el-icon-folder"></i>
            <span>{{ scope.row.catalog }}</span>
          </div>
        </template>
      </el-table-column>
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
              scope.row.question_content_id.search('.png') != -1
            "
          ></el-image>
          <p v-else>{{ scope.row.question_content_id }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="primary_ques_type" label="一级题型">
      </el-table-column>
      <el-table-column prop="secondary_ques_type" label="二级题型">
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.primary_ques_type != null"
            type="success"
            plain
            @click="check_edit(scope.row.id, scope.row.question_content_id)"
            >查看</el-button
          >
          <el-button type="danger" plain @click="delDefine(scope.row, 1)"
            >删除</el-button
          >
          <el-button type="primary" plain @click="moveTo(scope.row, 1)"
            >还原</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="删除"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定删除该文件？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delContent">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="还原"
      :visible.sync="moveVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定还原该文件？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="to">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import Cookie from "js-cookie";
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      loading: true,
      questionsCatalog: [],
      type: "",
      dialogVisible: false,
      preMove: [],
      multipleSelection: [],
      moveVisible: false,
      cataContent: [],
      delCD: false,
      delC: "",
      delCN: 0,
      input: "",
      tableData: [],
      initial: [],
      dialogFormVisible: false,
      form: {
        quesnum: "",
      },
      formLabelWidth: "120px",
      srcList: [],
      addMore: true,
      previousName: "",
      currentPage: 1,
      pageSize: 10,
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
              value: "选择正确词语填空",
              label: "选择正确词语填空",
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
        },
      ],
      catalog: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      let query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      let q2 = new BaaS.Query();
      q2.compare("is_delete", "=", true);
      let andQuery = BaaS.Query.and(query, q2);
      let Material = new BaaS.TableObject("questions_information");
      Material.limit(1000)
        .offset(0)
        .setQuery(andQuery)
        .orderBy("-created_at")
        .find()
        .then(
          (res) => {
            res.data.objects.forEach((element) => {
              if (element.question_content_id != null) {
                var query = new BaaS.Query();
                query.compare("id", "=", element.question_content_id);
                let findContent = new BaaS.TableObject("question_content");
                findContent
                  .setQuery(query)
                  .find()
                  .then(
                    (res) => {
                      if (res.data.objects[0].content != null) {
                        element.question_content_id =
                          res.data.objects[0].content;
                      } else if (res.data.objects[0].file_url != null) {
                        element.question_content_id =
                          res.data.objects[0].file_url.path;
                        this.srcList.push(element.question_content_id);
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }
            });
            this.loading = false;
            this.tableData = res.data.objects;
            this.initial = res.data.objects;
          },
          (err) => {
            console.log(err);
          }
        );
    },
    title_search(val) {
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var title_search = new Array();
        this.tableData.forEach((element) => {
          if (element.content != null && element.content.search(val) != -1) {
            title_search.push(element);
          } else if (
            element.catalog != null &&
            element.catalog.search(val) != -1
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
          console.log(type_select);
          this.tableData = type_select;
        }
      }
    },
    use_clear() {
      this.tableData = this.initial;
    },
    delDefine(row, type) {
      if (type == 1) {
        this.preMove.push(row.id);
      } else if (type == 2) {
        this.preMove = row;
      }
      this.dialogVisible = true;
    },
    delContent() {
      const loading = this.$loading({
        lock: true,
        text: "正在删除，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      for (let i = 0; i < this.preMove.length; i++) {
        let findCata = new BaaS.TableObject("questions_information");
        findCata.delete(this.preMove[i]).then(
          (res) => {
            console.log(res);
            if (i == this.preMove.length - 1) {
              loading.close();
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.init();
              this.dialogVisible = false;
            }
          },
          (err) => {
            loading.close();
            this.$message({
              message: "删除失败",
              type: "warning",
            });
            this.init();
            this.dialogVisible = false;
            console.log(err);
          }
        );
      }
    },
    moveTo(val, type) {
      if (type == 1) {
        let f = false;
        if (val.content == null && val.file_url == null) {
          for (let i = 0; i < this.questionsCatalog.length; i++) {
            if (val.catalog == this.questionsCatalog[i].catalog) {
              f = true;
              this.$message({
                message: val.catalog + "文件夹已存在，请改名或取消还原",
                type: "warning",
              });
            }
          }
          if (f == false) {
            this.preMove.push(val.id);
            this.moveVisible = true;
          }
        } else {
          this.preMove.push(val.id);
          this.moveVisible = true;
        }
      } else if (type == 2) {
        this.preMove = val;
        this.moveVisible = true;
      }
    },
    to() {
      const loading = this.$loading({
        lock: true,
        text: "正在还原，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      for (let i = 0; i < this.preMove.length; i++) {
        console.log(this.preMove[i]);
        let Catalog = new BaaS.TableObject("questions_information");
        let cata = Catalog.getWithoutData(this.preMove[i]);
        cata.set("is_delete", false);
        cata.update().then(
          (res) => {
            console.log(res);
            loading.close();
            this.$message({
              message: "还原成功",
              type: "success",
            });
            this.init();
            let temp = {
              have: false,
              finish: true,
              rename: false,
              catalog: res.data.catalog,
            };
            this.questionsCatalog.push(temp);
            this.moveVisible = false;
          },
          (err) => {
            loading.close();
            this.$message({
              message: "还原失败",
              type: "warning",
            });
            this.init();
            this.moveVisible = false;
            console.log(err);
          }
        );
      }
    },
    multipleDel() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择删除项",
          type: "warning",
        });
      } else {
        let temp = [];
        this.multipleSelection.forEach((element) => {
          temp.push(element.id);
        });
        this.delDefine(temp, 2);
      }
    },
    multipleMove() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择还原项",
          type: "warning",
        });
      } else {
        let cata = "";
        let c = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].question_content_id == null) {
            c.push(this.multipleSelection[i]);
            for (let j = 0; j < this.questionsCatalog.length; j++) {
              if (
                this.multipleSelection[i].catalog ==
                this.questionsCatalog[j].catalog
              ) {
                cata += this.multipleSelection[i].catalog + " ";
                break;
              }
            }
          }
        }
        const map = new Map();
        const qc = c.filter(
          (key) => !map.has(key.catalog) && map.set(key.catalog, 1)
        );
        if (qc.length != c.length) {
          this.$message({
            message: "不能还原多个同名空文件夹",
            type: "warning",
          });
        } else if (cata != "") {
          this.$message({
            message: cata + "文件夹已存在，请改名或取消还原",
            type: "warning",
          });
        } else {
          let temp = [];
          this.multipleSelection.forEach((element) => {
            temp.push(element.id);
          });
          this.moveTo(temp, 2);
        }
      }
    },
    check_edit(id, question) {
      Cookies.set("ques_checkEdit", id);
      if (
        (question && question.search(".png") != -1) ||
        question.search(".mp3") != -1
      ) {
        Cookies.set("question_file", question);
      } else {
        Cookies.set("question_content", question);
      }
      Cookies.set("selectQues", "true");
      Cookies.set("trash", "questions");
      this.$router.push("/ques_checkEdit");
    },
    handleClose() {
      this.preMove = [];
      this.moveVisible = false;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
  },
  created() {},
  mounted() {
    this.questionsCatalog = JSON.parse(
      sessionStorage.getItem("questionsCatalog")
    );
    this.init();
  },
};
</script>
<style>
</style>