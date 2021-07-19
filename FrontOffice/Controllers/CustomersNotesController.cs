using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using System.Net;
using System.IO;
using System.Text;
using acba = FrontOffice.ACBAServiceReference;
using System.Net.Http;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using Newtonsoft.Json;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class CustomersNotesController : Controller
    {

        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("CustomersNotes");
        }

        public ActionResult CustomersNotes()
        {
            return PartialView("CustomersNotes");
        }

        [OutputCache(CacheProfile = "AppViewCache")]
        public ActionResult OneCustomerNotes()
        {
            return PartialView("OneCustomerNotes");
        }

        public ActionResult CustomerNewNote()
        {
            return PartialView("CustomerNewNote");
        }

        public ActionResult CustomerNoteDetails()
        {
            return PartialView("CustomerNoteDetails");
        }

        public JsonResult SavePersonNote(acba.PersonNote personNote, ulong customerNumber)
        {
            if (customerNumber == 0)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
            }
            return Json(ACBAOperationService.SavePersonNote(personNote, customerNumber), JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetPersonNotesHistory(acba.CustomerNoteQuality quality)
        {
            List<acba.PersonNoteHistory> personNoteHistory = ACBAOperationService.GetPersonNotesHistory();

            if (quality == acba.CustomerNoteQuality.Opened)
            {
                List<acba.PersonNoteHistory> closedpersonNotesHistory = personNoteHistory.FindAll(m => m.ActionType.key != 1);
                foreach (acba.PersonNoteHistory closedpersonNoteHistory in closedpersonNotesHistory)
                {
                    personNoteHistory.RemoveAll(m => m.PersonNote.NoteID==closedpersonNoteHistory.PersonNote.NoteID);
                }

                
            }


            personNoteHistory.ForEach(m =>
            {
                m.ActionUserName = Utility.ConvertAnsiToUnicode(ACBAOperationService.GetCasherDescription(m.ActionSetNumber));
            });

            return Json(personNoteHistory, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPersonNoteHistory(int noteId)
        {
            List<acba.PersonNoteHistory> personNoteHistory = ACBAOperationService.GetPersonNoteHistory(noteId);
            personNoteHistory.ForEach(m =>
            {
                m.ActionUserName = Utility.ConvertAnsiToUnicode(ACBAOperationService.GetCasherDescription(m.ActionSetNumber));
            });

            return Json(personNoteHistory, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSearchedPersonNotes(acba.SearchPersonNotes searchParams)
        {
            return Json(ACBAOperationService.GetSearchedPersonNotes(searchParams), JsonRequestBehavior.AllowGet);
        }


        public JsonResult ChangePersonNoteReadingStatus(int noteId)
        {
            ACBAOperationService.ChangePersonNoteReadingStatus(noteId);
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerHasArrests()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();


            return Json(XBService.GetCustomerHasArrests(customerNumber), JsonRequestBehavior.AllowGet);
        }

    }
}