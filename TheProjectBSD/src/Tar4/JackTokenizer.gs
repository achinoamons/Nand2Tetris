package Tar4
uses java.io.*
uses java.util.regex.Matcher
uses java.util.regex.Pattern
uses java.util.*


class JackTokenizer {
  static var currentToken:String  =" "
  static var currentTokenType:TYPE  = TYPE.NONE
  static var pointer: int  = 0
  static var tokens={}


  static enum TYPE {
    KEYWORD, SYMBOL, IDENTIFIER, INT_CONST, STRING_CONST, NONE,
  }
  static enum KEYWORD {
    CLASS, METHOD, FUNCTION, CONSTRUCTOR, INT, BOOLEAN, CHAR, VOID, VAR, STATIC,
    FIELD, LET, DO, IF, ELSE, WHILE, RETURN, TRUE, FALSE, NULL, THIS, NONE,
  }

  static var keywordReg='class|constructor|function|method|field|static|' +
      'var|int|char|boolean|' +
      'void|true|false|null|this|' +
      'let|do|if|else|while|return'

  static var symbolReg="[\\&\\*\\+\\(\\)\\.\\/\\,\\-\\]\\;\\~\\}\\|\\{\\>\\=\\[\\<]" //כל מה שרוצים שלא יתיחס אליו כתו מיוחד שמים 2 סלשים לפניו או 1 למשל כמו בstrReg
  static var intReg = "[0-9]+"//כל מה שיש בתוך רגקס הוא עושה או או
  static var  strReg = "\"[^\"\n]*\"";//כל מה שהוא לא גרשיים או ירידת שורה ונמצא בתוך גרשיים
  //not start with a digit!
  static var idReg = "[a-zA-Z_][\\w]*"///"[\\w_]+";
  //static var  tokenPatterns:Pattern = Pattern.compile(keywordReg +"|"+ symbolReg + "|" + intReg + "|" + strReg + "|" + idReg);//הוספנו אור בין הראשון לשני

  static var  tokenPatterns:Pattern = Pattern.compile( symbolReg + "|" + intReg + "|" + strReg + "|" + idReg);
  //static var keyWordMap: HashMap <String,Integer>   = new HashMap<String, Integer>()
  // static var opSet: HashSet<Character>  = new HashSet<Character>()

  //map for keywords
  static var map={"class"->KEYWORD.CLASS,
      "constructor"->KEYWORD.CONSTRUCTOR,
      "function"->KEYWORD.FUNCTION,
      "method"->KEYWORD.METHOD,
      "field"->KEYWORD.FIELD,
      "static"->KEYWORD.STATIC,
      "var"->KEYWORD.VAR,
      "int"->KEYWORD.INT,
      "char"->KEYWORD.CHAR,
      "boolean"->KEYWORD.BOOLEAN,
      "void"->KEYWORD.VOID,
      "true"->KEYWORD.TRUE,
      "false" -> KEYWORD.FALSE,
      "null"-> KEYWORD.NULL,
      "this"-> KEYWORD.THIS,
      "let"-> KEYWORD.LET,
      "do"-> KEYWORD.DO,
      "if"-> KEYWORD.IF,
      "else"-> KEYWORD.ELSE,
      "while"-> KEYWORD.WHILE,
      "return"-> KEYWORD.RETURN
  }
  //static var help={'+','-','*','/','|','<','>','=','&'}/////////////////////////////////////////
  // static var set=help.toSet()
  //like a set of operations
  static var set={"+","-","*","/","|","<",">","=","&"}//
  public function  JackTokenizer( inFile :File) {

    try {

      var scanner = new Scanner(inFile);////create object to read from file
      var preprocessed : String = "";//string of the lines
      var line : String = "";

      while (scanner.hasNextLine()) { //while its not the EOF read all the content from the file and add it to the array
        //The trim( ) method returns the text string stripped of white space at both ends.
        // The method does not affect the value of the text string.
        line = noComments(scanner.nextLine()).trim();//delete all the comments

        if (line.length() > 0) {
          preprocessed += line + "\n";
        }
      }
      preprocessed = noBlockComments(preprocessed).trim()

      var match :Matcher = tokenPatterns.matcher(preprocessed)
      ///////
      //tokens = new ArrayList<String>();
      // pointer = 0;
      /////
      while (match.find()){
        tokens.add(match.group())
        // print(tokens)//
      }
      print(tokens)
    }


    catch( e: FileNotFoundException) {
      e.printStackTrace()
    }
    ///////
    //currentToken = ""
    //currentTokenType = TYPE.NONE
    ////////
  }

