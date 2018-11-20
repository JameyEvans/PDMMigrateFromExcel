// TestPage2JPG.js script
// Part of PDFCreator
// License: GPL
// Homepage: http://www.pdfforge.org/pdfcreator
// Windows Scripting Host version: 5.6
// Version: 1.0.0.0
// Date: July, 28. 2014
// Author: Sazan Hoti
// Comments: This script demonstrates the conversion of multiple printable user chosen files in tif-files under "DefaultGuid" profile using 
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

if(WScript.Arguments.Length == 0)
{
 WScript.Echo("No file provided!");
 WScript.Quit();
}

try
{
var PDFCreatorQueue = new ActiveXObject("PDFCreator.JobQueue");

WScript.Echo("Initializing PDFCreator queue...");
PDFCreatorQueue.Initialize();

for(var i=0;i < WScript.Arguments.Length;i++)
{
var filename = WScript.Arguments(i);

if(!objFSO.FileExists(filename))
{
 WScript.Echo("The file doesn't exist.");
 WScript.Quit();
}
//Since we are using the "DefaultGuid" pdf is our output format
var fullname = objFSO.GetFileName(filename);
var name =  fullname.replace(objFSO.GetExtensionName(fullname),"pdf");

 var fullPath = objFSO.GetParentFolderName(WScript.ScriptFullname) + "\\" + name;
WScript.Echo("Setting up target path to: " + fullPath);
 
WScript.Echo("Printing: " + filename);
 objShell.ShellExecute(filename,"", "", "print", 0);
 
WScript.Echo("Waiting for the job to arrive at the queue for " + maxTimeOut + " seconds");
 if(!PDFCreatorQueue.WaitForJob(maxTimeOut))
{   
	WScript.Echo("The print job did not reach the queue within " + maxTimeOut + " seconds"); 
}
else
{
	WScript.Echo("Currently there are " + PDFCreatorQueue.Count + " job(s) in the queue");
	WScript.Echo("Getting job instance");
	var job = PDFCreatorQueue.NextJob;
	job.SetProfileByGuid("DefaultGuid");						
	
	//Assuming you want to convert to .tif-file you can do this by
	//simply changing the output format setting of your current profile
	job.SetProfileSetting("OutputFormat", "Tif");
	
	//Don't show the converted file after the process finished
	job.SetProfileSetting("OpenViewer","false");
	
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