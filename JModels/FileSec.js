export class File{
  /**
   * Represents a mets "file" element
   * @constructor
   * @param {string} id (required) value of the id attribute
   * @param {string} link (required) value of the link attribute
   */
  constructor(id,link){
    this.id = id;
    this.link = link;
  }

  /**
   * Getter of fileID
   * @returns {string} Returns the id of the file
   */
  getFileID(){
    return this.id;
  }

  /**
   * Converts the element to a json formated string
   * @returns {string} Returns the element as a json string
   */
  convertToJson(){
    return "{"+
              "\"@ID\": \""+this.id+"\","+ 
              "\"FLocat\": {"+
                "\"@LOCTYPE\": \"URL\","+
                "\"@xlink:type\": \"simple\","+
                "\"@xlink:href\": \""+ this.link +"\""+
           "}}"
  }
}

export class FileGroup{


    /**
     * Constructor of a mets filegroup element
     * @param {string} use (required) value of the "use"-attribute of the filegroup element.
     */
    constructor(use){
        this.fileGroups = [];
        this.files = [];
        this.use = use;
    }

    /**
     * Adds a filegroup object to the current filegroup
     * @param {FileGroup} fileGroup filegroup object
     */
    addFileGroup(fileGroup){
      this.fileGroups.push(fileGroup);

    }

    /**
     * Adds a file element to this filegroup element
     * @param {*} id id of the file
     * @param {*} link link to the file
     */
    addFile(id,link){
      this.files.push(new File(id,link));
    }
    
    /**
     * Returns if a file with the fileID is already existing
     * @param {string} fileID id of the file
     * @returns Returns true if the file already exists else false
     */
    containsFile(fileID){
      let contains = false;
      for (const file of this.files) {
        if(file.getFileID() === fileID){
          contains = true;
          break;
        }
      }
      return contains;
    }
    
    /**
     * Converts the element to a json formated string
     * @returns {string} Returns the element as a json string
     */
    convertToJson(){
      let output = "{";
      output +=       "\"@USE\": \""+this.use+"\"";
      if(this.fileGroups.length >= 1 || this.files.length >= 1){
        output += ",";
      }
      let counter = 1;
      this.fileGroups.forEach(group => {
        if(counter == 1){
          output += "\"fileGrp\": [";
        }
        if(counter < this.fileGroups.length){
          output += group.convertToJson() + ",";
        }else{
          output += group.convertToJson();
        }
        if(counter == this.fileGroups.length){
          output +="]";
        }
        counter++;
      });
      if(this.fileGroups.length >= 1 && this.files.length >= 1){
        output += ",";
      }
      counter = 1;
      this.files.forEach(file => {
        if(counter == 1){
          output += "\"file\": [";
        }
        if(counter < this.files.length){
          output += file.convertToJson() + ",";
        }else{
          output += file.convertToJson();
        }
        if(counter == this.files.length){
          output +="]";
        }
        counter++;
      });
      output += "}";
      return output;
    }
}

export class FileSec{

  /**
   * Represents the mets "FileSec" element
   */
  constructor(){
      this.fileGroups = [];
  }

  /**
   * Adds a fileGroup element to this fileSec element
   * @param {FileGroup} fileGroup the fileGroup object which should be added
   */
  addFileGroup(fileGroup){
    this.fileGroups.push(fileGroup);
  }

  /**
   * Checks if a file with the given id already exists in this fileSec element
   * @param {string} fileID Id of the file
   * @returns Returns true if the file with the id already exists else false
   */
  containsFile(fileID){
    let contains = false;
    for (const fileGroup of this.fileGroups) {
      if(fileGroup.containsFile(fileID)){
        contains = true;
        break;
      }
    }
    return contains;
  }
  
  /**
   * Converts the element to a json formated string
   * @returns {string} Returns the element as a json string
   */
  convertToJson(){
    let output = "";
    output += "\"fileSec\": {" +
                "\"fileGrp\": [";

    let counter = 1;
    this.fileGroups.forEach(group => {
      if(counter < this.fileGroups.length){
        output += group.convertToJson() + ","
      }else{
        output += group.convertToJson();
      }

      counter++;
    });
    output +="]}"
    return output;
  }
}
