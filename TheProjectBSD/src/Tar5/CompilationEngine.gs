package Tar5
uses java.io.File
//לבדוק שזה מתאים לנו למילונים שהיו בתרגיל 4!כלומר לעבוד במקביל עם compilationengine של 4
//הפונקציה עם הchar----compileterm
//הפונקציה שעושה ניו לייבל
//הפור בקומפייל טרם
class CompilationEngine {
  //יום שלישי הפכתי את כולם לסטטיק
  private static var vmWriter :Tar5.VMWriter
  private static var  tokenizer:Tar5.JackTokenizer
  private static var symbolTable:Tar5.SymbolTable
  private static var  currentClass:String
  private static var  currentSubroutine: String
  private static var labelIndex=0



  /**
   * Creates a new compilation engine with the given input and output.
   * The next routine called must be compileClass()
   * @param inFile
   * @param outFile
   */
  public function CompilationEngine(inFile: File, outFile:File ) {

    tokenizer = new JackTokenizer(inFile);
    vmWriter = new VMWriter(outFile);
    symbolTable = new SymbolTable();

    labelIndex = 0;

  }
  /**
   * return current function name, className.subroutineName
   * @return
   */
  private function  currentFunction():String{

    if (currentClass.length() != 0 && currentSubroutine.length() !=0){

      return currentClass + "." + currentSubroutine;

    }

    return "";
  }
  /**
   * Compiles a type
   * @return type
   */
  //int|char|boolien|classname
  private function compileType():String{

    tokenizer.advance();

    if (tokenizer.tokenType() == JackTokenizer.TYPE.KEYWORD && (tokenizer.keyWord() == JackTokenizer.KEYWORD.INT ||
        tokenizer.keyWord() == JackTokenizer.KEYWORD.CHAR || tokenizer.keyWord() == JackTokenizer.KEYWORD.BOOLEAN)){
      return tokenizer.getCurrentToken();
    }

    if (tokenizer.tokenType() == JackTokenizer.TYPE.IDENTIFIER){
      return tokenizer.identifier_();
    }

    error("int|char|boolean|className");

    return "";
  }

  /**
   * Complies a complete class
   * class: 'class' className '{' classVarDec* subroutineDec* '}'
   */
  public function compileClass():void{

    //'class'
    tokenizer.advance();

    if (tokenizer.tokenType() != JackTokenizer.TYPE.KEYWORD || tokenizer.keyWord() != JackTokenizer.KEYWORD.CLASS){
      //print(tokenizer.getCurrentToken());
      error("class");
    }

    //className
    tokenizer.advance();

    if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
      error("className");
    }

    //we dont need to put classname  in symbol table
    currentClass = tokenizer.identifier_();

    //'{'
    requireSymbol("{");

    //classVarDec* subroutineDec*
    compileClassVarDec();
    compileSubroutine();

    //'}'
    requireSymbol("}");

    if (tokenizer.hasMoreTokens()){
      throw new IllegalStateException("Unexpected tokens");
    }

    //save file
    vmWriter.close();

  }

  /**
   * Compiles a static declaration or a field declaration
   * classVarDec ('static'|'field') type varName (','varNAme)* ';'
   */
  private function  compileClassVarDec():void{

    //first determine whether there is a classVarDec, nextToken is } or start subroutineDec
    tokenizer.advance();

    //next is a '}'
    if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == "}"){
      tokenizer.pointerBack();
      return;
    }

