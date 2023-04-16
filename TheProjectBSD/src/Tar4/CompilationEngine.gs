package Tar4
uses java.io.File;
uses java.io.FileNotFoundException;
uses java.io.FileWriter
uses java.io.PrintWriter;
uses  Tar4.JackTokenizer.KEYWORD
uses Tar4.JackTokenizer.TYPE

class CompilationEngine {
  private static var printWriter : FileWriter //to create xml file
  private static var tokensPrintWriter : FileWriter // to create Txml file
  private static var tokenizer : JackTokenizer
  private static var Indentation = 0
  private static var width = '  '
  static var reverseMap = {(TYPE.KEYWORD) -> 'keyword',
      (TYPE.SYMBOL) -> 'symbol',
      (TYPE.IDENTIFIER) -> 'identifier',
      (TYPE.INT_CONST) -> 'integerConstant',
      (TYPE.STRING_CONST) -> 'stringConstant',

      (KEYWORD.CLASS) -> 'class',
      (KEYWORD.CONSTRUCTOR) -> 'constructor',
      (KEYWORD.FUNCTION) -> 'function',
      (KEYWORD.METHOD) -> 'method',
      (KEYWORD.FIELD) -> 'field',
      (KEYWORD.STATIC) -> 'static',
      (KEYWORD.VAR) -> 'var',
      (KEYWORD.INT) -> 'int',
      (KEYWORD.CHAR) -> 'char',
      (KEYWORD.BOOLEAN) -> 'boolean',
      KEYWORD.VOID -> 'void',
      KEYWORD.TRUE -> 'true',
      KEYWORD.FALSE -> 'false',
      KEYWORD.NULL -> 'null',
      KEYWORD.THIS -> 'this',
      KEYWORD.LET -> 'let',
      KEYWORD.DO -> 'do',
      KEYWORD.IF -> 'if',
      KEYWORD.ELSE -> 'else',
      KEYWORD.WHILE -> 'while',
      KEYWORD.RETURN -> 'return'
  }

  public function CompilationEngine(inFile : File, outFile : File, outTokensFile : File) {
    try {
      tokenizer = new JackTokenizer(inFile)
      printWriter = new FileWriter(outFile)
      tokensPrintWriter = new FileWriter(outTokensFile)
    } catch (e : FileNotFoundException) {
      e.printStackTrace()
    }
  }

  //int|char|boolien|classname
  private function compileType() : void {
    //the return value from a function is void or 1 of these!
    tokenizer.advance()
    var isType = false;
    var type : TYPE
    type = tokenizer.tokenType()
    if (type == TYPE.KEYWORD &&
        (tokenizer.keyWord() == KEYWORD.INT || tokenizer.keyWord() == KEYWORD.CHAR || tokenizer.keyWord() == KEYWORD.BOOLEAN)) {
      printWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");
      tokensPrintWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");
      isType = true;
    }

    if (type == TYPE.IDENTIFIER) {
      printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
      tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
      isType = true;

    }

    if (!isType) error("int|char|boolean|className");
  }

  /**
   * Complies a complete class
   * class: 'class' className '{' classVarDec* subroutineDec* '}'
   */
  public function compileClass() : void {

    //'class'-we want to find the word class
    tokenizer.advance();
    var type : TYPE
    type = tokenizer.tokenType()

    if (type != TYPE.KEYWORD || tokenizer.keyWord() != JackTokenizer.KEYWORD.CLASS) {//If its not a keyword or its a keyword but not class
      error("class");
    }
    //if everything ok:
    printWriter.write("<class>\n");//xml
    tokensPrintWriter.write("<tokens>\n");//T.xml

    printWriter.write("<keyword>class</keyword>\n");
    tokensPrintWriter.write("<keyword>class</keyword>\n");

    //className
    tokenizer.advance()

    if (tokenizer.tokenType() != JackTokenizer.TYPE.IDENTIFIER) {
      error("className")
    }
    //if its identifier
    printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n")
    tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n")

    //'{'
    requireSymbol("{")

    //classVarDec* subroutineDec*
    compileClassVarDec()
    compileSubroutine()

    //'}'
    requireSymbol("}")

    if (tokenizer.hasMoreTokens()) {
      throw new IllegalStateException("Unexpected tokens");
    }

    tokensPrintWriter.write("</tokens>\n");
    printWriter.write("</class>\n");

    //save file
    printWriter.close();
    tokensPrintWriter.close();
  }

