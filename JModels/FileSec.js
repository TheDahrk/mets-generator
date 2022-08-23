export class File{

  /*
    ID and LOCTYPE are required
  */

  constructor(id,link){
    this.id = id;
    this.link = link;
  }

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
    /*
      USE is required
    */
    constructor(use){
        this.fileGroups = [];
        this.files = [];
        this.use = use;
    }

    addFileGroup(fileGroup){
      this.fileGroups.push(fileGroup);

    }

    addFile(id,link){
      this.files.push(new File(id,link));
    }
    
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
  constructor(){
      this.fileGroups = [];
  }

  addFileGroup(fileGroup){
    this.fileGroups.push(fileGroup);
  }
  
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

/*
{
  "metsHdr": 
  {
    "@CREATEDATE": "2006-05-15T00:00:00.001",
    "@LASTMODDATE": "2006-05-15T00:00:00.001",
    "agent": 
    [
      {
        "@ROLE": "CREATOR",
        "name": "METS-FILE CREATORTOOL"
      }
    ]
  },
  "fileSec": 
  {
    "fileGrp": 
    [
      {
        "file": [
          {"@ID": "f1","Flocat": {"@LOCTYPE": "URL","@type": "simple","@href": "undefined"}}]},{}]}}
*/