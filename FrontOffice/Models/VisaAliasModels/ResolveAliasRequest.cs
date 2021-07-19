using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models.VisaAliasModels
{
    public class ResolveAliasRequest
    {
        public string BusinessApplicationId { get; set; }
        public string Alias { get; set; }
        public string AccountLookUp { get; set; }
        public int SetNumber { get; set; }
    }
}