function createBulkPDFs(){

  const docFile = DriveApp.getFileById("googledocid");
  const tempFolder = DriveApp.getFolderById("tempfolderid");
  const pdfFolder = DriveApp.getFolderById("pdffolderid");
  const currentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sols");

  const data = currentSheet.getRange(2,1,currentSheet.getLastRow()-1,4).getDisplayValues();

  let errors = [];
  data.forEach(row =>{
    try{
      createPDF(row[0],row[1],row[2],row[3],docFile,tempFolder,pdfFolder,row[0]+" LOR");
      errors.push([""]);
    }catch(err){
      errors.push(["Failed"]);
    }
    
  });
  currentSheet.getRange(2,5,currentSheet.getLastRow()-1,1).setValues(errors);
}

function createPDF(fullName,collegeName,viewCount,lensCount,docFile,tempFolder,pdfFolder,pdfName) {

  const tempFile = docFile.makeCopy(tempFolder);
  const tempDocFile = DocumentApp.openById(tempFile.getId());
  const body = tempDocFile.getBody();
  body.replaceText("{fullName}",fullName);
  body.replaceText("{collegeName}",collegeName);
  body.replaceText("{viewCount}",viewCount);
  body.replaceText("{lensCount}",lensCount);
  tempDocFile.saveAndClose();

  const pdfContentBlob = tempFile.getAs(MimeType.PDF);
  pdfFolder.createFile(pdfContentBlob).setName(pdfName);

  tempFolder.removeFile(tempFile);
}
