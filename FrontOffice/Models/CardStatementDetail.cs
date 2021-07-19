using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class CardStatementDetail
    {
        public string OperationAmountToString
        {
            get
            {
                if (OperationAmount != 0)
                {
                    return OperationAmount.ToString("#,0.00");
                }
                return "";
            }
        }
        public string CommissionFeeToString
        {
            get
            {
                {
                    if (CommissionFee != 0)
                    {
                        return CommissionFee.ToString("#,0.00");
                    }
                    return "";
                }
            }
        }
        public string AmountToString
        {
            get
            {
                {
                    if (Amount!= 0)
                    {
                        return  Amount.ToString("#,0.00");
                    }
                    return "";
                }
            }
        }
    }
}