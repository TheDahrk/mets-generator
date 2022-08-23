export class XmlData{
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

    convertToJson(){
        return "\"xmlData\": {"+
                    this.convertPropertiesToJson()+
                "}";

    }
    /*
    <xmlData>
        <dc:creator>Washington, George, 1732-1799</dc:creator>
        <dc:date>October 13, 1776</dc:date>
        <dc:publisher>Harlem Heights</dc:publisher>
        <dc:type>l. s.</dc:type>
        <dc:format>23.0 cm. wide by 37.0 cm.high, 4 pages</dc:format>
        <dc:description>To Artemas Ward. Reports that 'yesterday the enemy landed at Frogs Point.' Body in hand of Robert Hanson Harrison, signed by Washington. folded half sheet, multiple repairs</dc:description>
    </xmlData>
    */
}

export class MdWrap{

    constructor(mdtype,xmlData){
        this.mdtype = mdtype;
        this.xmlData = xmlData;
    }

    convertToJson(){
        return "\"mdWrap\": {"+ 
                "\"@MDTYPE\": \""+ this.mdtype +"\","+
                    this.xmlData.convertToJson() +
                "}";
    }
}

export class DmdSec{
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

    convertPropertiesToJson(){
        let output = "";
        let counter = 1;
        this.properties.forEach((value,type) => {
          output +=     "\"@"+type+"\": \""+ value +"\",";
          counter++;
        });
  
        return output;
    }

    convertToJson(){
        return "{"+
                    this.convertPropertiesToJson()+
                    this.mdWrap.convertToJson()+
                "}";

    }
}