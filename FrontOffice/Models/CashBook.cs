
namespace FrontOffice.XBS
{
    public partial class CashBook
    {
        public string OperationTypeString
        {
            get
            {
                return OperationType == 1 ? "Ելք" : "Մուտք";
            }
        }
    }
}