  /**
   * Compiles a static declaration or a field declaration
   * classVarDec: ('static'|'field') type varName (','varNAme)* ';'
   */
  private function compileClassVarDec() : void {

    //first determine whether there is a classVarDec, nextToken is } or start subroutineDec
    tokenizer.advance();

    //next is a '}'-no classvardec and no subroutinedec
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == "}") {
      tokenizer.pointerBack();//because compile class will require it!(and require do advance!)
      return; //to compileclass
    }

    //next is start subroutineDec or classVarDec, both start with A keyword
    if (tokenizer.tokenType() != JackTokenizer.TYPE.KEYWORD) {
      error("We need Keywords");
    }

    //next is a subroutineDec
    if (tokenizer.keyWord() == KEYWORD.CONSTRUCTOR || tokenizer.keyWord() == KEYWORD.FUNCTION || tokenizer.keyWord() == KEYWORD.METHOD) {
      tokenizer.pointerBack() //because of subroutineDec
      return;//to compileclass
    }
    //if it is static or field-only if there are!
    printWriter.write("<classVarDec>\n");

    //classVarDec exists
    if (tokenizer.keyWord() != KEYWORD.STATIC && tokenizer.keyWord() != KEYWORD.FIELD) {
      error("static or field");
    }

    //print the keyword(static or field)
    printWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");
    tokensPrintWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");

    //type
    compileType();

    //at least one varName
    var varNamesDone = false;

    //all the varNames(at least1)
    do {

      //varName
      tokenizer.advance();
      if (tokenizer.tokenType() != TYPE.IDENTIFIER) {
        error("identifier");
      }

      printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
      tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");

      //',' or ';'
      tokenizer.advance();

      if (tokenizer.tokenType() != TYPE.SYMBOL || (tokenizer.symbol_() != "," && tokenizer.symbol_() != ";")) {
        error("',' or ';'");
      }

      if (tokenizer.symbol_() == ",") {
        printWriter.write("<symbol>,</symbol>\n");
        tokensPrintWriter.write("<symbol>,</symbol>\n");

      } else {

        printWriter.write("<symbol>;</symbol>\n");
        tokensPrintWriter.write("<symbol>;</symbol>\n");
        break;//because there are no varnames anymore
      }


    } while (true);

    printWriter.write("</classVarDec>\n");

