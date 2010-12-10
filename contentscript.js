function load_items(){
  var $body = $("body").html("");
  $("link").remove();
  
  var style = "body { font-family: Arial; }" +
    "div.story { height: 13.7cm; font-size: 1cm; padding-bottom: 1em; page-break-before: always; font-weight: bold; }" +
    "div.citeria { border-top: 1px solid #000; font-size: 0.5cm; white-space: pre; line-height: 1.5em; height: 13.7cm; position: relative; }" +
    "div.citeria .content{ -webkit-transform: rotate(180deg); padding-bottom: 1cm; }";
  
  $body.append('<style type="text/css" media="all">' + style + '</style>');
  
  $.get('/projects/4071498/todo_lists/11815962.xml', function(xml){
    
    var $items = $("todo-item", xml),
      count = $items.length;
    
    $items.each(function(){
      var $div = $("<div class='story'>").appendTo($body);

      var title = $("content", this).text(),
        id = $("id", this).text();
        
      $div.append(title);
      
      $div = $("<div class='citeria'>").appendTo($body);

      $.get("/todo_items/" + id + "/comments.xml", function(xml){
        var comment = $("comment body", xml).text();
        comment = comment.replace("* ", "<br />* ");
        $div.html("<div class='content'>" + comment + "</div>");
        
        if (!--count){ print(); }
      });
    });
  });
}

$(".page_header_links").prepend(
  $("<a href='#'>Print Stories</a>").click(load_items)
);