import {Mets} from './JModels/Mets.js';

var metadata = "";



$(document).ready(function() {
    $("button.add.group").bind("click", function(event, callback) {
        console.log(callback)
        event.preventDefault();
        var d = $(this).parent().find(".tag-group:first").clone();
        $(d).find("input,select").val("");
        $(d).find("input + button.delete.element").each(function() {
            $(this).prev("input").remove();
            $(this).remove();
        });
        $("<button/>", {"class":"delete group", type:"button", text:"-"}).appendTo($(d).find(".tag:first"));
        d.appendTo($(this).parent());
    });

    $("div.section").on("click", "button.delete.group", function(event) {
        event.preventDefault();
        $(this).parent().remove();
        $("input").eq(0).keyup();
    });

    $("#reset").bind("click", function(event) {
        event.preventDefault();
        location.reload(true);
    });

    $("body").on("click", "button.add.single-tag", function(event, callback) {
        event.preventDefault();
        var c = $(this).parent().clone();
        $(c).find("input,select").val("");
        $(this).before($("<button/>", {"class":"delete single-tag", type:"button", text:"-"}));
        $(this).parent().after(c);
        $(this).remove();
    });	

    $("body").on("click", "button.delete.single-tag", function(event) {
        event.preventDefault();
        $(this).parent().remove();
    });

    $("div.section").on("mouseenter mouseleave focusin focusout", "button.delete.group, button.delete.single-tag", function(event) {
        event.preventDefault();
        $(this).parent().toggleClass("remove-highlight");
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

    $("#download").bind("click", function(){downloadFile()});

    $("#generate").bind("click", function(){run()});
    var selectorRole = $("div[title~=agent]").children("select[title~=role]");
    var selectorfileType = $("div[title~=subfiles]").children("select[title~=fileType]");
    var selectorViewer = $("div[title~=csvfile]").children("select[title~=viewer]");

    addValueToSelector(selectorRole,"Editor","EDITOR");
    addValueToSelector(selectorRole,"Creator","CREATOR");
    addValueToSelector(selectorfileType,"CSV","csv");
    addValueToSelector(selectorfileType,"Epidoc","epidoc");
    addValueToSelector(selectorfileType,"TEI","tei");
    addValueToSelector(selectorViewer,"Heurist","heurist");
    addValueToSelector(selectorViewer,"Sortable6","sortable6");
    addValueToSelector(selectorViewer,"NETamil2","netamil2");

});

function addValueToSelector(selector,text,value){
    var option = new Option(text, value);
    selector.append($(option));
}

/**
 * Creates a xml string with correct tabs and spaces
 * @param {*} sourceXml The xml string which should be "prettified"
 * @returns Returns the "prettified" xml string
 */
var prettifyXml = function(sourceXml)
{
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
};

function run(){
    let mets = new Mets();
    cleanError();
    //generator needs to add possible GUI variants as divs
    mets.addDivToDiv("root","heurist");
    mets.addDivToDiv("root","sortable6");
    mets.addDivToDiv("root","netamil2");

    mets.addFileGroup("preview");
    mets.addFileGroup("csv");
    mets.addFileGroup("epidoc");
    mets.addFileGroup("tei");

    var emptyField = false;

    //Values from user input
    $("div[title~=agent]").each(function() {
        var name = $(this).children("input[title~=name]").val();
        var role = $(this).children("select[title~=role]").val();
        if(name === null || role === null ) emptyField = true;
        //Hier muss noch abgefangen werden ob Name/Rolle Leer ist -> wenn ja Error visualisierung
        mets.addAgent(role,name); 
    });

    $("div[title~=csvfile-wrapper]").each(function() {
        var csvFileID = $(this).children("div[title~=csvfile]").children("input[title~=fileID]").val();
        var csvFileLink = $(this).children("div[title~=csvfile]").children("input[title~=fileLink]").val();
        var viewer = $(this).children("div[title~=csvfile]").children("select[title~=viewer]").val();
        var listOfSubFiles = new Array;
        $(this).children("div[title~=subfiles]").each(function() {
            var subFileID = $(this).children("input[title~=fileID]").val();
            var subFileLink = $(this).children("input[title~=fileLink]").val();
            var subFileType = $(this).children("select[title~=fileType]").val();
            if(subFileID.length == 0 ||  subFileLink.length == 0 || subFileType === null) emptyField = true;
            listOfSubFiles.push([subFileID,subFileLink,subFileType]);
            
        });
        if(csvFileID.length == 0 || csvFileLink.length == 0 || viewer === null) emptyField = true;
        //Error behandelung und visualisierung fehlt noch
        mets.addCSVFile(viewer,csvFileID,csvFileLink,listOfSubFiles);
    });
    
    if(emptyField){
        inputError();
        return;
    }

    let xmlString = mets.convertToXML();
    
    //output formated xml string on html site
    //document.getElementById("xmlWrapper").innerHTML =  prettifyXml(xmlString);
    metadata = prettifyXml(xmlString);
    $("div.right code").text(metadata);
    $(".right").show();
    
};

function inputError(){
    $("input, select").each(function() {
        var value = $(this).val();
        if(value === null || value.length == 0){
            $(this).addClass("error-highlight");
        }
    });
    alert("One or more fields are empty! Please fill all fields to generate the file.");
}

function cleanError(){
    $("input, select").each(function() {
        $(this).removeClass("error-highlight");
    });
}

//-------------File-Download--------------------------

function cleanUp(a) {
  setTimeout(function() {
    window.URL.revokeObjectURL(a.href);
  }, 1500);
  $("span#output").html("");
}

function downloadFile() {
    var MIME_TYPE = "application/xml";
    window.URL = window.webkitURL || window.URL;
    var prevLink = $("span#output a");
    if (prevLink) {
        $("span#output").html("");
    }
    var bb = new Blob([metadata], {type:MIME_TYPE});
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(bb, "metadata.xml");
    } else {
        var a = document.createElement("a");
        a.download = "metadata.xml";
        a.href = window.URL.createObjectURL(bb);
        a.onclick = function(e) {
        if ($(this).is(":disabled")) {
            return false;
        }
        cleanUp(this);
        };
        $(a).appendTo($("span#output"));
        $(a)[0].click();
    }
}
