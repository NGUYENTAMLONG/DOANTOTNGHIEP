// Zoom images

// Add zoom-image class to the container of the image that you want to apply the zoom to.

jQuery(document).ready(function ($) {
  $(".zoom-image img").click(function (event) {
    var ix = $(this).offset().left;
    var iy = $(this).offset().top;
    console.log(ix + "-" + iy);

    var mx = event.pageX;
    var my = event.pageY;
    console.log(mx + "-" + my);
  });

  $(".zoom-image img").hover(
    function () {
      var img = $(this).attr("src");

      $(this).after(
        "<div class='hover-image' style='background-image: url(" +
          img +
          "); background-size: 1200px;'></div>"
      );

      $(this).mousemove(function (event) {
        // Mouse Position
        var mx = event.pageX;
        var my = event.pageY;

        // Image Position
        var ix = $(this).offset().left;
        var iy = $(this).offset().top;

        // Mouse Position Relavtive to Image
        var x = mx - ix;
        var y = my - iy;

        // Image Height and Width
        var w = $(this).width();
        var h = $(this).height();

        // Mouse Position Relative to Image, in %
        var xp = (-x / w) * -100;
        var yp = (-y / h) * -100;

        $(this)
          .parent()
          .find(".hover-image")
          .attr(
            "style",

            "background-image: url(" +
              img +
              "); background-size: 1200px; background-repeat: no-repeat; background-position: " +
              xp +
              "% " +
              yp +
              "%; top: " +
              y +
              "px; left: " +
              x +
              "px;"
          );
      });
    },
    function () {
      $(this).parent().find(".hover-image").remove();
    }
  );
});
