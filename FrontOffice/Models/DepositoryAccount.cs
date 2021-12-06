using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace FrontOffice.Models
{
    public class BankAccountList
    {
        public string AccountNumber { get; set; }
        public string Currency { get; set; }
    }

    public class DepoAccount
    {
        public string AccountOperator { get; set; }
        public string SecuritiesAccount { get; set; }
        public string AccountClass { get; set; }
        public string AccountClassDescription { get; set; }
        public string Status { get;  set; }
        public List<BankAccountList> BankAccountList { get; set; }
        public string AccountIDInDepo { get; set; }
        public string IdentityDocumentIDInDepo { get; set; }
    }

    public class SecuritiesList
    {
        public double SecuritiesQuantity { get; set; }
        public decimal SecuritiesVolume { get; set; }
        public string ISIN { get; set; }
        public decimal ISINNominalPrice { get; set; }
        public string ISINSubtype { get; set; }
        public string ISINFullName { get; set; }
        public string PartName { get; set; }
    }

    public class DepositaryApiAccount
    {
        public DepoAccount Account { get; set; }
        public List<SecuritiesList> SecuritiesList { get; set; }
    }

}