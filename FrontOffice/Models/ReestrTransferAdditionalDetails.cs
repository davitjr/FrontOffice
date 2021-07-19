using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;

namespace FrontOffice.XBS
{
    public partial class ReestrTransferAdditionalDetails
    {
        /// <summary>
        /// Քարտը փակ է թե ոչ
        /// </summary>
        public bool? CardClosed { get; set; }
        /// <summary>
        /// Քարտը ԴԱՀԿ ունի թե ոչ
        /// </summary>
        public bool? CardHasDAHK { get; set; }

        /// <summary>
        /// Զգուշացման հաղորդագրություն
        /// </summary>
        public string WarningDescription { get; set; }
    }
}