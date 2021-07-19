using FrontOffice.FinancialPlanningService;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace FrontOffice.CustomBinders
{
    public class PlanningIndicatorDetailsBinder:DefaultModelBinder
    {
        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
          
            HttpRequestBase request = controllerContext.HttpContext.Request;

            var doc = request.Form["document"];
            if (string.IsNullOrEmpty(doc))
                return (null);

            var documentJSON = JObject.Parse(doc);
            Document document = new Document();
            document.Targets = new List<Target>();
            document.FinancialPlanningType = documentJSON["financialPlanningType"].Value<byte>();

            for (int s = 0; s < documentJSON["Targets"].Count(); s++)
            {
                var targetJSON = documentJSON["Targets"][s];
                Target target = new Target();
                target.FilialCode = targetJSON["Filial"].Value<int>();
                target.TargetID  = targetJSON["TargetID"].Value<int>();
                target.TargetType = targetJSON["TargetType"].Value<byte>();
                target.PlanningIndicators = new List<PlanningIndicator>();

                for (int pi = 0; pi < targetJSON["PlanningIndicators"].Count(); pi++)
                {
                    var planningIndicatorJSON = targetJSON["PlanningIndicators"][pi];
                    PlanningIndicator planningIndicator = new PlanningIndicator();
                    planningIndicator.Date = planningIndicatorJSON["Date"].Value<DateTime>();
                    planningIndicator.Type = planningIndicatorJSON["Type"].Value<byte>();
                    planningIndicator.PlanningIndicatorGroups = new List<PlanningIndicatorGroup>();

                    for (int pig = 0; pig < planningIndicatorJSON["PlanningIndicatorGroups"].Count(); pig++)
                    {
                        var planningIndicatorGroupJSON = planningIndicatorJSON["PlanningIndicatorGroups"][pig];
                        PlanningIndicatorGroup planningIndicatorGroup = new PlanningIndicatorGroup();
                        planningIndicatorGroup.Type = planningIndicatorGroupJSON["Type"].Value<byte>();
                        planningIndicatorGroup.PlanningIndicatorDetails = new List<object>();

                        for (int pid = 0; pid < planningIndicatorGroupJSON["PlanningIndicatorDetails"].Count(); pid++)
                        {
                            var planningIndicatorDetailJSON = planningIndicatorGroupJSON["PlanningIndicatorDetails"][pid];
                            object planningIndicatorDetail = null;

                            switch (planningIndicatorGroup.Type)
                            {
                                case 1:
                                    Customer customer = new Customer();
                                    customer.TargetQuantity = planningIndicatorDetailJSON["TargetQuantity"]?.Value<int>();
                                    customer.ActualQuantity = planningIndicatorDetailJSON["ActualQuantity"]?.Value<int>();
                                    customer.Type = planningIndicatorDetailJSON["Type"].Value<byte>();
                                    planningIndicatorDetail = customer;
                                    break;
                                case 2:
                                    Loan loan = new Loan();
                                    loan.TargetPortfolio = planningIndicatorDetailJSON["TargetPortfolio"]?.Value<double>();
                                    loan.ActualPortfolio = planningIndicatorDetailJSON["ActualPortfolio"]?.Value<double>();
                                    loan.Type = planningIndicatorDetailJSON["Type"].Value<byte>();
                                    planningIndicatorDetail = loan;
                                    break;
                                case 3:
                                    Deposit deposit = new Deposit();
                                    deposit.TargetPortfolio = planningIndicatorDetailJSON["TargetPortfolio"]?.Value<double>();
                                    deposit.ActualPortfolio = planningIndicatorDetailJSON["ActualPortfolio"]?.Value<double>();
                                    deposit.Type = planningIndicatorDetailJSON["Type"].Value<byte>();
                                    planningIndicatorDetail = deposit;
                                    break;
                                case 4:
                                    Card card = new Card();
                                    card.TargetQuantity = planningIndicatorDetailJSON["TargetQuantity"]?.Value<int>();
                                    card.ActualQuantity = planningIndicatorDetailJSON["ActualQuantity"]?.Value<int>();
                                    card.Type = planningIndicatorDetailJSON["Type"].Value<byte>();
                                    planningIndicatorDetail = card;
                                    break;
                                case 5:
                                    Other other = new Other();
                                    other.TargetQuantity = planningIndicatorDetailJSON["TargetQuantity"]?.Value<int>();
                                    other.ActualQuantity = planningIndicatorDetailJSON["ActualQuantity"]?.Value<int>();
                                    other.TargetPercent = planningIndicatorDetailJSON["TargetPercent"]?.Value<int>();
                                    other.Type = planningIndicatorDetailJSON["Type"].Value<byte>();
                                    planningIndicatorDetail = other;
                                    break;
                            }
                            planningIndicatorGroup.PlanningIndicatorDetails.Add(planningIndicatorDetail);
                        }
                        planningIndicator.PlanningIndicatorGroups.Add(planningIndicatorGroup);
                    }
                    target.PlanningIndicators.Add(planningIndicator);
                }
                document.Targets.Add(target);
            }

            document.Year = (short)document.Targets[0].PlanningIndicators[1].Date.Year;
            return document;
        }
    }
}