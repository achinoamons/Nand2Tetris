uses java.io.*
uses java.nio.file.Files
uses java.nio.file.Paths
//Achinoam Monsonego ID 206552382
//Shulamit Nahon ID 323782854


//static var vm_content = {}//array of lines
static var outputBuffer=""
static var file_name=""//we need it for static push and pop command for examle
static  var output : FileWriter
//Each comparison operation needs its own label so we have created a global counter that will produce different labels for us
var labelCounter=0
var returnAddressIndex = 0//a counter for the return address for example in recursion

main()
function main():void
{
  //get the path from the user
  var scanner = new Scanner(System.in)
//path_ - a variable that has the path to a file / directory.
  var path_ = scanner.nextLine()

  var direc = new File(path_) //create a file handle
  var x =path_.split("\\\\")/////////////////
  var y=x[x.length-1]


  if(direc.isDirectory()){
    output= new FileWriter(path_+ "\\"+y+".asm") //creates a new file with .asm suffix with the name of the last dir in the path///////
    output.write(" ")
    FolderVmToHack(path_,direc)
    output.write(outputBuffer.toString())
    print(outputBuffer+"\n")//for checking
    output.close()
  }
  else//if it is a file
  {
    var path1=path_.substring(0,path_.lastIndexOf("\\"))
    var z=y.substring(0,y.lastIndexOf("."))
    output= new FileWriter(path1+ "\\"+z+".asm") //creates a new file with .asm suffix with the name of the last file in the path
    output.write(" ")
    if (direc.Name.endsWith(".vm")){
      FileVmToHack(direc)
    }
    output.write(outputBuffer.toString())
    print(outputBuffer+"\n")//for checking
    output.close()
  }
}

private function add_command():void
{
  outputBuffer +=(
      "// vm command: add\n" +
          "@SP\n"+//A=0
          "A=M-1\n"+//A=269
          "D=M\n"+//D=Y
          "A=A-1\n"+//A=268
          "M=D+M\n"+//RAM[268]=Y+RAM[268]=Y+X
          "@SP\n"+//A=0
          "M=M-1\n"//RAM[0]=RAM[0]-1=269 FOR EXAMPLE
  )


}

private function sub_command() {
  outputBuffer +=(
      "// vm command: sub\n" +
          "@SP\n"+//A=0
          "A=M-1\n"+//A=270-1
          "D=M\n"+//D=Y
          "A=A-1\n"+//A=268
          "M=M-D\n"+//X-Y
          "@SP\n"+
          "M=M-1\n"
  )
}

private function neg_command() {
  outputBuffer +=(
      "// vm command: neg\n" +
          "@SP\n"+//A=0
          "A=M-1\n"+//A=270-1
          "M=-M\n"//M=-Y

  )
}

private function eq_command() {
  outputBuffer += (
      "// vm command: eq\n" +
          "@SP\n"+//A=0
          "A=M-1\n"+//A=270-1
          "D=M\n"+//D=Y
          "A=A-1\n"+//A=268
          "D=D-M\n"+//Y-X
          "@IF_TRUE" + labelCounter + "\n"+
          "D;JEQ\n"+//CHECK IF D=0
          "@SP\n"+//A=0
          "M=M-1\n"+//RAM[0]=RAM[0]-1=269 FOR EXAMPLE
          "A=M-1\n"+//A=268
          "M=0\n"+//RAM[268]=0=FALSE
          "@IF_FALSE" + labelCounter + "\n"+
          "0;JMP\n"+
          "(IF_TRUE" + labelCounter + ")\n"+
          "@SP\n"+//A=0
          "M=M-1\n"+//RAM[0]=RAM[0]-1=269 FOR EXAMPLE
          "A=M-1\n"+//A=268
          "M=-1\n"+//RAM[268]=-1=TRUE
          "(IF_FALSE" + labelCounter + ")\n"
  )
  labelCounter++
}

