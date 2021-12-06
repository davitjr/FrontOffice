using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class BondIssueController : Controller
    {
        [AllowAnonymous]

        public ActionResult BondIssue()
        {
            return View("BondIssue");
        }
        public JsonResult GetBondIssue(int id)
        {
            return Json(XBService.GetBondIssue(id), JsonRequestBehavior.AllowGet);
        }

        public ActionResult BondIssueDetails()
        {
            return View("BondIssueDetails");
        }


        public JsonResult DeleteBondIssue(int id)
        {
            return Json(XBService.DeleteBondIssue(id), JsonRequestBehavior.AllowGet);
        }


        public JsonResult ApproveBondIssue(int id)
        {
            return Json(XBService.ApproveBondIssue(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveBondIssue(xbs.BondIssue bondissue)
        {
            return Json(XBService.SaveBondIssue(bondissue), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBondIssuesList(xbs.BondIssueFilter filter, bool availableForSale = false)
        {
            if (filter.Currency == null)
            {
                filter.Currency = "";
            }

            if (filter.ISIN == null)
            {
                filter.ISIN = "";
            }

            filter.StartDate =filter.StartDate.Date;

            filter.EndDate = filter.EndDate.Date;

            List<xbs.BondIssue> bondIssues = XBService.GetBondIssuesList(filter);
         

            if (availableForSale)
            {
                List<xbs.BondIssue> bondIssuesNew = new List<XBS.BondIssue>();
                foreach (xbs.BondIssue bondIssue in bondIssues)
                {
                    if(bondIssue.NonDistributedBondsCount >= 0 && bondIssue.ReplacementDate <= DateTime.Now && bondIssue.ReplacementEndDate >= DateTime.Now)
                    {
                        bondIssuesNew.Add(bondIssue);
                    }                
                }
                bondIssues = bondIssuesNew;
            }

            return Json(bondIssues, JsonRequestBehavior.AllowGet);
        }




        public ActionResult BondIssueSave()
        {
            return View("BondIssueSave");
        }

        public JsonResult CalculateCouponRepaymentSchedule(XBS.BondIssue bondIssue)
        {
            List<string> schedule = new List<string>();
            List<DateTime> scheduleDates = XBService.CalculateCouponRepaymentSchedule(bondIssue);

            foreach (DateTime item in scheduleDates)
            {
                schedule.Add(item.ToString(("dd/MM/yyyy")));
            }


            return Json(schedule, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCouponRepaymentSchedule(XBS.BondIssue bondIssue)
        {
            List<string> schedule = new List<string>();
            List<DateTime> scheduleDates = XBService.GetCouponRepaymentSchedule(bondIssue);

            foreach (DateTime item in scheduleDates)
            {
                schedule.Add(item.ToString(("dd/MM/yyyy")));
            }


            return Json(schedule, JsonRequestBehavior.AllowGet);
        }

        public ActionResult BondIssueSchedule()
        {
            return PartialView("BondIssueSchedule");
        }

        public JsonResult GetNonDistributedBondsCount(int bondIssueId)
        {
           return Json(XBService.GetNonDistributedBondsCount(bondIssueId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult BondQualityUpdateOrder(xbs.BondQualityUpdateOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            result = XBService.SaveBondQualityUpdateOrder(order);
            return Json(result);

        }

        public ActionResult BondIssuePartial()
        {
            return PartialView("BondIssue");
        }

        public ActionResult StockIssueSave()
        {
            return PartialView("StockIssueSave");
        }
        
        public JsonResult SaveStockIssue(xbs.BondIssue bondissue)
        {
            return Json(XBService.SaveBondIssue(bondissue), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUnitPrice(int bondIssueId)
        {
            return Json(XBService.GetUnitPrice(bondIssueId), JsonRequestBehavior.AllowGet);
        }

    }
}