class ClassReader {
  offset //下标
  bytes //uint8数组
  constructor (arr) {
    this.bytes = arr
    this.offset = 0
  }
  u2Value (bytes) {
    return bytes[1] + (bytes[0] << 8)
  }

  readU1 () {
    let u1 = this.bytes[this.offset]
    this.offset++
    return u1
  }
  readU2 () {
    return this.u2Value(this.readBytes(2))
  }
  readU4 () {
    return this.readBytes(4)
  }

  readBytes (size) {
    let data = []
    for (let i = 0; i < size; i++) {
      data.push(this.bytes[this.offset + i])
    }
    this.offset += size
    return data
  }
}

class Entry {
  index
  endIndex
  readInfo (reader) {
    this.index = reader.offset
    this.read(reader)
    this.endIndex = reader.offset
  }
}

class CONSTANT_Utf8_info extends Entry {
  tag = 1
  len //u2
  bytes //u1[]
  read (reader) {
    let len = reader.readU2()
    this.len = len
    this.bytes = reader.readBytes(len)
  }
  toString () {
    let result = ''
    for (let i = 0; i < this.len; i++) {
      result += String.fromCharCode(this.bytes[i]);
    }
    return result
  }
}

class CONSTANT_Integer_info extends Entry {
  tag = 3
  bytes //u4
  read (reader) {
    this.bytes = reader.readU4()
  }
}

class CONSTANT_Float_info extends Entry {
  tag = 4
  bytes //u4
  read (reader) {
    this.bytes = reader.readU4()
  }
}

class CONSTANT_Long_info extends Entry {
  tag = 5
  high_bytes //u4
  low_bytes //u4
  read (reader) {
    this.high_bytes = reader.readU4()
    this.low_bytes = reader.readU4()
  }
}

class CONSTANT_Double_info extends Entry {
  tag = 6
  high_bytes //u4
  low_bytes //u4
  read (reader) {
    this.high_bytes = reader.readU4()
    this.low_bytes = reader.readU4()
  }
}

class CONSTANT_Class_info extends Entry {
  tag = 7
  name_index //u2
  read (reader) {
    this.name_index = reader.readU2()
  }
}

class CONSTANT_String_info extends Entry {
  tag = 8
  string_index //u2
  read (reader) {
    this.string_index = reader.readU2()
  }
}

class CONSTANT_Ref_info extends Entry {
  class_index //u2
  name_and_type_index //u2
  read (reader) {
    this.class_index = reader.readU2()
    this.name_and_type_index = reader.readU2()
  }
}

class CONSTANT_Fieldref_info extends CONSTANT_Ref_info {
  tag = 9
}

class CONSTANT_Methodref_info extends CONSTANT_Ref_info {
  tag = 10
}

class CONSTANT_InterfaceMethodref_info extends CONSTANT_Ref_info {
  tag = 11
}

class CONSTANT_NameAndType_info extends Entry {
  tag = 12
  name_index //u2
  descriptor_index //u2
  read (reader) {
    this.name_index = reader.readU2()
    this.descriptor_index = reader.readU2()
  }
}

class ClassEntry extends Entry {
  magic //u4,魔数
  minor_version //u2,次版本
  major_version //u2,主版本
  constant_pool_count //u2,常量池数量
  constant_pool //cp_info
  access_flags //u2
  this_class //u2
  super_class //u2
  interfaces_count //u2
  interfaces //interface[]
  fields_count //u2
  fields //field_info[]
  methods_count //u2
  methods //method_info[]
  attributes_count //u2
  attributes //attribute_info[]

  toString () {
    let str = ''
    str += 'magic:' + this.magic
    return str
  }

  read (reader) {
    this.magic = reader.readU4()
    this.minor_version = reader.readU2()
    this.major_version = reader.readU2()
    this.constant_pool_count = reader.readU2()
    this.readConstants(reader)
    console.log('major_version:' + this.major_version)
  }

  CP_MAP = {
    1: CONSTANT_Utf8_info,
    3: CONSTANT_Integer_info,
    4: CONSTANT_Float_info,
    5: CONSTANT_Long_info,
    6: CONSTANT_Double_info,
    7: CONSTANT_Class_info,
    8: CONSTANT_String_info,
    9: CONSTANT_Fieldref_info,
    10: CONSTANT_Methodref_info,
    11: CONSTANT_InterfaceMethodref_info,
    12: CONSTANT_NameAndType_info
  }

  readConstant (tag, reader) {
    let cp = this.CP_MAP[tag]
    if (cp != undefined) {
      let con = new cp()
      con.readInfo(reader)
      this.constant_pool.push(con)
    } else {
      console.error('unsupport constant type:' + tag)
    }
  }

  readConstants (reader) {
    this.constant_pool = []
    let count = this.constant_pool_count - 1
    console.log('constant count:' + count)
    for (let i = 0; i < count; i++) {
      let tag = reader.readU1()
      this.readConstant(tag, reader)
    }
  }
}