private function gt_command() { //CHECK IF X>Y
  outputBuffer += (
      "// vm command: gt\n" +
          "@SP\n"+ //A=0
          "A=M-1\n"+ //A=270-1
          "D=M\n"+ //D=Y
          "A=A-1\n"+ //A=268
          "D=M-D\n"+ //D=X-Y
          "@IF_TRUE" + labelCounter + "\n"+
          "D;JGT\n"+ //CHECK ID D>0
          "@SP\n"+ //A=0
          "M=M-1\n"+ //M= 270-1
          "A=M-1\n"+ //A=268
          "M=0\n"+//RAM[268]=0=FALSE
          "@IF_FALSE" + labelCounter + "\n"+
          "0;JMP\n"+
          "(IF_TRUE" + labelCounter + ")\n"+ //IF X > Y
          "@SP\n"+
          "M=M-1\n"+
          "A=M-1\n"+
          "M=-1\n"+ //THEN PUT -1 AS A TRUE RESULT
          "(IF_FALSE" + labelCounter + ")\n"
  )
  labelCounter++
}

private function lt_command() {//CHECK IF X<Y
  outputBuffer += (
      "// vm command: lt\n" +
          "@SP\n"+//A=0
          "A=M-1\n"+//A=270-1
          "D=M\n"+//D=Y
          "A=A-1\n"+//A=268
          "D=D-M\n"+//Y-X
          "@IF_TRUE" + labelCounter + "\n"+
          "D;JGT\n"+//CHECK IF D>0
          "@SP\n"+//A=0
          "M=M-1\n"+//RAM[0]=RAM[0]-1=270-1 =THE NEXT FREE PLACE
          "A=M-1\n"+//A=268
          "M=0\n"+//RAM[268]=0
          "@IF_FALSE" + labelCounter + "\n"+
          "0;JMP\n"+
          "(IF_TRUE" + labelCounter + ")\n"+
          "@SP\n"+//A=0
          "M=M-1\n"+//RAM[0]=RAM[0]-1
          "A=M-1\n"+//A=268
          "M=-1\n"+//RAM[268]=-1=TRUE
          "(IF_FALSE" + labelCounter + ")\n"
  )
  labelCounter++
}

private function and_command() {
  outputBuffer += (
      "// vm command: and\n" +
          "@SP\n"+//A=0
          "A=M-1\n"+//A=270-1
          "D=M\n"+//D=Y
          "A=A-1\n"+//A=268
          "M=D&M\n"+//RAM[268]=Y AND X
          "@SP\n"+
          "M=M-1\n"//THE NEXT FREE PLACE

  )
}

private function or_command() {
  outputBuffer += (
      "// vm command: or\n" +
          "@SP\n"+//A=0
          "A=M-1\n"+//A=270-1
          "D=M\n"+//D=Y
          "A=A-1\n"+//A=268
          "M=D|M\n"+//RAM[268]=Y OR X
          "@SP\n"+
          "M=M-1\n"

  )
}

private function not_command() {
  outputBuffer += (
      "// vm command: not\n" +
          "@SP\n" +//A=0
          "A=M-1\n" +//A=270-1
          "M=!M\n"//Y=not Y

  )
}

