using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using System.Web.SessionState;
using System.Threading.Tasks;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class BondController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache")]
        public ActionResult Bonds()
        {
            return PartialView("Bonds");
        }

        /// <summary>
        /// Վերադարձնում է պարտատոմսերի մանրամասների պատուհանը
        /// </summary>
        /// <returns></returns>
        public ActionResult BondDetails()
        {
            return View("BondDetails");
        }

        /// <summary>
        /// Վերադարձնում է դիլինգի հաստատման համար նախատեսված պատուհանը
        /// </summary>
        /// <returns></returns>
        public ActionResult BondDealing()
        {
            return View("BondDealing");
        }

        /// <summary>
        /// Վերադարձնում է վաճառված մեկ պարտատոմսի մանրամասները
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public JsonResult GetBondByID(int ID)
        {
            return Json(XBService.GetBondByID(ID), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Վաճառված պարտատոմսերի որոնում տրված պարամետրերով
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public JsonResult GetBonds(xbs.BondFilter filter)
        {
            return Json(XBService.GetBonds(filter), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Վերադարձնում է տվյալ պարտատոմսի ձեռքբերման գինը
        /// </summary>
        /// <param name="ISIN">Պարտատոմսի ԱՄՏԾ</param>
        /// <returns></returns>
        public JsonResult GetBondPrice(int bondIssueId)
        {
            return Json(XBService.GetBondPrice(bondIssueId), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Վերադարձնում է՝ արդյոք հաճախորդը ունի արժեթղթերի հաշիվ Բանկի բազայում
        /// </summary>
        /// <param name="customerNumber"></param>
        /// <returns></returns>
        public JsonResult HasCustomerDepositaryAccountInBankDB(ulong customerNumber)
        {
            return Json(XBService.HasCustomerDepositaryAccountInBankDB(customerNumber), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Վերադարձնում է հաճախորդի՝ Բանկի բազայում եղած արժեթղթերի հաշիվը
        /// </summary>
        /// <param name="customerNumber"></param>
        /// <returns></returns>
        public JsonResult GetCustomerDepositaryAccount(ulong customerNumber)
        {
            return Json(XBService.GetCustomerDepositaryAccount(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerDepositaryAccounts(ulong customerNumber)
        {
            return Json(XBService.GetCustomerDepositaryAccounts(customerNumber), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Վերադարձնում է պարտատոմսի ձեռբերման  հայտը՝ pdf ֆորմատով
        /// </summary>
        /// <param name="bondId"></param>
        /// <param name="amountCreditDate"></param>
        /// <param name="amountCreditTime"></param>
        public void GetBondAcquirementApplication(int bondId, DateTime amountCreditDate, string amountCreditTime)
        {
            if(bondId > 0)
            {
                xbs.Bond bond = XBService.GetBondByID(bondId);
                if (bond != null)
                {
                    ulong customerNumber = bond.CustomerNumber;
                    string ISIN = bond.ISIN;
                    double unitPrice = bond.UnitPrice;
                    int bondCount = bond.BondCount;
                    int documentNumber = bond.DocumentNumber;
                    string accountNumberAMD = bond.AccountForCoupon.AccountNumber;
                    string accountNumberCurrency = bond.AccountForBond.AccountNumber;
                    string depositaryAccount = "";
                    string depositaryAccountDescription = "";

                    if (bond.CustomerDepositaryAccount != null && bond.CustomerDepositaryAccount.AccountNumber != 0)
                    {
                        depositaryAccount = bond.CustomerDepositaryAccount.AccountNumber.ToString();
                        depositaryAccountDescription = bond.CustomerDepositaryAccount.Description;
                    }

                    
                    xbs.DepositaryAccountExistence depositaryAccountExistenceType = bond.DepositaryAccountExistenceType;
               


                    string hasDepositaryAccount = "0";
                    string depositaryAccountOpenRequest = "1";

                    if (depositaryAccountExistenceType == XBS.DepositaryAccountExistence.Exists || depositaryAccountExistenceType == XBS.DepositaryAccountExistence.ExistsInBank)
                    {
                        hasDepositaryAccount = "1";
                        depositaryAccountOpenRequest = "0";
                    }
                    else
                    {
                        hasDepositaryAccount = "0";
                        depositaryAccountOpenRequest = "1";
                        depositaryAccountDescription = "«ԱԿԲԱ ԲԱՆԿ» ԲԲԸ";
                    }
                    string guid = Utility.GetSessionId();
                    string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();

                    Dictionary<string, string> parameters = new Dictionary<string, string>();
                    parameters.Add(key: "customerNumber", value: customerNumber.ToString());
                    parameters.Add(key: "ISIN", value: ISIN);
                    parameters.Add(key: "unitPrice", value: unitPrice.ToString());
                    parameters.Add(key: "bondCount", value: bondCount.ToString());
                    parameters.Add(key: "documentNumber", value: documentNumber.ToString());
                    parameters.Add(key: "date", value: DateTime.Now.Date.ToString("dd/MM/yy"));
                    parameters.Add(key: "time", value: DateTime.Now.ToString("HH:mm"));
                    parameters.Add(key: "accountNumberAMD", value: accountNumberAMD);
                    parameters.Add(key: "accountNumberCurrency", value: accountNumberCurrency);
                    parameters.Add(key: "depositaryAccount", value: depositaryAccount);
                    parameters.Add(key: "depositaryAccountDescription", value: depositaryAccountDescription);
                    parameters.Add(key: "hasDepositaryAccount", value: hasDepositaryAccount);
                    parameters.Add(key: "depositaryAccountOpenRequest", value: depositaryAccountOpenRequest);
                    parameters.Add(key: "amountCreditDate", value: amountCreditDate.ToString("dd/MM/yy"));
                    parameters.Add(key: "amountCreditTime", value: amountCreditTime);
                    parameters.Add(key: "filialCode", value: filialCode);



                    ContractService.BondAcquirementApplication(parameters);
                }
               
            }
           
        }

        /// <summary>
        /// Վերադարձնում է դիլինգի հաստատման համար նախատեսված պարտատոմսերի ցանկը 
        /// bondFilterType = 1` արժեթղթերի հաշիվ չունեցող պարտատոմսեր
        /// bondFilterType = 2` հաստատման ենթակա պարտատոմսեր
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="bondFilterType"></param>
        /// <returns></returns>
        public JsonResult GetBondsForDealing(xbs.BondFilter filter, string bondFilterType)
        {
            filter.CustomerNumber = filter.CustomerNumber;

            if (filter.ISIN == null)
            {
                filter.ISIN = "";
            }

            filter.StartDate = filter.StartDate.Date;

            filter.EndDate = filter.EndDate.Date;

            List<xbs.Bond> bondsDealing = XBService.GetBondsForDealing(filter, bondFilterType);


            return Json(bondsDealing, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult>  ConfirmStockOrder(int bondId)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            xbs.Bond bond = XBService.GetBondByID(bondId);
            (bool isResident, bool isPhysical) = DepositaryService.GetCustomerTypeAndResidence(bond.CustomerNumber);
            if (isResident == false  && bond.CustomerDepositaryAccount.AccountNumber == 0  && bond.DepositaryAccountExistenceType == xbs.DepositaryAccountExistence.Exists)
            {
               await DepositaryService.CreateDepositaryAccountOrder(bond.CustomerNumber, bond.CustomerDepositaryAccount.StockIncomeAccountNumber);
            }
            result = XBService.ConfirmStockOrder(bondId);
            return Json(result);

        }

    }
}