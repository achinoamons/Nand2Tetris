 // vm command: push constant
@3030
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop pointer 0
@SP
A=M-1
D=M
@THIS
M=D
@SP
M=M-1
// vm command: push constant
@3040
D=A
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
@32
D=A
@SP
A=M
M=D
@SP
M=M+1
// vm command: pop this
@THIS
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
// vm command: push constant
@46
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
@6
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
// vm command: push pointer 0
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// vm command: push pointer 1
@THAT
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
// vm command: push this
@2
D=A
@THIS
A=M+D
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
// vm command: push that
@6
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
