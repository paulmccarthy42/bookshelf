/* global Vue, VueRouter, axios */

var router = new VueRouter({
  routes: [{ path: "/:id" }],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  // el: "#app",
  router: router,
  created: function() {
    $("#flipbook").turn({
      width: 400,
      height: 300,
      autoCenter: true
    });
    console.log("hello");
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
