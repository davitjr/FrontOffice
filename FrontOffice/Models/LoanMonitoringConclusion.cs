using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;
using FrontOffice.ACBAServiceReference;
using System.Web.SessionState;

namespace FrontOffice.XBS
{
    public partial class LoanMonitoringConclusion
    {
        public string MonitoringSetNumberDescription
        {
            get
            {
                ACBAServiceReference.Cashier cashier = ACBAOperationService.GetCashier((uint)this.MonitoringSetNumber);
                return cashier.firstName + " " + cashier.lastName + " [" + cashier.setNumber + " ՊԿ]";
            }
        }
        public string MonitoringFactorsDescription
        {
            get
            {
                string value = "";
                foreach (var item in this.MonitoringFactors)
                {
                    value += item.FactorDescription + ", ";
                }
                return value;
            }
        }

        public List<int> ConclusionChangerUsers
        {
            get
            {
                List<int> users = new List<int>();
                if (this.Status==1)
                {
                    users = ACBAOperationService.GetAllManagersOfUser(Convert.ToUInt32(this.MonitoringSetNumber)).Select(x => Convert.ToInt32(x.setNumber)).ToList();
                    users.Add(this.MonitoringSetNumber);
                   
                }
                return users;
            }
        }

        public bool IsConclusionChanger
        {
            get;set;
        }
    }
}