using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using FrontOffice.ACBAServiceReference;
using FrontOffice.Service;


namespace FrontOffice.Models
{
    /// <summary>
    /// Հաճախորդի տվյալների ցուցադրման մոդել
    /// </summary>
    public class CustomerViewModel
    {
        /// <summary>
        /// Մասնաճյուղ
        /// </summary>
        public int FilialCode { get; set; }

        /// <summary>
        /// Մասնաճյուղի անվանում
        /// </summary>
        public string FilialName { get; set; }

        /// <summary>
        /// Հաճախորդի համար
        /// </summary>
        public ulong CustomerNumber { get; set; }

        /// <summary>
        /// Հաճախորդի տեսակ
        /// </summary>
        public int CustomerType { get; set; }

        /// <summary>
        /// Կարգավիճակ
        /// </summary>
        public int Quality { get; set; }

        /// <summary>
        /// Կարգավիճակի նկարագրություն
        /// </summary>
        public string QualityDescription { get; set; }

        /// <summary>
        /// Ռեզիդենտություն
        /// </summary>
        public int Residence { get; set; }

        /// <summary>
        /// Ռեզիդենտության երկիր
        /// </summary>
        public StringKeyValue ResidenceCountry { get; set; }

        /// <summary>
        /// Անուն
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Անուն (ոչ UNICODE)
        /// </summary>
        public string FirstNameNonUnicode { get; set; }

        /// <summary>
        /// Ազգանուն
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Ազգանուն (ոչ UNICODE)
        /// </summary>
        public string LastNameNonUnicode { get; set; }

        /// <summary>
        /// Անուն անգլերեն
        /// </summary>
        public string FirstNameEng { get; set; }

        /// <summary>
        /// Ազգանուն անգլերեն
        /// </summary>
        public string LastNameEng { get; set; }

        /// <summary>
        /// Հայրանուն
        /// </summary>
        public string MiddleName { get; set; }

        /// <summary>
        /// Ծննդյան ա/թ
        /// </summary>
        public DateTime? BirthDate { get; set; }

        /// <summary>
        /// Կազմակերպության անվանում
        /// </summary>
        public string OrganisationName { get; set; }

        /// <summary>
        /// Կազմակերպության անվանում (ոչ UNICODE)
        /// </summary>
        public string OrganisationNameNonUnicode { get; set; }

        /// <summary>
        /// Կազմակերպության անվանում անգլերեն
        /// </summary>
        public string OrganisationNameEng { get; set; }

        /// <summary>
        /// Հաճախորդի էլ. հասցեներ
        /// </summary>
        public List<string> EmailList { get; set; }

        /// <summary>
        /// Հաճախորդի հեռախոսահամարներ
        /// </summary>
        public List<CustomerPhone> PhoneList { get; set; }

        /// <summary>
        /// Սոց. քարտի համար
        /// </summary>
        public string SocCardNumber { get; set; }

        /// <summary>
        /// ՀԾՀ չունենալու մասին տեղեկանքի համար
        /// </summary>
        public string NoSocCardNumber { get; set; }

        /// <summary>
        /// ՀՎՀՀ
        /// </summary>
        public string TaxCode { get; set; }

        /// <summary>
        /// Անձնագրի համար
        /// </summary>
        public string PassportNumber { get; set; }

        /// <summary>
        /// Հիմնական փաստաթղթի համար
        /// </summary>
        public string DocumentNumber { get; set; }

        /// <summary>
        /// Հիմնական հասցե
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Հիմնական հասցե (ոչ UNICODE)
        /// </summary>
        public string AddressNonUnicode { get; set; }

        /// <summary>
        /// Երկիր
        /// </summary>
        public string Country { get; set; }

        ///<summary>
        ///Բանկային գաղտնաբառ
        ///</summary>
        public string SecurityCode { get; set; }

        /// <summary>
        /// Ունիկալ համար
        /// </summary>
        public uint IdentityID { get; set; }

        /// <summary>
        /// Հաճախորդի հիմանական փաստաթղթի ID (իրավ. անձանց դեպքում Ստորագրության նմուշ տեսակի փաստաթղթի ID)
        /// </summary>
        public ulong DefaultDocumentID { get; set; }
        /// <summary>
        /// Հաճախորդի տվյալների թարմացման վերջին ամսաթիվը
        /// </summary>
        public DateTime? LastDate { get; set; }

