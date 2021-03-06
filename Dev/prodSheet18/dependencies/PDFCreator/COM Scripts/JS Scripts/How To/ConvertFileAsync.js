// TestPage2PDFAsync.js script
// Part of PDFCreator
// License: GPL
// Homepage: http://www.pdfforge.org/pdfcreator
// Windows Scripting Host version: 5.6
// Version: 1.0.0.0
// Date: July, 28. 2014
// Author: Sazan Hoti
// Comments: This script is demonstrating the conversion of a printable test file asynchronously in a pdf-file using 
//           the COM interface of PDFCreator.



var objFSO = new ActiveXObject("Scripting.FileSystemObject");
var objShell = new ActiveXObject("Shell.Application");

var Scriptname = objFSO.GetFileName(WScript.ScriptFullname);

if (WScript.Version < 5.6)
{
 WScript.Echo("You need the \"Windows Scripting Host version 5.6\" or greater!");
 WScript.Quit();
}

try
{
var PDFCreatorQueue = new ActiveXObject("PDFCreator.JobQueue");

WScript.Echo("Initializing PDFCreator queue...");
PDFCreatorQueue.Initialize();

 var fullPath = objFSO.GetParentFolderName(WScript.ScriptFullname) + "\\TestPage.pdf";
WScript.Echo("Setting up target path to: " + fullPath);
 
WScript.Echo("Printing one windows test page...");
 objShell.ShellExecute("RUNDLL32.exe", "PRINTUI.DLL,PrintUIEntry /k /n \"PDFCreator\"", "", "open", 1);

WScript.Echo("Waiting for the job to arrive at the queue...");
 if(!PDFCreatorQueue.WaitForJob(10))
{   
	WScript.Echo("The print job did not reach the queue within " + 10 + " seconds"); 
}
else
{
	WScript.Echo("Currently there are " + PDFCreatorQueue.Count + " job(s) in the queue");
	WScript.Echo("Getting job instance");
	var job = PDFCreatorQueue.NextJob;
	//For converting to other formats than pdf set here the appropriate conversion profile
	job.SetProfileByGuid("DefaultGuid");						
	
	WScript.Echo("Converting under \"DefaultGuid\" conversion profile");
	//The difference between converting synchronously(job.ConvertTo(...)) and asynchronously(job.ConvertToAsync(...)) is here
	job.ConvertToAsync(fullPath);											
	WScript.Echo("The job is being converted asynchronously right now.");
	
	if(!job.IsFinished || !job.IsSuccessful)
	{
		WScript.Echo("Could not convert the file: " + fullPath);
	}
	else
	{
		WScript.Echo("Job finished successfully");
	}
}
WScript.Echo("Releasing the object");
PDFCreatorQueue.ReleaseCom();
}
catch(e)
{
	WScript.Echo(e.message);
	PDFCreatorQueue.ReleaseCom();
}