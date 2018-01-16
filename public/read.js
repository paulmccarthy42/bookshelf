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
      author: "",
      currentLeftPage: 0,
      currentRightPage: 1
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
    // hook pages into vue data
    $("#flipbook").bind(
      "turning",
      function(event, page, view) {
        console.log("turning", event, page, view);
        this.currentRightPage = view[0];
        this.currentPageLeft = view[1];
      }.bind(this)
    );
    // Build the book
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
          // add lines to flipbook
          page.lines.forEach(function(line) {
            // add uncommented line
            if (line.comments.length === 0) {
              newPage.append($("<div class='line'/>").html(line.text));
              // add commented line as mark
            } else {
              var newLine = $("<div class='line'/>").html(
                $("<div class='tool-tip-line' />").html(line.text)
              );
              var text = "";
              line.comments.forEach(function(comment) {
                text += "- ";
                text += comment.comment_text;
                text += "<br>";
              });
              newLine.append($("<span class='tool-tip-info' />").html(text));

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
  },
  methods: {
    checkPage: function() {
      // this.currentPage = $("#flipbook").turn("page");
      // console.log("hello", $("#flipbook").turn("page"));
      console.log("goodbye", this.currentPage);
    }
  }
});