        /// <summary>
        /// Կապը բանկի հետ
        /// </summary>
        public int Link { get; set; }

        /// <summary>
        /// Հաճախորդի տվյալների չեն թարմացվել
        /// </summary>
        public byte UpdateExpired { get; set; }

        /// <summary>
        /// Հաճախորդի ծննդյան օրն է
        /// </summary>
        public byte IsBirthdayToday { get; set; }

        /// <summary>
        /// Անձնագրի տրման ա/թ
        /// </summary>
        public string PassportGivenDate { get; set; }

        /// <summary>
        /// Ում կողմից է տրվել անձնագիրը
        /// </summary>
        public string PassportGivenBy { get; set; }

        /// <summary>
        /// ö³ëï³ÃÕÃÇ տրման ա/թ
        /// </summary>
        public string DocumentGivenDate { get; set; }

        /// <summary>
        /// Փաստաթղթի գործողության ավարտի ամսաթիվ
        /// </summary>
        public string DocumentExpirationDate { get; set; }

        /// <summary>
        /// Ում կողմից է տրվել ÷³ëï³ÃáõÕÃÁ
        /// </summary>
        public string DocumentGivenBy { get; set; }

        /// <summary>
        /// Փաստաթղթի թողարկման երկիր
        /// </summary>
        public StringKeyValue DocumentCountry { get; set; }

        /// <summary>
        /// Փաստաթղթի տեսակ
        /// </summary>
        public KeyValue DocumentType { get; set; }

        /// <summary>
        /// VIP տեսակ
        /// </summary>
        public short VipTypeId { get; set; }

        /// <summary>
        /// VIP տեսակի նկարագրություն
        /// </summary>
        public string VipType { get; set; }


        /// <summary>
        /// Ռիսկայնություն
        /// </summary>
        public string RiskQuality { get; set; }

        /// <summary>
        /// Մահվան ա/թ
        /// </summary>
        public DateTime? DeathDate { get; set; }

        /// <summary>
        /// Մահվան վկայականի համարը
        /// </summary>
        public string DeathDocument { get; set; }

        /// <summary>
        /// Գրանցման հասցե
        /// </summary>
        public string RegistrationAddress { get; set; }

        /// <summary>
        /// Սեռը
        /// </summary>
        public short Gender { get; set; }

        /// <summary>
        /// Ամուսնական կարգավիճակ
        /// </summary>
        public short MaritalStatus { get; set; }

        /// <summary>
        /// Ամուսնական կարգավիճակի նկարագրություն
        /// </summary>
        public string MaritalStatusDescription { get; set; }

        /// <summary>
        /// Հաճախորդի հասցեներ (key: հասցեի տեսակ, value: հասցե)
        /// </summary>
        public List<KeyValuePair<short, string>> AddressList { get; set; }

        /// <summary>
        /// Հիմնական փաստաթղթին կցված սկանի նշում (իրավ. անձանց դեպքում ստորագրության նմուշ)
        /// </summary>
        public bool HasDefaultAttachment { get; set; }


        /// <summary>
        /// Կցված է հաճախորդին KYC թե ոչ
        /// </summary>
        public bool HasKYC { get; set; }

                /// <summary>
        /// Տնորենի հաճախորդի համար և անուն ազգանուն
        /// </summary>
        public KeyValuePair<ulong, string> OrganisationDirector { get; set; }

        /// <summary>
        /// Խորհրդատու ՊԿ
        /// </summary>
        public CustomerServingEmployee ServingEmployee { get; set; }


        /// <summary>
        /// Փոխկապակցված անձանց առկայության նշում
        /// </summary>
        public bool HasLinkedPersons { get; set; }
        /// <summary>
        /// Հիմնական աշխատավայրը
        /// </summary>
        public Employment Employment { get; set; }

        /// <summary>
        /// ԳՓՄ անդամակցության նշում
        /// </summary>
        public bool IsGPMMember { get; set; } = false;
        /// <summary>
        /// Հաճախորդը ունի արգելքներ թե ոչ
        /// </summary>
        public bool HasArrests { get; set; } = false;

        /// <summary>
        /// Հաճախորդի զբաղվածություն
        /// </summary>
        public string Occupation { get; set; }

        /// <summary>
        /// Ծննդավայր
        /// </summary>
        public string BirthPlaceName { get; set; }

