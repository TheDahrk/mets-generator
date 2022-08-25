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
        this.structMap = new StructMap("s01");
        this.rootDiv = new Div("root");
        this.fileGroups = new Map();
        this.divs = new Map();

        this.structMap.addDiv(this.rootDiv);
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
     * Adds a file to the mets with fptr in the structMap and link in the fileSec
     * @param {string} fileID The id of the file
     * @param {string} fileLink The link to the file
     * @param {string} fileGroupID The id of the filegroup in which the file should be added
     * @param {string} divID The id of the div in which the fptr for the file should be added
     */
    addFile(fileID,fileLink,fileGroupID,divID){
        if(!this.fileSec.containsFile(fileID)){
            this.addFileToFileGroup(fileID,fileLink,fileGroupID);
        }
        this.addFptrToDiv(fileID,divID);  
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

    /**
     * Adds a fptr element with the given fileID to the div with the given divID
     * @param {string} fileID The id of the file
     * @param {string} divID The id of the div 
     */
    addFptrToDiv(fileID,divID){
        if(this.divs.has(divID)){
            this.divs.get(divID).addFPTR(fileID);
        }
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

    /**
     * Adds a div element with the given divID to the structMap element
     * @param {string} divID The id of the div
     */
    addDiv(divID){
        let div = new Div(divID);
        this.divs.set(divID,div);
        this.rootDiv.addDiv(div);
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
