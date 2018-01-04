/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome, ",
      bookshelves: [],
      submitNewName: "",
      NewShelfName: "",
      currentUser: {}
    };
  },
  created: function() {
    // refactor so book shelves and all other information are pulled upon confirmation of login
    axios
      .get("/v1/current_user")
      .then(
        function(response) {
          this.currentUser = response.data;
          this.message += this.currentUser.name;
          console.log(this.currentUser);
          axios.get("/v1/book_shelves").then(
            function(response) {
              this.bookshelves = response.data;
              console.log(response.data);
            }.bind(this)
          );
        }.bind(this)
      )
      .catch(
        function(error) {
          this.message = "Please log in";
        }.bind(this)
      );
  },
  methods: {
    submitNewShelf: function() {
      console.log("Hello");
      axios
        .post("v1/book_shelves", { title: this.NewShelfName })
        .then(
          function(response) {
            console.log(response.data);
            this.bookshelves.push(response.data);
            this.NewShelfName = "";
          }.bind(this)
        )
        .catch(function(error) {
          console.log();
        })
        .catch(function(error) {
          console.log("BOOM");
          console.log(error.response.data.errors);
        });
    }
  },
  computed: {}
};

var BookSummaryPage = {
  template: "#book-page",
  data: function() {
    return {
      message: "Welcome to Book #" + this.$route.params.id,
      info: {}
    };
  },
  created: function() {
    axios.get("/v1/books/" + this.$route.params.id).then(
      function(response) {
        this.info = response.data;
      }.bind(this)
    );
  },
  methods: {},
  computed: {}
};

var AddBookPage = {
  template: "#add-book-page",
  data: function() {
    return {
      searching: true,
      booksOnfile: [],
      bookInfo: {},
      errors: []
    };
  },
  created: function() {
    axios.get("v1/books").then(
      function(response) {
        this.booksOnfile = response.data;
      }.bind(this)
    );
  },
  methods: {
    searchGutenberg: function() {
      // check and see if already found
      axios
        .get("https://gutenbergapi.org/texts/" + this.bookInfo.gutenberg_id) //breaks if you use jwt in header
        .then(
          function(response) {
            this.bookInfo.title = response.data.metadata.title[0];
            this.bookInfo.author = response.data.metadata.author[0];
            this.bookInfo.language = response.data.metadata.language[0];
            console.log(this.bookInfo.gutenberg_id);
            axios
              .get("/v1/books/check", {
                params: { gutenberg_id: this.bookInfo.gutenberg_id }
              })
              .then(
                function(response) {
                  if (response.data === "pass") {
                    console.log("true");
                    this.toggleSearching();
                  } else {
                    console.log("false");
                    return false;
                  }
                }.bind(this)
              );
          }.bind(this)
        );
    },
    toggleSearching: function() {
      this.searching = !this.searching;
    },
    submitNewBook: function() {
      axios.post("/v1/books", this.bookInfo).then(
        function() {
          router.push("/");
        }.bind(this)
      );
    },
    shelveABook: function(bookId) {
      axios
        .post("/v1/book_selections", {
          book_id: bookId,
          book_shelf_id: this.$route.params.book_shelf_id
        })
        .then(function(response) {
          router.push("/");
        })
        .catch(function(error) {
          console.log(error.response.data.errors);
        });
    }
    // second method pushing gberg data to database and calling page controllers
  },
  computed: {}
};

var BookReadPage = {
  template: "#read-page",
  data: function() {
    return {
      pages: [],
      bookId: parseInt(this.$route.params.id)
    };
  },
  created: function() {
    console.log("hello");
    var params = {};
    axios.get("/v1/books/" + this.bookId + "/read/").then(
      function(response) {
        this.pages = response.data;
      }.bind(this)
    );
  },
  methods: {},
  computed: {}
};

var BookShelfPage = {
  template: "#bookshelf-page",
  data: function() {
    return {
      message: "Welcome",
      bookshelf: [],
      NewShelfName: ""
    };
  },
  created: function() {
    axios.get("/v1/book_shelves/" + this.$route.params.id).then(
      function(response) {
        this.bookshelf = response.data;
        console.log(response.data);
      }.bind(this)
    );
  },
  methods: {},
  computed: {}
};

var SignUpPage = {
  template: "#signup-page",
  data: function() {
    return {
      message: "Please enter your account information",
      newUser: {}
    };
  },
  methods: {
    signup: function() {
      axios
        .post("v1/users", this.newUser)
        .then(function(response) {
          router.push("/login");
        })
        .catch(function(error) {
          console.log(error.response.data.errors);
        });
    }
  },
  computed: {}
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      message: "Please enter your account information",
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  },
  computed: {}
};

var LogoutPage = {
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/book/search/", component: AddBookPage },
    { path: "/book/new/:book_shelf_id", component: AddBookPage },
    { path: "/books/:id/read", component: BookReadPage },
    { path: "/book/:id", component: BookSummaryPage },
    { path: "/bookshelves/:id", component: BookShelfPage },
    { path: "/sign_up", component: SignUpPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  },
  methods: {
    search: function() {}
  }
});
