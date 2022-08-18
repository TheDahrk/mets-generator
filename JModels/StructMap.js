class Fptr{
    constructor(fileID){
        this.fileID = fileID;

    }

    convertToJson(){
        return "{" +
              "\"@FILEID\": \"" + this.fileID+ "\"" +
           "}";
    }
}

class Div{
    constructor(label,dmdid,type,order){
        this.fptrs = [];
        this.divs = [];
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

    addFPTR(fileID){
        this.fptrs.push(new Fptr(fileID));
    }

    addDiv(div){
        this.divs.push(div);
    }

    convertDivsToJson(){
      let output = "";
      let counter = 1;
      output += "\"div\": [";
      this.divs.forEach(div => {
        output += div.convertToJson();
        if(counter < this.divs.length){
          output += ",";
        }
        counter++;
      });
      output +="]";

      return output;
    }

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

    convertToJson(){
      let output = "{";
      output += this.convertPropertiesToJson();
      if(this.divs.length >= 1 || this.fptrs.length >= 1){
        output += ",";
      }
      if(this.divs.length > 0){
        output += this.convertDivsToJson();
      }
      if(this.divs.length >= 1 && this.fptrs.length >= 1){
        output += ",";
      }
      if(this.fptrs.length > 0){
        output += this.convertFptrToJson();
      }
      output +=   "}";
      return output;
    }
}

class StructMap {
    constructor(id){
        this.id = id;
        this.divs = [];
    }

    addDiv(div){
        this.divs.push(div);
    }

    convertToJson(){
        let output = "";
        output += "\"structMap\": {" +
                    "\"@ID\": \""+this.id+"\","+
                    "\"div\": [";

        let counter = 1;
        this.divs.forEach(div => {
        if(counter < this.divs.length){
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