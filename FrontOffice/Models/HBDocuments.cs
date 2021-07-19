using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExternalBanking
{
    public class HBDocuments
    {
        public int TransactionCode { get; set; }
        public string TransactionDate { get; set; }
        public int FilialCode { get; set; }
        public long CustomerNumber { get; set; }
        public string CustomerFullName { get; set; }
        public int DocumentType { get; set; }
        public int Type { get; set; }
        public int DocumentSubtype { get; set; }
        public float TransactionAmount { get; set; }
        public string TransactionCurrency { get; set; }
        public long? DebitAccount { get; set; }
        public string TransactionDescription { get; set; }
        public string ConfirmationDate { get; set; }
        public int TransactionQuality { get; set; }
        public int CreditBankCode { get; set; }
        public int Urgent { get; set; }
        public int TransactionSource { get; set; }
        public bool ForAutomatConfirmated { get; set; }
        public bool ByJob { get; set; }
        public string RegistrationDate { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverNameInRecords { get; set; }

        public double TotalAmount { get; set; }
        public int TotalQuantity { get; set; }

        public int LastRow { get; set; }

        public bool TypeIsForAutomatonfirmated { get; set; }

        public string CustomerWroteDescription { get; set; }

        public HBDocumentsDropdownLists SelectedRejectReason { get; set; }

        public HBDocumentCustomerDetails CustomerDetails { get; set; }

        public HBDocumentAccountDetails AccountDetails { get; set; }
        
        public string CreditAccount { get; set; }

        public int SetNumber { get; set; }

       
    }
}
