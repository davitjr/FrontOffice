
namespace FrontOffice.XBS
{
     public partial class ClassifiedLoan
    {
        public int RowCount { get; set; }
        public string ClassificationDateString
        {
            get
            {
                return ClassificationDate.ToString("dd/MM/yyyy");
            }
        }

    }
    
}