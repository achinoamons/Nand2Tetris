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
// vm command: pop pointer 1
@SP
A=M-1
D=M
@THAT
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
// vm command: pop that
@THAT
D=M
@SP
A=M
M=D
@0
D=A
@SP
A=M
M=D+M
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
@1
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop that
@THAT
D=M
@SP
A=M
M=D
@1
D=A
@SP
A=M
M=D+M
@SP
A=M-1
D=M
@SP
A=M
A=M
M=D
@SP
M=M-1
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
// vm command: pop argument
@ARG
D=M
@SP
A=M
M=D
@0
D=A
@SP
A=M
M=D+M
@SP
A=M-1
D=M
@SP
A=M
A=M
M=D
@SP
M=M-1
// vm command: label
(FibonacciSeries.MAIN_LOOP_START)
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
// vm command: if_goto
@SP
M=M-1
A=M
D=M
@FibonacciSeries.COMPUTE_ELEMENT
D;JNE
// vm command: goto
@FibonacciSeries.END_PROGRAM
0;JMP
// vm command: label
(FibonacciSeries.COMPUTE_ELEMENT)
// vm command: push that
@0
D=A
@THAT
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: push that
@1
D=A
@THAT
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: add
@SP
A=M-1
D=M
A=A-1
M=D+M
@SP
M=M-1
// vm command: pop that
@THAT
D=M
@SP
A=M
M=D
@2
D=A
@SP
A=M
M=D+M
@SP
A=M-1
D=M
@SP
A=M
A=M
M=D
@SP
M=M-1
// vm command: push pointer 1
@THAT
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
// vm command: add
@SP
A=M-1
D=M
A=A-1
M=D+M
@SP
M=M-1
// vm command: pop pointer 1
@SP
A=M-1
D=M
@THAT
M=D
@SP
M=M-1
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
// vm command: pop argument
@ARG
D=M
@SP
A=M
M=D
@0
D=A
@SP
A=M
M=D+M
@SP
A=M-1
D=M
@SP
A=M
A=M
M=D
@SP
M=M-1
// vm command: goto
@FibonacciSeries.MAIN_LOOP_START
0;JMP
// vm command: label
(FibonacciSeries.END_PROGRAM)
