using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models
{
    public class JointCustomerModel
    {
        //Հաճախորդի համարը
        public ulong CustomerNumber { get; set; }
        //Հաճախորդի անունը
        public string CustomerName { get; set; }
        //Հաճախորդի բաժնեմասը 
        public double Part { get; set; }
    }
}