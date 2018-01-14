/* global Vue, VueRouter, axios, initalizeTheme */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome, ",
      bookshelves: [],
      submitNewName: "",
      NewShelfName: "",
      currentUser: {},
      books: []
    };
  },
  created: function() {
    axios
      .get("/v1/current_user")
      .then(
        function(response) {
          this.currentUser = response.data;
          this.message += this.currentUser.name;
          // console.log(this.currentUser);
          axios.get("/v1/book_shelves").then(
            function(response) {
              this.bookshelves = response.data;
              // console.log(response.data);
              // generate full book list
              response.data.forEach(
                function(shelf) {
                  shelf.books.forEach(
                    function(book) {
                      var classifiedTitle = shelf.title.split(" ").join("-");
                      book.shelf = classifiedTitle;
                      this.books.push(book);
                      console.log(classifiedTitle);
                    }.bind(this)
                  );
                }.bind(this)
              );
              console.log(this.books);
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
    },
    toggleActive: function(shelfID) {
      console.log(shelfID);
      var shelfIndex = this.bookshelves.findIndex(function(shelf) {
        return shelf.id === shelfID;
      });
      this.bookshelves[shelfIndex] = true;
    },
    filterBookData: function() {}
  },
  computed: {}
};

var BookSummaryPage = {
  template: "#book-page",
  data: function() {
    return {
      bookId: this.$route.params.id,
      info: {},
      bookshelves: [],
      currentUser: {},
      selectedShelf: "",
      comment: ""
    };
  },
  created: function() {
    axios.get("/v1/books/" + this.$route.params.id).then(
      function(response) {
        this.info = response.data;
        console.log(this.info);
      }.bind(this)
    );

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
  mounted: function() {
    initalizeTheme();
  },
  methods: {
    shelveABook: function(bookId) {
      axios
        .post("/v1/book_selections", {
          book_id: this.$route.params.id,
          book_shelf_title: this.selectedShelf
        })
        .then(function(response) {
          router.push("/");
        })
        .catch(function(error) {
          console.log(error.response.data.errors);
        });
    },
    addComment: function() {
      var params = {};
      params.comment = this.comment;
      params.id = this.bookId;
      params.commented = "Book";
      axios
        .post("v1/comments", params)
        .then(
          function(response) {
            this.info.comments.push(response.data);
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  computed: {}
};

var AddBookPage = {
  //probably makes more sense as a modal on home page
  template: "#add-book-page",
  data: function() {
    return {
      booksOnfile: [],
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
  },
  computed: {}
};

var SearchBookPage = {
  template: "#search-book-page",
  data: function() {
    return {
      searching: true,
      booksOnfile: [],
      bookInfo: {},
      errors: []
    };
  },
  created: function() {
    var url = "v1/books/";
    axios.get(url).then(
      function(response) {
        console.log(response.data);
        this.booksOnfile = response.data;
      }.bind(this)
    );
  },
  methods: {},
  computed: {}
};

// on mothballs
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
        console.log(response.data);
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
    { path: "/book/search/", component: SearchBookPage }, // maybe cuttable
    { path: "/books/:id/read", component: BookReadPage },
    { path: "/book/:id", component: BookSummaryPage },
    { path: "/bookshelves/:id", component: BookShelfPage }, //likely cuttable
    { path: "/sign_up", component: SignUpPage }, //move to modal
    { path: "/login", component: LoginPage }, //move to modal
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
  data: function() {
    return {
      searchTerm: ""
    };
  },
  methods: {
    search: function() {
      router.push("/book/search?title=" + this.searchTerm);
      this.searchTerm = "";
    }
  }
});
