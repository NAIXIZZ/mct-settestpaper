//医学专业词汇大纲
<template>
  <div>
    <div class="medical_top">
      <el-input
        placeholder="请输入要查找的词语"
        prefix-icon="el-icon-search"
        v-model="input"
        clearable
        class="word_search"
        @input="search(input)"
        @clear="clear"
      >
      </el-input>
      <div class="voc_title">
        <h1>医学专业词汇大纲</h1>
        <el-tooltip class="item" effect="dark" placement="right">
          <!-- <el-button type="primary" circle><i class="el-icon-info"></i></el-button> -->
          <div slot="content">
            * 词性标注原则：<br />
            <hr />
            1.疾病名称统一标注为名词；疾病症状类词语以《现代汉语词典（第7版）》为准。
            <br />2.《现代汉语词典（第7版）》未收录词语，根据构词方式，按该词语中心语素的词性进行标注。
            <br />3.多义词按医学上常用义项标注词性，通用汉语使用的义项一般不再另做标注。
            <br />4.短语（词组）不标注词性。 <br />5.词表中“不”标注变调。
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <el-select
        v-model="value"
        clearable
        placeholder="请选择等级"
        class="level_select"
        @change="level_select(value)"
        @clear="level_clear"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      border
      style="width: 100%"
    >
      <el-table-column prop="words" label="词语" sortable> </el-table-column>
      <el-table-column prop="part_of_speech" label="词性" sortable> </el-table-column>
      <el-table-column prop="pinyin" label="拼音" sortable> </el-table-column>
      <el-table-column prop="level" label="等级" sortable> </el-table-column>
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
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      tableData: [],
      initial: [],
      currentPage: 1,
      pageSize: 10,
      options: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
      ],
      value: "",
      input: "",
    };
  },
  methods: {
    voc_all() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let Vocabulary = new BaaS.TableObject("vocabulary_outline");
      Vocabulary.limit(1000)
        .offset(0)
        .find()
        .then(
          (res) => {
            res.data.objects.forEach((element) => {
              // if (element.level == "1") {
              //   element.level = "一级";
              // } else if (element.level == "2") {
              //   element.level = "二级";
              // } else if (element.level == "3") {
              //   element.level = "三级";
              // }
              this.tableData.push(element);
            });
            Vocabulary.limit(1000)
              .offset(1000)
              .find()
              .then(
                (res) => {
                  res.data.objects.forEach((element) => {
                    // if (element.level == "1") {
                    //   element.level = "一级";
                    // } else if (element.level == "2") {
                    //   element.level = "二级";
                    // } else if (element.level == "3") {
                    //   element.level = "三级";
                    // }
                    this.tableData.push(element);
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
      this.initial = this.tableData;
    },
    search(val) {
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var word_search = new Array();
        this.tableData.forEach((element) => {
          if (element.words.search(val) != -1) {
            word_search.push(element);
          }
        });
        if (word_search.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + word_search.length + "项数据",
            type: "success",
          });
          console.log(word_search);
          this.tableData = word_search;
        }
      }
    },
    clear() {
      this.tableData = this.initial;
    },
    level_select(val) {
      this.tableData = this.initial;
      var voc_level = new Array();
      this.tableData.forEach((element) => {
        if (element.level == val) {
          voc_level.push(element);
        }
      });
      this.tableData = voc_level;
    },
    level_clear() {
      this.tableData = this.initial;
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
  },
  mounted() {
    this.voc_all();
  },
};
</script>
<style>
.medical_top {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.word_search .el-input__inner,
.level_select .el-input {
  width: 250px;
}
.voc_title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.el-icon-info {
  color: #3eaeff;
}
.footer {
  margin-top: 15px;
}
</style>