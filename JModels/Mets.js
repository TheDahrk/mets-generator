import {DmdSec,XmlData} from './DmdSec.js';
import {StructMap,Div} from './StructMap.js';
import {FileSec,FileGroup } from './FileSec.js';
import {MetsHdr} from './MetsHdr.js';

export class Mets{
    constructor(){
        this.metsHdr = new MetsHdr(this.getCurrentDate(),this.getCurrentDate());
        this.dmdSecs = [];
        this.fileSec = new FileSec();
        this.structMap = new StructMap("s01");
        this.rootDiv = new Div("root");
        this.fileGroups = new Map();
        this.divs = new Map();

        this.structMap.addDiv(this.rootDiv);
        this.addAgent("CREATOR","METS-FILE-CREATOR-TOOL-V1");
    }

    getCurrentDate(){
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
    }

    addAgent(role,name){
        this.metsHdr.addAgent(role,name);
    }

    addFile(id,link,fileGroupID){
        if(this.fileGroups.has(fileGroupID)){
            this.fileGroups.get(fileGroupID).addFile(id,link);
            this.divs.get(fileGroupID).addFPTR(id);
        }
    }

    addFileGroup(fileGroupID){
        let fileGroup = new FileGroup(fileGroupID);
        let div = new Div(fileGroupID,fileGroupID);

        this.fileGroups.set(fileGroupID,fileGroup);
        this.divs.set(fileGroupID,div);

        this.rootDiv.addDiv(div);
        this.fileSec.addFileGroup(fileGroup);

        this.dmdSecs.push(new DmdSec(fileGroupID,null,"DC",new XmlData(fileGroupID,null,null,null,null,null,"place holder description")));
    }

    convertToXML(){

        let output = "{" +
        //Headerpart
        this.metsHdr.convertToJson() + ",";
        //Descriptionpart
        let counter = 1;
        output += "\"dmdSec\": [";
        this.dmdSecs.forEach(dmdSec => {
            if(counter < this.dmdSecs.length){
                output += dmdSec.convertToJson() + ",";
            }else{
                output += dmdSec.convertToJson();
            }
            counter++;
        });
        output +="],";
        //Filepart
        output += this.fileSec.convertToJson() + ","; 
        
        //Structpart
        output += this.structMap.convertToJson()+ "}";

        let json = JSON.parse(output)
        console.log(output);
        console.log(json)
        let xmlString = "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"no\"?> \n\n "+
                        "<mets xmlns=\"http://www.loc.gov/METS/\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" OBJID=\"f000446\" xsi:schemaLocation=\"http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/mets.xsd http://purl.org/dc/elements/1.1/ http://dublincore.org/schemas/xmls/simpledc20021212.xsd\">"+
                            json2xml(json)+
                        "</mets>";
        return xmlString;
    }
}
