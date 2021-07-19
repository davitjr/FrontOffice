using FrontOffice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;

namespace FrontOffice.XBS
{
    public partial class Account
    {
        public string BalanceString
        {
            get
            {
                if (isAccessible )
                    return Balance.ToString("#,0.00");
                else
                {
                    Balance = 0;
                    AvailableBalance = 0;
                    return "*****";
                }
            }
        }
        public string UnUsedAmountString
        {
            get
            {
                if (UnUsedAmount != null)
                {
                    return UnUsedAmount.Value.ToString("#,0.00");
                }
                else
                {
                    return "";
                }
            }
        }

        public string ClosingDateString
        {
            get
            {
                return ClosingDate != null ? ClosingDate.Value.ToString("dd/MM/yy") : "null";
            }
        }

        public string OpenDateString
        {
            get
            {
                return OpenDate != null ? OpenDate.Value.ToString("dd/MM/yy") : "null";
            }
        }

        public List<JointCustomerModel> JointPerson { get; set; }

        public bool isAccessible
        {
            get
            {
                string guid = Utility.GetSessionId();
                XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();
                SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);

                User user = (User)System.Web.HttpContext.Current.Session[guid + "_User"];

                bool accountAccessible = false;

                if (sessionProperties == null)
                {
                    sessionProperties = new SessionProperties();
                }

                if (sessionProperties.IsNonCustomerService && this.AccountNumber!=null && this.AccountNumber.Length==15)
                {
                    accountAccessible= XBService.AccountAccessible(this.AccountNumber, user.AccountGroup);
                }
                

                if (HttpContext.Current.Session[guid + "_userAccessForCustomer"] != null || accountAccessible)
                { 
                    userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session[guid + "_userAccessForCustomer"];
                    if ( accountAccessible || userAccessForCustomer.ListOfAccessibleAccountsGroups.Exists(i => i.AccountGroup.ToString() == this.AccountPermissionGroup) )
                        return true;
                    else
                        return false;
                }
                else
                    return true;
            }
        }
    }
}