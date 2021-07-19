using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FrontOffice.ACBAServiceReference;
using FrontOffice.Service;


namespace FrontOffice.Models
{
    /// <summary>
    /// Հաճախորդի հիմնական տվյալների ցուցադրման մոդել
    /// </summary>
    public class CustomerMainDataViewModel
    {
        /// <summary>
        /// Հաճախորդի համար
        /// </summary>
        public ulong CustomerNumber { get; set; }

        ///<summary>
        ///Հաճախորդի տեսակ
        ///</summary>
        public int CustomerType { get; set; }

        /// <summary>
        /// Հաճախորդի տեսակի նկարագրություն
        /// </summary>
        public string CustomerTypeDescription { get; set; }

        ///<summary>
        ///Հաճախորդի Մուտքագրման ամսաթիվ
        ///</summary>
        public DateTime RegisrationDate { get; set; }

        /// <summary>
        /// Հաճախորդի անուն/ազգանուն(ֆիզ. անձ), անվանում(ոչ ֆիզ.)
        /// </summary>
        public string CustomerDescription { get; set; }

        /// <summary>
        /// Հաճախորդի անուն/ազգանուն(ֆիզ. անձ), անվանում(ոչ ֆիզ.)
        /// </summary>
        public string CustomerDescriptionEng { get; set; }

        ///<summary>
        ///Ռեզիդենտության տեսակ
        ///</summary>
        public int ResidenceType { get; set; }

        ///<summary>
        ///Անձի կամ Կազմակերպության հերթական համար
        ///</summary>
        public virtual uint IdentityId { get; set; }

        ///<summary>
        ///Վերջին թարմացման ամսաթիվ
        ///</summary>
        public DateTime? LastUpdateDate { get; set; }

        ///<summary>
        ///Թարմացման վերաբերյալ մեկնաբանություն
        ///</summary>
        public string LastUpdateAddInf { get; set; }

        /// <summary>
        /// Հաճախորդի հեռախոսահամար(ներ)
        /// </summary>
        public List<CustomerPhone> Phones { get; set; }

        /// <summary>
        /// Հաճախորդի հասցե(ներ)
        /// </summary>
        public List<CustomerAddress> Addresses { get; set; }

        /// <summary>
        /// Հաճախորդի էլ. հասցե(ներ)
        /// </summary>
        public List<CustomerEmail> Emails { get; set; }

        /// <summary>
        /// Հաճախորդի վեբ կայք(եր)
        /// </summary>
        public List<CustomerWebSite> WebSites { get; set; }

        ///<summary>
        ///Փոխկապակցված անձանց ցուցակ
        ///</summary>
        //public List<LinkedCustomer> LinkedCustomerList { get; set; }

        /// <summary>
        /// ՀՎՀՀ
        /// </summary>
        public string TaxCode { get; set; }

        /// <summary>
        /// Սոցիալական քարտի համար
        /// </summary>
        public string SocialNumber { get; set; }

        public void Get(ulong customerNumber)
        {
            if (customerNumber == 0) return;
            CustomerMainData customer = new CustomerMainData();
            customer = ACBAOperationService.GetCustomerMainData(customerNumber);

            if (customer != null)
            {
                this.CustomerNumber = customer.CustomerNumber;
                this.CustomerType = customer.CustomerType;
                this.CustomerTypeDescription = customer.CustomerTypeDescription;
                this.RegisrationDate = customer.RegisrationDate;
                this.CustomerDescription = customer.CustomerDescription;
                this.CustomerDescriptionEng = customer.CustomerDescriptionEng;
                this.ResidenceType = customer.ResidenceType;
                this.IdentityId = customer.IdentityId;
                this.LastUpdateDate = customer.LastUpdateDate;
                this.LastUpdateAddInf = customer.LastUpdateAddInf;
                this.Phones = customer.Phones;
                this.Addresses = customer.Addresses;
                this.Emails = customer.Emails;
                this.WebSites = customer.WebSites;
                this.TaxCode = customer.TaxCode;
                this.SocialNumber = customer.SocialNumber;
            }

        }
    }
}
