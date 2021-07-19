using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models.VisaAliasModels
{
    public class UpdateAliasRequest
    {
        public string Guid { get; set; }
        public string ConsentDateTime { get; set; }
        public string Alias { get; set; }
        public string AliasType { get; set; }
        public string RecipientPrimaryAccountNumber { get; set; }
        public string CardType { get; set; }
        public string IssuerName { get; set; }
        public string NewGuid { get; set; }
        public string ExpiryDate { get; set; }
        public int SetNumber { get; set; }
    }
}