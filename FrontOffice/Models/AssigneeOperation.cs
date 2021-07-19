using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class AssigneeOperation
    {
        public bool Checked { get; set; }
        public bool CanChangeAllAccounts { get; set; }
        public List<AssigneeOperationAccount> Accounts { get; set; }

        public AssigneeOperation()
        {
            Accounts = new List<AssigneeOperationAccount>();
        }
    }
}