package Tar5
uses java.io.File;
uses java.io.FileNotFoundException;
uses java.io.FileWriter
uses java.io.PrintWriter;
uses java.util.HashMap;

public class VMWriter {

  public static enum SEGMENT {CONST, ARG, LOCAL, STATIC, THIS, THAT, POINTER, TEMP, NONE};

  public static enum COMMAND {ADD, SUB, NEG, EQ, GT, LT, AND, OR, NOT};

  //private static var segmentStringHashMap: HashMap<SEGMENT,String>  = new HashMap<SEGMENT, String>();
  //private static var commandStringHashMap : HashMap<COMMAND, String> = new HashMap<COMMAND, String>();
  private var fileWriter : FileWriter

  static var segmentStringHashMap = {

      SEGMENT.CONST -> "constant",
      SEGMENT.ARG -> "argument",
      SEGMENT.LOCAL -> "local",
      SEGMENT.STATIC -> "static",
      SEGMENT.THIS -> "this",
      SEGMENT.THAT -> "that",
      SEGMENT.POINTER -> "pointer",
      SEGMENT.TEMP -> "temp"

//      COMMAND.ADD -> "add",
//      COMMAND.SUB -> "sub",
//      COMMAND.NEG -> "neg",
//      COMMAND.EQ -> "eq",
//      COMMAND.GT -> "gt",
//      COMMAND.LT -> "lt",
//      COMMAND.AND -> "and",
//      COMMAND.OR -> "or",
//      COMMAND.NOT -> "not"
  }
  static var commandStringHashMap=
      {
          COMMAND.ADD -> "add",
          COMMAND.SUB -> "sub",
          COMMAND.NEG -> "neg",
          COMMAND.EQ -> "eq",
          COMMAND.GT -> "gt",
          COMMAND.LT -> "lt",
          COMMAND.AND -> "and",
          COMMAND.OR -> "or",
          COMMAND.NOT -> "not"
      }

  /**
   * creates a new file and prepares it for writing
   *
   * @param fileOut
   */
  public function VMWriter(fileOut : File) {

    try {
      fileWriter = new FileWriter(fileOut);
    } catch (e : FileNotFoundException) {
      e.printStackTrace();
    }

  }

  /**
   * writes a VM push command
   *
   * @param segment
   * @param index
   */
  public function writePush(segment : SEGMENT, index : int) : void {
    writeCommand("push", segmentStringHashMap.get(segment), String.valueOf(index));
  }

  /**
   * writes a VM pop command
   *
   * @param segment
   * @param index
   */
  public function writePop(segment : SEGMENT, index : int) : void {
    writeCommand("pop", segmentStringHashMap.get(segment), String.valueOf(index));
  }

  /**
   * writes a VM arithmetic command
   *
   * @param command
   */
  public function writeArithmetic(command : COMMAND) : void {
    writeCommand(commandStringHashMap.get(command), "", "");
  }

  /**
   * writes a VM label command
   *
   * @param label
   */
  public function writeLabel(label : String) : void {
    writeCommand("label", label, "");
  }

  /**
   * writes a VM goto command
   *
   * @param label
   */
  public function writeGoto(label : String) : void {
    writeCommand("goto", label, "");
  }

  /**
   * writes a VM if-goto command
   *
   * @param label
   */
  public function writeIf(label : String) : void {
    writeCommand("if-goto", label, "");
  }

  /**
   * writes a VM call command
   *
   * @param name
   * @param nArgs
   */
  public function writeCall(name : String, nArgs : int) : void {
    writeCommand("call", name, String.valueOf(nArgs));
  }

  /**
   * writes a VM function command
   *
   * @param name
   * @param nLocals
   */
  public function writeFunction(name : String, nLocals : int) : void {
    writeCommand("function", name, String.valueOf(nLocals));
  }

  /**
   * writes a VM return command
   */
  public function writeReturn() : void {
    writeCommand("return", "", "");
  }

  public function writeCommand(command : String, arg1 : String, arg2 : String) : void {

    fileWriter.write(command + " " + arg1 + " " + arg2 + "\n");

  }

  /**
   * close the output file
   */
  public function close() : void {
    fileWriter.close();
  }

}
