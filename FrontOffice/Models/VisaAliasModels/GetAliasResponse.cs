﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models.VisaAliasModels
{
    public class GetAliasResponse
    {
        public string Country { get; set; }
        public string RecipientLastName { get; set; }
        public string RecipientFirstName { get; set; }
        public string RecipientPrimaryAccountNumber { get; set; }
        public string IssuerName { get; set; }
        public string CardType { get; set; }
        public string ConsentDateTime { get; set; }
        public string Guid { get; set; }
        public string Alias { get; set; }
        public string AliasType { get; set; }
        public List<OneAlias> Aliases { get; set; }
    }

    public class OneAlias
    {
        public string Alias { get; set; }
        public string AliasType { get; set; }
        public string IsDefault { get; set; }
    }
}