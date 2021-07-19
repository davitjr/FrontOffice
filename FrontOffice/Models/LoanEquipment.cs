using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;

namespace FrontOffice.XBS
{
     public partial class LoanEquipment
    {

        public string EquipmentPriceString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", EquipmentPrice);
            }
        }

        public string EquipmentSalePriceString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", EquipmentSalePrice);
            }
        }

        public string BankTransferedMoneyString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", BankTransferedMoney);
            }
        }

        public string ExpertAppraisedValueString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", ExpertAppraisedValue);
            }
        }
        public string FirstAuctionInitialPriceString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", FirstAuctionInitialPrice);
            }
        }
        public string MarketPriceString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", MarketPrice);
            }
        }
        public string PriceLimitByTheBankString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", PriceLimitByTheBank);
            }
        }

        public string BankTransferredMoneyString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", BankTransferredMoney);
            }
        }

        public string ProvisionAmountString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", ProvisionAmount);
            }
        }

        public string HistoryAmountString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", HistoryAmount);
            }
        }

        public string SalePriceString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", SalePrice);
            }
        }


        public string SumOfEquipmentPriceString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", SumOfEquipmentPrice);
            }
        }

        public string SumOfEquipmentSalePriceString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", SumOfEquipmentSalePrice);
            }
        }

        public string SumOfBankTransferedMoneyString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", SumOfBankTransferredMoney);
            }
        }

        public string SumOfPriceLimitByTheBankString
        {
            get
            {
                return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", SumOfPriceLimitByTheBank);
            }
        }

    }

}