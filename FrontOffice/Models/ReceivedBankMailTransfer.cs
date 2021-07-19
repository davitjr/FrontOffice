using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;

namespace FrontOffice.XBS
{
    public partial class ReceivedBankMailTransfer
    {
        public string DateGetString
        {
            get
            {
                string registrationDateTime = "";
                if (DateGet != null)
                    registrationDateTime = DateGet.ToString("dd/MM/yyyy");
                if (TimeGet != null)
                    registrationDateTime = registrationDateTime + " " + TimeGet.ToString(@"hh\:mm");
   

                return registrationDateTime;
            }

        }

        public string DateTransferString
        {
            get
            {

                if (DateTransfer != null)
                    return DateTransfer.ToString("dd/MM/yyyy");
                else
                    return "";
 
            }

        }

        public string DateTransString
        {
            get
            {

                if (DateTrans != null)
                    return DateTrans.ToString("dd/MM/yyyy");
                else
                    return "";

            } 
        }
 
        public string VerifiedString
        {
            get
            {
                if (Verified == 2)
                    return "Կասկածելի";
                else if (Verified == 3)
                    return "Թույլատրելի";
                else
                    return "";
            }
        }
 
        
        public string AMLCheckString
        {
            get
            {
              if (AmlCheck ==0)
                {
                    if (VerifiedAML ==2)
                          return "ԿAML";
                    else
                        if(VerifiedAML ==3)
                              return "ÂAML";
                        else
                            return "";
                }
                else
                {
                    if (AmlCheck ==1)
                        return "AML";
                        else
                            return "AMLC";
                }
           }
        }

        public short  CheckSetNumber
        {
            get
            {
                if (AmlCheck == 0)
                {
                    return VerifierSetNumber;
                }
                else
                {
                    return AmlCheckSetNumber;
                }
            }
        }

        public string CheckDateString
        {
            get
            {
                if (AmlCheck == 0)
                {
                    if (VerifierSetDateAML!=null)
                        return VerifierSetDateAML.ToString("dd/MM/yyyy");
                    else 
                        return "";
                }
                else
                {
                    if (AmlCheckDate != null)
                        return AmlCheckDate.ToString("dd/MM/yyyy");
                    else
                        return "";
                }
            }
        }

        public string UserCodeString 
        {
            get
            { 
                if (UserCode  == 0)
                    return "Չստուգաված";
                else if (UserCode ==1)
                    return "Ստուգված";
                else if (UserCode ==2)
                    return "ԴԱՀԿ";
                else
                    return "";
            }
        }

        public string UnknownTransferString
        {
            get
            {
                if (UnknownTransfer  == 0)
                    return "Ոչ";
                else
                    return "Այո";
            }
        }

        public string NotAutomatTransString
        { 
            get
            {
                if (NotAutomatTrans  == 0)
                    return "Այո";
                else
                    return "Ոչ";
            }
        }
    }
}
