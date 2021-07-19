using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBManagement
{
    public partial class PhoneBankingContract
    {
        public string ContractDateString
        {
            get
            {
                if (ContractDate != null)
                {
                    return ContractDate.Value.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "";
                }

            }
        }

        public string ApplicationDateString
        {
            get
            {
                if (ApplicationDate != null)
                {
                    return ApplicationDate.Value.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "";
                }

            }
        }

        public string OneTransactionLimitToOwnAccountToString
        {
            get { return OneTransactionLimitToOwnAccount.ToString("#,0.00"); }
        }

        public string OneTransactionLimitToAnothersAccountToString
        {
            get { return OneTransactionLimitToAnothersAccount.ToString("#,0.00"); }
        }

        public string DayLimitToOwnAccountToString
        {
            get { return DayLimitToOwnAccount.ToString("#,0.00"); }
        }

        public string DayLimitToAnothersAccountToString
        {
            get { return DayLimitToAnothersAccount.ToString("#,0.00"); }
        }
    }
}