var TOKEN,
  $body = $("body");

function load_token(){
  TOKEN = window.localStorage.getItem("basecamp_token")
  
  if (!TOKEN){
    var link = $("#settings_signout_and_help a[title^=Review]");

    $.get(link.attr("href"), function(response){ 
      TOKEN = $("#token", response).text();
      
      window.localStorage.setItem("basecamp_token", TOKEN);      
    });
  }
}

function clear_page(){
  $body.html("");
   
  $("link").remove();
  
  var style = "body { font-family: Arial; }" +
    "ul { padding: 0 0 0 1em; } " +
    "ul, li { margin: 0; }" +
    "div.story { font-size: 20px; padding-bottom: 1em; page-break-before: always; font-weight: bold; }" +
    "div.citeria { font-size: 14px !important; line-height: 1.2em; font-weight: normal; margin-top: 0.5em;}";
  
  $body.append('<style type="text/css" media="all">' + style + '</style>');  
}

function parse_todo_list(xml){
  var $items = $("todo-item", xml),
    count = $items.length;
  
  $items.each(function(){
    var $div = $("<div class='story'>").appendTo($body),
      title = $("content", this).text(),
      id = $("id", this).text();
      
    function render(xml){
      var comment = $("comment body", xml).text();
      comment = convert(comment);

      if (comment.indexOf("<li>") === 0){
        comment = "<ul>" + comment + "</ul>";
      }

      $div.html(comment);

      if (!--count){ print(); }
    }
      
    $div.append(title);
    
    $div = $("<div class='citeria'>").appendTo($div);

    $.ajax({
      url: "/todo_items/" + id + "/comments.xml",
      type: "GET",
      username: TOKEN,
      success: render
    });
  });
}

function load_items(){
  clear_page();
  $.get(document.location.pathname + '.xml', parse_todo_list);
}


function add_link(){
  $(".page_header_links").prepend(
    $("<a href='#'>Print Stories</a>").click(load_items)
  );
  
}


add_link();
load_token();