$(document).ready(function() {

    $("#reset").bind("click", function(event) {
        event.preventDefault();
        location.reload(true);
    });

    $("#selectall").bind("click", function(event) {
        event.preventDefault();
        st($("div code").get(0));
    });
    
    
    
    $("button.add.group").bind("click", function(event, callback) {
        event.preventDefault();
        var d = $(this).parent().find(".tag-group:first").clone();
        $(d).find("input,select").val("");
        $(d).find("input + button.delete.element").each(function() {
          $(this).prev("input").remove();
          $(this).remove();
        });
        $("<button/>", {"class":"delete group", type:"button", text:"-"}).appendTo($(d).find(".tag:first"));
        d.appendTo($(this).parent());
        if (callback !== null) callback(d);
    });
    
    
    $("div.section").on("mouseenter mouseleave focusin focusout", "button.delete.group, button.delete.single-tag", function(event) {
        event.preventDefault();
        $(this).parent().toggleClass("remove-highlight");
    });
    $("div.section").on("click", "button.delete.group", function(event) {
        event.preventDefault();
        $(this).parent().remove();
        $("input").eq(0).keyup();
    });
    
    
    
    $("body").on("click", " button.add.single-tag", function(event, callback) {
        event.preventDefault();
        var c = $(this).parent().clone();
        $(c).find("input,select").val("");
        $(this).before($("<button/>", {"class":"delete single-tag", type:"button", text:"-"}));
        $(this).parent().after(c);
        $(this).remove();
        if (callback !== null) callback(c);
      });		
    
    $("body").on("click", "button.delete.single-tag", function(event) {
        event.preventDefault();
        $(this).parent().remove();
        $("input").eq(0).keyup();
    });

    $("body").on("click", "button#more", function(event) {
        event.preventDefault();
        var div = $(this).parent();
        $(div).find("button#more").hide();
        $(div).find("div#subgroup,button#less").show();
    });
    $("body").on("click", "button#less", function(event) {
        event.preventDefault();
        var div = $(this).parent();
        $(div).find("div#subgroup,button#less").hide();
        $(div).find("button#more").show();
        $(div).find("div#subgroup input,div#subgroup select").val("");
        $("input").eq(0).keyup();
    });
    
    $("body").on("click", "h3.recommended,h3.other", function(event) {
        var div = $(this).next("div");
        var text = $(this).html();
        if (text.charAt(0) == "+") {
            text = text.replace("+", "-");
            $(this).html(text);
            $(div).show();
        } else {
            if (text.charAt(0) == "-") {
                text = text.replace("-", "+");
                $(this).html(text);
                $(div).hide();
            }
        }
    });
});