        /// <summary>
        /// Հաճախորդի փոստային կոդ
        /// </summary>
        public string PostCode { get; set; }

        /// <summary>
        /// Հաճախորդը զորակոչված է
        /// </summary>
        public bool IsSoldier { get; set; }

        public void Get(ulong customerNumber)
        {
            Customer customer = ACBAOperationService.GetCustomerData(customerNumber); 

            if (customer != null)
            {
                this.CustomerNumber = customer.customerNumber;
                this.FilialCode = customer.filial.key;
                this.FilialName = Utility.ConvertAnsiToUnicode(customer.filial.value);
                this.CustomerType = customer.customerType.key;
                this.Quality = customer.quality.key;
                this.QualityDescription = customer.quality.value;
                this.Residence = customer.residence.key;
                this.ResidenceCountry = customer.residenceCountry;
                this.LastDate = customer.LastDate;
                this.Link = customer.link.key;
                this.SecurityCode = customer.securityCode;
                this.IdentityID = customer.identityId;
                List<CustomerAddress> addressList;
                List<CustomerEmail> emailList;
                List<CustomerPhone> phoneList;

                if (customer.vipInfo != null && customer.vipInfo.vipType != null)
                {
                    this.VipType = customer.vipInfo.vipType.value;
                    this.VipTypeId = customer.vipInfo.vipType.key;
                }

                if (customer.riskQuality != null && customer.riskQuality.key == 3)
                {
                    this.RiskQuality = customer.riskQuality.value;
                }

                HasLinkedPersons = false;
                if (customer.linkedCustomerList != null && customer.linkedCustomerList.Count>0)
                {
                    HasLinkedPersons = true;
                }

                if (customer.GPM != null && customer.GPM.id != 0)
                {
                    IsGPMMember = true;
                }

                if (customer.customerType.key == 6)
                {
                    PhysicalCustomer physicalCustomer = (PhysicalCustomer)customer;
                    Person person = physicalCustomer.person;
                    CustomerDocument pass = new CustomerDocument();
                    this.FirstName = person.fullName.firstName;
                    this.LastName = person.fullName.lastName;
                    this.FirstNameEng = person.fullName.firstNameEng;
                    this.LastNameEng = person.fullName.lastNameEng;
                    this.MiddleName = person.fullName.MiddleName;
                    this.BirthDate = person.birthDate;
                    this.PassportNumber = physicalCustomer.passportNumber;
                    this.Employment = person.employmentList.FirstOrDefault(e => e.EmploymentType.key == 1);

                    this.Occupation = Utility.ConvertAnsiToUnicode(person.occupation);

                    if (person.birthPlace != null)
                    {
                        Dictionary<string, string> countries = InfoService.GetCountries();
                        this.BirthPlaceName = countries.FirstOrDefault(c => c.Key.Equals(person.birthPlace.key)).Value;
                    }

                    pass = person.documentList.Find(cd => cd.documentNumber == this.PassportNumber && cd.documentType.key==1);
                    if (pass != null)
                    {
                        this.PassportGivenBy = pass.givenBy;
                        this.PassportGivenDate = String.Format("{0:dd/MM/yy}", pass.givenDate);
                    }
                    else
                    {
                        this.PassportNumber = null;
                    }

                    this.DocumentNumber = physicalCustomer.DefaultDocument;

                    pass = person.documentList.Find(cd => cd.documentNumber == this.DocumentNumber && cd.defaultSign);
                    HasDefaultAttachment = false;

                    if (pass.attachmentList != null && pass.attachmentList.Count > 0)
                    {
                        HasDefaultAttachment = true;
                    }

                    if (person.documentList != null && person.documentList.Exists(m => m.documentType.key == 39)
                        && person.documentList.FindAll(m => m.documentType.key == 39).Exists(m=>m.attachmentList?.Count>0))
                    {
                        this.HasKYC = true;
                    }

                    if (person.documentList.FindAll(cd => cd.documentNumber == this.DocumentNumber).Count > 0)
                    {
                        this.DefaultDocumentID = pass.id;

                    }

                    this.DocumentGivenBy = pass.givenBy;
                    this.DocumentGivenDate = String.Format(CultureInfo.InvariantCulture, "{0:dd/MM/yy}", pass.givenDate); //pass.givenDate.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
                    this.DocumentExpirationDate = String.Format(CultureInfo.InvariantCulture, "{0:dd/MM/yy}", pass.validDate);

                    this.DocumentCountry = pass.documentCountry;
                    this.DocumentType = pass.documentType;


                    this.SocCardNumber = "";
                    this.NoSocCardNumber = "";
                    if (person.documentList != null)
                    {
                        if (person.documentList.Find(cd => cd.documentType.key == 56) != null)
                            this.SocCardNumber = person.documentList.Find(cd => cd.documentType.key == 56).documentNumber;
                        else if (person.documentList.Find(cd => cd.documentType.key == 57) != null)
                            this.NoSocCardNumber = Utility.ConvertAnsiToUnicode(person.documentList.Find(cd => cd.documentType.key == 57).documentNumber);
                        if (person.documentList.Find(cd => cd.documentType.key == 19) != null)
                             this.TaxCode= Utility.ConvertAnsiToUnicode(person.documentList.Find(cd => cd.documentType.key == 19).documentNumber);
                    }

                    this.DeathDate = person.deathDate;

                    pass = person.documentList.Find(cd => cd.documentType.key == 22);
                    if (pass != null)
                    {

                        this.DeathDocument = pass.documentNumber + " " + Convert.ToDateTime(pass.givenDate).ToString("dd/MM/yyyy");
                    }

                    addressList = person.addressList;
                    emailList = person.emailList;
                    phoneList = person.PhoneList;
                    Gender = person.gender.key;
                    MaritalStatus = person.maritalStatus.key;
                    MaritalStatusDescription = GetCustomerMaritalStatusDescription(MaritalStatus, Gender);

                }
                else
                {
                    LegalCustomer legalCustomer = (LegalCustomer)customer;
                    Organisation organisation = legalCustomer.Organisation;
                    this.OrganisationName = organisation.Description;
                    this.OrganisationNameEng = customer.customerType.key == 2 ? "Private entrepreneur " + organisation.DescriptionEnglish : organisation.DescriptionEnglish;
                    this.TaxCode = Utility.ConvertAnsiToUnicode(legalCustomer.CodeOfTax);

                    addressList = organisation.addressList;
                    emailList = organisation.emailList;
                    phoneList = organisation.phoneList;

                    CustomerDocument signature = new CustomerDocument();
                    signature = organisation.documentList.Find(cd => cd.documentType.key == 28);
                    HasDefaultAttachment = false;

                    //Ստորագրության նմուշ
                    if (signature != null)
                    {
                        this.DefaultDocumentID = signature.id;
                        if (signature.attachmentList != null && signature.attachmentList.Count > 0)
                        {
                            HasDefaultAttachment = true;
                        }
                    }

                    if (organisation.documentList != null && organisation.documentList.Exists(m => m.documentType.key == 39)
                       && organisation.documentList.FindAll(m => m.documentType.key == 39).Exists(m => m.attachmentList?.Count > 0))
                    {
                        this.HasKYC = true;
                    }


                    if (customer.linkedCustomerList != null && customer.linkedCustomerList.Exists(m => m.linkType.key == 4))
                    {

                        ulong directorCustomerNumber = customer.linkedCustomerList.Find(m => m.linkType.key == 4).linkedCustomerNumber;

                        string directorName = ACBAOperationService.GetCustomerDescription(directorCustomerNumber);
                        directorName = Utility.ConvertAnsiToUnicode(directorName);
                        OrganisationDirector = new KeyValuePair<ulong, string>(key: directorCustomerNumber, value: directorName);
                    }
                }

                CustomerAddress defaultAddress = addressList.Find(m => m.priority.key == 1);

                if (defaultAddress != null)
                {
                    this.Address = GenerateAddress(defaultAddress);
                    this.PostCode = defaultAddress.address.PostCode;
                }

                if (addressList.Count > 0 && addressList.Exists(m => m.addressType.key == 2))
                {
                    CustomerAddress regAddress = addressList.Find(m => m.addressType.key == 2);
                    this.Country = regAddress.address.Country.key.ToString();
                    this.RegistrationAddress = GenerateAddress(regAddress);
                }

                this.AddressList = new List<KeyValuePair<short, string>>();
                if (addressList.Count > 0)
                {
                    addressList.ForEach(m =>
                    {
                        this.AddressList.Add(new KeyValuePair<short, string>(key: m.addressType.key, value: Utility.ConvertAnsiToUnicode(GenerateAddress(m))));
                    });
                }


                if (emailList != null && emailList.Count > 0)
                {
                    this.EmailList = new List<string>();
                    emailList.ForEach(m => this.EmailList.Add(m.email.emailAddress));
                }

                if (phoneList != null && phoneList.Count > 0)
                {
                    this.PhoneList = phoneList;
                }

                this.AddressNonUnicode = this.Address;
                this.FirstNameNonUnicode = this.FirstName;
                this.LastNameNonUnicode = this.LastName;
                this.OrganisationNameNonUnicode = this.OrganisationName;

                this.FirstName = Utility.ConvertAnsiToUnicode(this.FirstName);
                this.LastName = Utility.ConvertAnsiToUnicode(this.LastName);
                this.MiddleName = Utility.ConvertAnsiToUnicode(this.MiddleName);
                this.OrganisationName = Utility.ConvertAnsiToUnicode(this.OrganisationName);
                this.Address = Utility.ConvertAnsiToUnicode(this.Address);
                this.RegistrationAddress = Utility.ConvertAnsiToUnicode(this.RegistrationAddress);
                this.DocumentNumber = Utility.ConvertAnsiToUnicode(this.DocumentNumber);
                this.DocumentGivenBy = Utility.ConvertAnsiToUnicode(this.DocumentGivenBy);
                if (this.PassportNumber != null)
                {
                    this.PassportNumber = Utility.ConvertAnsiToUnicode(this.PassportNumber);
                }

                ServingEmployee = new CustomerServingEmployee();

                if (customer.servingEmployeeList != null && customer.servingEmployeeList.Exists(m => m.type.key == 2))
                {
                    ServingEmployee = customer.servingEmployeeList.Find(m => m.type.key == 2);
                    ServingEmployee.type.value = Utility.ConvertAnsiToUnicode(ServingEmployee.type.value);
                    ServingEmployee.servingEmployee.firstName = Utility.ConvertAnsiToUnicode(ServingEmployee.servingEmployee.firstName);
                    ServingEmployee.servingEmployee.lastName = Utility.ConvertAnsiToUnicode(ServingEmployee.servingEmployee.lastName);
                }

                this.UpdateExpired = ACBAOperationService.CheckCustomerUpdateExpired(customerNumber);
                this.IsBirthdayToday = ACBAOperationService.CheckBirthDayOfCustomer(customerNumber);
                this.HasArrests = ACBAOperationService.HasCustomerArrests(customerNumber);
                this.IsSoldier = ACBAOperationService.CheckCustomerIsSoldier(customerNumber);
            }
        }
        
