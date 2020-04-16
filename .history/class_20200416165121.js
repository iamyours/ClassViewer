class Entry{
  index
  length
  readBytes(arr,offset){
    index = offset;
  }
}

class U extends Entry{
  data
   readBytes(arr,offset) {
    super.readBytes(arr,offset);
    data = [];
    for(let i=0;i<length;i++){
      data.push(arr[offset+i]);
    }
    offset+=length;
  }
   toString(){
    let str = "";
    data.foreach((v)=>{
      str+=toHex(v);
    });
    return str;
  }

   toHex(val){
    var str = val.toString(16).toUpperCase();
    if(str.length==1)return "0"+str;
    return str;
  }
}

class U1 extends U{
  constructor(){
    super();
    length = 1;
  }
  
}

class U2 extends U{
  constructor(){
    super();
    length = 2;
  }
}

class U4 extends U{
  constructor(){
    super();
    length = 4;
  }
}



class ClassEntry extends Entry{
  u4             magic
  u2             minor_version;
  u2             major_version;
  u2             constant_pool_count;
  cp_info        constant_pool[constant_pool_count-1];
  u2             access_flags;
  u2             this_class;
  u2             super_class;
  u2             interfaces_count;
  u2             interfaces[interfaces_count];
  u2             fields_count;
  field_info     fields[fields_count];
  u2             methods_count;
  method_info    methods[methods_count];
  u2             attributes_count;
  attribute_info attributes[attributes_count];
}