    compileClassVarDec(); //recursicve call
  }

  /**
   * Compiles a complete method function or constructor
   * ('constractor'|'function'|'method') ('void'|type)subrotineName '('parameterList')' subrotineBody
   */
  private function compileSubroutine() : void {

    //determine whether there is a subroutine, next can be a '}'
    tokenizer.advance();

    //next is a '}'
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == "}") {
      tokenizer.pointerBack();
      return;//to compileclass
    }

    //start of a subroutine
    if (tokenizer.tokenType() != TYPE.KEYWORD || (tokenizer.keyWord() != KEYWORD.CONSTRUCTOR && tokenizer.keyWord() != KEYWORD.FUNCTION && tokenizer.keyWord() != KEYWORD.METHOD)) {
      error("constructor|function|method");
    }

    printWriter.write("<subroutineDec>\n"); ///there is at least 1

    printWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");
    tokensPrintWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");

    //'void' or type
    tokenizer.advance();
    if (tokenizer.tokenType() == TYPE.KEYWORD && tokenizer.keyWord() == KEYWORD.VOID) {
      printWriter.write("<keyword>void</keyword>\n");
      tokensPrintWriter.write("<keyword>void</keyword>\n");
    } else {
      tokenizer.pointerBack(); // we decrese the pointer beacuse the function compileType advances the pointer in 1
      compileType();
    }

    //subroutineName which is a identifier
    tokenizer.advance();
    if (tokenizer.tokenType() != TYPE.IDENTIFIER) {
      error("subroutineName");
    }

    printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
    tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");

    //'('
    requireSymbol("("); //for parameter list

    //parameterList
    printWriter.write("<parameterList>\n");
    compileParameterList();
    printWriter.write("</parameterList>\n");

    //')'
    requireSymbol(")"); //for closing the parameter list

    //subroutineBody
    compileSubroutineBody();

    printWriter.write("</subroutineDec>\n");

    compileSubroutine();
  }



  /**
   * Compiles the body of a subroutine
   * '{'  varDec* statements '}'
   */
  private function compileSubroutineBody() : void {
    printWriter.write("<subroutineBody>\n");
    //'{'
    requireSymbol("{");
    //varDec*
    compileVarDec();
    //statements
    printWriter.write("<statements>\n");
    compileStatement();
    printWriter.write("</statements>\n");
    //'}'
    requireSymbol("}");
    printWriter.write("</subroutineBody>\n");
  }

  /**
   * Compiles a single statement
   */
  private function compileStatement() : void {

    //determine whether there is a statementnext can be a '}'
    tokenizer.advance();

    //next is a '}'
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == "}") {
      tokenizer.pointerBack();
      return;//to subroutinebody
    }

    //next is 'let'|'if'|'while'|'do'|'return'
    if (tokenizer.tokenType() != TYPE.KEYWORD) {
      error("keyword");
    } else {
      switch (tokenizer.keyWord()) {
        case KEYWORD.LET:
          compileLet();
          break;
        case KEYWORD.IF:
          compileIf();
          break;
        case KEYWORD.WHILE:
          compilesWhile();
          break;
        case KEYWORD.DO:
          compileDo();
          break;
        case KEYWORD.RETURN:
          compileReturn();
          break;
        default:
          error("'let'|'if'|'while'|'do'|'return'");
      }
    }
    compileStatement();
  }

  /**
   * Compiles a (possibly empty) parameter list
   * not including the enclosing "()"
   * ((type varName)(',' type varName)*)?
   */
  private function compileParameterList() : void {

    //check if there is parameterList, if next token is ')' than go back
    tokenizer.advance();
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == ")") {
      tokenizer.pointerBack();
      return;//to subroutinedec
    }

    //there is parameter, at least one varName
    tokenizer.pointerBack();//because of compileType that we are going to do
    do {
      //type
      compileType();

      //varName
      tokenizer.advance();
      if (tokenizer.tokenType() != TYPE.IDENTIFIER) {
        error("identifier");
      }
      printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
      tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");

      //',' or ')'
      tokenizer.advance();
      if (tokenizer.tokenType() != TYPE.SYMBOL || (tokenizer.symbol_() != "," && tokenizer.symbol_() != ")")) {
        error("',' or ')'");
      }

      if (tokenizer.symbol_() == ",") {
        printWriter.write("<symbol>,</symbol>\n");
        tokensPrintWriter.write("<symbol>,</symbol>\n");
      } else {
        tokenizer.pointerBack();//because of requireSymbol(')') of compileSubroutine()
        break;
      }
    } while (true)
  }

  /**
   * Compiles a var declaration
   * 'var' type varName (',' varName)*;
   */
  private function compileVarDec() : void {

    //determine if there is a varDec

    tokenizer.advance();
    //no 'var' go back
    if (tokenizer.tokenType() != TYPE.KEYWORD || tokenizer.keyWord() != KEYWORD.VAR) {
      tokenizer.pointerBack();
      return;//to subroutinebody
    }
    //if there are var dec(at least 1)
    printWriter.write("<varDec>\n");

    printWriter.write("<keyword>var</keyword>\n");
    tokensPrintWriter.write("<keyword>var</keyword>\n");

    //type
    compileType();

    //at least one varName
    var varNamesDone = false;

    do {

      //varName
      tokenizer.advance();

      if (tokenizer.tokenType() != TYPE.IDENTIFIER) {
        error("identifier");
      }

      printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
      tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");

      //',' or ';'
      tokenizer.advance();

      if (tokenizer.tokenType() != TYPE.SYMBOL || (tokenizer.symbol_() != "," && tokenizer.symbol_() != ";")) {
        error("',' or ';'");
      }

      if (tokenizer.symbol_() == ",") {

        printWriter.write("<symbol>,</symbol>\n");
        tokensPrintWriter.write("<symbol>,</symbol>\n");

      } else {

        printWriter.write("<symbol>;</symbol>\n");
        tokensPrintWriter.write("<symbol>;</symbol>\n");
        break;
      }


    } while (true);

    printWriter.write("</varDec>\n");

    compileVarDec();
  }
  /**
   * Compiles a do statement
   * 'do' subroutineCall ';'
   */
  private function compileDo() : void {
    printWriter.write("<doStatement>\n");
    //we sure to write it because compileStatement check that there is!
    printWriter.write("<keyword>do</keyword>\n");
    tokensPrintWriter.write("<keyword>do</keyword>\n");

    //subroutineCall
    compileSubroutineCall();

    //';'
    requireSymbol(";");

    printWriter.write("</doStatement>\n");
  }

  /**
   * Compiles a let statement
   * 'let' varName ('[' ']')? '=' expression ';'
   * for example: let x[i]=3;
   */
  private function compileLet() : void {

    printWriter.write("<letStatement>\n");
    //we sure to write it because compileStatement check that there is!
    printWriter.write("<keyword>let</keyword>\n");
    tokensPrintWriter.write("<keyword>let</keyword>\n");

    //varName
    tokenizer.advance();
    if (tokenizer.tokenType() != TYPE.IDENTIFIER) {
      error("varName");
    }

    printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
    tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");

    //'[' or '='
    tokenizer.advance();
    if (tokenizer.tokenType() != TYPE.SYMBOL || (tokenizer.symbol_() != "[" && tokenizer.symbol_() != "=")) {
      error("'['|'='");
    }

    var expExist = false;

    //'[' expression ']'
    if (tokenizer.symbol_() == "[") {

      expExist = true;

      printWriter.write("<symbol>[</symbol>\n");
      tokensPrintWriter.write("<symbol>[</symbol>\n");

      compileExpression();//could be recursive inside

      //']'
      tokenizer.advance();
      if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == "]") {
        printWriter.write("<symbol>]</symbol>\n");
        tokensPrintWriter.write("<symbol>]</symbol>\n");
      } else {
        error("']'");
      }
    }

    if (expExist) {
      tokenizer.advance() //כדי להגיע ל=
    }

    //'='
    printWriter.write("<symbol>=</symbol>\n");
    tokensPrintWriter.write("<symbol>=</symbol>\n");

    //expression
    compileExpression();

    //';'
    requireSymbol(";");//////////////////////////

    printWriter.write("</letStatement>\n");
  }

  /**
   * Compiles a while statement
   * 'while' '(' expression ')' '{' statements '}'
   */
  private function compilesWhile() : void {
    printWriter.write("<whileStatement>\n");
    //we sure to write it because compileStatement check that there is!
    printWriter.write("<keyword>while</keyword>\n");
    tokensPrintWriter.write("<keyword>while</keyword>\n");

    //'('
    requireSymbol("(");

    //expression
    compileExpression();

    //')'
    requireSymbol(")");

    //'{'
    requireSymbol("{");

    //statements
    printWriter.write("<statements>\n");
    compileStatement();
    printWriter.write("</statements>\n");

    //'}'
    requireSymbol("}");

    printWriter.write("</whileStatement>\n");
  }



  /**
   * Compiles a return statement
   * ‘return’ expression? ';'
   */
  private function compileReturn() : void {
    printWriter.write("<returnStatement>\n");
    //we sure to write it because compileStatement check that there is!
    printWriter.write("<keyword>return</keyword>\n");
    tokensPrintWriter.write("<keyword>return</keyword>\n");
    //in jack there is always return-also if we wont return anything!
    //check if there is any expression
    tokenizer.advance();

    //no expression
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == ";") {
      printWriter.write("<symbol>;</symbol>\n");
      tokensPrintWriter.write("<symbol>;</symbol>\n");
      printWriter.write("</returnStatement>\n");
      return;//to compilestatement
    }
    //if its not ;
    tokenizer.pointerBack();
    //expression
    compileExpression();
    //';'
    requireSymbol(";");

    printWriter.write("</returnStatement>\n");
  }

  /**
   * Compiles an if statement
   * possibly with a trailing else clause
   * 'if' '(' expression ')' '{' statements '}' ('else' '{' statements '}')?
   */
  private function compileIf() : void {
    printWriter.write("<ifStatement>\n");
    //we sure to write it because compileStatement check that there is!
    printWriter.write("<keyword>if</keyword>\n");
    tokensPrintWriter.write("<keyword>if</keyword>\n");

    //'('
    requireSymbol("(");

    //expression
    compileExpression();

    //')'
    requireSymbol(")");

    //'{'
    requireSymbol("{");

    //statements
    printWriter.write("<statements>\n");
    compileStatement();
    printWriter.write("</statements>\n");

    //'}'
    requireSymbol("}");

    //check if there is 'else'
    tokenizer.advance();
    if (tokenizer.tokenType() == TYPE.KEYWORD && tokenizer.keyWord() == KEYWORD.ELSE) {
      printWriter.write("<keyword>else</keyword>\n");
      tokensPrintWriter.write("<keyword>else</keyword>\n");

      //'{'
      requireSymbol("{");

      //statements
      printWriter.write("<statements>\n");
      compileStatement();
      printWriter.write("</statements>\n");

      //'}'
      requireSymbol("}");
    } else {
      tokenizer.pointerBack();
    }

    printWriter.write("</ifStatement>\n");
  }

  /**
   * Compiles a term.
   * its  a liitle bit difficult to decide between some of the alternative parsing rules
   * Specifically, if the current token is an identifier-
   * we must distinguish between a variable, an array entry and a subroutine call
   * A single look-ahead token, which may be one of "[" "(" "." suffices to distinguish between the three possibilities
   * Any other token is not part of this term and should not be advanced over
   * integerConstant|stringConstant|keywordConstant|varName|varName '[' expression ']'|subroutineCall|
   * '(' expression ')'|unaryOp term
   */
  private function compileTerm() : void {
    printWriter.write("<term>\n")
    tokenizer.advance();
    //check if it is an identifier
    if (tokenizer.tokenType() == TYPE.IDENTIFIER) {
      //varName|varName '[' expression ']'|subroutineCall
      var tempId = tokenizer.identifier_();//give us the id

      tokenizer.advance();//lookahead!
      /////////////////////
      if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == "[") {
        printWriter.write("<identifier>" + tempId + "</identifier>\n");
        tokensPrintWriter.write("<identifier>" + tempId + "</identifier>\n");

        //this is an array entry
        printWriter.write("<symbol>[</symbol>\n");
        tokensPrintWriter.write("<symbol>[</symbol>\n");

        //expression
        compileExpression();

        //']'
        requireSymbol("]");

      }
      /////////////////////////////////////////////
      else if (tokenizer.tokenType() == TYPE.SYMBOL && (tokenizer.symbol_() == "(" || tokenizer.symbol_() == ".")) {

        //this is a subroutineCall
        //2 times of pointer back because we want to stand at the start of the subroutinecall
        tokenizer.pointerBack();
        tokenizer.pointerBack();

        compileSubroutineCall();

      }
      //////////////////////
      else {
        printWriter.write("<identifier>" + tempId + "</identifier>\n");//i
        tokensPrintWriter.write("<identifier>" + tempId + "</identifier>\n");//i

        //this is varName
        tokenizer.pointerBack();
      }

    }
    ///////////////////if it is not id
    else {
      //integerConstant|stringConstant|keywordConstant|'(' expression ')'|unaryOp term
      if (tokenizer.tokenType() == TYPE.INT_CONST) {
        printWriter.write("<integerConstant>" + tokenizer.intVal() + "</integerConstant>\n");
        tokensPrintWriter.write("<integerConstant>" + tokenizer.intVal() + "</integerConstant>\n");
      } else if (tokenizer.tokenType() == TYPE.STRING_CONST) {
        printWriter.write("<stringConstant>" + tokenizer.stringVal() + "</stringConstant>\n");
        tokensPrintWriter.write("<stringConstant>" + tokenizer.stringVal() + "</stringConstant>\n");
      }
      //if its keywordconstant
      else if (tokenizer.tokenType() == TYPE.KEYWORD &&
          (tokenizer.keyWord() == KEYWORD.TRUE ||
              tokenizer.keyWord() == KEYWORD.FALSE ||
              tokenizer.keyWord() == KEYWORD.NULL ||
              tokenizer.keyWord() == KEYWORD.THIS))
      {
        printWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");
        tokensPrintWriter.write("<keyword>" + tokenizer.getCurrentToken() + "</keyword>\n");
      }
      //(expression)
      else if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == "(") {
        printWriter.write("<symbol>(</symbol>\n");
        tokensPrintWriter.write("<symbol>(</symbol>\n");

        //expression
        compileExpression();

        //')'
        requireSymbol(")");
      }
      //unaryOp term (unaryop is ~ or -)
      else if (tokenizer.tokenType() == TYPE.SYMBOL && (tokenizer.symbol_() == "-" || tokenizer.symbol_() == "~")) {
        printWriter.write("<symbol>" + tokenizer.symbol_() + "</symbol>\n");
        tokensPrintWriter.write("<symbol>" + tokenizer.symbol_() + "</symbol>\n");

        //term
        compileTerm();
      }
      //////////////////////

      else {
        error("integerConstant|stringConstant|keywordConstant|'(' expression ')'|unaryOp term");
      }
    }
    ///////////////
    printWriter.write("</term>\n");

  }


  /**
   * Compiles a subroutine call
   * subroutineName '(' expressionList ')' | (className|varName) '.' subroutineName '(' expressionList ')'
   */
  private function compileSubroutineCall() : void {

    tokenizer.advance();
    if (tokenizer.tokenType() != TYPE.IDENTIFIER) {
      error("identifier");
    }

    printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
    tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");

    tokenizer.advance();
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == "(") {

      //'(' expressionList ')'
      printWriter.write("<symbol>(</symbol>\n");
      tokensPrintWriter.write("<symbol>(</symbol>\n");

      //expressionList
      printWriter.write("<expressionList>\n");
      compileExpressionList();
      printWriter.write("</expressionList>\n");

      //')'
      requireSymbol(")");

    } else if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == ".") {
      //(className|varName) '.' subroutineName '(' expressionList ')'
      printWriter.write("<symbol>.</symbol>\n");
      tokensPrintWriter.write("<symbol>.</symbol>\n");

      //subroutineName
      tokenizer.advance();
      if (tokenizer.tokenType() != TYPE.IDENTIFIER) {
        error("identifier");
      }
      printWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");
      tokensPrintWriter.write("<identifier>" + tokenizer.identifier_() + "</identifier>\n");

      //'('
      requireSymbol("(");

      //expressionList
      printWriter.write("<expressionList>\n");
      compileExpressionList();
      printWriter.write("</expressionList>\n");

      //')'
      requireSymbol(")");

    } else {
      error("'('|'.'");
    }
  }




  /**
   * Compiles an expression
   * term (op term)*
   */
  private function compileExpression() : void {
    printWriter.write("<expression>\n");


    //term
    compileTerm();

    //(op term)*
    do {
      tokenizer.advance();

      //op
      if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.isOp()) {

        if (tokenizer.symbol_() == ">") {
          printWriter.write("<symbol>&gt;</symbol>\n");
          tokensPrintWriter.write("<symbol>&gt;</symbol>\n");
        } else if (tokenizer.symbol_() == "<") {
          printWriter.write("<symbol>&lt;</symbol>\n");
          tokensPrintWriter.write("<symbol>&lt;</symbol>\n");
        } else if (tokenizer.symbol_() == "&") {
          printWriter.write("<symbol>&amp;</symbol>\n");
          tokensPrintWriter.write("<symbol>&amp;</symbol>\n");
        } else
        //all the rest (+ - * /.....)
        {
          printWriter.write("<symbol>" + tokenizer.symbol_() + "</symbol>\n");
          tokensPrintWriter.write("<symbol>" + tokenizer.symbol_() + "</symbol>\n");
        }
        //term
        compileTerm();
      } else {
        tokenizer.pointerBack();
        break;
      }

    } while (true);

    printWriter.write("</expression>\n");
  }






  /**
   * Compiles a (possibly empty) comma-separated list of expressions
   * (expression(','expression)*)?
   */
  private function compileExpressionList() : void {
    tokenizer.advance();

    //determine if there is any expression, if next is ')' then no
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == ")") {
      tokenizer.pointerBack();
      //no else so return to subroutineCall
    }
    else {

      tokenizer.pointerBack();//FOR DOING compileExpression

      //expression
      compileExpression();

      //(','expression)*
      do {
        tokenizer.advance();
        if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == ",") {
          printWriter.write("<symbol>,</symbol>\n");
          tokensPrintWriter.write("<symbol>,</symbol>\n");

          //expression
          compileExpression();
        } else {
          tokenizer.pointerBack();
          break;
        }

      } while (true);

    }

