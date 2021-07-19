using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Errors()
        {
            return PartialView("Errors");
        }
        public ActionResult MsgBoxAccess()
        {
            return PartialView("MsgBoxAccess");
        }
        public ActionResult ProgramExpire()
        {
            return PartialView("ProgramExpire");
        }
        public ActionResult MsgError()
        {
            return PartialView("MsgError");
        }
        public ActionResult MsgOK()
        {
            return PartialView("MsgOK");
        }
    }
}