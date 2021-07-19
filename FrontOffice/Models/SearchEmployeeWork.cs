using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.EmployeeWorksManagementService
{
    public partial class SearchEmployeeWork
    {

        public bool IsOverdueWork
        {
            get
            {
                if ((Quality == 10 || Quality == 20) && EndDate!=null && EndDate.Value.Date < DateTime.Now.Date)
                {
                    return true;
                }
                else
                {
                    return false;
                }


            }

        }

    }
}