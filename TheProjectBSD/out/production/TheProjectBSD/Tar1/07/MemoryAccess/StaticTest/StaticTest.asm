 // vm command: push constant
@111
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: push constant
@333
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: push constant
@888
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop static
@SP
A=M-1
D=M
@StaticTest.8
M=D
@SP
M=M-1
// vm command: pop static
@SP
A=M-1
D=M
@StaticTest.3
M=D
@SP
M=M-1
// vm command: pop static
@SP
A=M-1
D=M
@StaticTest.1
M=D
@SP
M=M-1
// vm command: push static
@StaticTest.3
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: push static
@StaticTest.1
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
// vm command: push static
@StaticTest.8
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
