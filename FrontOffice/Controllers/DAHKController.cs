using System;
using System.Collections.Generic;
using System.Web.Mvc;
using acbaRef = FrontOffice.ACBAServiceReference;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{

    [SessionState(SessionStateBehavior.ReadOnly)]
    public class DAHKController : Controller
    {

        public ActionResult SearchDAHK(ulong customerNumber = 0, string documentNumber = "", bool showFreeAttaches = false)
        {
            List<acbaRef.DahkCheckResult> result = new List<acbaRef.DahkCheckResult>();

            ACBAOperationService.Use(client =>
            {
                result = client.CheckCustomerDahk(customerNumber, documentNumber, showFreeAttaches);
            }
            );

            result.ForEach(m =>
            {

                m.InquestNumber = Utility.ConvertAnsiToUnicode(m.InquestNumber);
                m.DebtorName = Utility.ConvertAnsiToUnicode(m.DebtorName);
                m.DebtorPassport = Utility.ConvertAnsiToUnicode(m.DebtorPassport);
                m.DebtorAddress = Utility.ConvertAnsiToUnicode(m.DebtorAddress);
                m.DecisionOwner = Utility.ConvertAnsiToUnicode(m.DecisionOwner);
                m.Branch = Utility.ConvertAnsiToUnicode(m.Branch);
                m.DebtorType = Utility.ConvertAnsiToUnicode(m.DebtorType);
            });

            var jsonData = new
            {
                total = (int)Math.Ceiling((float)result.Count / (float)30),
                records = result.Count,
                rows = result.ToArray()
            };

            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetDahkBlockageDetails()
        {
            return PartialView("DahkBlockages");
        }

        public ActionResult GetDahkCollectionDetails()
        {
            return PartialView("DahkCollections");
        }

        public ActionResult GetDahkEmployersDetails()
        {
            return PartialView("DahkEmployers");
        }

        public ActionResult GetDahkAmountTotalsDetails()
        {
            return PartialView("DahkAmountTotals");
        }

        public ActionResult AmountAvailabilitySetting()
        {
            return PartialView("AmountAvailabilitySetting");
        }

        public ActionResult BlockingAvailableAmount()
        {
            return PartialView("BlockingAvailableAmount");
        }

        public ActionResult GetAllDahkDetails()
        {
            return PartialView("AllDahkDetails");
        }


        public JsonResult GetDahkBlockages(ulong customerNumber)
        {
            List<xbs.DahkDetails> blockages = new List<xbs.DahkDetails>();
            blockages = XBService.GetDahkBlockages(customerNumber);
            return Json(blockages, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDahkCollections(ulong customerNumber)
        {
            List<xbs.DahkDetails> collections = new List<xbs.DahkDetails>();
            collections = XBService.GetDahkCollections(customerNumber);
            return Json(collections, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDahkEmployers(ulong customerNumber, xbs.ProductQualityFilter quality, string inquestId)
        {
            List<xbs.DahkEmployer> employers = new List<xbs.DahkEmployer>();
            employers = XBService.GetDahkEmployers(customerNumber, quality, inquestId);
            return Json(employers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDahkAmountTotals(ulong customerNumber)
        {
            List<xbs.DahkAmountTotals> amountTotals = new List<xbs.DahkAmountTotals>();
            amountTotals = XBService.GetDahkAmountTotals(customerNumber);
            return Json(amountTotals, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrentInquestDetails(ulong customerNumber)
        {
            List<xbs.AccountDAHKfreezeDetails> details = new List<xbs.AccountDAHKfreezeDetails>();
            details = XBService.GetCurrentInquestDetails(customerNumber);

            return Json(details, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAccountDAHKFreezeDetails(ulong customerNumber, string inquestId, ulong accountNumber = 0)
        {
            List<xbs.AccountDAHKfreezeDetails> freezeDetails = new List<xbs.AccountDAHKfreezeDetails>();
            freezeDetails = XBService.GetAccountDAHKFreezeDetails(customerNumber, inquestId, accountNumber);
            return Json(freezeDetails, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDAHKproductAccounts(ulong accountNumber)
        {
            return Json(XBService.GetDAHKproductAccounts(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFreezedAccounts(ulong customerNumber)
        {
            return Json(XBService.GetFreezedAccounts(customerNumber), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MakeAvailable(List<long> freezeIdList, float availableAmount)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            return Json(XBService.MakeAvailable(freezeIdList, availableAmount, currentUser.filialCode, currentUser.userID));

        }

        public JsonResult GetTransitAccountNumberFromCardAccount(double cardAccountNumber)
        {
            return Json(XBService.GetTransitAccountNumberFromCardAccount(cardAccountNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllAccounts(ulong customerNumber)
        {
            return Json(XBService.GetAccountsForBlockingAvailableAmount(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public ActionResult BlockingAmountFromAvailableAccount (double accountNumber, float blockingAmount, List<XBS.DahkDetails> inquestDetailsList)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            return Json(XBService.BlockingAmountFromAvailableAccount(accountNumber, blockingAmount, inquestDetailsList, currentUser.userID));
        }

    }
}