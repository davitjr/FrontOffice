using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class CardLimit
    {
        public string LimitValueString
        {
            get
            {
                return Limit != LimitType.DailyCashingQuantityLimit ? LimitValue.ToString("#,0.00") : LimitValue.ToString();
            }
        }
    }
}