//next is start subroutineDec or classVarDec, both start with keyword
    if (tokenizer.tokenType() != JackTokenizer.TYPE.KEYWORD){
      error("Keywords");
    }

    //if next is subroutineDec
    if (tokenizer.keyWord() == JackTokenizer.KEYWORD.CONSTRUCTOR || tokenizer.keyWord() == JackTokenizer.KEYWORD.FUNCTION || tokenizer.keyWord() == JackTokenizer.KEYWORD.METHOD){
      tokenizer.pointerBack();
      return;
    }

    //classVarDec exists
    if (tokenizer.keyWord() != JackTokenizer.KEYWORD.STATIC && tokenizer.keyWord() != JackTokenizer.KEYWORD.FIELD){
      error("static or field");
    }
    //we need to push it to the symboltable!
    var kind :Symbol.KIND
    kind = null
    var type = ""
    var name = ""
    //start collecting details about the symbol
    switch (tokenizer.keyWord()){
      case STATIC:kind = Symbol.KIND.STATIC;break;
      case FIELD:kind = Symbol.KIND.FIELD;break;
    }

    //type
    type = compileType();

    //at least one varName
    var varNamesDone = false

    do {

      //varName
      tokenizer.advance();
      if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
        error("identifier");
      }

      name = tokenizer.identifier_();
      //define a new symbol and put it into the suitable symbol-table
      symbolTable.define(name,type,kind);

      //',' or ';'
      tokenizer.advance();

      if (tokenizer.tokenType() != JackTokenizer.TYPE.SYMBOL || (tokenizer.symbol_() != "," && tokenizer.symbol_() != ";")){
        error("',' or ';'")
      }

      if (tokenizer.symbol_() == ";"){
        break;
      }


    }while(true)

    compileClassVarDec()
  }

  /**
   * Compiles a complete method function or constructor
   * ('constractor'|'function'|'method') ('void'|type)subrotineName '('parameterList')' subrotineBody
   */
  private function compileSubroutine():void{

    //determine whether there is a subroutine, next can be a '}'
    tokenizer.advance();

    //next is a '}'
    if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == "}"){
      tokenizer.pointerBack();
      return;
    }

    //start of a subroutine
    if (tokenizer.tokenType() != JackTokenizer.TYPE.KEYWORD ||
        (tokenizer.keyWord() != JackTokenizer.KEYWORD.CONSTRUCTOR && tokenizer.keyWord() != JackTokenizer.KEYWORD.FUNCTION && tokenizer.keyWord() != JackTokenizer.KEYWORD.METHOD)){
      error("constructor|function|method");
    }
    var keyword: JackTokenizer.KEYWORD
    keyword = tokenizer.keyWord()
    //clear the subrutine symbolTable and put 0 in arg and var of indices
    symbolTable.startSubroutine();

    //for method this is the first argument-for method we first send the "this"
    if (tokenizer.keyWord() == JackTokenizer.KEYWORD.METHOD){
      // the name is "this",the type is currentClass and the kind is arg
      symbolTable.define("this",currentClass, Symbol.KIND.ARG);
    }

    var type = ""

    //'void' or type
    tokenizer.advance();
    if (tokenizer.tokenType() == JackTokenizer.TYPE.KEYWORD && tokenizer.keyWord() == JackTokenizer.KEYWORD.VOID){
      type = "void";
    }else {
      tokenizer.pointerBack();//we decrese the pointer beacuse the function compileType advances the pointer in 1
      type = compileType();
    }

    //subroutineName which is a identifier
    tokenizer.advance();
    if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
      error("subroutineName");
    }

    currentSubroutine = tokenizer.identifier_();

    //'('
    requireSymbol("(")

    //parameterList
    compileParameterList()

    //')'
    requireSymbol(")")

    //subroutineBody
    compileSubroutineBody(keyword)

    compileSubroutine()

  }

  /**
   * Compiles the body of a subroutine
   * '{'  varDec* statements '}'
   */
  private function compileSubroutineBody( keyword:JackTokenizer.KEYWORD):void{
    //'{'
    requireSymbol("{")
    //varDec*
    compileVarDec() //this is actually all the locals of the function and therefore this is the place to write the vm command of "function...."
    //write VM function declaration
    wrtieFunctionDec(keyword)//
    //statements
    compileStatement()
    //'}'
    requireSymbol("}")
  }

  /**
   * write function declaration, load pointer when keyword is METHOD or CONSTRUCTOR
   */
  private function wrtieFunctionDec( keyword :JackTokenizer.KEYWORD):void{
    //the keyword is method or constractor or function
    // :השורה הבאה תכתב בכל מקרה
    vmWriter.writeFunction(currentFunction(),symbolTable.varCount(Symbol.KIND.VAR));

    //METHOD and CONSTRUCTOR need to load this pointer
    if (keyword == JackTokenizer.KEYWORD.METHOD){
      //A Jack method with k arguments is compiled into a VM function that operates on k + 1 arguments.
      // The first argument (argument number 0) always refers to the this object.
      vmWriter.writePush(VMWriter.SEGMENT.ARG, 0);
      vmWriter.writePop(VMWriter.SEGMENT.POINTER,0);

    }else if (keyword == JackTokenizer.KEYWORD.CONSTRUCTOR){
      //A Jack function or constructor with k arguments is compiled into a VM function that operates on k arguments.
      vmWriter.writePush(VMWriter.SEGMENT.CONST,symbolTable.varCount(Symbol.KIND.FIELD));
      vmWriter.writeCall("Memory.alloc", 1);
      vmWriter.writePop(VMWriter.SEGMENT.POINTER,0);
    }
  }


  /**
   * Compiles a single statement
   */
  private function compileStatement():void{

    //determine whether there is a statement next can be a '}'
    tokenizer.advance();

    //next is a '}'
    if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == "}"){
      tokenizer.pointerBack();
      return;//to compilesubroutine body
    }

    //next is 'let'|'if'|'while'|'do'|'return'
    if (tokenizer.tokenType() != JackTokenizer.TYPE.KEYWORD){
      error("keyword");
    }else {
      switch (tokenizer.keyWord()){
        case LET:
          compileLet()
          break
        case IF:
          compileIf()
          break
        case WHILE:
          compilesWhile()
          break
        case DO:compileDo()
          break
        case RETURN:
          compileReturn()
          break
        default:
          error("'let'|'if'|'while'|'do'|'return'")
      }
    }

    compileStatement();
  }
  /**
   * Compiles a (possibly empty) parameter list
   * not including the enclosing "()"
   * ((type varName)(',' type varName)*)?
   */
  private function compileParameterList():void{

    //check if there is parameterList, if next token is ')' than go back
    tokenizer.advance();
    if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == ")"){
      tokenizer.pointerBack();
      return;//to compilesubroutine
    }

    var type = ""

    //there is parameter, at least one varName
    tokenizer.pointerBack();
    do {
      //type
      type = compileType();

      //varName
      tokenizer.advance();
      if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
        error("identifier");
      }
      //every time we find new argument-we push it into the symboltable of function as arg
      symbolTable.define(tokenizer.identifier_(),type, Symbol.KIND.ARG);

      //',' or ')'
      tokenizer.advance();
      if (tokenizer.tokenType() != JackTokenizer.TYPE.SYMBOL || (tokenizer.symbol_() != "," && tokenizer.symbol_() != ")")){
        error("',' or ')'");
      }

      if (tokenizer.symbol_() == ")"){
        tokenizer.pointerBack()
        break
      }

    }while(true)

  }

  /**
   * Compiles a var declaration
   * 'var' type varName (',' varName)*;
   */
  private function compileVarDec():void{

    //determine if there is a varDec

    tokenizer.advance()
    //no 'var' go back
    if (tokenizer.tokenType() != JackTokenizer.TYPE.KEYWORD || tokenizer.keyWord() != JackTokenizer.KEYWORD.VAR){
      tokenizer.pointerBack();
      return;
    }

    //type
    var type :String
    type= compileType();

    //at least one varName
    var varNamesDone = false;

    do {

      //varName
      tokenizer.advance();

      if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
        error("identifier");
      }
      //every time we find a new local(=var) ,we put it in the symbol table of subroutine and define it as var
      symbolTable.define(tokenizer.identifier_(),type, Symbol.KIND.VAR);

      //',' or ';'
      tokenizer.advance();

      if (tokenizer.tokenType() != JackTokenizer.TYPE.SYMBOL || (tokenizer.symbol_() != "," && tokenizer.symbol_() != ";")){
        error("',' or ';'");
      }

      if (tokenizer.symbol_() == ";"){
        break;
      }


    }while(true)

    compileVarDec()

  }

  /**
   * Compiles a do statement
   * 'do' subroutineCall ';'
   */
  private function compileDo():void{

    //subroutineCall
    compileSubroutineCall()
    //';'
    requireSymbol(";");
    //pop return value
    vmWriter.writePop(VMWriter.SEGMENT.TEMP,0)//in order to ignore the value returned from the function---page 53
  }


  /**
   * Compiles a let statement
   * 'let' varName ('[' ']')? '=' expression ';'
   * for example let x[i]=3;
   */
  private function compileLet():void{

    //varName
    tokenizer.advance();
    if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
      error("varName");
    }

    var varName:String
    varName = tokenizer.identifier_();

    //'[' or '='
    tokenizer.advance();
    if (tokenizer.tokenType() != JackTokenizer.TYPE.SYMBOL || (tokenizer.symbol_() != "[" && tokenizer.symbol_() != "=")){
      error("'['|'='");
    }

    var expExist = false;

    //'[' expression ']' ,need to deal with array [base+offset]
    if (tokenizer.symbol_() == "["){

      expExist = true;

      //push array variable,base address into stack---because x[i] is x+i
      vmWriter.writePush(getSeg(symbolTable.kindOf(varName)),symbolTable.indexOf(varName))

      //calc offset
      compileExpression()

      //']'
      requireSymbol("]")

      //base+offset
      vmWriter.writeArithmetic(VMWriter.COMMAND.ADD);
    }

    if (expExist) {tokenizer.advance()}//to =

    //expression
    compileExpression()

    //';'
    requireSymbol(";")

    if (expExist){
      //*(base+offset) = expression
      //pop expression value to temp
      vmWriter.writePop(VMWriter.SEGMENT.TEMP,0);
      //pop base+index into 'that'
      vmWriter.writePop(VMWriter.SEGMENT.POINTER,1);
      //pop expression value into *(base+index)
      vmWriter.writePush(VMWriter.SEGMENT.TEMP,0);
      vmWriter.writePop(VMWriter.SEGMENT.THAT,0);
    }else {
      //pop expression value directly
      vmWriter.writePop(getSeg(symbolTable.kindOf(varName)), symbolTable.indexOf(varName));

    }
  }

  /**
   * return corresponding seg for input kind
   * @param kind
   * @return
   */
  private function  getSeg( kind:Symbol.KIND):VMWriter.SEGMENT{

    switch (kind){
      case FIELD:return VMWriter.SEGMENT.THIS;
      case STATIC:return VMWriter.SEGMENT.STATIC;
      case VAR:return VMWriter.SEGMENT.LOCAL;
      case ARG:return VMWriter.SEGMENT.ARG;
      default:return VMWriter.SEGMENT.NONE;
    }

  }
  /**
   * Compiles a while statement
   * 'while' '(' expression ')' '{' statements '}'
   */
  private function  compilesWhile():void{

    var continueLabel :String
    continueLabel= newLabel();
    var topLabel :String
    topLabel= newLabel();

    //top label for while loop
    vmWriter.writeLabel(topLabel);

    //'('
    requireSymbol("(");
    //expression while condition: true or false
    compileExpression();
    //')'
    requireSymbol(")");
    //if ~(condition) go to continue label
    vmWriter.writeArithmetic(VMWriter.COMMAND.NOT);
    vmWriter.writeIf(continueLabel);
    //'{'
    requireSymbol("{");
    //statements
    compileStatement();
    //'}'
    requireSymbol("}");
    //if (condition) go to top label
    vmWriter.writeGoto(topLabel);
    //or continue
    vmWriter.writeLabel(continueLabel);
  }

  private function  newLabel():String {////////לא עבד לי פה אז שיניתי!!!!לזכור שעשיתי את השינוי
    var x=labelIndex
    labelIndex++
    return "LABEL_" + x


  }

  /**
   * Compiles a return statement
   * ‘return’ expression? ';'
   */
  private function  compileReturn():void{

    //check if there is any expression
    tokenizer.advance();

    if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == ";"){
      //no expression push 0 to stack!
      //page 52
      vmWriter.writePush(VMWriter.SEGMENT.CONST,0);
    }else {
      //expression exist
      tokenizer.pointerBack();
      //expression
      compileExpression();
      //';'
      requireSymbol(";");
    }

    vmWriter.writeReturn();

  }
  /**
   * Compiles an if statement
   * possibly with a trailing else clause
   * 'if' '(' expression ')' '{' statements '}' ('else' '{' statements '}')?
   */
  private function compileIf():void{

    var elseLabel = newLabel();
    var endLabel = newLabel();

    //'('
    requireSymbol("(");
    //expression
    compileExpression();
    //')'
    requireSymbol(")");
    //if ~(condition) go to else label
    vmWriter.writeArithmetic(VMWriter.COMMAND.NOT);
    vmWriter.writeIf(elseLabel);
    //'{'
    requireSymbol("{");
    //statements
    compileStatement();
    //'}'
    requireSymbol("}");
    //if condition after statement finishing, go to end label
    vmWriter.writeGoto(endLabel);

    vmWriter.writeLabel(elseLabel);
    //check if there is 'else'
    tokenizer.advance();
    if (tokenizer.tokenType() == JackTokenizer.TYPE.KEYWORD && tokenizer.keyWord() == JackTokenizer.KEYWORD.ELSE){
      //'{'
      requireSymbol("{");
      //statements
      compileStatement();
      //'}'
      requireSymbol("}");
    }else {
      tokenizer.pointerBack();
    }

    vmWriter.writeLabel(endLabel);

  }

  /**
   * Compiles a term.
   * This routine is faced with a slight difficulty when trying to decide between some of the alternative parsing rules.
   * Specifically, if the current token is an identifier
   *      the routine must distinguish between a variable, an array entry and a subroutine call
   * A single look-ahead token, which may be one of "[" "(" "." suffices to distinguish between the three possibilities
   * Any other token is not part of this term and should not be advanced over
   *
   * integerConstant|stringConstant|keywordConstant|varName|varName '[' expression ']'|subroutineCall|
   * '(' expression ')'|unaryOp term
   */
  private function compileTerm():void{

    tokenizer.advance();
    //check if it is an identifier
    if (tokenizer.tokenType() == JackTokenizer.TYPE.IDENTIFIER){
      //varName|varName '[' expression ']'|subroutineCall
      var  tempId :String
      tempId= tokenizer.identifier_();
      //lookahead
      tokenizer.advance();
      if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == "["){
        //this is an array entry

        //push array variable,base address into stack
        vmWriter.writePush(getSeg(symbolTable.kindOf(tempId)),symbolTable.indexOf(tempId));

        //expression
        compileExpression();
        //']'
        requireSymbol("]");

        //base+offset
        vmWriter.writeArithmetic(VMWriter.COMMAND.ADD);

        //pop into 'that' pointer
        vmWriter.writePop(VMWriter.SEGMENT.POINTER,1);
        //push *(base+index) onto stack
        vmWriter.writePush(VMWriter.SEGMENT.THAT,0);

      }else if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && (tokenizer.symbol_() == "(" || tokenizer.symbol_() == ".")){
        //this is a subroutineCall
        tokenizer.pointerBack();tokenizer.pointerBack();
        compileSubroutineCall();
      }else {
        //this is varName
        tokenizer.pointerBack();
        //push variable directly onto stack
        vmWriter.writePush(getSeg(symbolTable.kindOf(tempId)), symbolTable.indexOf(tempId));
      }

    }else{
      //integerConstant|stringConstant|keywordConstant|'(' expression ')'|unaryOp term
      if (tokenizer.tokenType() == JackTokenizer.TYPE.INT_CONST){
        //integerConstant just push its value onto stack
        vmWriter.writePush(VMWriter.SEGMENT.CONST,tokenizer.intVal());
      }else if (tokenizer.tokenType() == JackTokenizer.TYPE.STRING_CONST){
        //stringConstant new a string and append every char to the new stack
        var str = tokenizer.stringVal();

        vmWriter.writePush(VMWriter.SEGMENT.CONST,str.length());
        vmWriter.writeCall("String.new",1);

        for (var i in str){///!!!! לשים לב ללולאה אולי זה char וכו
          //כל זה חדש
          var x=str.indexOf(i) //לבדוק אם יעבוד!
          var x1=str.charAt(x)
          // var help=Integer.parseInt(x1)
          var help=(Integer.valueOf(x1))
          //נראלי שהוא שם את האסקי של כל char
          //vmWriter.writePush(VMWriter.SEGMENT.CONST,(int)str.charAt(i));
          vmWriter.writePush(VMWriter.SEGMENT.CONST, help);
          vmWriter.writeCall("String.appendChar", 2);
        }

//        for (var i = 0; i < str.length(); i++){
//          vmWriter.writePush(VMWriter.SEGMENT.CONST,(int)str.charAt(i));
//          vmWriter.writeCall("String.appendChar",2);
//        }

      }else if(tokenizer.tokenType() == JackTokenizer.TYPE.KEYWORD && tokenizer.keyWord() == JackTokenizer.KEYWORD.TRUE){
        //~0 is true
        vmWriter.writePush(VMWriter.SEGMENT.CONST,0);
        vmWriter.writeArithmetic(VMWriter.COMMAND.NOT);

      }else if(tokenizer.tokenType() == JackTokenizer.TYPE.KEYWORD && tokenizer.keyWord() == JackTokenizer.KEYWORD.THIS){
        //push this pointer onto stack
        vmWriter.writePush(VMWriter.SEGMENT.POINTER,0);

      }else if(tokenizer.tokenType() == JackTokenizer.TYPE.KEYWORD && (tokenizer.keyWord() == JackTokenizer.KEYWORD.FALSE || tokenizer.keyWord() == JackTokenizer.KEYWORD.NULL)){
        //0 for false and null
        vmWriter.writePush(VMWriter.SEGMENT.CONST,0);
      }else if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == "("){
        //expression
        compileExpression();
        //')'
        requireSymbol(')');
      }else if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && (tokenizer.symbol_() == "-" || tokenizer.symbol_() == "~")){

        var s = tokenizer.symbol_();

        //term
        compileTerm();

        if (s == "-"){
          vmWriter.writeArithmetic(VMWriter.COMMAND.NEG);
        }else {
          vmWriter.writeArithmetic(VMWriter.COMMAND.NOT);
        }

      }else {
        error("integerConstant|stringConstant|keywordConstant|'(' expression ')'|unaryOp term");
      }
    }

  }
  /**
   * Compiles a subroutine call
   * subroutineName '(' expressionList ')' | (className|varName) '.' subroutineName '(' expressionList ')'
   */
  private function compileSubroutineCall():void{

    tokenizer.advance();
    if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
      error("identifier");
    }

    var name = tokenizer.identifier_();
    var nArgs = 0;

    tokenizer.advance();
    if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == "("){
      //push this pointer---because this is my method-כלומר קראתי למתודה מבפנים
      vmWriter.writePush(VMWriter.SEGMENT.POINTER,0);
      //'(' expressionList ')'
      //expressionList
      nArgs = compileExpressionList() + 1;//plus 1 because of this
      //')'
      requireSymbol(')');
      //call subroutine
      vmWriter.writeCall(currentClass + '.' + name, nArgs);

    }else if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == "."){
      //(className|varName) '.' subroutineName '(' expressionList ')'

      var objName = name;
      //subroutineName
      tokenizer.advance();
      // System.out.println("subroutineName:" + tokenizer.identifier());
      if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER){
        error("identifier");
      }

      name = tokenizer.identifier_();

      //check for if it is built-in type
      var type = symbolTable.typeOf(objName);

      if (type.equals("int")||type.equals("boolean")||type.equals("char")||type.equals("void")){
        error("no built-in type");
      }else if (type.equals("")){
        name = objName + "." + name;
      }else {
        nArgs = 1;
        //push variable directly onto stack
        //נראלי שזה כאשר מזמנים מתודה של עצם V ממחלקה אחרת-מה שרשום בעמ 48
        vmWriter.writePush(getSeg(symbolTable.kindOf(objName)), symbolTable.indexOf(objName));
        name = symbolTable.typeOf(objName) + "." + name;
      }

      //'('
      requireSymbol('(');
      //expressionList
      nArgs += compileExpressionList();
      //')'
      requireSymbol(')');
      //call subroutine
      vmWriter.writeCall(name,nArgs);
    }else {
      error("'('|'.'");
    }

  }

  /**
   * Compiles an expression
   * term (op term)*
   */
  private function compileExpression():void{
    //term
    compileTerm();
    //(op term)*
    do {
      tokenizer.advance();
      //op
      if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.isOp()){

        var opCmd = "";

        switch (tokenizer.symbol_()){
          case "+":opCmd = "add";break;
          case "-":opCmd = "sub";break;
          case "*":opCmd = "call Math.multiply 2";break;
          case "/":opCmd = "call Math.divide 2";break;
          case "<":opCmd = "lt";break;
          case ">":opCmd = "gt";break;
          case "=":opCmd = "eq";break;
          case "&":opCmd = "and";break;
          case "|":opCmd = "or";break;
          default:error("Unknown op!");
        }

        //term
        compileTerm();

        vmWriter.writeCommand(opCmd,"","");

      }else {
        tokenizer.pointerBack();
        break;
      }

    }while (true);

  }

  /**
   * Compiles a (possibly empty) comma-separated list of expressions
   * (expression(','expression)*)?
   * @return nArgs
   */
  private function compileExpressionList():int{
    var nArgs = 0;

    tokenizer.advance();
    //determine if there is any expression, if next is ')' then no
    if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == ")"){
      tokenizer.pointerBack();
    }else {
      nArgs = 1;
      tokenizer.pointerBack();
      //expression
      compileExpression();
      //(','expression)*
      do {
        tokenizer.advance();
        if (tokenizer.tokenType() == JackTokenizer.TYPE.SYMBOL && tokenizer.symbol_() == ","){
          //expression
          compileExpression();
          nArgs++;
        }else {
          tokenizer.pointerBack();
          break;
        }

      }while (true);
    }

    return nArgs;
  }


  // ---------------------------------------------Auxiliary functions-----------------------
  /**
   * throw an exception to report errors
   * @param val
   */
  private function error( val:String):void{
    throw new IllegalStateException("Expected token missing : " + val + " Current token:" + tokenizer.getCurrentToken());
  }

  /**
   * require symbol when we know there must be such symbol
   * @param symbol
   */
  private function requireSymbol( symbol:String):void{
    tokenizer.advance();
    if (tokenizer.tokenType() != JackTokenizer.TYPE.SYMBOL || tokenizer.symbol_() != symbol){
      error("'" + symbol + "'");
    }
  }





}