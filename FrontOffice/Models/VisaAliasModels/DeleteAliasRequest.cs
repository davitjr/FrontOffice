using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models.VisaAliasModels
{
    public class DeleteAliasRequest
    {       
        public int SetNumber { get; set; }

        public string Alias { get; set; }

        public string Guid { get; set; }
    }
}