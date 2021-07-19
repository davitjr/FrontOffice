using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;

namespace FrontOffice.XBS
{
    public partial class BondQualityUpdateOrder
    {
        public Bond  Bond
        {
            get
            {
                Bond bond = new Bond();

                bond = XBService.GetBondByID(BondId);
                return bond;
            }
            set { }
        }


    }
}