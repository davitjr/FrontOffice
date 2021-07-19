using System;

namespace FrontOffice.EmployeeWorksManagementService
{
    public partial class EmployeeWork
    {
        public ulong CustomerNumber { get; set; }

        public bool IsOverdueWork
        {
            get
            {
                if ((Quality==10 || Quality==20) && EndDate.Date < DateTime.Now.Date)
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