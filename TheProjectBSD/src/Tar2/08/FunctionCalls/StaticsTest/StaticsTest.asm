 @256
D=A
@SP
M=D
// vm command: call
@Sys.init.ReturnAddress0
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(Sys.init.ReturnAddress0)
// vm command: function
(Class1.set)
@0
D=A
@Class1.set.End
D;JEQ
(Class1.set.Loop)
@SP
A=M
M=0
@SP
M=M+1
@Class1.set.Loop
D=D-1;JNE
(Class1.set.End)
// vm command: push argument
@0
D=A
@ARG
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop static
@SP
A=M-1
D=M
@Class1.0
M=D
@SP
M=M-1
// vm command: push argument
@1
D=A
@ARG
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop static
@SP
A=M-1
D=M
@Class1.1
M=D
@SP
M=M-1
// vm command: push constant
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: return
@LCL
D=M
@5
A=D-A
D=M
@13
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@LCL
 M=M-1
A=M
D=M
@THAT
M=D
@LCL
M=M-1
A=M
D=M
@THIS
M=D
@LCL
M=M-1
A=M
D=M
@ARG
M=D
@LCL
M=M-1
A=M
D=M
@LCL
M=D
@13
A=M
0; JMP
// vm command: function
(Class1.get)
@0
D=A
@Class1.get.End
D;JEQ
(Class1.get.Loop)
@SP
A=M
M=0
@SP
M=M+1
@Class1.get.Loop
D=D-1;JNE
(Class1.get.End)
// vm command: push static
@Class1.0
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: push static
@Class1.1
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: sub
@SP
A=M-1
D=M
A=A-1
M=M-D
@SP
M=M-1
// vm command: return
@LCL
D=M
@5
A=D-A
D=M
@13
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@LCL
 M=M-1
A=M
D=M
@THAT
M=D
@LCL
M=M-1
A=M
D=M
@THIS
M=D
@LCL
M=M-1
A=M
D=M
@ARG
M=D
@LCL
M=M-1
A=M
D=M
@LCL
M=D
@13
A=M
0; JMP
// vm command: function
(Class2.set)
@0
D=A
@Class2.set.End
D;JEQ
(Class2.set.Loop)
@SP
A=M
M=0
@SP
M=M+1
@Class2.set.Loop
D=D-1;JNE
(Class2.set.End)
// vm command: push argument
@0
D=A
@ARG
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop static
@SP
A=M-1
D=M
@Class2.0
M=D
@SP
M=M-1
// vm command: push argument
@1
D=A
@ARG
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop static
@SP
A=M-1
D=M
@Class2.1
M=D
@SP
M=M-1
// vm command: push constant
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: return
@LCL
D=M
@5
A=D-A
D=M
@13
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@LCL
 M=M-1
A=M
D=M
@THAT
M=D
@LCL
M=M-1
A=M
D=M
@THIS
M=D
@LCL
M=M-1
A=M
D=M
@ARG
M=D
@LCL
M=M-1
A=M
D=M
@LCL
M=D
@13
A=M
0; JMP
// vm command: function
(Class2.get)
@0
D=A
@Class2.get.End
D;JEQ
(Class2.get.Loop)
@SP
A=M
M=0
@SP
M=M+1
@Class2.get.Loop
D=D-1;JNE
(Class2.get.End)
// vm command: push static
@Class2.0
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: push static
@Class2.1
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: sub
@SP
A=M-1
D=M
A=A-1
M=M-D
@SP
M=M-1
// vm command: return
@LCL
D=M
@5
A=D-A
D=M
@13
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M
@SP
M=D+1
@LCL
 M=M-1
A=M
D=M
@THAT
M=D
@LCL
M=M-1
A=M
D=M
@THIS
M=D
@LCL
M=M-1
A=M
D=M
@ARG
M=D
@LCL
M=M-1
A=M
D=M
@LCL
M=D
@13
A=M
0; JMP
// vm command: function
(Sys.init)
@0
D=A
@Sys.init.End
D;JEQ
(Sys.init.Loop)
@SP
A=M
M=0
@SP
M=M+1
@Sys.init.Loop
D=D-1;JNE
(Sys.init.End)
// vm command: push constant
@6
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: push constant
@8
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: call
@Class1.set.ReturnAddress1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@2
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class1.set
0;JMP
(Class1.set.ReturnAddress1)
// vm command: pop temp
@5
D=A
@0
D=D+A
@SP
A=M
M=D
@SP
A=M-1
D=M
@SP
A=M
A=M
M=D
@SP
M=M-1
// vm command: push constant
@23
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: push constant
@15
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: call
@Class2.set.ReturnAddress2
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@2
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class2.set
0;JMP
(Class2.set.ReturnAddress2)
// vm command: pop temp
@5
D=A
@0
D=D+A
@SP
A=M
M=D
@SP
A=M-1
D=M
@SP
A=M
A=M
M=D
@SP
M=M-1
// vm command: call
@Class1.get.ReturnAddress3
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class1.get
0;JMP
(Class1.get.ReturnAddress3)
// vm command: call
@Class2.get.ReturnAddress4
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class2.get
0;JMP
(Class2.get.ReturnAddress4)
// vm command: label
(Sys.WHILE)
// vm command: goto
@Sys.WHILE
0;JMP