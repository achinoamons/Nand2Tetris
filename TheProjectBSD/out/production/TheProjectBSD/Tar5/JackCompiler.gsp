package Tar5
uses java.io.*
//bsd
//Achinoam Monsonego 206552382
//Shulamit Nahon 323782854

main()
public static function main() : void {
  var scanner = new Scanner(System.in)
  var path_ = scanner.nextLine()
  var inFile = new File(path_)
  var jackFiles: ArrayList<File>
  if(inFile.isDirectory()){
    jackFiles= handleDirectory(inFile)
  }
  else{
    jackFiles  =handleSingleFile(inFile)}

  // var jackFiles = inFile.isDirectory() ? handleDirectory(inFile) : handleSingleFile(inFile)

  for (var currentJackFile in jackFiles) {
    var fileName = currentJackFile.Name.substring(0, currentJackFile.Name.lastIndexOf("."))

    //creates the files whith the xml suffix
    var fileOut = new File(path_+ "\\" + fileName+".vm")


    var compilationEngine: CompilationEngine  = new CompilationEngine(currentJackFile,fileOut)//////////////todo
    compilationEngine.compileClass()//////////////////////todo


    print("File created : " + fileName)

  }
}

/**
 * Handles a single jack file.
 *
 * @param file - path of jack file.
 */
static function handleSingleFile(file : File) : ArrayList<File> {
  if (!file.Name.toLowerCase().endsWith('.jack')) {
    throw new IllegalArgumentException('.jack file is required!')
  }
  return {file}
}

/**
 * Handles a folder that has jack files.
 *
 * @param dir - path of directory.
 */
static function handleDirectory(dir : File) : ArrayList<File> {
  var fileList = dir.listFiles()
  var jackFiles : ArrayList<File>
  jackFiles=new ArrayList<File>()
  for (var file in fileList) {
    //find jack files and add them to the jackfile arraylist
    if ((file.Name.toLowerCase().endsWith(".jack"))) {
      jackFiles.add(file)
    }
  }

  if (jackFiles.size() == 0) {
    throw new IllegalArgumentException('No jack file in this directory')
  }
  return jackFiles
}


