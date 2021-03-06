/* global Vue, VueRouter, axios, initalizeTheme, $ */

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
          console.log(this.currentUser);
          axios.get("/v1/book_shelves").then(
            function(response) {
              var shelves = response.data;
              shelves.forEach(function(shelf) {
                shelf.classTitle = shelf.title.split(" ").join("-");
              });
              this.bookshelves = shelves;
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
      // console.log("hello", shelfClassTitle);
      // $("a.shelfClassTitle").toggleClass("active");
      console.log("start", shelfID);
      // var shelfIndex = this.bookshelves.findIndex(
      //   function(shelf) {
      //     console.log("inner", shelf.id);
      //     return shelf.id === shelfID;
      //   }.bind(this)
      // );
      var shelfIndex = -1;
      var innerIndex = 0;
      this.bookshelves.forEach(function(shelf) {
        if (shelf.id === shelfID) {
          shelfIndex = innerIndex;
        }
        innerIndex += 1;
      });
      this.bookshelves[shelfIndex].isActive = true;

      // console.log("end", this.bookshelves[shelfIndex]);
      // console.log("all shelves", this.bookshelves);
    },
    test: function(shelf) {
      console.log(shelf);
    },
    signedIn: function() {
      console.log(this.$parent.$data.signedIn);
      return this.$parent.$data.signedIn;
    }
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
      comment: "",
      subcommentsText: {},
      description: []
    };
  },
  created: function() {
    axios.get("/v1/books/" + this.$route.params.id).then(
      function(response) {
        this.info = response.data;
        this.description = response.data.description.split("\n");
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
    // initalizeTheme();
    console.log("hello");
    $(".site-hero_2").css("background-image", "url(info.cover_image)");
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
            this.comment = "";
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
    },
    addSubComment: function(parentCommentId) {
      var params = {};
      var subcommentText = this.subcommentsText;
      console.log("TEXT", subcommentText);
      params.comment = subcommentText;
      params.id = parentCommentId;
      params.commented = "Comment";
      axios
        .post("v1/comments", params)
        .then(
          function(response) {
            var comments = this.info.comments;
            console.log("hello", comments, parentCommentId);
            var commentIndex = comments.findIndex(function(comment) {
              return comment.id === parentCommentId;
            });
            console.log(commentIndex);
            console.log(comments[commentIndex]);

            comments[commentIndex].subcomments.push(response.data);
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
      errors: [],
      OCRText: "",
      newBook: {},
      searchedBook: ""
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
  methods: {
    uploadFile: function(event) {
      console.log(event.target.files[0]);
      if (event.target.files.length > 0) {
        var fileCreated = new FormData();
        fileCreated.append("image", event.target.files[0]);
        axios
          .post("v1/images", fileCreated)
          .then(
            function(response) {
              console.log(response.data.grpc.description);
              this.OCRText = response.data.grpc.description;
            }.bind(this)
          )
          .catch(function(error) {
            console.log("fatal error. please try again");
          });
      }
    },
    submitBook: function() {
      console.log(this.newBook);
      this.newBook.OCRText = this.OCRText;
      axios
        .post("/v1/books", this.newBook)
        .then(function(response) {
          console.log(response.data);
          this.OCRText = "";
          this.newBook = {};
          this.booksOnfile.push(response.data);
          location.reload();
          // UNTESTED
        })
        .catch(function(errors) {
          console.log(errors);
          location.reload();
        });
    }
  },
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

var TestPage = {
  template: "#test-page",
  created: console.log("hello")
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/book/search/", component: SearchBookPage }, // maybe cuttable
    { path: "/book/:id", component: BookSummaryPage },
    // { path: "/bookshelves/:id", component: BookShelfPage },
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
  data: function() {
    return { email: "", password: "", errors: [], signedIn: false };
  },
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
      this.signedIn = true;
    }
  },

  methods: {
    toggleHeader: function() {
      $(".box-menu-icon").toggleClass("is-clicked");
      $(".box-header").toggleClass("menu-is-open");

      if ($(".box-primary-nav").hasClass("is-visible")) {
        $(".box-primary-nav")
          .removeClass("is-visible")
          .one(
            "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function() {
              $("body").removeClass("overflow-hidden");
            }
          );
      } else {
        $(".box-primary-nav")
          .addClass("is-visible")
          .one(
            "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function() {
              $("body").addClass("overflow-hidden");
            }
          );
      }
    },
    test: function() {
      console.log(this.signedIn);
    },
    signup: function() {
      axios
        .post("v1/users", this.newUser)
        .then(function(response) {
          router.push("/login");
        })
        .catch(function(error) {
          console.log(error.response.data.errors);
        });
    },
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
          this.signedIn = true;
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
  watch: {
    $route: function() {
      console.log("changed route...");
      location.reload();
    }
  }
});
