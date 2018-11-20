=begin
 PDFCreator COM Interface test for Ruby
 Part of the PDFCreator application
 License: GPL
 Homepage: http://www.pdfforge.org/pdfcreator
 Ruby Version: 2.1.6
 Version: 1.0.0.0
 Created: June, 16. 2015
 Modified: June, 16. 2015 
 Author: Sazan Hoti
 Comments: This project demonstrates the use of the COM Interface of PDFCreator.
           This script converts a windows testpage while adding a background to it.
 Note: More usage examples then in the Ruby directory can be found in the JavaScript directory only.
=end

require 'win32ole'
require 'tk'

ShellObj = WIN32OLE.new("Shell.Application")
PDFCreatorQueue = WIN32OLE.new("PDFCreator.JobQueue")
scriptDir = File.expand_path(File.dirname(__FILE__))
fullPath = scriptDir + "/Results/TestPage_WithBackground.pdf" 

Tk.messageBox('message' =>  "Initializing PDFCreator queue...")
PDFCreatorQueue.Initialize

Tk.messageBox('message' =>  "Printing a windows testpage")
ShellObj.ShellExecute("RUNDLL32.exe", "PRINTUI.DLL,PrintUIEntry /k /n ""PDFCreator""", "", "open", 1)

Tk.messageBox('message' =>  "Waiting for the job to arrive at the queue...")
if (!PDFCreatorQueue.WaitForJob(10))
    Tk.messageBox('message' =>  "The print job did not reach the queue within 10 seconds")
else 
    Tk.messageBox('message' =>  "Currently there are " + (PDFCreatorQueue.Count).to_s + " job(s) in the queue")
    Tk.messageBox('message' =>  "Getting job instance")
    printJob = PDFCreatorQueue.NextJob
    
    printJob.SetProfileByGuid("DefaultGuid")
    
    Tk.messageBox('message' =>  "Applying background page settings...")
    #The SetProfileSettings method allows us to tell the job that it should add a background to the first page'
	#Since we want to add a background page, we have to enable it first
    
    printJob.SetProfileSetting("BackgroundPage.Enabled", "true")
    printJob.SetProfileSetting("BackgroundPage.Repetition", "RepeatAllPages")
    printJob.SetProfileSetting("BackgroundPage.File", scriptDir + "\\FilesForTests\\BackgroundPage.pdf")
    
    #Notice that the first parameter here says that we want to attach a file and the second specifies the file. It is very important that
	#the file is in pdf-Format otherwise exceptions will occur
    
    Tk.messageBox('message' =>  "Converting under ""DefaultGuid"" conversion profile")
    printJob.ConvertTo(fullPath)
    
    if (!printJob.IsFinished || !printJob.IsSuccessful)
		Tk.messageBox('message' =>  "Could not convert the file: " + fullPath)
	else
		Tk.messageBox('message' =>  "Job finished successfully")
    end
end
Tk.messageBox('message' =>  "Releasing the object")
PDFCreatorQueue.ReleaseCom