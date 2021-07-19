using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models.VisaAliasModels
{
    public class ResolveAliasResponse
    {
        public string Country { get; set; }
        public string RecipientPrimaryAccountNumber { get; set; }
        public string IssuerName { get; set; }
        public string CardType { get; set; }
        public string RecipientName { get; set; }
        public AccountLookUpInfo AccountLookUpInfo { get; set; }
    }
    public class AccountLookUpInfo
    {
        public List<VisaNetworkInfo> VisaNetworkInfo { get; set; }
    }

    public class VisaNetworkInfo
    {
        public string CardTypeCode { get; set; }
        public int BillingCurrencyCode { get; set; }
        public int BillingCurrencyMinorDigits { get; set; }
        public string IssuerName { get; set; }
        public int CardIssuerCountryCode { get; set; }
        public string FastFundsIndicator { get; set; }
        public string PushFundsBlockIndicator { get; set; }
        public string OnlineGambingBlockIndicator { get; set; }
    }

}