//    tokenizer.advance()
//    var type = tokenizer.tokenType()
//    //determine if there is any expression, if next is ')' then no
//    tokenizer.pointerBack()
//    if (!(type == TYPE.SYMBOL && tokenizer.symbol_() == ")")){
//      //expression
//      compileExpression()
//      //(','expression)*
//      do {
//        tokenizer.advance()
//        type = tokenizer.tokenType()
//        if (type == TYPE.SYMBOL && tokenizer.symbol_() == ","){
//          printWriter.write("<symbol>,</symbol>\n");
//         tokensPrintWriter.write("<symbol>,</symbol>\n");
//          //expression
//          compileExpression()
//        } else {
//          tokenizer.pointerBack()
//          break
//        }
//      } while(true)
//    }

  }

//-----------------------------------------Auxiliary functions-------------------------------------------------------
  /**
   * throw an exception to report errors
   *
   * @param val
   */
  private function error(val : String) : void {
    throw new IllegalStateException("Expected token missing : " + val + " Current token:" + tokenizer.getCurrentToken());
  }


  /**
   * require symbol when we know there must be such symbol
   *
   * @param symbol
   */
  private function requireSymbol(symbol : String) : void {
    tokenizer.advance();
    if (tokenizer.tokenType() == TYPE.SYMBOL && tokenizer.symbol_() == symbol) {
      printWriter.write("<symbol>" + symbol + "</symbol>\n");
      tokensPrintWriter.write("<symbol>" + symbol + "</symbol>\n");
    } else {
      error("'" + symbol + "'");
    }
  }
}


