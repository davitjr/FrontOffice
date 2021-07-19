
namespace FrontOffice.XBS
{
    public partial class Credential
    {
        public string StartDateToString
        {
            get
            {
                return StartDate.Value.ToString("dd/MM/yyyy");
            }
        }
        public string EndDateToString
        {
            get
            {
                return EndDate != null ? EndDate.Value.ToString("dd/MM/yyyy") : "null";
            }
        }
    }
}