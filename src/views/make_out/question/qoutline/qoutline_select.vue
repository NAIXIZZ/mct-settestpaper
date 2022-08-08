//医生-医生
<template>
  <div class="outline_second">
    <div class="top">
      <i class="el-icon-back" @click="back"></i>
      <h1 class="title">{{ title }}</h1>
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="input"
        clearable
        class="input"
        @input="search(input)"
        @clear="clear"
      >
      </el-input>
    </div>

    <div class="topic">
      <div
        class="card"
        v-for="cards in card"
        :key="cards.id"
        @click="pushto(cards.second_title)"
      >
        <div class="card_title">
          {{ cards.second_title }}
        </div>
        <div class="card_content" v-for="con in cards.content" :key="con.id">
          {{ con }}
        </div>
      </div>
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
      title: "",
      input: "",
      c: "",
      card: [],
      initial: [],
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
      this.title = Cookie.get("first_title");
      query.contains("first_title", this.title);
      let Topic = new BaaS.TableObject("topic_outline");
      Topic.setQuery(query)
        .find()
        .then(
          (res) => {
            console.log(res);
            this.card = res.data.objects;
            this.initial = res.data.objects;
          },
          (err) => {
            console.log(err);
          }
        );
    },
    back() {
      this.$router.go(-1);
    },
    pushto(val) {
      Cookies.set("second_title", val);
      this.$router.push("/qknowledge");
    },
    search(val) {
      if (val == "") {
        this.card = this.initial;
      } else {
        this.card = this.initial;
        var card_search = new Array();
        var search_id = [];
        this.card.forEach((element) => {
          if (element.second_title.search(val) != -1) {
            search_id.push(element.id);
          } else {
            try {
              element.content.forEach((item) => {
                if (item.search(val) != -1) {
                  search_id.push(element.id);
                  throw Error();
                }
              });
            } catch (e) {}
          }
        });
        if (search_id.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + search_id.length + "项数据",
            type: "success",
          });
          search_id.forEach((element) => {
            this.card.forEach((item) => {
              if (element == item.id) {
                card_search.push(item);
                return;
              }
            });
          });
          console.log(card_search);
          this.card = card_search;
        }
      }
    },
    clear() {
      this.card = this.initial;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.outline_second .top {
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.outline_second .el-icon-back {
  width: 200px;
  font-size: 25px;
}
.outline_second .title {
  width: 200px;
}
.outline_second .input {
  width: 200px !important;
}
.outline_second .topic {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
.outline_second .card {
  min-height: 200px;
  min-width: 350px;
  max-width: 300px;
  max-height: 300px;
  margin: 20px 70px 20px 70px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 15px #959ba1;
  padding: 10px;
}
.outline_second .card_title {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}
.outline_second .card_content {
  text-align: left;
  text-indent: 2em;
}
</style>