//资料
<template>
  <div class="materialCatalog">
    <div class="top_button">
      <div class="ques_search">
        <el-input
          v-model="input"
          placeholder="搜索题目或选项"
          clearable
          @clear="use_clear"
        ></el-input>
        <el-button type="success" @click="title_search(input)">搜索</el-button>
      </div>
      <h1 class="title">{{ catalog }}</h1>
      <div class="back">
        <el-button plain @click="back">返回</el-button>
      </div>
    </div>
    <el-table
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
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="材料内容">
              <span>{{ props.row.content }}</span>
              <img
                :src="props.row.file_url.path"
                alt=""
                v-if="
                  props.row.file_url &&
                  props.row.file_url.path.search('.png') != -1
                "
              />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column label="材料内容" prop="content" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="图片/音频" prop="file_url">
        <template slot-scope="scope">
          <audio
            :src="scope.row.file_url.path"
            controls="controls"
            v-if="
              scope.row.file_url && scope.row.file_url.path.search('.mp3') != -1
            "
          ></audio>
          <el-image
            style="width: 150px"
            :preview-src-list="srcList"
            :src="scope.row.file_url.path"
            v-if="
              scope.row.file_url && scope.row.file_url.path.search('.png') != -1
            "
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <div>
            <el-button type="success" plain @click="checkQuesP(scope.row.id)"
              >查看题目/试卷</el-button
            >
            <el-button type="warning" plain @click="handleSet(scope.row.id)"
              >出题/出卷</el-button
            >
            <el-button type="danger" plain>删除</el-button>
            <el-button type="primary" plain>移动到</el-button>
            <!-- <el-button type="primary" plain @click="checkMaterial(scope.row.id)"
            >查看</el-button
          > -->
          </div>
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
    <div class="trash">
      <el-button type="primary" icon="el-icon-delete">回收站</el-button>
    </div>
    <el-dialog title="自动出题" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="题目数量：" :label-width="formLabelWidth">
          <el-input v-model="form.quesnum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目类型：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择题型"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setQues">保存到题库</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
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
      catalog: "",
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
      // catalog: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      this.catalog = Cookie.get("catalog");
      let query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      let query2 = new BaaS.Query();
      query2.compare("catalog", "=", this.catalog);
      let andQuery = BaaS.Query.and(query, query2);
      let Material = new BaaS.TableObject("question_content");
      Material.limit(1000)
        .offset(0)
        .setQuery(andQuery)
        .orderBy("-created_at")
        .find()
        .then(
          (res) => {
            if (
              res.data.objects.length == 1 &&
              res.data.objects[0].file_url == null &&
              res.data.objects[0].content == null
            ) {
              this.tableData = [];
            } else {
              res.data.objects.forEach((element) => {
                if (
                  element.file_url != null &&
                  (element.file_url.path.search(".png") != -1 ||
                    element.file_url.path.search(".jpg") != -1 ||
                    element.file_url.path.search(".gif") != -1)
                ) {
                  this.srcList.push(element.file_url.path);
                }
              });
              this.tableData = res.data.objects;
              this.initial = res.data.objects;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    title_search(val) {
      console.log(val);
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
    use_clear() {
      this.tableData = this.initial;
    },
    rename(row) {
      row.rename = true;
      this.previousName = row.catalog;
    },
    renameDefine(index, row) {
      let query = new BaaS.Query();
      query.compare("catalog", "=", row.catalog);
      let Catalog = new BaaS.TableObject("question_content");
      Catalog.setQuery(query)
        .find()
        .then(
          (res) => {
            console.log(res);
            if (res.data.objects.length == 0) {
              let catalog = Catalog.getWithoutData(row.id);
              catalog.set("catalog", row.catalog);
              catalog.update().then(
                (res) => {
                  console.log(res);
                  row.rename = false;
                  this.$message({
                    message: "文件重命名成功",
                    type: "success",
                  });
                },
                (err) => {
                  console.log(err);
                }
              );
            } else {
              this.$message({
                message: "该文件名已存在，请重新命名",
                type: "error",
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    cancelRename(index, row) {
      console.log(index);
      row.catalog = this.previousName;
      row.rename = false;
      this.previousName = "";
    },
    delCatalog(index, row) {
      console.log(row.id);
      let Catalog = new BaaS.TableObject("question_content");
      Catalog.delete(row.id).then(
        (res) => {
          console.log(res);
          this.tableData.splice(index, 1);
          this.$message({
            message: "文件删除成功",
            type: "success",
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    checkQuesP(id) {
      Cookies.set("material_id", id);
      this.$router.push("checkQuesP");
    },
    handleSet(val) {
      Cookies.set("material_id", val);
      this.dialogFormVisible = true;
    },
    setQues() {
      this.dialogFormVisible = false;
    },
    checkMaterial(id) {
      Cookies.set("material_id", id);
      this.$router.push("checkMaterial");
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
    back() {
      Cookies.set("catalog", "");
      this.$router.go(-1);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.materialCatalog {
  padding: 20px 20px;
}
.materialCatalog .top_button {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.materialCatalog .ques_search {
  flex: 1;
}
.materialCatalog .title {
  flex: 2;
}
.materialCatalog .back {
  flex: 1;
}
.materialCatalog .el-table {
  padding-left: 30px;
}
.materialCatalog .demo-table-expand {
  font-size: 0;
}
.materialCatalog .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.materialCatalog .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  margin-left: 57px;
}
.materialCatalog .el-dialog {
  width: 450px;
}
.materialCatalog .el-cascader {
  width: 100%;
}
.materialCatalog .trash {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>