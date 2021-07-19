using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.CardStatementService;


namespace FrontOffice.CardStatementService
{
    public partial class CardStatementSession
    {
        public string ScheduleString
        {
            get
            {
                if (Schedule!=null && Schedule > DateTime.Now)
                    return Schedule.Value.ToString("dd/MM/yy HH:mm");
                return null;
            }
        }
  
    }
}