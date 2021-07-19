using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
namespace FrontOffice.Controllers
{
    public class TokensDistributionController : Controller
    {
        // GET: TokensDistribution
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("TokensDistributionForm");
        }

        public JsonResult GetUnusedTokensByFilialAndRange(string from, string to, int filial)
        {
            return Json(XBManagementService.GetUnusedTokensByFilialAndRange(from, to, filial), JsonRequestBehavior.AllowGet);
        }

        public  void MoveUnusedTokens(int filialToMove, List<String> unusedTokens)
        {
            XBManagementService.MoveUnusedTokens(filialToMove, unusedTokens);
        }

    }
}