using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Srv = FrontOffice.Service;
using statementService = FrontOffice.CardStatementService;

namespace FrontOffice.Controllers
{
    public class CardStatementAdvertisementController : Controller
    {
        // GET: CardStatementAdvertisement
        public ActionResult Index()
        {
            return View("CardStatementAdvertisements");
        }

        public ActionResult CardStatementAdvertisements()
        {
            return PartialView("CardStatementAdvertisements");
        }
        
        public ActionResult AddNewCardStatementAdvertisement()
        {
            return View("AddNewCardStatementAdvertisement");
        }

        public ActionResult OneCardAdvertisementsDetails()
        {
            return View("OneCardAdvertisementsDetails");
        }

        public JsonResult GetAllCardsAdvertisements()
        {
            statementService.Advertisement advertisement = Srv.CardStatementService.GetAllCardsAdvertisements();

            Dictionary<string, string> cardSystems = Srv.InfoService.GetCardSystemTypes();
            Dictionary<string, string> cardsType = Srv.InfoService.GetOpenCardsType();

            foreach (statementService.AdvertisementConfiguration item in advertisement.AllCardsAdvertisements)
            {
                item.CardSystemDescription = cardSystems[item.CardSystem.ToString()];
                item.CardTypeDescription = cardsType[item.CardType.ToString()];
            }

            var jsonResult = Json(advertisement, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }


        public JsonResult GetOneCardAdvertisements(int cardType)
        {
            statementService.AdvertisementConfiguration oneCardAdvertisements = Srv.CardStatementService.GetOneCardAdvertisements(cardType);

            var jsonResult = Json(oneCardAdvertisements, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;

        }
        public JsonResult GetAdvertisementFiles(int advertisementID)
        {
            return Json(Srv.CardStatementService.GetAdvertisementFiles(advertisementID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAdvertisementFileByID(int ID)
        {
            return Json(Srv.CardStatementService.GetAdvertisementFileByID(ID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult InsertAdvertisement(statementService.AdvertisementConfiguration statementAdvertisements)
        {
            return Json(Srv.CardStatementService.InsertAdvertisement(statementAdvertisements), JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateAdvertisementWithNewFile(statementService.Advertisement advertisement)
        {
            return Json(Srv.CardStatementService.UpdateAdvertisementWithNewFile(advertisement), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeactivateAdvertisement(int advertisementID)
        {
            return Json(Srv.CardStatementService.DeactivateAdvertisement(advertisementID), JsonRequestBehavior.AllowGet);
        }
    }
}