export class Agent{
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

  /**
   * Represents the mets "Agent" element
   * @param {string} role The role of the agent
   * @param {string} name The name of the agent
   */
  constructor(role,name){
    this.role = role;
    this.name = name;
  }
  /**
   * Converts the element to a json formated string
   * @returns {string} Returns the element as a json string
   */
  convertToJson(){
    return "{" +
              "\"@ROLE\": \"" + this.role+ "\"," +
              "\"name\": \"" + this.name + "\"" +
           "}";
  }

  /**
   * Returns the name of the Agent
   * @returns {string} Returns the name
   */
  getName(){
    return this.name;
  }
  
  /**
   * Returns the role of the agent
   * @returns {string} Returns the role
   */
   getRole(){
    return this.role;
  }
}


export class MetsHdr {
  /**
   * Represents the mets "MetsHdr" element
   * @param {*} createDate The date of the creation
   * @param {*} lastModifiedDate The date of the last modification
   */
  constructor(createDate,lastModifiedDate) {
    this.agents = new Array();
    this.properties = new Map();
      if(createDate != null){
        this.properties.set("CREATEDATE",createDate);
      }
      if(lastModifiedDate != null){
        this.properties.set("LASTMODDATE",lastModifiedDate);
      }
  }

  /**
   * Adds an agent to this metsHdr element
   * @param {string} role The role of the agent
   * @param {string} name The name of the agent
   */
  addAgent(role,name){
      this.agents.push(new Agent(role,name));
  }

  /**
   * Converts properties to a json fromated string
   * @returns the properties as an json fromated string
   */
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

  /**
   * Converts the element to a json formated string
   * @returns {string} Returns the element as a json string
   */
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
  

  /**
   * Checks if a agent with the same name and role already exist
   * @returns {boolean} Returns true if agents exist, else false
   */
  checkAgentExist(role,name){
    var exist = false;
    this.agents.forEach(agent => {
      if(agent.getName().toLowerCase() == name.toLowerCase() && agent.getRole().toLowerCase() == role.toLowerCase()){
        exist = true;
      }
    });

    return exist;
  }
}