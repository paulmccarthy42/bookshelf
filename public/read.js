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
      test: [1, 2, 3, 4],
      bookId: 45,
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
      height: 600,
      autoCenter: true
    });
    axios.get("/v1/books/" + parseInt(this.$route.params.id) + "/read/").then(
      function(response) {
        console.log(response.data);
        this.pages = response.data;
        this.pages.forEach(function(page) {
          $("#flipbook").turn("addPage", $("<div />").html(page.text));
        });
      }.bind(this)
    );
  }
});
