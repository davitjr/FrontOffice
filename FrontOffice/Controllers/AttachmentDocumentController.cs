using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class AttachmentDocumentController : Controller
    {
        // GET: AttachmentDocument
        public ActionResult AttachmentDocuments()
        {
            return PartialView("AttachmentDocuments");
        }
        public JsonResult GetProductDocuments(ulong productID)
        {
            return Json(XBService.GetProductDocuments(productID), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAttachmentsInfo(ulong documentID)
        {
            return Json(ACBAOperationService.GetAttachmentsInfo(documentID), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetHBAttachmentsInfo(ulong documentID)
        {
             return Json(XBService.GetHBAttachmentsInfo(documentID), JsonRequestBehavior.AllowGet);
        }
        public void GetOneAttachment(ulong id)
        {
            byte[] attachment = ACBAOperationService.GetOneAttachment(id);
            ReportService.ShowDocument(attachment, ExportFormat.PDF, "LoanContract");
        }
        public void GetOneHBAttachment(ulong id)
        {
            byte[] attachment = XBService.GetOneHBAttachment(id);
            ReportService.ShowDocument(attachment, ExportFormat.PDF, "LoanContract");
            
        }
    }
}