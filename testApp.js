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

function getCurrentDate(){
    const t = new Date();
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    const hours = ('0' + t.getHours()).slice(-2);
    const minutes = ('0' + t.getMinutes()).slice(-2);
    const seconds = ('0' + t.getSeconds()).slice(-2);
    const time = `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`;
    return time;
    output: "27-04-2020 12:03:03"
    ymt
}

function run(){
    //Creating necessary jsonparts for metsHeader
    let header = new MetsHdr(getCurrentDate(),getCurrentDate());
    header.addAgent("EDITOR","Max Mustermann")

    //Creating necessary jsonparts for dmdSec
    let xmlData1 = new XmlData(null,null,"Moritz Mustermann","18 August 2022","Musterstadt",null,"This is a little test description!");
    let dmdSec1 = new DmdSec("dm001","common","DC",xmlData1);
    let dmdSec2 = new DmdSec("dm002",null,"DC",new XmlData("055-002-a-0446",""));

    //Create necessary jsonparts for fileSec
    let fileSec = new FileSec();
    let fileGroup1 = new FileGroup("master");
    let fileGroupEdak = new FileGroup("edak");
    let fileGroupOtherGui = new FileGroup("andereGui");
    
    fileGroupEdak.addFile("f001","http://genericWebAdress.de/file01.csv");
    fileGroupOtherGui.addFile("f002","http://genericWebAdress.de/file02.csv");

    fileSec.addFileGroup(fileGroup1);
    fileSec.addFileGroup(fileGroupEdak);
    fileSec.addFileGroup(fileGroupOtherGui);

    //Create necessary jsonparts for structMap
    let structMap = new StructMap("s1");

    let div1 = new Div("001","dm001",null,null);
    let div2 = new Div("002","dm001",null,"1");
    let div3 = new Div("003","dm002",null,"2");

    div1.addDiv(div2);
    div1.addDiv(div3);

    div2.addFPTR("f001");
    div3.addFPTR("f002");

    structMap.addDiv(div1);

    //Creating final json string
    //Start
    let output = "{" +
        //Headerpart
        header.convertToJson() + ","+
        //Descriptionpart
        "\"dmdSec\": [" +
        dmdSec1.convertToJson() + ","+
        dmdSec2.convertToJson() + "],"+
        //Filepart
        fileSec.convertToJson() + ","+ 
        //Structpart
        structMap.convertToJson() +
        //Behaviorpart
    "}";
    //output json string and json object in console
    console.log(output);
    let json = JSON.parse(output)
    console.log(json)
    //extend final xml string with root mets node
    let xmlString = "<mets xmlns=\"http://www.loc.gov/METS/\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" OBJID=\"f000446\" xsi:schemaLocation=\"http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/mets.xsd http://purl.org/dc/elements/1.1/ http://dublincore.org/schemas/xmls/simpledc20021212.xsd\">"+
                        json2xml(json)+
                    "</mets>";
    
    //output formated xml string on html site
    document.getElementById("xmlWrapper").innerHTML =  prettifyXml(xmlString); 

}




