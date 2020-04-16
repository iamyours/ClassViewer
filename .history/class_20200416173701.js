class ByteData{
  data
  offset
}

class Entry {
  index
  len
  readBytes (byteData) {
    this.index = byteData.offset;
    return this;
  }
}

class U extends Entry {
  data
  constructor(){
    super();
    this.index = 0;
    this.len = 0;
  }
  readBytes (byteData) {
    super.readBytes(byteData)
    this.data = []
    for (let i = 0; i < this.len; i++) {
      this.data.push(byteData.data[byteData.offset + i])
    }
    byteData.offset += this.len
    return this;
  }
  toString () {
    let str = ''
    this.data.forEach((v,i) => {
      str += this.toHex(v)
    })
    return str
  }

  toHex (val) {
    var str = val.toString(16).toUpperCase()
    if (str.length == 1) return '0' + str
    return str
  }
}

class U1 extends U {
  constructor () {
    super()
    this.len = 1
  }
}

class U2 extends U {
  constructor () {
    super()
    this.len = 2
  }
}

class U4 extends U {
  constructor () {
    super()
    this.len = 4
  }
}


class ClassEntry extends Entry{
  magic                     //u4,魔数
  minor_version             //u2,次版本
  major_version             //u2,主版本
  constant_pool_count       //u2,常量池数量
  constant_pool             //cp_info
  access_flags              //u2
  this_class                //u2
  super_class               //u2
  interfaces_count          //u2
  interfaces                //interface[]
  fields_count              //u2
  fields                    //field_info[]
  methods_count             //u2
  methods                   //method_info[]
  attributes_count          //u2
  attributes                //attribute_info[]

  readBytes(byteData){
    this.magic = new U4().readBytes(byteData);
    this.minor_version = new U2().readBytes(byteData);
    this.major_version = new U2().readBytes(byteData);
    return this;
  }

  toString(){
    let str = "";
    str+="magic:"+this.magic;
    return str;
  }
}
