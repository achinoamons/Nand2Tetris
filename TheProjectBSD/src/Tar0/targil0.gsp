uses java.io.*
//Achinoam Monsonego ID 206552382
//Shulamit Nahon ID 323782854


static var sum_cell = 0.0
static var sum_buy = 0.0

//path_ - a variable that has the path to a file / directory.
var path_ = "C:\\Users\\user\\IdeaProjects\\Tar0\\tar0"
var dir = new File(path_)//create a file handle

var file_list = dir.list()//get list of files in dir
//create new file
var output = new FileWriter(path_ + "\\Tar0.asm")

output.write("")
var buf = ""//intlize buffer
//go over the list and check
for (var fname in file_list){
  //create handle to  the current file
  var f2 = new File(path_ + '\\' + fname)
  if(f2.Name.endsWith(".vm"))//check if it's a .vm file
  {
    output.write(f2.Name.substring(0,6)+"\n")
    var reader = new Scanner(f2)//creat object to read from file

    while (reader.hasNextLine()) //not at EOF
    {
      var l = reader.nextLine().toString()
      var spilted_line = l.split(" ") //spilt it array of strings
      //activate the funcs
      if (spilted_line[0] == "buy")//check  first word in line
        buf += HandleBuy(spilted_line[1], Integer.parseInt(spilted_line[2]), Float.parseFloat(spilted_line[3]))
      if (spilted_line[0] == "cell")
        buf += HandleCell(spilted_line[1], Integer.parseInt(spilted_line[2]), Float.parseFloat(spilted_line[3]))
    }
    // buf += "TOTAL BUY: " + sum_buy + "\n" + "TOTAL CELL: " + sum_cell
    output.write(buf)
  }
  buf=""
}


print("TOTAL BUY: " + sum_buy)
print("TOTAL CELL: " + sum_cell)
buf = "TOTAL BUY: " + sum_buy + "\n" + "TOTAL CELL: " + sum_cell
output.write(buf)
output.close()


public static  function HandleBuy(ProductName:String,Amount:int,Price:float):String{
  var final_price = Amount * Price
  sum_buy += final_price
  return "###BUY " + ProductName + "###\n" + final_price + "\n"

}
public static  function HandleCell (ProductName:String,Amount:int,Price:float):String{
  var final_price = Amount * Price
  sum_cell += final_price
  return ("$$$CELL  " + ProductName + " $$$\n" + final_price + "\n")
}