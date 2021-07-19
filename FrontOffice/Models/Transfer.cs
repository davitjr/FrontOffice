using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;

namespace FrontOffice.XBS
{
    public partial class Transfer
    {
        public string RegistrationDateString
        {
            get
            {
                string registrationDateTime = "";
                if (RegistrationDate != null)
                    registrationDateTime= RegistrationDate.ToString("dd/MM/yyyy");
                if (RegistrationTime != null)
                    registrationDateTime = registrationDateTime + " " + RegistrationTime.Value.ToString(@"hh\:mm");
   

                return registrationDateTime;
            }

        }
        public string ConfirmationDateString
        {
            get
            {
                string confirmationDateTime = "";
                if (ConfirmationDate != null)
                    confirmationDateTime= ConfirmationDate.Value.ToString("dd/MM/yyyy");
                if (ConfirmationTime != null)
                    confirmationDateTime = confirmationDateTime + " " + ConfirmationTime.Value.ToString(@"hh\:mm");
   

                return confirmationDateTime;
            }
        }


        public string SenderDateOfBirthString
        {
            get
            {
                if (SenderDateOfBirth != null)
                    return SenderDateOfBirth.Value.ToString("dd/MM/yyyy");
                else
                    return "";
            }
        }

        public string VerifiedString
        {
            get
            {
                if (Verified==2 )
                        return   "Կասկածելի";
                else if (Verified==3 )
                        return   "Թույլատրելի";
                else
                    return "";
            }
        }

        public string AmlCheckString
        {
            get
            {
                if (AmlCheck == 1)
                    return "AML";
                else if (AmlCheck ==2)
                    return "AMLC";
                else if (AmlCheck ==3)
                    return "AMLR";
                else if (AmlCheck ==4)
                    return "AMLP";
                else
                    return "";
            }
        }

        public string VerifiedAmlString
        {
            get
            {
                if (VerifiedAml == 2)
                    return "Կասկածելի AML";
                else if (VerifiedAml == 3)
                    return "Թույլատրելի AML";
                else if (VerifiedAml == 4)
                    return "Մերժված AML";
                else if (VerifiedAml == 5)
                    return "Ընթացքում AML";
                else
                    return "";
            }
        }

    }
}