private function push_command(line : Object):void {
  var command = line.toString().split(" ")
  switch (command[1].toString()) {
    case ("constant"):
      outputBuffer += (
          "// vm command: push constant\n" +
              "@" + command[2] + "\n" + //FOR EXAMPLE A=5
              "D=A\n" +//D=5
              "@SP\n" +//A=0
              "A=M\n" +//A=270
              "M=D\n" +//RAM[270]=CONST=5 FOR EXAMPLE
              "@SP\n" +//A=0
              "M=M+1\n"//THE ADDRESS GROW IN 1
      )
      break

    case "local":
      outputBuffer += (
          "// vm command: push local\n" +
              "@" + command[2] + "\n" +//A=X
              "D=A\n" +//D=X
              "@LCL\n"+//A=1
              "A=M+D\n"+//A=RAM[1](1000 FOR EXAMPLE)+X
              "D=M\n"+//D=RAM[1000+X] /3 FOR EXAMPLE
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=3
              "@SP\n"+//A=0
              "M=M+1\n"//SP GROW IN 1

      )
      break
    case "argument":
      outputBuffer += (
          "// vm command: push argument\n" +
              "@" + command[2] + "\n" +//A=X
              "D=A\n" +//D=X
              "@ARG\n"+//A=2
              "A=M+D\n"+//A=RAM[2](2000 FOR EXAMPLE)+X
              "D=M\n"+//D=RAM[2000+X] /3 FOR EXAMPLE
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=3
              "@SP\n"+//A=0
              "M=M+1\n"//SP GROW IN 1

      )
      break
    case "this"://FIELDS OF OBJECT
      outputBuffer += (
          "// vm command: push this\n" +
              "@" + command[2] + "\n" +//A=X
              "D=A\n" +//D=X
              "@THIS\n"+//A=3
              "A=M+D\n"+//A=RAM[3](3000 FOR EXAMP)+X
              "D=M\n"+//D=RAM[3000+X]
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=VALUE
              "@SP\n"+//A=0
              "M=M+1\n"//SP GROW IN 1

      )
      break
    case "that"://PLACES IN ARRAY
      outputBuffer += (
          "// vm command: push that\n" +
              "@" + command[2] + "\n" +//A=X
              "D=A\n" +//D=X
              "@THAT\n"+//A=4
              "A=M+D\n"+//A=RAM[4](4000 FOR EXAMPLE)+X
              "D=M\n"+//D=RAM[4000+X]
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=D
              "@SP\n"+//A=0
              "M=M+1\n"//SP GROW IN 1

      )
      break
    case "temp":
      outputBuffer += (
          "// vm command: push temp\n" +
              "@" + command[2] + "\n" +//A=X and x is between 0 to 7
              "D=A\n" +//D=X
              "@5\n"+//5 is constant value, since temp variables are saved on RAM[5-12]
              "A=A+D\n"+//A=5+X
              "D=M\n"+//D=RAM[5+X]
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=RAM[5+X]
              "@SP\n"+
              "M=M+1\n"//SP GROW IN 1

      )
      break
    case "static"://STATIC ARE BETWEEN RAM[16] TO RAM[255]
      outputBuffer += (
          "// vm command: push static\n" +
              "@" + file_name + "." + command[2] + "\n" +//A=FILENAME.X-TO GET THE NAME OF THE CLASS =THE NAME OF VM FILE
              "D=M\n" +//D=RAM[A]=CONTENT OF STATIC
              "@SP\n" +//A=0
              "A=M\n" +//A=270
              "M=D\n" +//RAM[270]=CONTENT OF STATIC
              "@SP\n"+
              "M=M+1\n"
      )
      break


    case "pointer":
      switch (command[2]) {
        case "0"://POINTER TO OBJECT
          outputBuffer += (
              "// vm command: push pointer 0\n" +
                  "@THIS\n" +//A=3
                  "D=M\n" +//D=RAM[3]
                  "@SP\n" +//A=0
                  "A=M\n" +//A=RAM[0]=270
                  "M=D\n" +//RAM[270]=RAM[3]-THE ADDRESS OF THE POINTER TO THE OBJECT
                  "@SP\n" +
                  "M=M+1\n")
          break
        case "1"://POINTER TO ARRAY
          outputBuffer += (
              "// vm command: push pointer 1\n" +
                  "@THAT\n" +//A=4
                  "D=M\n" +//D=RAM[4]
                  "@SP\n" +//A=0
                  "A=M\n" +//A=RAM[0]=270
                  "M=D\n" +//RAM[270]=RAM[4]-THE ADDRESS OF THE POINTER OF THE ARRAY
                  "@SP\n" +
                  "M=M+1\n")
          break

      }
      break


  }
}

