//let db = "server=VM-SVR191;Database=DoClever2;Uid=sa;Pwd=abcd@1234;Driver={ODBC Driver 18 for SQL Server};TrustServerCertificate=yes;";
let db = 'server=192.168.30.155;Database=DoClever2Demo;Uid=sa;Pwd=abcd@1234;Driver={SQL Server Native Client 11.0};';
// let db =
//   "server=192.168.30.155;Database=Hani;Uid=sa;Pwd=abcd@1234;Driver={SQL Server Native Client 11.0};";
let servicePort = '8080';
let debug = true;
let title = 'ERP Suite';
let logo = 'doCleverSquare.png';
let icon = 'logo4ico.png';
/*
let tmp_upload = "/Users/mlau/Projects/doiierp/assets/_upload/";
let claim_images = "/Users/mlau/Projects/doiierp/assets/claims/";
let inv_images = "/Users/mlau/Projects/doiierp/assets/inv/";
let pdfs = "/Users/mlau/Projects/doiierp/assets/pdfs/";
let avator_images = "/Users/mlau/Projects/doiierp/assets/images/avatars/";
*/

let tmp_upload = 'C:\\Projects\\DoClever\\assets\\_upload\\';
let claim_images = 'C:\\Projects\\DoClever\\assets\\claims\\';
let inv_images = 'C:\\Projects\\DoClever\\assets\\inv\\';
let pdfs = 'C:\\Projects\\DoClever\\assets\\pdfs\\';
let avator_images = 'C:\\Projects\\DoClever\\assets\\images\\avatars\\';

let db_refresh_sts = 10 * 1000; // 10 sec;
let db_refresh_tbl = 60 * 1000; // 10 sec;
let pdf_url = 'http://showcase.apex.hk/docleverplugin/GeneratePDF.aspx?';
module.exports = {
  debug,
  db,
  tmp_upload,
  avator_images,
  claim_images,
  inv_images,
  db_refresh_sts,
  db_refresh_tbl,
  servicePort,
  pdf_url,
  pdfs,
  title,
  logo,
  icon
};
