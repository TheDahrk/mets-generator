export class Fptr{
    /**
     * Represents a mets "Fptr" element
     * @param {*} fileID id of the file
     */
    constructor(fileID){
        this.fileID = fileID;

    }

    /**
     * Getter of fileID
     * @returns {string} Returns the id of the file
     */
    getFileID(){
      return this.fileID;
    }

    /**
     * Converts the element to a json formated string
     * @returns {string} Returns the element as a json string
     */
    convertToJson(){
        return "{" +
              "\"@FILEID\": \"" + this.fileID+ "\"" +
           "}";
    }
}

export class Div{
  /**
   * Represents a mets "Div" element
   * @param {string} label (required) label of the div element
   * @param {string} dmdid (optional) dmdid(s) which relate to the div and its content
   * @param {string} type (optional) type of the div element
   * @param {string} order (optional) order of the div element
   */
  constructor(label,dmdid,type,order){
      this.fptrs = [];
      this.divs = new Map;
      this.properties = new Map();
      if(label != null){
        this.properties.set("LABEL",label);
      }
      if(dmdid != null){
        this.properties.set("DMDID",dmdid);
      }
      if(type != null){
        this.properties.set("TYPE",type);
      }
      if(order != null){
        this.properties.set("ORDER",order);
      }
  }
  
  /**
   * Adds a Fptr element to the Div element
   * @param {string} fileID id of the file
   */
  addFPTR(fileID){
      this.fptrs.push(new Fptr(fileID));
  }

  /**
   * Adds a Div element to the this StructMap element (a root div is required which contains all other divs)
   * @param {Div} div the Div element which should be added
   */
  addDiv(divID){
    this.divs.set(divID,new Div(divID));
  }

  /**
   * Checks if a Fptr with the given file id already exists
   * @param {string} fileID The id of the file
   * @returns Returns true if the fptr with the given file id already exists else false
   */
  containsFptr(fileID){
    var contains = false;
    for (const fptr of this.fptrs) {
      if(fptr.getFileID() === fileID){
        contains = true;
        break;
      }
    }
    return contains;
  }

  containsDiv(divID){
    return this.divs.has(divID);
  }

  getDivByID(divID){
    if(this.containsDiv(divID)){
      return this.divs.get(divID);
    }
    var result = null;
    this.divs.forEach((values,keys)=>{
      let foundDiv = values.getDivByID(divID);
      if(foundDiv != null){
        result = foundDiv;
      }
    })
    return result;
  }

  /**
   * Converts the element to a json formated string
   * @returns {string} Returns the element as a json string
   */
   convertToJson(){
    let output = "{";
    output += this.convertPropertiesToJson();
    if(this.divs.size >= 1 || this.fptrs.length >= 1){
      output += ",";
    }
    if(this.divs.size > 0){
      output += this.convertDivsToJson();
    }
    if(this.divs.size >= 1 && this.fptrs.length >= 1){
      output += ",";
    }
    if(this.fptrs.length > 0){
      output += this.convertFptrToJson();
    }
    output +=   "}";
    return output;
  }


  /**
   * Converts properties to a json fromated string
   * @returns the properties as an json fromated string
   */
  convertPropertiesToJson(){
    var output = "";
    var counter = 1;
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
   * Converts Div elements to a json fromated string
   * @returns Returns the Div elements as an json fromated string
   */
  convertDivsToJson(){
    var output = "";
    var counter = 1;
    output += "\"div\": [";
    this.divs.forEach((div,keys) => {
      output += div.convertToJson();
      if(counter < this.divs.size){
        output += ",";
      }
      counter++;
    });
    output +="]";

    return output;
  }

  /**
   * Converts Fptr elements to a json fromated string
   * @returns Returns the Fptr elements as an json fromated string
   */
  convertFptrToJson(){
    let output = "";
    let counter = 1;
    output += "\"fptr\": [";
    this.fptrs.forEach(fptr => {
      output += fptr.convertToJson();
      if(counter < this.fptrs.length){
        output += ",";
      }

      counter++;
    });  
    output +="]";
    return output;
  }

}

export class StructMap {
  /**
   * Represents a mets "structMap" element
   * @param {string} id id of the structMap element
   */
  constructor(id){
      this.id = id;
      this.divs = new Map();
  }

  containsDiv(divID){
    return this.divs.has(divID);
  }

  getDivByID(divID){
    if(this.containsDiv(divID)){
      return this.divs.get(divID);
    }
    var result = null;
    this.divs.forEach((values,keys)=>{
      let foundDiv = values.getDivByID(divID);
      if(foundDiv != null){
        result = foundDiv;
      }
    })
    return result;
  }

  /**
   * Adds a Div element to the this StructMap element (a root div is required which contains all other divs)
   * @param {Div} div the Div element which should be added
   */
  addDiv(divIDToAdd,newDivID){
      if(divIDToAdd == newDivID){
        this.divs.set(newDivID,new Div(newDivID));
        return true;
      }

      var foundDiv = this.getDivByID(divIDToAdd);
      if(foundDiv != null){
        foundDiv.addDiv(newDivID);
        return true;
      }
      return false;
  }
  
  /**
   * Converts the element to a json formated string
   * @returns {string} Returns the element as a json string
   */
  convertToJson(){
      var output = "";
      output += "\"structMap\": {" +
                  "\"@ID\": \""+this.id+"\","+
                  "\"div\": [";

      var counter = 1;
      this.divs.forEach((div,keys)=> {
        if(counter < this.divs.size){
            output += div.convertToJson() + ","
        }else{
            output += div.convertToJson();
        }
        counter++;
      });
      output +="]"
      output += "}";
      return output;
  }
}