// TestPage2PDF.js script
// Part of PDFCreator
// License: GPL
// Homepage: http://www.pdfforge.org/pdfcreator
// Windows Scripting Host version: 5.6
// Version: 1.0.0.0
// Date: July, 28. 2014
// Author: Sazan Hoti
// Comments: This script demonstrating the conversion of a printable test file in a pdf-file using 
//           the COM interface of PDFCreator and additionally configurating the security settings of the converted file.



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
	job.SetProfileByGuid("DefaultGuid");						
	
	WScript.Echo("Applying pdf security settings...");
	/* The SetProfileSettings method allows us to change the pdf security settings of the job*/
	// Since we want to make our pdf more safe, we have to enable the security action
	job.SetProfileSetting("PdfSettings.Security.Enabled", "true"); 
	// We set up the encryption level to medium
	job.SetProfileSetting("PdfSettings.Security.EncryptionLevel", "Aes128Bit"); 
	//Now everyone who wants to open the converted file has to know the security password "myPassword"
	job.SetProfileSetting("PdfSettings.Security.OwnerPassword", "myOwnerPassword"); 
	//Require a user password to be able to view the PDF
	job.SetProfileSetting("PdfSettings.Security.RequireUserPassword", "true"); 
	//Now everyone who wants to open the converted file has to know the security password "myPassword"
	job.SetProfileSetting("PdfSettings.Security.UserPassword", "myPassword"); 
	
	WScript.Echo("Converting under \"DefaultGuid\" conversion profile");
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
WScript.Echo("Releasing the object");
PDFCreatorQueue.ReleaseCom();
}
catch(e)
{
	WScript.Echo(e.message);
	PDFCreatorQueue.ReleaseCom();
}