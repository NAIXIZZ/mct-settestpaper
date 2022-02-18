//登录
<template>
<div>
  <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">登录</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <input v-model="loginForm.email" type="email" class="form-control" aria-describedby="emailHelp" placeholder="请输入邮箱">
          </div>
          <div class="form-group">
            <input v-model="loginForm.password" type="password" class="form-control" placeholder="请输入密码">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="openRegisterModal" data-dismiss="modal">去注册</button>
          <button type="button" class="btn btn-primary" @click="handleLogin">登录</button>
        </div>
      </div>
    </div>
  </div>
  <!--注册模态框-->
<div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">注册</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <input v-model="registerForm.email" type="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email">
          </div>
          <div class="form-group">
            <input v-model="registerForm.password" type="password" class="form-control" placeholder="Password">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="openLoginModal" data-dismiss="modal">去登录</button>
          <button type="button" class="btn btn-primary" @click="handleRegister">注册</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
  <script src="https://cdn.bootcss.com/vue/2.5.22/vue.js"></script>
  <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
          crossorigin="anonymous"></script>
  <script src="https://cdn.bootcss.com/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
          crossorigin="anonymous"></script>
  <script src="https://cdn.bootcss.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
          crossorigin="anonymous"></script>
<script>
// import Vue from 'vue'
export default {

  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        email: '',
        password: '',
      }
    }
  },
  methods: {
    // createBook() {
    //   if (!this.creatingBookName) return false
    //   let record = BookShelf.create()
    //   record.set({
    //     bookName: this.creatingBookName
    //   }).save().then(res => {
    //     this.creatingBookName = ''
    //     this.bookList.push({
    //       id: res.data.id,
    //       bookName: res.data.bookName,
    //       disabled: true,
    //     })
    //   })
    // },
    // editBook(book) {
    //   if (book.disabled) {
    //     book.disabled = false
    //   } else {
    //     let record = BookShelf.getWithoutData(book.id)
    //     record.set({bookName: book.bookName}).update().then(res => {
    //       book.disabled = true
    //     })
    //   }
    // },
    // deleteBook(book) {
    //   BookShelf.delete(book.id).then(() => {
    //     this.bookList = this.bookList.filter(v => {
    //       return v.id !== book.id
    //     })
    //   })
    // },
    // getBookList() {
    //   BookShelf.offset(0).limit(10).find().then(res => {
    //     res.data.objects.forEach(v => {
    //       this.bookList.push({
    //         id: v.id,
    //         bookName: v.bookName,
    //         disabled: true,
    //       })
    //     })
    //   })
    // },
    openLoginModal() {
      $('#loginModal').modal()
    },
    openRegisterModal() {
      $('#registerModal').modal()
    },
    handleLogin() {
      let BaaS = window.BaaS
      BaaS.auth.login(this.loginForm).then(() => {
        $('#loginModal').modal('hide')
        // this.init()
      })
    },
    handleRegister() {
      let BaaS = window.BaaS
      BaaS.auth.register(this.registerForm).then(() => {
        $('#registerModal').modal('hide')
        // this.init()
      })
    },
    // init() {
    //   this.getBookList()
    // },
  },
  mounted() {
    let BaaS = window.BaaS
    let cacheKey = 'ifanrx_clientID'
    if (!localStorage.getItem(cacheKey)) {
      while (true) {
        let clientID = window.prompt('请输入 clientID')  // 从 BaaS 后台获取 ClientID
        if (clientID && clientID.match(/\w{20}/)) {
          localStorage.setItem(cacheKey, clientID) // 若输入了错误的 clientID，可以清空 localStorage
          break
        }
      }
    }
    BaaS.init(localStorage.getItem(cacheKey))
    BaaS.auth.getCurrentUser().then(() => {
      // this.init()
    }).catch(e => {
      this.openLoginModal()
    })
  }

}

// export default {
//   name: '',
//   components: {},
//   props: {},
//   data() {
//     return {
//     };
//   },
//   methods: {
    
//   },
// };
</script>
<style>

</style>