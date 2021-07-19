using System;

namespace FrontOffice.ACBAServiceReference
{
    public partial class Employment
    {
           public string WorkExperience {
            get {
                try
                {
                    if (this.StartDate == null || this.StartDate.Value == null || DateTime.Now < this.StartDate.Value)
                    {
                        return String.Empty;
                    }
                    else
                    {
                        var workYears = new DateTime(DateTime.Now.Subtract(this.StartDate.Value).Ticks).Year - 1;
                        if (workYears > 0)
                        {
                            return (new DateTime(DateTime.Now.Subtract(this.StartDate.Value).Ticks).Year - 1).ToString() + " տարի";
                        }
                        else
                        {
                            var workMoths = DateTime.Now.Month - this.StartDate.Value.Month;
                            if (workMoths == 0) return string.Empty;
                            return workMoths.ToString() + " ամիս";
                        }
                    }
                }
                catch (Exception)
                {
                    return String.Empty;
                }
                
                       
            }
        }
        public string OrganisationNameUnicode
        {
            get
            {
                return Utility.ConvertAnsiToUnicode(this.OrganisationName);
            }
        } 
        public string PositionStaff {
            get {
                string posStaff = string.Empty;
                if (this.Position.value != string.Empty && this.Staff != string.Empty)
                {
                    posStaff = this.Staff;
                }
                 if (this.Position.value != string.Empty)
                {
                    posStaff = Utility.ConvertAnsiToUnicode(this.Position.value);
                }
                if(this.Staff != string.Empty)
                {
                    posStaff = Utility.ConvertAnsiToUnicode(this.Staff);
                }
                return posStaff;
            }
        }
    }
}

