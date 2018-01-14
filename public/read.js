/* global Vue, VueRouter, axios */

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
      test: [1, 2, 3, 4]
    };
  },
  created: function() {
    $("#flipbook").turn({
      width: 400,
      height: 300,
      autoCenter: true
    });
    var pages = [1, 2, 3, 4];
    pages.forEach(function(page) {
      var element = $("<div />").html(page);
      $("#flipbook").turn("addPage", element);
    });
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
