/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Mah Capstone!",
      books: []
    };
  },
  created: function() {
    axios.get("/v1/books").then(
      function(response) {
        this.books = response.data;
      }.bind(this)
    );
  },
  methods: {},
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
      bookInfo: {}
    };
  },
  created: function() {},
  methods: {
    searchGutenberg: function() {
      // check and see if already found
      axios
        .get("https://gutenbergapi.org/texts/" + this.bookInfo.gutenberg_id)
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
          this.toggleSearching();
        }.bind(this)
      );
    }
    // second method pushing gberg data to database and calling page controllers
  },
  computed: {}
};

// var BookReadPage = {
//   template: "#read-page",
//   data: function() {
//     return {
//       text: ""
//     };
//   },
//   created: function() {
//     var params = {};
//     axios.get("/v1/pages/" + this.$route.params.id + "/read");
//   },
//   methods: {},
//   computed: {}
// };

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    // { path: "/book/:id/read/:page_number", component: BookReadPage },
    { path: "/book/new", component: AddBookPage },
    { path: "/book/:id", component: BookSummaryPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#app",
  router: router
});
