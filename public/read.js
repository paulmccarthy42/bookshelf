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
      pages: []
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
        this.pages = response.data;
        // build pages line by line
        $("#flipbook").turn(
          "addPage",
          $("<div class='hard'/>").html(
            this.pages[0].book + " by " + this.pages[0].author
          )
        );
        this.pages.forEach(function(page) {
          console.log(page.lines);
          var newPage = $("<div/>");
          page.lines.forEach(function(line) {
            newPage.append($("<div class='line'/>").html(line.text));
          });

          $("#flipbook").turn("addPage", newPage);
        });
        $("#flipbook").turn("addPage", $("<div class='hard'/>").html(""));
      }.bind(this)
    );
  }
});
