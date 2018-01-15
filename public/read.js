/* global Vue, VueRouter, axios, $ */

var router = new VueRouter({
  routes: [{ path: "/:id" }],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#app",
  router: router,
  data: function() {
    return {
      bookId: parseInt(this.$route.params.id),
      pages: [],
      book: "",
      author: ""
    };
  },
  created: function() {
    // check if logged in
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  },
  mounted: function() {
    // Create the turn book
    console.log("hello", $("#flipbook"));
    $("#flipbook").turn({
      width: 1000,
      height: 700,
      autoCenter: true
    });
    axios.get("/v1/books/" + this.bookId + "/read/").then(
      function(response) {
        console.log(response.data);
        this.pages = response.data.pages;
        this.book = response.data.book;
        this.author = response.data.author;
        // Title page
        $("#flipbook").turn(
          "addPage",
          $("<div class='hard'/>").html(this.book + " by " + this.author)
        );
        // Build pages line by line
        this.pages.forEach(function(page) {
          console.log(page.lines);
          var newPage = $("<div/>");
          page.lines.forEach(function(line) {
            // add lines to flipbook
            if (line.comments.length === 0) {
              newPage.append($("<div class='line'/>").html(line.text));
            } else {
              var newLine = $("<mark class='line' />").html(line.text);

              newPage.append(newLine);
            }
          });
          newPage.append(
            $("<div class='page-number'/>").html(page.page_number)
          );
          // add page to flipbook
          $("#flipbook").turn("addPage", newPage);
        });
        // add closing page
        $("#flipbook").turn("addPage", $("<div class='hard'/>").html(""));
      }.bind(this)
    );
  }
});