private function pop_command(line : Object) {
  var command = line.toString().split(" ")
  switch (command[1].toString()) {
    case "local":
      outputBuffer += (
          "// vm command: pop local\n" +
              "@LCL\n"+ //A=1
              "D=M\n"+//D=RAM[1](1000 FOR EXAMPLE)
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=1000
              "@" + command[2] + "\n"+//A=X
              "D=A\n"+//D=X
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D+M\n"+//RAM[270]=RAM[270]+X=1000+X
              "@SP\n"+//A=0
              "A=M-1\n"+//A=RAM[0]-1=269
              "D=M\n"+//D=RAM[269] FOR EXAMPLE 3
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "A=M\n"+//A=RAM[270]=1000+X
              "M=D\n"+//RAM[1000+X]=3
              "@SP\n"+//A=0
              "M=M-1\n"//SP DECREASE IN 1
      )
      break
    case "argument":
      outputBuffer += (
          "// vm command: pop argument\n" +
              "@ARG\n"+ //A=2
              "D=M\n"+//D=RAM[2]=(2000 FOR EXAMPLE)
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=2000
              "@" + command[2] + "\n"+//A=X
              "D=A\n"+//D=X
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D+M\n"+//RAM[270]=RAM[270]+X=2000+X
              "@SP\n"+//A=0
              "A=M-1\n"+//A=RAM[0]-1=269
              "D=M\n"+//D=RAM[269] FOR EXAMPLE 3
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "A=M\n"+//A=RAM[270]=2000+X
              "M=D\n"+//RAM[2000+X]=3
              "@SP\n"+//A=0
              "M=M-1\n"//SP DECREASE IN 1
      )
      break
    case "this":
      outputBuffer += (
          "// vm command: pop this\n" +
              "@THIS\n"+ //A=3
              "D=M\n"+//D=RAM[3] (3000 FOR EXAMPLE)
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=3000
              "@" + command[2] + "\n"+//A=X
              "D=A\n"+//D=X
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D+M\n"+//RAM[270]=RAM[270]+X=3000+X
              "@SP\n"+//A=0
              "A=M-1\n"+//A=RAM[0]-1=269
              "D=M\n"+//D=RAM[269] FOR EXAMPLE 3
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "A=M\n"+//A=RAM[270]=3000+X
              "M=D\n"+//RAM[3000+X]=3
              "@SP\n"+//A=0
              "M=M-1\n"//SP DECREASE IN 1
      )
      break
    case "that":
      outputBuffer += (
          "// vm command: pop that\n" +
              "@THAT\n"+ //A=4
              "D=M\n"+//D=RAM[4]=4000 FOR EXAMPLE
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D\n"+//RAM[270]=4000
              "@" + command[2] + "\n"+//A=X
              "D=A\n"+//D=X
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "M=D+M\n"+//RAM[270]=RAM[270]+X=4000+X
              "@SP\n"+//A=0
              "A=M-1\n"+//A=RAM[0]-1=269
              "D=M\n"+//D=RAM[269] FOR EXAMPLE 3
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "A=M\n"+//A=RAM[270]=4000+X
              "M=D\n"+//RAM[4000+X]=3
              "@SP\n"+//A=0
              "M=M-1\n"//SP DECREASE IN 1
      )
      break
    case "temp":
      outputBuffer += (
          "// vm command: pop temp\n" +
              "@5\n"+ //A=5
              "D=A\n"+//D=5
              "@" + command[2] + "\n"+//A=X
              "D=D+A\n"+//D=5+X
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270

              "M=D\n"+//RAM[270]=5+X
              "@SP\n"+//A=0
              "A=M-1\n"+//A=RAM[0]-1=269
              "D=M\n"+//D=RAM[269] FOR EXAMPLE 3
              "@SP\n"+//A=0
              "A=M\n"+//A=RAM[0]=270
              "A=M\n"+//A=RAM[270]=5+X
              "M=D\n"+//RAM[5+X]=D=3
              "@SP\n"+//A=0
              "M=M-1\n"//SP DECREASE IN 1

      )
      break
    case "pointer":
      switch (command[2]) {
        case "0":
          outputBuffer += (
              "// vm command: pop pointer 0\n" +
                  "@SP\n" +//A=0
                  "A=M-1\n" +//A=RAM[0]-1=269
                  "D=M\n" +//D=RAM[269] FOR EXAMPLE 3012
                  "@THIS\n" +//A=3
                  "M=D\n" +//RAM[3]=RAM[269]=3012
                  "@SP\n" +
                  "M=M-1\n")
          break
        case "1":
          outputBuffer += (
              "// vm command: pop pointer 1\n" +
                  "@SP\n" +//A=0
                  "A=M-1\n" +//A=RAM[0]-1=269
                  "D=M\n" +//D=RAM[269]
                  "@THAT\n" +//A=4
                  "M=D\n" +//RAM[4]=RAM[269]
                  "@SP\n" +
                  "M=M-1\n")
          break

      }
      break
    case "static":
      outputBuffer += (
          "// vm command: pop static\n" +
              "@SP\n"+ //A=0
              "A=M-1\n"+//A=RAM[0]-1=269
              "D=M\n"+//D=RAM[269]
              "@" + file_name + "." + command[2] + "\n" +//TO GET THE NAME OF THE CLASS =THE NAME OF VM FILE
              "M=D\n"+//RAM[LABLE]=D
              "@SP\n"+//A=0
              "M=M-1\n"


      )
      break

  }
}
private function if_goto(line : Object) : void {
  var command = line.toString().split(" ")
  var label_name = command[1]
  outputBuffer += (
      "// vm command: if_goto\n" +
          "@" +
          "SP\n" +//A=0
          "M=M-1\n" +//RAM[0]=RAM[0]-1//SP DECREASE IN 1
          "A=M\n" +//A=RAM[0] FOR EXAMPLE 269
          "D=M\n" +//D=RAM[269]
          "@" +//LOAD LABEL NAME TO A
          file_name +
          "." +
          label_name +
          "\n" +
          "D;JNE\n"//IF THE HEAD OF THE STACK!=0 JUMP TO THE LABEL
  )

}
private function goto(line : Object) : void {
  var command = line.toString().split(" ")
  var label_name = command[1]//get label c
  outputBuffer += (
      "// vm command: goto\n" +
          "@" +
          file_name +
          "." +
          label_name +
          "\n" +
          "0;JMP\n"//JUMP WITOUT CONDITION TO THE LABEL
  )

}
private function label(line : Object) : void {
  var command = line.toString().split(" ")
  var label_name = command[1] //get c
  outputBuffer += (
      "// vm command: label\n" +
          "(" +
          file_name +
          "." +
          label_name +
          ")\n"
  )

}
private function function_VM(line : Object) : void {//DECLERATION ON A FUNCTION WITH K LOCAL VARIABLES
  var command = line.toString().split(" ")
  var func_name = command[1]
  var local_num = command[2]
  outputBuffer += (
      "// vm command: function\n" +
          "(" + func_name + ")\n" //DECLARE THE LABEL FOR THE FUNCTION ENTRY
          //WHEN THE FUNC STARTS RUNNING IT NEEDS TO PUT 0 IN THE STACK local_num TIMES
          + "@" + local_num + "\n" +//A=THE NUMBER OF THE LOCALS FOR EXAMPLE 5
          "D=A\n" +//FOR EXAMPLE 5
          "@" + func_name + ".End\n" +
          "D;JEQ\n" +//IF D=0 THEN JUMP TO THE END OF THE FUNCTION
          "(" + func_name + ".Loop)\n" +
          "@SP\n" +             //   A = 0
          "A=M\n" +             //   A = ram[0] FOR EXAMPLE 270
          "M=0\n" +             //   ram[ram[0]] = 0-PUT 0 AT THE HEAD OF STACK AS THE NUM OF LOCALS
          "@SP\n" +             //   A = 0
          "M=M+1\n"+            //   ram[0] = ram[0]+1  +//save space in stack with D val-SP INCREASE IN 1
          "@" + func_name + ".Loop\n" +
          "D=D-1;JNE\n" +//IF D IS STILL NOT=0 REPEAT THE LOOP
          "(" + func_name + ".End)\n"


  )


}

