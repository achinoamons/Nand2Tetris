uses java.io.File
uses java.io.FileWriter

function func1( ): String{
  return  "Hello World!"
}

var x=func1()

var y=3.0
var z=(int)

var a=1.5 //float
var b: int //integer
var c="string"//string

var implicit=6
var str= "hi"+x //hi6

enum Letter {A,B}
var dictionary={ Letter.A->"a",Letter.B->"b" }


//files
var path_ = "C:\\Users\\user\\IdeaProjects"
var dir = new File(path_)//create a file handle
var file_list = dir.list()//get list of files in dir
var output = new FileWriter(path_ +"txt")//open a file for writing
output.write("hello")
output.close()//must close!



var str1:String
var nullSafty=str1?.substring(3)

function IloveGosu(i:int,love:float):String{
  return "I Love GOSU"
}


for (number in 0..9){print(number)}
for(letter in "we love GOSU" index i){print(i+letter)}


var operator1=0
//var assigmentPlusPlus=operator1++




