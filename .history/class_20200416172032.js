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
  u4             magic
  u2             minor_version;
  u2             major_version;
  u2             constant_pool_count;
  // cp_info        constant_pool[constant_pool_count-1];
  u2             access_flags;
  u2             this_class;
  u2             super_class;
  u2             interfaces_count;
  u2             interfaces[interfaces_count];
  u2             fields_count;
  // field_info     fields[fields_count];
  u2             methods_count;
  // method_info    methods[methods_count];
  u2             attributes_count;
  // attribute_info attributes[attributes_count];
  readBytes(ByteData byteData){
    this.magic = new U4().readBytes(byteData);
  }
}
