package Tar5
class Symbol {
  public static enum KIND {STATIC, FIELD, ARG, VAR, NONE};

  var  type:String
  var  kind: KIND
  var index:int

  public function Symbol( type1:String,  kind1:KIND,  index1:int) {
    this.type = type1;//int,boolien....
    this.kind = kind1;
    this.index = index1;
  }

  public function getType() :String{
    return type
  }

  public function getKind() :KIND{
    return kind
  }

  public function getIndex() :int{
    return index
  }

  @Override
  public function toString() :String{
    return "Symbol{" +
        "type='" + type + '\'' +
        ", kind=" + kind +
        ", index=" + index +
        '}';
  }

}