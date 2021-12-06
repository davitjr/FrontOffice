using FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models
{
    public class DepositoryAccountSaveModel
    {
        public DepositaryAccountOrder order { get; set; }
        public bool IsOpeningAccInDepo { get; set; }
        public bool fromBondOrder { get; set; }
    }
}