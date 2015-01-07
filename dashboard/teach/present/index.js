(function() {
  if (location.hash == "#") {
    location.assign("/dashboard/teach");
  } else {
    var presKey = location.hash.split("#")[1];
    var presData = {
      "name": "bruh"
    };
    var presAlias = "";
    var updatePresentation = function() {
      var sN = presData.presenting_currentSlide.s;
      var sC = presData.slides[presData.order[sN][1]][presData.order[sN][0]][presData.order[sN][1] == "content" ? "contents" : "query"];
      $('.presName').text(presData.name);
      $('#slideContents').html(sC);
      var sN2 = sN + 1;
      $('#slideNumber').text("Slide " + sN + ";");
      if (presData.order[sN][1] == "questions") {
        $('#responsesC').show();
        $('#responses').html("");
        for (var k in presData.slides[presData.order[sN][1]][presData.order[sN][0]].responses) {
          var r = presData.slides[presData.order[sN][1]][presData.order[sN][0]].responses[k];
          var c = r.content;
          var t = r.type;
          var u = r.name;
          $('#responses').append("<li class=\"list-group-item\"><b>" + u + "</b><br/>" + c + "</li>")
        }
      } else {
        $('#responses').html("");
        $('#responsesC').hide();
      }
    };
    var activatePresentation = function() {
      var url = "http://firedeck.tk/watch#" + presAlias;
      _modal({
        title: "Presentation is Live!",
        body: "<p><br/><b>URL:</b> <a href=\"" + url + "\">" + url + "</a><br/><b>Key [for student dashboard]:</b> " + presAlias + "</p>",
        footer: "<span id=\"clM\" class=\"btn btn-success\">Close</span>"
      });
      $('#clM').click(function() {
        $('#clM').off("click");
        _modal({
          "close": true
        });
      });
      fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_currentSlide/s").set(0);
      fb.child("aliases").child(presAlias).set({
        uid: fb.getAuth().uid,
        key: presKey
      });
      fb.child("aliases").child(presAlias).onDisconnect().remove();
    };
    $('#nextSlide').click(function() {
      if (presData.order.length - 1 > presData.presenting_currentSlide.s) {
        fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_currentSlide/s").set(presData.presenting_currentSlide.s + 1);
      }
    });
    $('#prevSlide').click(function() {
      if (0 < presData.presenting_currentSlide.s) {
        fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_currentSlide/s").set(presData.presenting_currentSlide.s - 1);
      }
    });
    fb.child("presentations/" + fb.getAuth().uid + "/" + presKey).once("value", function(snap) {
      presData = snap.val();
      if (presData.alias != null) {
        presAlias = presData.alias;
      } else {
        presAlias = makeName();
      }
      activatePresentation();
    });
    fb.child("presentations/" + fb.getAuth().uid + "/" + presKey).on("value", function(snap) {
      presData = snap.val();
      updatePresentation();
    });
    fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_clientsJoined").on("value", function(snap) {
      var keys = [],
        i = 0;
      for (keys[i++] in snap.val()) {}
      $('#clientNums').text(keys.length + " viewers");
    });
  }
})();