private function call(line : Object) : void {//AFTER PUSHING N ARGUMENTS -CALL THE FUNC!
  var command = line.toString().split(" ")
  var func_name = command[1]
  var n=command[2]
  //push return-address
  outputBuffer += (
      "// vm command: call\n" +
          "@" +func_name + ".ReturnAddress" + returnAddressIndex + "\n"
          + "D=A\n"
          + "@SP\n"//A=0
          + "A=M\n"//A=RAM[0] FOR EXAMPLE 270
          + "M=D\n"
          + "@SP\n"
          +"M=M+1\n"//SP INCREASE IN 1

          //push LCL OF CALLER
          + "@LCL\n"//A=1
          + "D=M\n"//D=RAM[1]
          + "@SP\n"//A=0
          + "A=M\n"//A=RAM[0] FOR EXAMPLE 270
          + "M=D\n"//RAM[270]=RAM[1]=THE LCL ADDRESS
          + "@SP\n"
          + "M=M+1\n"//SP INCREASE IN 1

          //push ARG
          + "@ARG\n"//A=2
          + "D=M\n"//D=RAM[2]
          + "@SP\n"//A=0
          + "A=M\n"//A=RAM[0] FOR EXAMPLE 270
          + "M=D\n"//RAM[270]=RAM[2]=ADDRESS OF ARG OF CALLER
          + "@SP\n"
          + "M=M+1\n"//SP INCREASE IN 1

          //push THIS
          + "@THIS\n"//A=3
          + "D=M\n"//D=RAM[3]
          + "@SP\n"//A=0
          + "A=M\n"//A=RAM[0] FOR EXAMP 270
          + "M=D\n"//RAM[270]=RAM[3]=ADD OF THIS OF CALLER
          + "@SP\n"
          + "M=M+1\n"

          //push THAT
          + "@THAT\n"//A=4
          + "D=M\n"//D=RAM[4]
          + "@SP\n"//A=0
          + "A=M\n"//A=RAM[0] FOR EXAMP 270
          + "M=D\n"//RAM[270]=RAM[4]=ADDRESS OF THAT OF CALLER
          + "@SP\n"
          + "M=M+1\n"

          //ARG = SP-n-5=ARGS OF CALLEE
          + "@SP\n"//a=0
          + "D=M\n"//d=ram[0] FOR EXAMPLE 270
          + "@5\n"//a=5
          + "D=D-A\n"//d=ram[0]-5 FOR EXAMPLE 265
          + "@" + n + "\n"//a=n=num of args
          + "D=D-A\n"//d=d-n FOR EXAMPLE 265-N
          + "@ARG\n"//A=2
          + "M=D\n"//RAM[2]=D =THE ADDRESS OF ARGS OF CALLEE

          //LCL OF CALLEE = SP
          + "@SP\n"//A=0
          + "D=M\n"//D=RAM[0] FOR EXAMPLE 270
          + "@LCL\n"//A=1
          + "M=D\n"//RAM[1]=270
          //goto THE func

          +"@"+func_name+"\n"
          +"0;JMP\n"
          //return-address label
          + "(" + func_name + ".ReturnAddress" + returnAddressIndex + ")\n"
  )

  returnAddressIndex++//FOR RECURSION OR IF WE CALL THE FUNC MORE THAN 1 TIME...ETC.


}
private function return_VM(line : Object) : void {//RETURN CONTROL TO THE CALLER
  outputBuffer += (
      "// vm command: return\n" +

// FRAME = LCL OF CALLEE
          "@LCL\n"+//A=1
          "D=M\n"+//D=RAM[1]=THE ADDRESS OF LOCALS OF CALLEE

// RET = * (FRAME-5)-PUT THE RETURN ADDRESS IN A TEMPORARY VARIABLE
// RAM[13] = (LOCAL - 5)[13 -15 ARE FREE REGISTERS FOR GENAREAL PURPOSE!]
          //Before placing the returned value - it is mandatory to save the return address.
          //If the function has no arguments - the return address may be overwritten
          "@5\n"+//A=5
          "A=D-A\n"+//A=THE ADDRESS OF LOCALS OF CALLEE-5=THE PLACE OF RETURN ADDRESS
          "D=M\n"+//D=RAM[A]=THE RETURN ADDRESS
          "@13\n"+//A=13
          "M=D\n"+//SAVE THE RETURN ADDRESS IN RAM[13]

// * ARG = pop()=PUT THE RESULT OF CALLEE IN THE PLACE OF ARGUMENT O OF CALLEE-למעלה
          "@SP\n"+//A=0
          "M=M-1\n"+//RAM[0]=RAM[0]-1=SP DECREASE IN 1 FOR EXAMLE 269
          "A=M\n"+//A=269=THE PLACE OF RESULT
          "D=M\n"+//D=RAM[269]=THE RESULT
          "@ARG\n"+//A=2=THE PLACE WHERE THE ADREES OF ARGS OF CALLEE IS WRITTEN
          "A=M\n"+//A=RAM[2]
          "M=D\n"+//RAM[RAM[2]]=THE RESULT
          // SP = ARG+1
          "@ARG\n"+//A=2
          "D=M\n"+//D=RAM[2]
          "@SP\n"+//A=0
          "M=D+1\n"+//RAM[0]=RAM[2]+1 -הדריסה...

// THAT = *(FRAM-1)-RESTORE THAT OF CALLER
          "@LCL\n"+//A=1
          " M=M-1\n"+//RAM[1]=RAM[1]-1
          "A=M\n"+//A=RAM[1]
          "D=M\n"+//D=RAM[RAM[1]]=THE ADRESS OF THAT OF CALLER
          "@THAT\n"+//A=4
          "M=D\n"+//RAM[4]=THE ADREES OF THAT OF CALLER

// THIS = *(FRAM-2)-RESTORE THIS OF CALLER
          "@LCL\n"+//A=1
          "M=M-1\n"+//RAM[1]=RAM[1]-1
          "A=M\n"+//A=RAM[1]
          "D=M\n"+//D=RAM[RAM[1]]=THE ADRESS OF THIS OF CALLER
          "@THIS\n"+//A=3
          "M=D\n"+//RAM[3]=THE ADREES OF THIS OF CALLER
// ARG = *(FRAM-3)-RESTORE ARG OF CALLER
          "@LCL\n"+//A=1
          "M=M-1\n"+//RAM[1]=RAM[1]-1
          "A=M\n"+//A=RAM[1]
          "D=M\n"+
          "@ARG\n"+//A=2
          "M=D\n"+
// LCL = *(FRAM-4)-RESTORE LCL OF CALLER
          "@LCL\n"+
          "M=M-1\n"+
          "A=M\n"+
          "D=M\n"+
          "@LCL\n"+//A=1
          "M=D\n"+

// goto RET
          "@13\n"+//A=13
          "A=M\n"+//A=RAM[13]
          "0; JMP\n")//GO TO RAM[13]

}