        internal static string GenerateAddress(CustomerAddress address)
        {
            string result = "";

            if (address.address.Region != null && address.address.Region.value != "")
            {
                result = address.address.Region.value;
            }

            if (address.address.TownVillage != null && address.address.TownVillage.value != "")
            {
                result += ", " + address.address.TownVillage.value;
            }

            if (address.address.Street != null && address.address.Street.value != "")
            {
                result += "," + address.address.Street.value;
            }

            //if (address.address.Building != null && address.address.Building.value != "")
            //{
            //    result +=", "+ address.address.Building.value;
            //}

            if (address.address.House != null && address.address.House != "")
            {
                result += ", " + address.address.House;
            }

            if (address.address.Appartment != null && address.address.Appartment != "")
            {
                result += ", " + address.address.Appartment;
            }

            if (result[0] == ',')
            {
                result.Remove(0, 2);
            }
            return result;

        }

        public static string GetCustomerMaritalStatusDescription(short maritalStatus, short gender)
        {
            if (maritalStatus == 1)
            {
                return "Ամուսնացած";
            }
            else if (maritalStatus == 2)
            {
                return "Ամուսնացած (չգրանցված)";
            }
            else if (maritalStatus == 3)
            {
                return "Ամուսնալուծված";
            }
            else if (maritalStatus == 4)
            {
                if (gender == 1)
                {
                    return "Ամուրի";
                }
                else
                {
                    return "Այրի";
                }

            }
            else if (maritalStatus == 5)
            {
                return "Չամուսնացած";
            }
            else
            {
                return "Ամուսնական կարգավիճակը նշված չէ";
            }
        }

        }
    }
