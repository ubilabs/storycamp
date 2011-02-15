function load_items(){
  var $body = $("body").html(""); 
   
  $("link").remove();
  
  var style = "body { font-family: Arial; }" +
    "ul { padding: 0 0 0 1em; } " +
    "ul, li { margin: 0; }" +
    "div.story { font-size: 20px; padding-bottom: 1em; page-break-before: always; font-weight: bold; }" +
    "div.citeria { font-size: 14px !important; line-height: 1.2em; font-weight: normal; margin-top: 0.5em;}";
  
  $body.append('<style type="text/css" media="all">' + style + '</style>');
  
  $.get(document.location.pathname + '.xml', function(xml){
    
    var $items = $("todo-item", xml),
      count = $items.length;
    
    $items.each(function(){
      var $div = $("<div class='story'>").appendTo($body);

      var title = $("content", this).text(),
        id = $("id", this).text();
        
      $div.append(title);
      
      $div = $("<div class='citeria'>").appendTo($div);

      $.get("/todo_items/" + id + "/comments.xml", function(xml){
        var comment = $("comment body", xml).text();
        
        comment = convert(comment);
                
        if (comment.indexOf("<li>") === 0){
          comment = "<ul>" + comment + "</ul>";
        }
                
        $div.html(comment);
        
        if (!--count){ print(); }
      });
    });
  });
}

$(".page_header_links").prepend(
  $("<a href='#'>Print Stories</a>").click(load_items)
);