import {StructMap,Div} from './StructMap.js';
import {FileSec,FileGroup } from './FileSec.js';
import {MetsHdr} from './MetsHdr.js';

export class Mets{
    /**
     * Represents a mets element which contains a metsHdr,a StructMap,a FileSec
     */
    constructor(){ 
        this.metsHdr = new MetsHdr({
            createDate : this.getCurrentDate(),
            lastModifiedDate : this.getCurrentDate()
        });
        this.addAgent({
            role : "CREATOR",
            name : "METS-FILE-CREATOR-TOOL-V1"
        });

        this.dmdSecs = [];
        this.fileSec = new FileSec();
        this.fileGroups = new Map();
        this.structMap = new StructMap("s01");
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
    addAgent(options){
        let agent = {
            role : options.role, 
            name : options.name
        };
        
        if(!this.metsHdr.checkAgentExist(agent)){
            this.metsHdr.addAgent(agent);
        }
        
    }

    /**
     * Adds a file element to the filegroup with the given filegroupid
     * @param {string} fileID The id of the file
     * @param {string} fileLink The link to the file
     * @param {string} fileGroupID The id of the filegroup
     */
    addFileToFileGroup(options){
        if(this.fileGroups.has(options.fileGroupID) && !this.fileSec.containsFile(options.fileID)){
            this.fileGroups.get(options.fileGroupID).addFile({fileID: options.fileID , fileLink : options.fileLink});
        }
    }

    /**
     * Adds a FPTR element to the div with the given divID
     * @param {string} divID The id of the div
     * @param {string} fileID The id of the file the pointer points at
     */
    addFPTRToDiv(options){
        if(!this.divIDExists(options.divID)){
            return;
        }
        var div = this.structMap.getDivByID(options.divID);
        if(div.containsFptr(options.fileID)){
            return;
        }
        div.addFPTR(options.fileID);
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
     * Adds a div element to the div element with the given id
     * @param {string} divID The id of div which should be added
     * @param {string} divIDToAdd The id of div which the new div should be added to
     */
    addDivToDiv(options){
        if(this.divIDExists(options.divID)){
            return false;
        }
        return this.structMap.addDiv({
            divIDToAdd : options.divIDToAdd,
            divID : options.divID
        });
        
    }

    /**
     * Adds the information of a csv file to mets file
     * @param {string} divID The id of div which the div of the csv file should be added to
     * @param {string} fileID The id of csv file
     * @param {string} fileLink The link to the csv file
     * @param {array} listOfSubFiles an array with the information of the subfiles [0] = subFileID,[1] = subFileLink,[2] = subFileType 
     */
    addCSVFile(options){
        this.addDivToDiv({divIDToAdd : options.divID,divID : options.fileID});
        this.addFPTRToDiv({divID : options.fileID,fileID : options.fileID});
        this.addFileToFileGroup({fileID: options.fileID,fileLink :  options.fileLink, fileGroupID : "csv"});

        /*
         *  [0] = subFileID
         *  [1] = subFileLink
         *  [2] = subFileType
         *  Maybe use an array of options objects instead of only an array?
         */
        options.listOfSubFiles.forEach(array => {
            this.addFileToFileGroup({fileID : array[0], fileLink : array[1], fileGroupID : array[2]});
            this.addFPTRToDiv({divID : options.fileID, fileID : array[0]});
        });
    }

    /**
     * Checks if the div with the given id already exists
     * @param {string} divID The id of the div which should be checked if it exist
     * @return true if already exists, else false
     */
    divIDExists(divID){
        if (this.structMap.getDivByID(divID) != null){
            return true;
        }
        return false;
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
                        "<mets xmlns=\"http://www.loc.gov/METS/\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xsi:schemaLocation=\"http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/mets.xsd http://purl.org/dc/elements/1.1/ http://dublincore.org/schemas/xmls/simpledc20021212.xsd\">"+
                            json2xml(json)+
                        "</mets>";
        return xmlString;
    }
}
