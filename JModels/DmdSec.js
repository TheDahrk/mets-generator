export class XmlData{
    /**
     * Represents a xmlData element for the mets "mdWrapper" element
     * @param {string} identifier (optional) identifier for the file/files
     * @param {string} title (optional) title for the file/files
     * @param {string} creator (optional) creator of the file/files
     * @param {string} date (optional) creation date of the file/files
     * @param {string} publisher (optional) publisher of the file/files
     * @param {string} type (optional) type of the file/files
     * @param {string} description (optional) description of the file/files
     */
    constructor(identifier,title,creator,date,publisher,type,description){
        this.properties = new Map();
        if(identifier != null){
            this.properties.set("identifier",identifier);
        }
        if(title != null){
            this.properties.set("title",title);
        }
        if(creator != null){
          this.properties.set("creator",creator);
        }
        if(date != null){
          this.properties.set("date",date);
        }
        if(publisher != null){
          this.properties.set("publisher",publisher);
        }
        if(type != null){
            this.properties.set("type",type);
        }
        if(description != null){
            this.properties.set("description",description);
        }

    }

    /**
     * Converts the properties to a json formated string
     * @returns {string} Returns the properties as a json string
     */
    convertPropertiesToJson(){
        let output = "";
        let counter = 1;
        this.properties.forEach((value,type) => {
          output +=     "\"dc:"+type+"\": \""+ value +"\"";
          if(counter < this.properties.size){
            output += ",";
          }
          counter++;
        });
  
        return output;
    }

    /**
     * Converts the element to a json formated string
     * @returns {string} Returns the element as a json string
     */
    convertToJson(){
        return "\"xmlData\": {"+
                    this.convertPropertiesToJson()+
                "}";

    }
}

export class MdWrap{
    /**
     * Represents the mets "MdWrap" element
     * @param {string} mdtype (required) type of the metadata only for now only DC is availabel
     * @param {XmlData} xmlData (required) xmlData object with the metadata for the description
     */
    constructor(mdtype,xmlData){
        this.mdtype = mdtype;
        this.xmlData = xmlData;
    }

    /**
     * Converts the element to a json formated string
     * @returns {string} Returns the element as a json string
     */
    convertToJson(){
        return "\"mdWrap\": {"+ 
                "\"@MDTYPE\": \""+ this.mdtype +"\","+
                    this.xmlData.convertToJson() +
                "}";
    }
}

export class DmdSec{

    /**
     * Represents a mets "DmdSec" element which contains descriptional metadata
     * @param {string} id (required) id of the DmdSec element
     * @param {string} groupid (optional) groupid of the DmdSec element
     * @param {string} mdType (required) metadata type of the DmdSec element (only DC)
     * @param {XmlData} xmlData (required) xmlData object
     */
    constructor(id,groupid,mdType,xmlData){
        this.id = id;
        this.groupid = groupid;
        this.mdWrap = new MdWrap(mdType,xmlData);
        this.properties = new Map();
        this.properties.set("ID",id);
        if(groupid != null){
            this.properties.set("GROUPID",groupid);
        }
    }

    /**
     * Converts properties to a json fromated string
     * @returns the properties as an json fromated string
     */
    convertPropertiesToJson(){
        let output = "";
        let counter = 1;
        this.properties.forEach((value,type) => {
          output +=     "\"@"+type+"\": \""+ value +"\",";
          counter++;
        });
  
        return output;
    }

    /**
     * Converts the element to a json formated string
     * @returns {string} Returns the element as a json string
     */
    convertToJson(){
        return "{"+
                    this.convertPropertiesToJson()+
                    this.mdWrap.convertToJson()+
                "}";

    }
}