 // vm command: push constant
@7
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
// vm command: add
@SP
A=M-1
D=M
A=A-1
M=D+M
@SP
M=M-1
