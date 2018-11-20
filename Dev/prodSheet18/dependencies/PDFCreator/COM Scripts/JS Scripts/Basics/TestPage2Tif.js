// TestPage2JPG.js script
// Part of PDFCreator
// License: GPL
// Homepage: http://www.pdfforge.org/pdfcreator
// Windows Scripting Host version: 5.6
// Version: 1.0.0.0
// Date: July, 28. 2014
// Author: Sazan Hoti
// Comments: This script demonstrates the conversion of a printable test file in a tif-file under "DefaultGuid" profile using 
//           the COM interface of PDFCreator.

var maxTimeOut = 5 // in seconds

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

 var fullPath = objFSO.GetParentFolderName(WScript.ScriptFullname) + "\\TestPage.tif";
WScript.Echo("Setting up target path to: " + fullPath);
 
WScript.Echo("Printing windows test page...");
 objShell.ShellExecute("RUNDLL32.exe", "PRINTUI.DLL,PrintUIEntry /k /n \"PDFCreator\"", "", "open", 1);

WScript.Echo("Waiting for the job to arrive at the queue for " + maxTimeOut + " seconds");
 if(!PDFCreatorQueue.WaitForJob(maxTimeOut))
{   
	WScript.Echo("The print job did not reach the queue within " + maxTimeOut + " seconds"); 
}
else
{
	WScript.Echo("Currently there are " + PDFCreatorQueue.Count + "job(s) in the queue");
	WScript.Echo("Getting job instance");
	var job = PDFCreatorQueue.NextJob;
	job.SetProfileByGuid("TiffGuid");						
	
	//Get the guid of the used profile
	var guid = job.GetProfileSetting("Guid");
	
	WScript.Echo("Converting under " + guid + " conversion profile");
	job.ConvertTo(fullPath);
	
	if(!job.IsFinished || !job.IsSuccessful)
	{
		WScript.Echo("Could not convert the file: " + fullPath);
	}
	else
	{
		WScript.Echo("Job finished successfully");
	}
}
WScript.Echo("Releasing the COM object");
PDFCreatorQueue.ReleaseCom();
}
catch(e)
{
	WScript.Echo(e.message);
	//Emptying the queue if an exception occurred
	PDFCreatorQueue.ReleaseCom();   
}