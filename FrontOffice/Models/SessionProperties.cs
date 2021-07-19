using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace FrontOffice
{
    [Serializable]
    public class SessionProperties
    {
        public string UserName { get; set; }
        public int SourceType { get; set; }
        public bool HasTransactionPermission { get; set; }
        public bool IsNonCustomerService { get; set; }
        public DateTime OperDay { get; set; }
        /// <summary>
        /// Օգտագործողի ՊԿ-ն
        /// </summary>
        public uint UserId { get; set; }

        /// <summary>
        /// Գլխավոր հաշվապահ
        /// </summary>
        public bool IsChiefAcc { get; set; }

        /// <summary>
        /// Կառավարիչ
        /// </summary>
        public bool IsManager { get; set; }

        /// <summary>
        /// Դրամարկղի վարիչ
        /// </summary>
        public bool IsHeadCashBook { get; set; }

        /// <summary>
        /// Որոշվում է արդյոք պետք է ստուգել ԱԳՍ-ի առկայությունը մասնաճյուղում
        /// </summary>
        public bool NonCheckFilialATSAccount { get; set; }

        /// <summary>
        /// Որոշվում է օգտագործողի մասնաճյուղում առկա է ԱԳՍ-ի հաշիվ
        /// </summary>
        public bool HasFilialATSAccount { get; set; }

        /// <summary>
        /// Փոփոխություն կատարելու հասանելիություններ
        /// </summary>
        public Dictionary<string, string> AdvancedOptions { get; set; }

        /// <summary>
        /// Վարկային պրոդուկտի ունիկալ համար
        /// </summary>
        public ulong LoanProductId { get; set; }

        /// <summary>
        /// HB Պատուհանից է կանչվում
        /// </summary>
        public bool IsCalledFromHB { get; set; }

        /// <summary>
        /// HB Պատուհանից գործարքի հաստատման համար է կանչվել թե ոչ
        /// </summary>
        public bool IsCalledForHBConfirm { get; set; } = false;

        /// <summary>
        /// Թեստաին տարբերակ է, թե ոչ
        /// </summary>
        public bool IsTestVersion { get { return bool.Parse(WebConfigurationManager.AppSettings["TestVersion"].ToString()); } }
    }
}