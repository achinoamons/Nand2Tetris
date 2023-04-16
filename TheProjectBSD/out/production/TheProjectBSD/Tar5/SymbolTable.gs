package Tar5
uses java.util.HashMap;
uses java.util.Map;


public class SymbolTable {
  //static var keyWordMap: HashMap <String,Integer>   = new HashMap<String, Integer>()
  private var classSymbols : HashMap<String, Symbol> //for STATIC, FIELD---for classes scope(the string is the name)
  private var subroutineSymbols : HashMap<String, Symbol> //for ARG, VAR---for function scope (the string is the name)
  //a counter to each kind
  private var indices : HashMap<Symbol.KIND, Integer>

  /**
   * creates a new empty symbol table
   * init all indices
   */
  public function SymbolTable() {
    classSymbols = new HashMap<String, Symbol>()
    subroutineSymbols = new HashMap<String, Symbol>()

    indices = new HashMap<Symbol.KIND, Integer>()//לבדוק אולי זה מיותר!
//      indices.put(Symbol.KIND.ARG,0)
//      indices.put(Symbol.KIND.FIELD,0)
//      indices.put(Symbol.KIND.STATIC,0)
//      indices.put(Symbol.KIND.VAR,0)
    indices = {Symbol.KIND.ARG -> 0,
        Symbol.KIND.FIELD -> 0,
        Symbol.KIND.STATIC -> 0,
        Symbol.KIND.VAR -> 0
    }


  }

  /**
   * starts a new subroutine scope
   * resets the subroutine's symbol table
   */
  public function startSubroutine() : void {
    subroutineSymbols.clear();
    indices.put(Symbol.KIND.VAR, 0);
    indices.put(Symbol.KIND.ARG, 0);
  }

  /**
   * Defines a new identifier of a given name,type and kind
   * and assigns it a running index,
   * STATIC and FIELD identifiers
   * have a class scope, while ARG and VAR identifiers have a subroutine scope
   *
   * @param name
   * @param type
   * @param kind
   */
  public function define(name : String, type : String, kind : Symbol.KIND) : void {
    var symbol : Symbol
    if (kind == Symbol.KIND.ARG || kind == Symbol.KIND.VAR || kind == Symbol.KIND.STATIC || kind == Symbol.KIND.FIELD) {
      var index = indices.get(kind)
      symbol = new Symbol(type, kind, index)
      indices.put(kind, index + 1)
    }

    if (kind == Symbol.KIND.ARG || kind == Symbol.KIND.VAR) {//if it is of a subroutine scope

      // var index = indices.get(kind);
      // Symbol symbol = new Symbol(type,kind,index);
      //indices.put(kind,index+1);
      subroutineSymbols.put(name, symbol);

    } else if (kind == Symbol.KIND.STATIC || kind == Symbol.KIND.FIELD) {

      // var index = indices.get(kind);
      // Symbol symbol = new Symbol(type,kind,index);
      //indices.put(kind,index+1);
      classSymbols.put(name, symbol);

    }

  }

  /**
   * returns the number of variables of the given kind already defined in the current scope
   *
   * @param kind
   * @return
   */
  public function varCount(kind : Symbol.KIND) : int {
    return indices.get(kind);
  }

  /**
   * returns the kind of the named identifier in the current scope
   * if the identifier is unknown in the current scope returns NONE
   *
   * @param name
   * @return
   */
  public function kindOf(name : String) : Symbol.KIND {
    var symbol : Symbol
    symbol = lookUp(name)

    if (symbol != null) {
      return symbol.getKind()
    }

    return Symbol.KIND.NONE;
  }

  /**
   * returns the type of the named identifier in the current scope
   *
   * @param name
   * @return
   */
  public function typeOf(name : String) : String {
    var symbol : Symbol
    symbol = lookUp(name);

    if (symbol != null)
      return symbol.getType();

    return "";
  }

  /**
   * returns the index assigned to the named identifier
   *
   * @param name
   * @return
   */
  public function indexOf(name : String) : int {
    var symbol : Symbol
    symbol = lookUp(name);

    if (symbol != null) return symbol.getIndex();

    return -1;
  }

  /**
   * check if target symbol is exist
   *
   * @param name
   * @return
   */
  private function lookUp(name : String) : Symbol {

    if (classSymbols.get(name) != null) {
      return classSymbols.get(name);
    } else if (subroutineSymbols.get(name) != null) {
      return subroutineSymbols.get(name);
    } else {
      return null;
    }
  }
}