  public static function  hasMoreTokens():boolean{
    return pointer<tokens.size()
  }
  /**
   * gets the next token from the input and makes it the current token
   * This method should only be called if hasMoreTokens() is true
   *
   */
  public function advance():void{

    if (hasMoreTokens()) {
      currentToken = tokens.get(pointer).toString()
      pointer++;
    }else {
      throw new IllegalStateException("No more tokens");
    }

    //deterrmine the type of the token
    if (currentToken.matches(keywordReg)){
      currentTokenType = TYPE.KEYWORD;
    }else if (currentToken.matches(symbolReg)){
      currentTokenType = TYPE.SYMBOL;
    }else if (currentToken.matches(intReg)){
      currentTokenType = TYPE.INT_CONST;
    }else if (currentToken.matches(strReg)){
      currentTokenType = TYPE.STRING_CONST;
    }else if (currentToken.matches(idReg)){
      currentTokenType = TYPE.IDENTIFIER;
    }else {

      throw new IllegalArgumentException("Unknown token:" + currentToken);
    }

  }
  public function getCurrentToken(): String{

    return currentToken
  }

  /**
   * Returns the type of the current token
   * @return
   */
  public function  tokenType(): TYPE{

    return currentTokenType
  }

  /**
   * Returns the keyword which is the current token
   * Should be called only when tokeyType() is KEYWORD
   * @return
   */
  public function keyWord():KEYWORD{

    if (currentTokenType ==TYPE.KEYWORD){

      return map.get(currentToken);

    }else {
      throw new IllegalStateException("Current token is not a keyword!");
    }
  }
  /**
   * Returns the character which is the current token
   * should be called only when tokenType() is SYMBOL
   *
   */
  public function symbol_():String{

    if (currentTokenType == TYPE.SYMBOL){

      return currentToken

    }else{
      throw new IllegalStateException("Current token is not a symbol!");
    }
  }

  /**
   * Return the identifier which is the current token
   * should be called only when tokenType() is IDENTIFIER
   * @return
   */
  public static function identifier_():String{

    if (currentTokenType == TYPE.IDENTIFIER){

      return currentToken;

    }else {
      throw new IllegalStateException("Current token is not an identifier!");
    }
  }

  /**
   * Returns the integer value of the current token
   * should be called only when tokenType() is INT_CONST
   * @return
   */
  public function intVal():int{

    if(currentTokenType == TYPE.INT_CONST){

      return Integer.parseInt(currentToken);
    }else {
      throw new IllegalStateException("Current token is not an integer constant!");
    }
  }

  /**
   * Returns the string value of the current token
   * without the double quotes!!
   * should be called only when tokenType() is STRING_CONST
   * @return
   */
  public function stringVal():String{

    if (currentTokenType == STRING_CONST){

      return currentToken.substring(1, currentToken.length() - 1);//return the string witout double quotes

    }else {
      throw new IllegalStateException("Current token is not a string constant!");
    }
  }
  /**
   * move pointer back
   */
  public function pointerBack():void {

    if (pointer > 0) {
      pointer--
    }
    else
      pointer=0
  }
  /**
   * return if current symbol is a op
   * @return
   */
  public function isOp():Boolean{

    return set.contains(symbol_());
//      for(var op in set){
//        if(op==symbol_())return true
//      }
//      return false
  }

  /**
   * Delete comments(String after "//") from a String
   * @param strIn
   * @return
   */
  public static function  noComments( strIn :String):String{

    var position:int = strIn.indexOf("//");

    if (position != -1){

      strIn = strIn.substring(0, position);

    }

    return strIn;
  }
  /**
   * Delete spaces from a String
   * @param strIn
   * @return
   */
  public static function   noSpaces( strIn:String):String{
    var result :String = "";

    if (strIn.length() != 0){

      var segs = strIn.split(" ");

      for ( var s in segs){
        result += s;
      }
    }

    return result;
  }

  /**
   * delete block comment
   * @param strIn
   * @return
   */
  public  static function noBlockComments( strIn:String):String{

    var startIndex :int = strIn.indexOf("/*")
    //if there is no
    if (startIndex == -1) {return strIn}

    var  result = strIn

    var endIndex = strIn.indexOf("*/");

    while(startIndex != -1){

      if (endIndex == -1){

        return strIn.substring(0,startIndex - 1);

      }
      result = result.substring(0,startIndex) + result.substring(endIndex + 2);
      //maybe there are more in the middle
      startIndex = result.indexOf("/*");
      endIndex = result.indexOf("*/");
    }

    return result;
  }

}






