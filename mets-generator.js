import {Mets} from './JModels/Mets.js';

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
    mets.addFileGroup("preview");
    mets.addFileGroup("csv");
    //generator needs to add possible GUI variants as divs
    mets.addDiv("epidoc");
    mets.addDiv("heurist")
    mets.addDiv("heurist-preview","heurist-preview");
    mets.addDiv("epidoc-preview","epidoc-preview");
    mets.addFileGroup("preview-epidoc");
    mets.addFileGroup("epidoc");


    //Values from user input
    mets.addAgent("EDITOR","Max Mustermann");
    mets.addFile("epidocCSV01","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","csv","epidoc");
    mets.addFile("epidocCSV02","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","csv","epidoc");
    mets.addFile("epidocCSV03","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","csv","epidoc");
    mets.addFile("epidocCSV03","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","csv","heurist");
    mets.addFile("epidocViewer","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","preview","epidoc-preview");


    let xmlString = mets.convertToXML();
    
    //output formated xml string on html site
    //document.getElementById("xmlWrapper").innerHTML =  prettifyXml(xmlString);
    $("div.right code").text(prettifyXml(xmlString));
    $(".right").show();
    
}

window.onload = run(); 