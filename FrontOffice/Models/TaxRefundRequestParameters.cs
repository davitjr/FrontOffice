using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models
{
    public class TaxRefundRequestParameters
    {
        public bool MassSending { get; set; }
        public long? ProductId { get; set; }
        public short Year { get; set; }
        public int[] Quarters { get; set; }
    }
}