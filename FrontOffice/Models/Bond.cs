using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class Bond
    {
        //public BondIssue BondIssue
        //{
        //    get
        //    {
        //        BondIssue bondIssue = new BondIssue();
        //        BondIssueFilter issueFilter = new BondIssueFilter();

        //        issueFilter.ISIN = this.ISIN;

        //        bondIssue = XBService.GetBondIssuesList(issueFilter).FirstOrDefault();

        //        return bondIssue;
        //    }
        //    set { }
        //}

        
        public string RegistrationDateToString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }

        public string AmountChargeDateToString
        {
            get
            {
                return AmountChargeDate.ToString("dd/MM/yyyy");
            }
        }
        
        public string AmountChargeTimeToString
        {
            get
            {
                return AmountChargeTime.ToString(@"hh\:mm");
            }
        }

        public string InterestRateValueToString
        {
            get
            {
                return (InterestRate * 100).ToString("#,0.00");
            }
        }

        public string TotalPriceToString
        {
            get
            {
                if (isAccessible)
                    return TotalPrice.ToString("#,0.00");
                else
                {
                    TotalPrice = 0;
                    return "*****";
                }
            }
        }

        public string BondCountToString
        {
            get
            {
                if (isAccessible)
                    return BondCount.ToString("#,0");
                else
                {
                    BondCount = 0;
                    return "*****";
                }
            }
        }

        public bool isAccessible
        {
            get
            {
                string guid = Utility.GetSessionId();
                XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();
                SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);

                User user = (User)System.Web.HttpContext.Current.Session[guid + "_User"];

                bool accountAccessible = false;
                Account currentAccount = null;

                if (sessionProperties == null)
                {
                    sessionProperties = new SessionProperties();
                }

                ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

                if (customerNumber != 0)
                {
                    List<Account> currentAccounts = XBService.GetCurrentAccounts(ProductQualityFilter.Opened);

                    if (currentAccounts.Any())
                    {
                        foreach (Account account in currentAccounts)
                        {
                            accountAccessible = XBService.AccountAccessible(account.AccountNumber, user.AccountGroup);
                            if (accountAccessible)
                            {
                                currentAccount = new Account();
                                currentAccount = account;
                                break;
                            }
                        }

                    }
                    else
                    {
                        List<Card> cards = XBService.GetCards(ProductQualityFilter.Opened);
                        foreach (Card card in cards)
                        {
                            accountAccessible = XBService.AccountAccessible(card.CardAccount.AccountNumber, user.AccountGroup);
                            if (accountAccessible)
                            {
                                currentAccount = new Account();
                                currentAccount = card.CardAccount;
                                break;
                            }
                        }

                    }

                    if (currentAccount != null && (HttpContext.Current.Session[guid + "_userAccessForCustomer"] != null || accountAccessible))
                    {
                        userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session[guid + "_userAccessForCustomer"];
                        if (accountAccessible || userAccessForCustomer.ListOfAccessibleAccountsGroups.Exists(i => i.AccountGroup.ToString() == currentAccount.AccountPermissionGroup))
                            return true;
                        else
                            return false;
                    }
                    else
                        return true;
                }
                else
                    return true;
            }
        }

    }
}