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
(Main.fibonacci)
@0
D=A
@Main.fibonacci.End
D;JEQ
(Main.fibonacci.Loop)
@SP
A=M
M=0
@SP
M=M+1
@Main.fibonacci.Loop
D=D-1;JNE
(Main.fibonacci.End)
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
// vm command: push constant
@2
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: lt
@SP
A=M-1
D=M
A=A-1
D=D-M
@IF_TRUE0
D;JGT
@SP
M=M-1
A=M-1
M=0
@IF_FALSE0
0;JMP
(IF_TRUE0)
@SP
M=M-1
A=M-1
M=-1
(IF_FALSE0)
// vm command: if_goto
@SP
M=M-1
A=M
D=M
@Main.IF_TRUE
D;JNE
// vm command: goto
@Main.IF_FALSE
0;JMP
// vm command: label
(Main.IF_TRUE)
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
// vm command: label
(Main.IF_FALSE)
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
// vm command: push constant
@2
D=A
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
// vm command: call
@Main.fibonacci.ReturnAddress1
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
@1
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci.ReturnAddress1)
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
// vm command: push constant
@1
D=A
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
// vm command: call
@Main.fibonacci.ReturnAddress2
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
@1
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci.ReturnAddress2)
// vm command: add
@SP
A=M-1
D=M
A=A-1
M=D+M
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
@4
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: call
@Main.fibonacci.ReturnAddress3
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
@1
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci.ReturnAddress3)
// vm command: label
(Sys.WHILE)
// vm command: goto
@Sys.WHILE
0;JMP
