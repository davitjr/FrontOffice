using System;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class UtilityController : Controller
    {
        [SessionExpireFilter]
        public JsonResult GetLastRates(String currency, RateType rateType, ExchangeDirection direction  )
        {
            return Json(XBService.GetLastRates(currency, rateType, direction), JsonRequestBehavior.AllowGet);
        }

        [SessionExpireFilter]
        public JsonResult GetOperationSystemAccount(Order order , short orderAccountType ,string currency)
        {
            return Json(XBService.GetOperationSystemAccount(order, (OrderAccountType)orderAccountType, order.Currency), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCBKursForDate(string date, string currency)
        {
            return Json(XBService.GetCBKursForDate(Convert.ToDateTime(date).Date, currency), JsonRequestBehavior.AllowGet);
        }

        public JsonResult ConvertAnsiToUnicode(string text)
        {
            return Json(Utility.ConvertAnsiToUnicode(text), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrentOperDay()
        {
            return Json(XBService.GetCurrentOperDay(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult FormatRountByDecimals(decimal number1, int decimalsCount, ushort operation=0, decimal number2=0)
        {
            double value = 0;
            if (operation == 1)//Բազմապատկում
            {
                value = Math.Round((double)(number1 * number2), decimalsCount, MidpointRounding.AwayFromZero);
            }
            else if (operation == 2)//Բաժանում
            {
                value = Math.Round((double)(number1 / number2), decimalsCount, MidpointRounding.AwayFromZero);
            }

            return Json(value, JsonRequestBehavior.AllowGet);
        }

    }
}