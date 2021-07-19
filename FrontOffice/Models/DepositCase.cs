using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class DepositCase
    {
        public string StartDateToString
        {
            get
            {
                return StartDate.ToString("dd/MM/yy");
            }
        }
        public string EndDateToString
        {
            get
            {
                return EndDate.ToString("dd/MM/yy");
            }
        }
        public string FilialName { get; set; }
        public string ServicingUserDescrition { get; set; }
    }
}