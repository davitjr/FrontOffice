using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.ACBAServiceReference
{
    public partial class PersonNoteHistory
    {
        public string ActionUserName { get; set; }

        public string ActionDateString
        {
            get
            {
                return ActionDate.Value.ToString("dd/MM/yyyy HH:mm");
            }
        }
    }
}