////path_ - a variable that has the path to a file / directory.
////var path_ = "C:\\Users\\user\\IdeaProjects\\Ekronot\\Tar1\\07\\MemoryAccess\\StaticTest"
//
////get the path from the user
//var scanner = new Scanner(System.in)
////path_ - a variable that has the path to a file / directory.
//var path_ = scanner.nextLine()
//
//var direc = new File(path_) //create a file handle
//var x =path_.split("\\\\")/////////////////
//var y=x[x.length-1]
//var output : FileWriter
//if(direc.isDirectory()){
//  output= new FileWriter(path_+ "\\"+y+".asm") //creates a new file with .asm suffix with the name of the last dir in the path///////
//  output.write(" ")
//}
//else
//{
//  var path1=path_.substring(0,path_.lastIndexOf("\\"))
//  output= new FileWriter(path1+ "\\"+y+".asm") //creates a new file with .asm suffix with the name of the last file in the path
//  output.write(" ")
//}

function FolderVmToHack( path_ :Object, direc :File):void {

  var fileList = direc.list() // a list of files in the directory
  var size:int
  for (var fname in fileList) {
    var currentFile1 = new File(path_ + "\\" + fname)
    if ((currentFile1.Name.endsWith(".vm"))){
      size++
    }
  }
  if(size>1){//if there are more than 1 .vm file -then bootstrap!
    outputBuffer += (
        "@256\n" + "D=A\n" + "@SP\n" + "M=D\n"

    )
    // output.write(outputBuffer.toString())
    call("call Sys.init 0")
  }

  for (var fname in fileList) {
    var currentFile = new File(path_ + "\\" + fname)
    print(currentFile.getName())

    if ((currentFile.Name.endsWith(".vm"))) //the current file has .vm suffix
    {
//       if ((currentFile.Name.toLowerCase().endsWith("sys.vm"))) {//add the tipul in bootstrap
//         outputBuffer += (
//             "@256\n" + "D=A\n" + "@SP\n" + "M=D\n"
//
//         )
//         output.write(outputBuffer.toString())
//         call("call Sys.init 0")
//
//
//       }
      FileVmToHack(currentFile)
    }
  }
}
function FileVmToHack(currentFile:File):void{
  var vm_content = {}//list of lines
  file_name = currentFile.getName().substring(0, currentFile.getName().indexOf("."))//
  var reader = new Scanner(currentFile) //create object to read from file
  while (reader.hasNextLine()) //while its not the EOF read all the content from the file and add it to the array
  {
    var line0 = reader.nextLine().toString() //זה מה שבחמישי שמתי בהערה ו2 השורות מתחתיו מתחתיו זה התיקוןבשביל הערות
    if (!line0.startsWith("//") && !line0.isEmpty()) {
      var line1 = line0.split("//")
      //var line1 = reader.nextLine().toString().split("//")//split the line accoording to // רביע 6.4-----------------------

      print(line1);
      var line = line1[0].toString()
      print(line);
      if (!line.startsWith("//") && !line.isEmpty())
        vm_content.add(line.toString())
    }}
  for (var line in vm_content) {
    var split_line = line.toString().split(" ")
    switch (split_line[0]) //splits the line and check the index 0
    {
      //tar1
      case "add":
        add_command()
        break
      case "sub":
        sub_command()
        break
      case "neg":
        neg_command()
        break
      case "eq":
        eq_command()
        break
      case "gt":
        gt_command()
        break
      case "lt":
        lt_command()
        break
      case "and":
        and_command()
        break
      case "or":
        or_command()
        break
      case "not":
        not_command()
        break
      case "push":
        push_command(line)
        break
      case "pop":
        pop_command(line)
        break
      //tar2
      case "label":
        label(line)
        break
      case "goto":
        goto(line)
        break
      case "if-goto":
        if_goto(line)
        break
      case "function":
        function_VM(line)
        break
      case "call":
        call(line)
        break
      case "return":
        return_VM(line)
        break
      default:
        print("ERROR")
    }

  }
}






