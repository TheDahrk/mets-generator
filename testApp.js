
import { DmdSec,XmlData} from './JModels/DmdSec.js';
import { StructMap,Div} from './JModels/StructMap.js';
import { FileSec,FileGroup } from './JModels/FileSec.js';
import {MetsHdr} from './JModels/MetsHdr.js';
import {Mets} from './JModels/Mets.js';

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

window.onload = function run(){

    let mets = new Mets();
    mets.addAgent("EDITOR","Max Mustermann");
    mets.addFileGroup("preview-epidoc");
    mets.addFileGroup("epidoc");
    mets.addFile("epidocCSV01","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","epidoc");
    mets.addFile("epidocCSV02","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","epidoc");
    mets.addFile("epidocCSV03","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","epidoc");
    mets.addFile("epidocViewer","http://dlib.nyu.edu/divlib/bobst/fales/imls_maass/images/maass/jpg/900000_902000/900345s.csv","preview-epidoc");


    let xmlString = mets.convertToXML();
    
    //output formated xml string on html site
    document.getElementById("xmlWrapper").innerHTML =  prettifyXml(xmlString);
    
}