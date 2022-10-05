import {StructMap,Div} from './StructMap.js';
import {FileSec,FileGroup } from './FileSec.js';
import {MetsHdr} from './MetsHdr.js';

export class Mets{
    /**
     * Represents a mets element which contains a metsHdr,a StructMap,a FileSec
     */
    constructor(){
        this.metsHdr = new MetsHdr(this.getCurrentDate(),this.getCurrentDate());
        this.dmdSecs = [];
        this.fileSec = new FileSec();
        this.fileGroups = new Map();

        this.structMap = new StructMap("s01");
        this.divs = new Map();
        this.divs.set("root",new Div("root"));
        this.structMap.addDiv(this.getDivByID("root"));

        this.addAgent("CREATOR","METS-FILE-CREATOR-TOOL-V1");
    }

    /**
     * Creates a String with the current time and date
     * @returns Returns a string with the current time and date. Example: "27-04-2020 12:03:03"
     */
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

    /**
     * Adds an agent to the mets element
     * @param {string} role The role of the agent
     * @param {string} name The name of the Agent
     */
    addAgent(role,name){
        this.metsHdr.addAgent(role,name);
    }

    /**
     * Adds a file element to the filegroup with the given filegroupid
     * @param {string} fileID The id of the file
     * @param {string} fileLink The link to the file
     * @param {string} fileGroupID The id of the filegroup
     */
    addFileToFileGroup(fileID,fileLink,fileGroupID){
        if(this.fileGroups.has(fileGroupID)){
            this.fileGroups.get(fileGroupID).addFile(fileID,fileLink);
        }
    }

    addFPTRToDiv(divID,fileID){
        if(!this.divIDExists(divID)){
            return;
        }
        var div = this.getDivByID(divID);
        if(div.containsFptr(fileID)){
            return;
        }
        div.addFPTR(fileID);
    }

    /**
     * Adds a filegroup element to the fileSec element
     * @param {string} fileGroupID The id of the filegroup
     */
    addFileGroup(fileGroupID){
        let fileGroup = new FileGroup(fileGroupID);
        this.fileGroups.set(fileGroupID,fileGroup);
        this.fileSec.addFileGroup(fileGroup);

    }
    

    addDivToDiv(divIDToAdd,divID){
        if(!this.divIDExists(divIDToAdd)){
            return;
        }
        let div = new Div(divID);
        this.divs.set(divID,div);
        this.getDivByID(divIDToAdd).addDiv(div);
        
    }

    addCSVFile(divID,fileID,fileLink,listOfSubFiles){
        this.addDivToDiv(divID,fileID);
        this.addFPTRToDiv(fileID,fileID);
        this.addFileToFileGroup(fileID,fileLink,"csv");

        /*
         *  [0] = subFileID
         *  [1] = subFileLink
         *  [2] = subFileType
         */
        listOfSubFiles.forEach(array => {
            this.addFileToFileGroup(array[0],array[1],array[2]);
            this.addFPTRToDiv(fileID,array[0]);
        });
    }

    divIDExists(divID){
        return this.divs.has(divID);
    }

    getDivByID(divID){
        return this.divs.get(divID);
    }

    /**
     * Converts the mets element to a xml formated string
     * @returns {string} Returns the mets element as a xml string
     */
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
