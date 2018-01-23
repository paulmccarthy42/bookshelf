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
      currentRightPage: 1,
      currentLeftLines: [],
      currentRightLines: [],
      comment: "",
      acc: document.getElementsByClassName("accordion"),
      hiddenComments: { right: false, left: false }
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
    // create events on page turn
    $("#flipbook").bind(
      "turning",
      function(event, page, view) {
        // generate left notes
        this.currentLeftPage = view[0];
        if (this.currentLeftPage < 3) {
          this.currentLeftLines = null;
        } else {
          this.currentLeftLines = this.pages[this.currentLeftPage - 3].lines;
        }
        // generate right notes
        this.currentRightPage = view[1];
        if (this.currentRightPage < 3) {
          this.currentRightLines = null;
        } else {
          this.currentRightLines = this.pages[this.currentRightPage - 3].lines;
        }
        // move bookmark
        axios
          .patch(
            "http://localhost:3000/v1/books/" +
              this.bookId +
              "/mark/" +
              this.currentRightPage
          )
          .then(function(response) {
            // console.log(response.data);
          })
          .catch(function(error) {
            // console.log("error. check backend");
          });
        console.log($(".line"));
        $(".line").hover(
          function() {
            $(this).css("background-color", "rgba(252, 244, 201, .5)");
            $(this)
              .children(".line-number")
              .css("visibility", "visible");
            $(this)
              .children("div")
              .children(".line-number")
              .css("visibility", "visible");
          },
          function() {
            $(this).css("background-color", "");
            $(this)
              .children(".line-number")
              .css("visibility", "hidden");
            $(this)
              .children("div")
              .children(".line-number")
              .css("visibility", "hidden");
          }
        );
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
              newPage.append(
                $("<div class='line'/>").html(
                  line.text +
                    "<span class='line-number'>" +
                    line.line_number +
                    "</span>"
                )
              );
              // add commented line as mark
            } else {
              var newLine = $("<div class='line'/>").html(
                $("<div class='tool-tip-line' />").html(
                  line.text +
                    "<span class='line-number'>" +
                    line.line_number +
                    "</span>"
                )
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
        // flip to last read page
        axios
          .get("http://localhost:3000/v1/books/" + this.bookId + "/mark")
          .then(function(response) {
            console.log(response.data);
            if (response.data.bookmarked_page_number !== 0) {
              $("#flipbook").turn("page", response.data.bookmarked_page_number);
            }
          })
          .catch(function(error) {
            $("#flipbook").turn("page", 0);
          });
      }.bind(this)
    );
  },

  methods: {
    accordion: function(index, side) {
      if (side === "right" && this.currentLeftLines !== null) {
        index += 40;
      }
      this.comment = "";
      console.log(this.acc);
      var button = this.acc[index];
      button.classList.toggle("active");
      if (this.hiddenComments[side]) {
        this.shrinkParent(side);
      } else {
        console.log("do nothing");
      }
      var panel = button.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    },
    accordionIn: function(side) {
      var startRange = 0;
      if (side === "right") {
        startRange += 40;
      }
      for (var i = 0; i < startRange + 40; i++) {
        var button = this.acc[startRange + i];
        button.classList.remove("active");
        var panel = button.nextElementSibling;
        console.log(i);
        panel.style.maxHeight = null;
      }
    },
    shrinkParent: function(direction) {
      if (direction === "left") {
        $(".commentary-left").toggleClass("shrunk");
        if ($(".commentary-left").hasClass("shrunk")) {
          this.accordionIn(direction);
        }
      } else {
        $(".commentary-right").toggleClass("shrunk");
        if ($(".commentary-right").hasClass("shrunk")) {
          this.accordionIn(direction);
        }
      }
      this.hiddenComments[direction] = !this.hiddenComments[direction];
    },
    addComment: function(lineId) {
      var params = {};
      params.comment = this.comment;
      params.id = lineId;
      params.commented = "Line";
      axios
        .post("v1/comments", params)
        .then(
          function(response) {
            var patched = false;
            if (this.currentRightLines.length > 0) {
              this.currentRightLines.forEach(function(line) {
                if (line.id === lineId) {
                  patched = true;
                  line.comments.push(response.data);
                }
              });
            }
            if (this.currentLeftLines.length > 0 && !patched) {
              this.currentLeftLines.forEach(function(line) {
                if (line.id === lineId) {
                  patched = true;
                  line.comments.push(response.data);
                }
              });
            }
            this.comment = "";
          }.bind(this)
        )
        .catch(function(error) {
          console.log(error);
        });
    }
  }
});
