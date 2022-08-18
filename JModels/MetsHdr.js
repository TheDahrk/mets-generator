class Agent{
  /*
    ROLE is required and the allowed values are: 
    CREATOR: The person(s) or institution(s) responsible for the METS document. 
    EDITOR: The person(s) or institution(s) that prepares the metadata for encoding. 
    ARCHIVIST: The person(s) or institution(s) responsible for the document/collection. 
    PRESERVATION: The person(s) or institution(s) responsible for preservation functions. 
    DISSEMINATOR: The person(s) or institution(s) responsible for dissemination functions. 
    CUSTODIAN: The person(s) or institution(s) charged with the oversight of a document/collection. 
    IPOWNER: Intellectual Property Owner: The person(s) or institution holding copyright, trade or service marks or other intellectual property rights for the object. 
    OTHER: Use OTHER if none of the preceding values pertains and clarify the type and location specifier being used in the OTHERROLE attribute (see below).
  */

  
  constructor(role,name){
    this.role = role;
    this.name = name;
  }

  convertToJson(){
    return "{" +
              "\"@ROLE\": \"" + this.role+ "\"," +
              "\"name\": \"" + this.name + "\"" +
           "}";
  }
}


class MetsHdr {
    constructor(createDate,lastModifiedDate) {
      this.agents = new Array();
      this.addAgent("CREATOR","METS-FILE CREATORTOOL")
      this.properties = new Map();
        if(createDate != null){
          this.properties.set("CREATEDATE",createDate);
        }
        if(lastModifiedDate != null){
          this.properties.set("LASTMODDATE",lastModifiedDate);
        }
    }

    convertPropertiesToJson(){
      let output = "";
      let counter = 1;
      this.properties.forEach((value,type) => {
        output +=     "\"@"+type+"\": \""+ value +"\"";
        if(counter < this.properties.size){
          output += ",";
        }
        counter++;
      });
      return output;
    }
    addAgent(role,name){
        this.agents.push(new Agent(role,name));
    }

    convertToJson(){
      let output = "\"metsHdr\": {";
      output += this.convertPropertiesToJson();
      if(this.agents.length >= 1){
        output += ",";  
      }
      output += "\"agent\": [";

      let counter = 1;
      this.agents.forEach(agent => {
        output += agent.convertToJson();
        if(counter < this.agents.length){
          output += ",";
        }
  
        counter++;
      });
      output +="]}"
      return output;
    }
    
    /*"metsHdr": {
      \"@CREATEDATE\": \"2006-05-15T00:00:00.001\",
      \"@LASTMODDATE\": \"value\",
      \"agent\":[
       {
          \"@ROLE\": \"value\",
          \"name\": \"value\"}
        },
        {
          \"@ROLE\": \"value\",
          \"name\": \"value\"}
        }]
      }*/
}