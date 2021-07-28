using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.ACBAServiceReference;
using FrontOffice.XBSInfo;
using System.ServiceModel;
using FrontOffice.Filters;

namespace FrontOffice.Service
{
    public class InfoService
    {
        public static Dictionary<string, string> GetEmbassyList(List<ushort> referenceTypes)
        {
            if (referenceTypes != null)
            {
                string cacheKey;
                if (referenceTypes.Count > 1 && referenceTypes.Contains(9))
                {
                    cacheKey = "Info_EmbassyList1";
                }
                else if (referenceTypes.Count == 1 && referenceTypes.Contains(9))
                {
                    cacheKey = "Info_EmbassyList2";
                }
                else
                {
                    cacheKey = "Info_EmbassyList3";
                }
                Dictionary<string, string> embassyList = CacheHelper.GetDictionary(cacheKey);

                if (embassyList == null)
                {
                    InfoService.Use(client =>
                    {
                        embassyList = client.GetEmbassyList(referenceTypes);
                        CacheHelper.Add(embassyList, cacheKey);
                    });
                }

                return embassyList;
            }

            return new Dictionary<string, string>();
        }

        public static Dictionary<string, string> GetReferenceLanguages()
        {
            string cacheKey = "Info_ReferenceLanguages";

            Dictionary<string, string> languages = CacheHelper.GetDictionary(cacheKey);

            if (languages == null)
            {
                InfoService.Use(client =>
                {
                    languages = client.GetReferenceLanguages();
                    CacheHelper.Add(languages, cacheKey);
                });
            }

            return languages;
        }

        public static List<KeyValuePairOflongstring> GetReferenceTypes()
        {
            string cacheKey = "Info_ReferenceTypes";

            List<KeyValuePairOflongstring> referenceTypes = CacheHelper.Get<List<KeyValuePairOflongstring>>(cacheKey);

            if (referenceTypes == null)
            {
                InfoService.Use(client =>
                {
                    referenceTypes = client.GetReferenceTypes();
                    CacheHelper.Add<List<KeyValuePairOflongstring>>(referenceTypes, cacheKey);
                });
            }

            return referenceTypes;
        }

        public static List<KeyValuePairOflongstring> GetFilialAddressList()
        {
            string cacheKey = "Info_FilialAddressList";

            List<KeyValuePairOflongstring> filialList = CacheHelper.Get<List<KeyValuePairOflongstring>>(cacheKey);

            if (filialList == null)
            {
                InfoService.Use(client =>
                {
                    filialList = client.GetFilialAddressList();
                    CacheHelper.Add<List<KeyValuePairOflongstring>>(filialList, cacheKey);
                });
            }

            return filialList;
        }

        public static Dictionary<string, string> GetCashOrderTypes()
        {
            string cacheKey = "Info_CashOrderTypes";

            Dictionary<string, string> cashTypes = CacheHelper.GetDictionary(cacheKey);

            if (cashTypes == null)
            {
                InfoService.Use(client =>
                {
                    cashTypes = client.GetCashOrderTypes();
                    CacheHelper.Add(cashTypes, cacheKey);
                });
            }

            return cashTypes;
        }

        public static List<KeyValuePair<short, string>> GetUtilityPaymentTypes()
        {
            List<KeyValuePair<short, string>> paymentTypes = new List<KeyValuePair<short, string>>();

            paymentTypes.Add(new KeyValuePair<short, string>(key: 3, value: "Հայաստանի էլեկտրական ցանցեր"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 4, value: "Գազպրոմ Հայաստան"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 6, value: "Վեոլիա Ջուր"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 7, value: "Բիլայն"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 8, value: "ՄՏՍ ՀԱՅԱՍՏԱՆ"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 9, value: "Աղբահանություն"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 10, value: "Ucom բջջային"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 11, value: "UCom"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 12, value: "Ընդհանուր որոնում հեռախոսով"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 13, value: "Հեռախոսավարձի գանձում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 14, value: "ՋՕԸ "));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 17, value: "Բիլայն Ինտերնետ"));

            return paymentTypes;

        }
        public static Dictionary<string, string> GetCurrencies()
        {
            string cacheKey = "Info_Currency";

            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {
                InfoService.Use(client =>
                {
                    currencies = client.GetCurrencies();
                    CacheHelper.Add(currencies, cacheKey);
                });
            }

            return currencies;
        }

        //public static Dictionary<string, string> GetDepositCurrencies()
        //{
        //    string cacheKey = "Info_DepositCurrency";

        //    Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

        //    if (currencies == null)
        //    {
        //        InfoService.Use(client =>
        //        {
        //            currencies = client.GetDepositCurrencies();
        //            CacheHelper.Add(currencies, cacheKey);
        //        });
        //    }

        //    return currencies;
        //}

        //public static Dictionary<string, string> GetDepositTypes()
        //{
        //    string cacheKey = "Info_DepositTypes";

        //    Dictionary<string, string> depsoitTypes = CacheHelper.GetDictionary(cacheKey);

        //    if (depsoitTypes == null)
        //    {
        //        InfoService.Use(client =>
        //        {
        //            depsoitTypes = client.GetDepositTypes();
        //            CacheHelper.Add(depsoitTypes, cacheKey);
        //        });
        //    }

        //    return depsoitTypes;
        //}


        public static List<KeyValuePair<string, string>> GetCashOrderCurrencies()
        {

            string cacheKey = "Info_CashOrderCurrency";
            List<KeyValuePair<string, string>> currencies = CacheHelper.GetObjectList(cacheKey);

            if (currencies == null)
            {
                currencies = new List<KeyValuePair<string, string>>();

                InfoService.Use(client =>
                {
                    Dictionary<string, string> currenciesDict = client.GetCurrencies();

                    for (int i = 0; i < currenciesDict.Count; i++)
                    {
                        currencies.Add(new KeyValuePair<string, string>(currenciesDict.ElementAt(i).Key, currenciesDict.ElementAt(i).Value));
                    }

                    CacheHelper.Add(currencies, cacheKey);
                });

            }

            return currencies;
        }



        public static Dictionary<string, string> GetInternationalPaymentCurrencies()
        {
            string cacheKey = "Info_InternationalPaymentCurrencies";
            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {

                InfoService.Use(client =>
                {
                    currencies = client.GetInternationalPaymentCurrencies();
                    CacheHelper.Add(currencies, cacheKey);
                });

            }
            return currencies;

        }
        public static Dictionary<string, string> GetActiveDepositTypes()
        {
            string cacheKey = "Info_ActiveDepositTypes";

            Dictionary<string, string> depositTypes = CacheHelper.GetDictionary(cacheKey);

            if (depositTypes == null)
            {
                InfoService.Use(client =>
                {
                    depositTypes = client.GetActiveDepositTypes();
                    CacheHelper.Add(depositTypes, cacheKey);
                });
            }

            return depositTypes;
        }

        public static Dictionary<string, string> GetActiveDepositTypesForNewDepositOrder(int accountType, int customerType)
        {
            Dictionary<string, string> depositTyepes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                depositTyepes = client.GetActiveDepositTypesForNewDepositOrder(accountType, customerType);
            });

            return depositTyepes;
        }


        public static Dictionary<string, string> GetStatementFrequency()
        {
            string cacheKey = "Info_StatementFrequency";

            Dictionary<string, string> frequency = CacheHelper.GetDictionary(cacheKey);

            if (frequency == null)
            {
                InfoService.Use(client =>
                {
                    frequency = client.GetStatementFrequency();
                    CacheHelper.Add(frequency, cacheKey);
                });
            }

            return frequency;
        }

        public static Dictionary<string, string> GetOrderTypes()
        {
            string cacheKey = "Info_OrderTypes";

            Dictionary<string, string> orderTypes = CacheHelper.GetDictionary(cacheKey);

            if (orderTypes == null)
            {
                InfoService.Use(client =>
                {
                    orderTypes = client.GetOrderTypes();
                    orderTypes.Add("0", "Բոլորը");
                    CacheHelper.Add(orderTypes, cacheKey);
                });
            }

            return orderTypes;
        }

        public static Dictionary<string, string> GetDepositTypeCurrency(short depositType)
        {
            Dictionary<string, string> currency = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                currency = client.GetDepositTypeCurrency(depositType);
            });
            return currency;


        }

        public static int ClearAllCache()
        {
            var enumerator = System.Web.HttpRuntime.Cache.GetEnumerator();
            List<string> keys = new List<string>();
            while (enumerator.MoveNext())
            {
                keys.Add(enumerator.Key.ToString());
            }

            for (int i = 0; i < keys.Count; i++)
            {
                HttpRuntime.Cache.Remove(keys[i]);
            }


            InfoService.Use(client =>
            {
                client.ClearAllCache();
            });
            return 1;
        }

        public static Dictionary<string, string> GetCardSystemTypes()
        {
            string cacheKey = "Info_CardSystemTypes";

            Dictionary<string, string> cardSystemTypes = CacheHelper.GetDictionary(cacheKey);

            if (cardSystemTypes == null)
            {
                InfoService.Use(client =>
                {
                    cardSystemTypes = client.GetCardSystemTypes();
                    CacheHelper.Add(cardSystemTypes, cacheKey);
                });
            }

            return cardSystemTypes;
        }





        public static Dictionary<string, string> GetCardTypes(int cardSystem)
        {
            Dictionary<string, string> cardTypes = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                cardTypes = client.GetCardTypes(cardSystem);
            });
            return cardTypes;
        }

        public static Dictionary<string, string> GetAllCardTypes(int cardSystem)
        {
            Dictionary<string, string> openCardTypes = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                openCardTypes = client.GetAllCardTypes(cardSystem);
            });
            return openCardTypes;
        }

        public static Dictionary<string, string> SearchRelatedOfficeTypes(string officeId, string officeName)
        {

            Dictionary<string, string> relatedOfficeTypes = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                relatedOfficeTypes = client.SearchRelatedOfficeTypes(officeId, officeName);
            });

            return relatedOfficeTypes;
        }
        public static Dictionary<string, string> GetPeriodicsSubTypes()
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetPeriodicsSubTypes(Languages.hy);
            });
            return types;
        }
        public static Dictionary<string, string> GetPeriodicUtilityTypes()
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetPeriodicUtilityTypes(Languages.hy);
            });
            return types;
        }

        public static Dictionary<string, string> GetFilialList()
        {
            string cacheKey = "Info_FilialList";

            Dictionary<string, string> filialList = CacheHelper.GetDictionary(cacheKey);

            if (filialList == null)
            {
                InfoService.Use(client =>
                {
                    filialList = client.GetFilialList();
                    CacheHelper.Add(filialList, cacheKey);
                });
            }

            return filialList;
        }

        public static Dictionary<string, string> GetCardClosingReasons()
        {
            string cacheKey = "Info_CardClosingReasons";

            Dictionary<string, string> closingReasons = CacheHelper.GetDictionary(cacheKey);

            if (closingReasons == null)
            {
                InfoService.Use(client =>
                {
                    closingReasons = client.GetCardClosingReasons();
                    CacheHelper.Add(closingReasons, cacheKey);
                });
            }

            return closingReasons;
        }
        public static Dictionary<string, string> GetPeriodicityTypes()
        {
            Dictionary<string, string> periodicityTypes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                periodicityTypes = client.GetPeriodicityTypes();
            });

            return periodicityTypes;
        }

        public static Dictionary<string, string> GetJointTypes()
        {
            Dictionary<string, string> jointTypes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                jointTypes = client.GetJointTypes();
            });

            return jointTypes;
        }

        public static Dictionary<string, string> GetStatementDeliveryTypes()
        {

            string cacheKey = "Info_StatementDeliveryTypes";

            Dictionary<string, string> deliveryTypes = CacheHelper.GetDictionary(cacheKey);

            if (deliveryTypes == null)
            {
                InfoService.Use(client =>
                {
                    deliveryTypes = client.GetStatementDeliveryTypes();
                    CacheHelper.Add(deliveryTypes, cacheKey);
                });
            }

            return deliveryTypes;
        }
        public static List<Country> GetCountryList()
        {

            string cacheKey = "Info_CountryList";
            List<Country> countries = CacheHelper.Get<List<Country>>(cacheKey);

            if (countries == null)
            {
                ACBAOperationService.Use(client =>
                {
                    countries = client.GetCountryList();
                    countries.Where(s => s.AddInf != "").ToList().ForEach(s => s.AddInf = Utility.ConvertAnsiToUnicode(s.AddInf));
                    CacheHelper.Add<List<Country>>(countries, cacheKey);
                });
            }

            return countries;

        }

        public static Dictionary<string, string> GetCountries()
        {

            string cacheKey = "Info_Countries";
            Dictionary<string, string> countries = CacheHelper.GetDictionary(cacheKey);

            if (countries == null)
            {
                InfoService.Use(client =>
                {
                    countries = client.GetCountries();
                    CacheHelper.Add(countries, cacheKey);
                });
            }

            return countries;

        }

        public static Dictionary<string, string> GetAccountOrderFeeChanrgesTypes()
        {
            Dictionary<string, string> feeTypes = new Dictionary<string, string>();
            feeTypes.Add("0", "Բացակայում է");
            feeTypes.Add("1", "Կանխիկ");
            feeTypes.Add("2", "Անկանխիկ");
            return feeTypes;
        }

        public static Dictionary<string, string> GetOperationsList()
        {

            string cacheKey = "Info_OperationsList";

            Dictionary<string, string> operations = CacheHelper.GetDictionary(cacheKey);

            if (operations == null)
            {
                InfoService.Use(client =>
                {
                    operations = client.GetOperationsList();
                });

                CacheHelper.Add(operations, cacheKey);
            }

            return operations;
        }


        public static Dictionary<string, string> GetBankOperationFeeTypes(int type)
        {
            Dictionary<string, string> bankOperationFeeTypes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {

                bankOperationFeeTypes = client.GetBankOperationFeeTypes(type);
            });
            return bankOperationFeeTypes;
        }

        public static Dictionary<string, string> GetAccountStatuses()
        {
            string cacheKey = "Info_AccountStatuses";

            Dictionary<string, string> accountStatuses = CacheHelper.GetDictionary(cacheKey);

            if (accountStatuses == null)
            {
                InfoService.Use(client =>
                {
                    accountStatuses = client.GetAccountStatuses();
                    CacheHelper.Add(accountStatuses, cacheKey);

                });
            }
            return accountStatuses;
        }



        public static Dictionary<string, string> GetTransitAccountTypes(bool forLoanMature)
        {
            Dictionary<string, string> transitAccountTypes = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                transitAccountTypes = client.GetTransitAccountTypes(forLoanMature);
            });
            return transitAccountTypes;
        }


        public static Dictionary<string, string> GetAccountFreezeReasonsTypes()
        {
            string cacheKey = "Info_FreezeReasonsTypes";

            Dictionary<string, string> freezeReasonsTypes = CacheHelper.GetDictionary(cacheKey);

            if (freezeReasonsTypes == null)
            {
                InfoService.Use(client =>
                {
                    freezeReasonsTypes = client.GetAccountFreezeReasonsTypes();
                });

                CacheHelper.Add(freezeReasonsTypes, cacheKey);
            }
            return freezeReasonsTypes;
        }

        public static string GetInfoFromSwiftCode(string swiftCode, short type)
        {
            string infoFromSwiftCode = "";

            InfoService.Use(client =>
            {
                infoFromSwiftCode = client.GetInfoFromSwiftCode(swiftCode, type);
            }
          );

            return infoFromSwiftCode;
        }

        public static string GetCountyRiskQuality(string country)
        {
            string infoFromSwiftCode = "";

            InfoService.Use(client =>
            {
                infoFromSwiftCode = client.GetCountyRiskQuality(country);
            }
          );

            return infoFromSwiftCode;
        }

        public static Dictionary<string, string> GetAccountFreezeStatuses()
        {
            string cacheKey = "Info_AccountFreezeStatuse";

            Dictionary<string, string> accountFreezeStatuses = CacheHelper.GetDictionary(cacheKey);

            if (accountFreezeStatuses == null)
            {
                accountFreezeStatuses = new Dictionary<string, string>();
                accountFreezeStatuses.Add("0", "Բոլորը");
                accountFreezeStatuses.Add("1", "Գործող");
                accountFreezeStatuses.Add("2", "Փակված");
                CacheHelper.Add(accountFreezeStatuses, cacheKey);
            }

            return accountFreezeStatuses;
        }

        public static List<KeyValuePair<string, string>> GetAutoConfirmOrderTypes()
        {

            string cacheKey = "Info_AutoConfirmOrderTypes";
            List<KeyValuePair<string, string>> autoconfirmTypes = CacheHelper.GetObjectList(cacheKey);

            if (autoconfirmTypes == null)
            {
                autoconfirmTypes = new List<KeyValuePair<string, string>>();
                InfoService.Use(client =>
                {
                    List<XBSInfo.KeyValuePairOfintint> typesDict = client.GetAutoConfirmOrderTypes();

                    for (int i = 0; i < typesDict.Count; i++)
                    {

                        autoconfirmTypes.Add(new KeyValuePair<string, string>(typesDict[i].key.ToString(), typesDict[i].value.ToString()));
                    }

                    CacheHelper.Add(autoconfirmTypes, cacheKey);
                });
            }

            return autoconfirmTypes;
        }

        public static Dictionary<string, string> GetLTACodes()
        {
            string cacheKey = "Info_LTACodes";

            Dictionary<string, string> LTACodes = CacheHelper.GetDictionary(cacheKey);

            if (LTACodes == null)
            {
                InfoService.Use(client =>
                {
                    LTACodes = client.GetLTACodes();
                });

                CacheHelper.Add(LTACodes, cacheKey);
            }
            return LTACodes;
        }

        public static Dictionary<string, string> GetPoliceCodes(string accountNumber = "")
        {
            Dictionary<string, string> PoliceCodes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                PoliceCodes = client.GetPoliceCodes(accountNumber);
            }
           );

            return PoliceCodes;
        }

        public static Dictionary<string, string> GetSyntheticStatuses()
        {
            Dictionary<string, string> SyntheticStatuses = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                SyntheticStatuses = client.GetSyntheticStatuses();
            }
           );

            return SyntheticStatuses;
        }


        public static string GetSyntheticStatus(string value)
        {
            string syntheticStatus = "";
            InfoService.Use(client =>
            {
                syntheticStatus = client.GetSyntheticStatus(value);
            });
            return syntheticStatus;
        }

        public static Dictionary<string, string> GetCommunalBranchList(CommunalTypes communalType)
        {
            string cacheKey = "Info_CommunalBranchList_" + communalType.ToString();

            Dictionary<string, string> communalBranchTypes = CacheHelper.GetDictionary(cacheKey);

            if (communalBranchTypes == null)
            {
                InfoService.Use(client =>
                {
                    communalBranchTypes = client.GetCommunalBranchList(communalType, Languages.hy);
                    foreach (var k in communalBranchTypes.Keys.ToList())
                    {
                        communalBranchTypes[k] = k + ' ' + communalBranchTypes[k];
                    }
                });

                CacheHelper.Add(communalBranchTypes, cacheKey);
            }



            return communalBranchTypes;
        }


        public static Dictionary<string, string> GetCurrentAccountCurrencies()
        {
            string cacheKey = "Info_CurrentAccountCurrency";

            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {
                InfoService.Use(client =>
                {
                    currencies = client.GetCurrentAccountCurrencies();
                    CacheHelper.Add(currencies, cacheKey);
                });
            }

            return currencies;
        }


        public static Dictionary<string, string> GetTransferCallQuality()
        {
            string cacheKey = "Info_TransferCallQuality";

            Dictionary<string, string> transferQuality = CacheHelper.GetDictionary(cacheKey);

            if (transferQuality == null)
            {
                InfoService.Use(client =>
                {
                    transferQuality = client.GetTransferCallQuality();
                    CacheHelper.Add(transferQuality, cacheKey);
                });
            }

            return transferQuality;
        }

        public static Dictionary<string, string> GetTransferTypes(short isActive)
        {
            Dictionary<string, string> transferTypes = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                transferTypes = client.GetTransferTypes(isActive);
            });
            return transferTypes;
        }

        public static Dictionary<string, string> GetAllTransferTypes()
        {
            string cacheKey = "Info_AllTransferTypes";

            Dictionary<string, string> transferTypes = CacheHelper.GetDictionary(cacheKey);

            if (transferTypes == null)
            {
                InfoService.Use(client =>
                {
                    transferTypes = client.GetAllTransferTypes();
                    CacheHelper.Add(transferTypes, cacheKey);
                });
            }

            return transferTypes;
        }

        public static string GetBank(int code)
        {
            string bankName = "";
            InfoService.Use(client =>
            {
                bankName = client.GetBank(code, Languages.hy);
            });
            return bankName;
        }


        public static Dictionary<string, string> GetTransferSystemCurrency(short transferSystem)
        {
            Dictionary<string, string> transferSystemCurrency = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                transferSystemCurrency = client.GetTransferSystemCurrency(transferSystem);
            });
            return transferSystemCurrency;
        }


        public static Dictionary<string, string> GetServiceProvidedTypes()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            byte customerType = 0;   //Ոչ հաճախորդի սպասարկում
            if (customerNumber != 0)
            {
                customerType = ACBAOperationService.GetCustomerType(customerNumber);
            }

            string cacheKey = "";

            if (customerType != 6 && customerNumber != 0)
            {
                cacheKey = "Info_ServiceProvidedTypes_Legal";
            }
            else
            {
                cacheKey = "Info_ServiceProvidedTypes_Physical";
            }

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetServiceProvidedTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }



            if (customerType != 6 && customerNumber != 0)
            {
                types.Remove("831");
            }

            return types;
        }

        public static void Use(Action<IXBInfoService> action)
        {

            string ipAddress = HttpContext.Current.Request["REMOTE_ADDR"];

            IXBInfoService client = ProxyManager<IXBInfoService>.GetProxy(nameof(IXBInfoService));
            bool success = false;

            try
            {
                client.Init(ipAddress, 1);
                action(client);
                ((IClientChannel)client).Close();

                success = true;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (FaultException ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                ((IClientChannel)client).Close();

                throw;
            }
#pragma warning disable CS0168 // The variable 'e' is declared but never used
            catch (TimeoutException e)
#pragma warning restore CS0168 // The variable 'e' is declared but never used
            {
                ((IClientChannel)client).Close();

                throw;
            }
#pragma warning disable CS0168 // The variable 'e' is declared but never used
            catch (Exception e)
#pragma warning restore CS0168 // The variable 'e' is declared but never used
            {
                ((IClientChannel)client).Abort();

                throw;
            }
            finally
            {
                if (!success)
                {
                    ((IClientChannel)client).Abort();

                }
                ((IClientChannel)client).Dispose();
            }

            //}
        }

        public static Dictionary<string, string> GetDisputeResolutions()
        {
            string cacheKey = "Info_DisputeResolutions";

            Dictionary<string, string> disputes = CacheHelper.GetDictionary(cacheKey);

            if (disputes == null)
            {
                InfoService.Use(client =>
                {
                    disputes = client.GetDisputeResolutions();
                    CacheHelper.Add(disputes, cacheKey);
                });
            }

            return disputes;
        }

        public static Dictionary<string, string> GetCommunicationTypes()
        {
            string cacheKey = "Info_CommunicationTypes";

            Dictionary<string, string> commTypes = CacheHelper.GetDictionary(cacheKey);

            if (commTypes == null)
            {
                InfoService.Use(client =>
                {
                    commTypes = client.GetCommunicationTypes();
                    CacheHelper.Add(commTypes, cacheKey);
                });
            }

            return commTypes;
        }

        public static Dictionary<string, string> GetOrderRemovingReasons()
        {
            string cacheKey = "Info_OrderRemovingReasons";

            Dictionary<string, string> reasonTypes = CacheHelper.GetDictionary(cacheKey);

            if (reasonTypes == null)
            {
                InfoService.Use(client =>
                {
                    reasonTypes = client.GetOrderRemovingReasons();
                    CacheHelper.Add(reasonTypes, cacheKey);
                });
            }

            return reasonTypes;
        }

        public static bool IsWorkingDay(DateTime date)
        {
            bool isWorkingDay = false;
            InfoService.Use(client =>
            {
                isWorkingDay = client.IsWorkingDay(date);
            });
            return isWorkingDay;
        }

        public static List<KeyValuePair<short, string>> GetUtilityCardApplicationTypes()
        {
            List<KeyValuePair<short, string>> paymentTypes = new List<KeyValuePair<short, string>>();

            paymentTypes.Add(new KeyValuePair<short, string>(key: 1, value: "Քարտի և քարտային հաշվի տվյալներ, քարտի սպասարկման սակագ."));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 2, value: "Վերաթողարկված քարտի ստացման հաստատում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 3, value: "Քարտի փոխարինման դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 4, value: "Քարտի սահմանաչափերի փոփոխության դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 5, value: "Քարտի վերաթողարկման դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 6, value: "Կից քարտի դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 7, value: "Քարտի փակման դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 8, value: "Քարտի բլոկավորման/ապաբլոկավորման դիմում"));

            paymentTypes.Add(new KeyValuePair<short, string>(key: 10, value: "Գործարքի բողոքարկման դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 11, value: "SMS-տեղեկացում/USSD ծառայության ակտիվացման/փոփոխման/դադարեցման դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 12, value: "Վարկային գծի դադարեցման դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 13, value: "Լրացուցիչ քարտի դիմում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 14, value: "BUSINESS քարտի սպասարկումը շարունակելու դիմում"));


            paymentTypes.Add(new KeyValuePair<short, string>(key: 17, value: "Այլ տեսակի քարտով վերաթողարկված քարտի ստացման հաստատում"));
            paymentTypes.Add(new KeyValuePair<short, string>(key: 18, value: "3DSecure Email ծառայության ակտիվացման/դադարեցման դիմում"));

            paymentTypes.Add(new KeyValuePair<short, string>(key: 20, value: "«ACBA DIGITAL» ինտերնետ բանկինգ համակարգով պատվիրված քարտի ստացման հաստատում"));

            return paymentTypes;

        }

        public static List<TupleOfintintstringboolean> GetAssigneeOperationTypes(int groupId, int typeOfCustomer)
        {
            List<TupleOfintintstringboolean> opTypes = new List<TupleOfintintstringboolean>();
            InfoService.Use(client =>
            {
                opTypes = client.GetAssigneeOperationTypes(groupId, typeOfCustomer);
            });
            return opTypes;
        }

        public static Dictionary<string, string> GetAssigneeOperationGroupTypes(int typeOfCustomer)
        {
            Dictionary<string, string> commTypes = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                commTypes = client.GetAssigneeOperationGroupTypes(typeOfCustomer);
            });
            return commTypes;
        }

        public static Dictionary<string, string> GetCredentialTypes(int typeOfCustomer, int customerFilialCode, int userFilialCode)
        {
            Dictionary<string, string> credentialTypes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                credentialTypes = client.GetCredentialTypes(typeOfCustomer, customerFilialCode, userFilialCode);
            });

            return credentialTypes;
        }

        public static Dictionary<string, string> GetCredentialClosingReasons()
        {
            string cacheKey = "Info_CredentialClosingReasons";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetCredentialClosingReasons();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static List<ActionPermission> GetActionPermissionTypes()
        {
            string cacheKey = "Info_ActionPermissionTypes";
            List<ActionPermission> actionTypes = CacheHelper.Get<List<ActionPermission>>(cacheKey);

            if (actionTypes == null)
            {

                InfoService.Use(client =>
                {
                    actionTypes = client.GetActionPermissionTypes();
                    CacheHelper.Add<List<ActionPermission>>(actionTypes, cacheKey);
                });

            }
            return actionTypes;

        }


        public static Dictionary<string, string> GetAccountClosingReasonsTypes()
        {
            string cacheKey = "Info_AccountClosingReasonsTypes";

            Dictionary<string, string> closingReasonsTypes = CacheHelper.GetDictionary(cacheKey);

            if (closingReasonsTypes == null)
            {
                InfoService.Use(client =>
                {
                    closingReasonsTypes = client.GetAccountClosingReasonsTypes();
                });

                CacheHelper.Add(closingReasonsTypes, cacheKey);
            }
            return closingReasonsTypes;
        }

        public static Dictionary<string, string> GetOrderQualityTypes()
        {
            string cacheKey = "Info_OrderQualityTypes";

            Dictionary<string, string> qualityList = CacheHelper.GetDictionary(cacheKey);

            if (qualityList == null)
            {
                InfoService.Use(client =>
                {
                    qualityList = client.GetOrderQualityTypes();
                    CacheHelper.Add(qualityList, cacheKey);
                });
            }

            return qualityList;
        }

        public static List<KeyValuePair<int?, string>> GetCashBookQualityTypes()
        {
            List<KeyValuePair<int?, string>> qualities = new List<KeyValuePair<int?, string>>();
            qualities.Add(new KeyValuePair<int?, string>(null, "Բոլորը"));
            qualities.Add(new KeyValuePair<int?, string>(-2, "Հեռացված"));
            qualities.Add(new KeyValuePair<int?, string>(-1, "Մերժված գլխ. հաշվապահի կողմից"));
            qualities.Add(new KeyValuePair<int?, string>(0, "Չհաստատված"));
            qualities.Add(new KeyValuePair<int?, string>(1, "Հաստատված գլխ. հաշվապահի կողմից"));
            qualities.Add(new KeyValuePair<int?, string>(2, "Հաստատված"));
            return qualities;
        }


        public static Dictionary<string, string> GetMonths()
        {
            string cacheKey = "Info_Months";

            Dictionary<string, string> months = CacheHelper.GetDictionary(cacheKey);

            if (months == null)
            {
                InfoService.Use(client =>
                {
                    months = client.GetMonths();
                    CacheHelper.Add(months, cacheKey);
                });
            }

            return months;
        }

        public static KeyValuePairOfstringstring GetCommunalDate(CommunalTypes cmnlType, short abonentType = 1)
        {
            KeyValuePairOfstringstring date = new KeyValuePairOfstringstring();
            InfoService.Use(client =>
            {
                date = client.GetCommunalDate(cmnlType, abonentType);
            });
            return date;
        }
        public static List<KeyValuePairOfunsignedShortstring> GetServicePaymentNoteReasons()
        {

            string cacheKey = "Info_ServicePaymentNoteReasons";

            List<KeyValuePairOfunsignedShortstring> noteReasons = CacheHelper.Get<List<KeyValuePairOfunsignedShortstring>>(cacheKey);

            if (noteReasons == null)
            {
                InfoService.Use(client =>
                {
                    noteReasons = client.GetServicePaymentNoteReasons();
                    CacheHelper.Add<List<KeyValuePairOfunsignedShortstring>>(noteReasons, cacheKey);
                });
            }

            return noteReasons;
        }


        public static List<KeyValuePairOfunsignedShortstring> GetTransferSenderLivingPlaceTypes()
        {
            string cacheKey = "Info_TransferSenderLivingPlaceTypes";

            List<KeyValuePairOfunsignedShortstring> transferSenderLivingPlaceTypes = CacheHelper.Get<List<KeyValuePairOfunsignedShortstring>>(cacheKey);

            if (transferSenderLivingPlaceTypes == null)
            {
                InfoService.Use(client =>
                {
                    transferSenderLivingPlaceTypes = client.GetTransferSenderLivingPlaceTypes();
                    CacheHelper.Add<List<KeyValuePairOfunsignedShortstring>>(transferSenderLivingPlaceTypes, cacheKey);
                });
            }

            return transferSenderLivingPlaceTypes;
        }


        public static List<KeyValuePairOfunsignedShortstring> GetTransferReceiverLivingPlaceTypes()
        {
            string cacheKey = "Info_TransferReceiverLivingPlaceTypes";

            List<KeyValuePairOfunsignedShortstring> transferReceiverLivingPlaceTypes = CacheHelper.Get<List<KeyValuePairOfunsignedShortstring>>(cacheKey);

            if (transferReceiverLivingPlaceTypes == null)
            {
                InfoService.Use(client =>
                {
                    transferReceiverLivingPlaceTypes = client.GetTransferReceiverLivingPlaceTypes();
                    CacheHelper.Add<List<KeyValuePairOfunsignedShortstring>>(transferReceiverLivingPlaceTypes, cacheKey);
                });
            }

            return transferReceiverLivingPlaceTypes;
        }


        public static List<KeyValuePairOfunsignedShortstring> GetTransferAmountTypes()
        {
            string cacheKey = "Info_TransferAmountTypes";

            List<KeyValuePairOfunsignedShortstring> transferAmountTypes = CacheHelper.Get<List<KeyValuePairOfunsignedShortstring>>(cacheKey);

            if (transferAmountTypes == null)
            {
                InfoService.Use(client =>
                {
                    transferAmountTypes = client.GetTransferAmountTypes();
                    CacheHelper.Add<List<KeyValuePairOfunsignedShortstring>>(transferAmountTypes, cacheKey);
                });
            }

            return transferAmountTypes;
        }


        public static List<KeyValuePairOfunsignedShortstring> GetTransferAmountPurposes()
        {
            string cacheKey = "Info_TransferAmountPurposes";

            List<KeyValuePairOfunsignedShortstring> transferAmountPurposes = CacheHelper.Get<List<KeyValuePairOfunsignedShortstring>>(cacheKey);

            if (transferAmountPurposes == null)
            {
                InfoService.Use(client =>
                {
                    transferAmountPurposes = client.GetTransferAmountPurposes();
                    CacheHelper.Add<List<KeyValuePairOfunsignedShortstring>>(transferAmountPurposes, cacheKey);
                });
            }

            return transferAmountPurposes;
        }

        public static Dictionary<string, string> GetPensionAppliactionQualityTypes()
        {
            string cacheKey = "Info_PensionAppliactionQualityTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetPensionAppliactionQualityTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetPensionAppliactionClosingTypes()
        {
            string cacheKey = "Info_PensionAppliactionClosingTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetPensionAppliactionClosingTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;
        }



        public static Dictionary<string, string> GetPensionAppliactionServiceTypes()
        {
            string cacheKey = "Info_PensionAppliactionServiceTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetPensionAppliactionServiceTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }


        public static Dictionary<string, string> GetCardsType()
        {
            string cacheKey = "Info_CardsType";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetCardsType();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;


        }

        public static Dictionary<string, string> GetOpenCardsType()
        {
            string cacheKey = "Info_OpenCardsType";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetOpenCardsType();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static ulong GetLastKeyNumber(int keyId, ushort filialCode)
        {
            ulong keyNumber = 0;
            InfoService.Use(client =>
            {
                keyNumber = client.GetLastKeyNumber(keyId, filialCode);
            });
            return keyNumber;
        }


        public static List<KeyValuePair<string, string>> GetCurNominals(string currency)
        {
            string cacheKey = "Info_CurNominals" + "_" + currency;

            List<KeyValuePair<string, string>> curNominalsCash = CacheHelper.GetObjectList(cacheKey);
            List<KeyValuePairOfstringstring> curNominals = new List<KeyValuePairOfstringstring>();
            if (curNominalsCash == null)
            {
                curNominalsCash = new List<KeyValuePair<string, string>>();
                InfoService.Use(client =>
                {
                    curNominals = client.GetCurNominals(currency);
                    foreach (KeyValuePairOfstringstring curNom in curNominals)
                    {
                        curNominalsCash.Add(new KeyValuePair<string, string>(key: curNom.key, value: curNom.value));
                    }
                    CacheHelper.Add(curNominalsCash, cacheKey);
                });
            }
            return curNominalsCash;
        }


        public static Dictionary<string, string> GetDepositCaseContractDays()
        {
            Dictionary<string, string> days = new Dictionary<string, string>();
            days.Add("1", "14 օր");
            days.Add("2", "1 ամիս");
            days.Add("3", "3 ամիս");
            days.Add("4", "6 ամիս");
            days.Add("5", "1 տարի");
            return days;
        }


        public static List<KeyValuePair<int?, string>> GetSMSMessagingStatusTypes()
        {

            List<KeyValuePair<int?, string>> qualities = new List<KeyValuePair<int?, string>>();
            qualities.Add(new KeyValuePair<int?, string>(null, "Բոլորը"));
            InfoService.Use(client =>
            {
                qualities.AddRange(client.GetSMSMessagingStatusTypes());
            });
            return qualities;
        }

        public static Dictionary<string, string> GetProvisionTypes()
        {
            string cacheKey = "Info_ProvisionTypes";

            Dictionary<string, string> provisions = CacheHelper.GetDictionary(cacheKey);

            if (provisions == null)
            {
                InfoService.Use(client =>
                {
                    provisions = client.GetProvisionTypes();
                    CacheHelper.Add(provisions, cacheKey);
                });
            }

            return provisions;
        }



        public static List<DateTime> GetWaterCoDebtDates(ushort code)
        {
            List<DateTime> dates = new List<DateTime>();
            InfoService.Use(client =>
            {
                dates = client.GetWaterCoDebtDates(code);
            });
            return dates;
        }


        public static Dictionary<string, string> GetReestrWaterCoBranches(ushort filialCode)
        {
            Dictionary<string, string> branches = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                branches = client.GetReestrWaterCoBranches(filialCode);
            });
            return branches;
        }

        public static Dictionary<string, string> GetWaterCoBranches(ushort filialCode)
        {
            Dictionary<string, string> branches = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                branches = client.GetWaterCoBranches(filialCode);
            });
            return branches;
        }

        public static Dictionary<string, string> GetWaterCoCitys(ushort code)
        {
            Dictionary<string, string> citys = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                citys = client.GetWaterCoCitys(code);
            });
            return citys;
        }

        public static List<WaterCoDetail> GetWaterCoDetails()
        {
            List<WaterCoDetail> list = new List<WaterCoDetail>();
            InfoService.Use(client =>
            {
                list = client.GetWaterCoDetails();
            });
            return list;
        }

        public static Dictionary<string, string> GetInsuranceTypes()
        {
            string cacheKey = "Info_InsuranceTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetInsuranceTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetInsuranceCompanies()
        {
            string cacheKey = "Info_InsuranceCompanies";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetInsuranceCompanies();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }


        public static string GetCardDataChangeFieldTypeDescription(ushort type)
        {
            string fieldTypeDescription = "";
            InfoService.Use(client =>
            {
                fieldTypeDescription = client.GetCardDataChangeFieldTypeDescription(type);
            });
            return fieldTypeDescription;
        }

        public static string GetCardRelatedOfficeName(ushort relatedOfficeNumber)
        {
            string cardRelatedOfficeName = "";
            InfoService.Use(client =>
            {
                cardRelatedOfficeName = client.GetCardRelatedOfficeName(relatedOfficeNumber);
            });
            return cardRelatedOfficeName;
        }

        public static string GetCOWaterBranchID(string branch, string abonentFilialCode)
        {
            string COWaterBranchID = "";
            InfoService.Use(client =>
            {
                COWaterBranchID = client.GetCOWaterBranchID(branch, abonentFilialCode);
            });
            return COWaterBranchID;
        }

        public static Dictionary<string, string> GetDepositClosingReasonTypes()
        {
            string cacheKey = "Info_DepositClosingReasonTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetDepositClosingReasonTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetSubTypesOfTokens()
        {
            string cacheKey = "Info_Tokens_Sub_Types";

            Dictionary<string, string> tokensSubTpes = CacheHelper.GetDictionary(cacheKey);

            if (tokensSubTpes == null)
            {
                InfoService.Use(client =>
                {
                    tokensSubTpes = client.GetSubTypesOfTokens();
                    CacheHelper.Add(tokensSubTpes, cacheKey);
                });
            }
            return tokensSubTpes;
        }

        public static Dictionary<string, string> GetPrintReportTypes()
        {
            Dictionary<string, string> reportTypes = new Dictionary<string, string>();


            InfoService.Use(client =>
            {
                reportTypes = client.GetPrintReportTypes();
            });


            return reportTypes;
        }
        public static Dictionary<string, string> GetHBApplicationReportType()
        {
            Dictionary<string, string> reportTypes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                reportTypes = client.GetHBApplicationReportType();
            });

            return reportTypes;
        }
        public static Dictionary<string, string> GetTransferRejectReasonTypes()
        {

            string cacheKey = "Info_TransferRejectReasonTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetTransferRejectReasonTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetTransferRequestStepTypes()
        {
            string cacheKey = "Info_TransferRequestStepTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetTransferRequestStepTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetTransferRequestStatusTypes()
        {
            string cacheKey = "Info_TransferRequestStatusTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetTransferRequestStatusTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }



        public static List<KeyValuePair<int, string>> GetTransferSessions(DateTime dateStart, DateTime dateEnd, short transferGroup)
        {

            List<KeyValuePair<int, string>> sessions = new List<KeyValuePair<int, string>>();
            sessions.Add(new KeyValuePair<int, string>(0, "Բոլորը"));
            InfoService.Use(client =>
            {
                sessions.AddRange(client.GetTransferSessions(dateStart, dateEnd, transferGroup));
            });
            return sessions;
        }

        public static List<DepositOption> GetBusinesDepositOptions()
        {
            List<DepositOption> depositOptions = new List<DepositOption>();
            string cacheKey = "Info_BusinesDepositOptions";
            depositOptions = CacheHelper.Get<List<DepositOption>>(cacheKey);
            if (depositOptions == null)
            {
                InfoService.Use(client =>
                {
                    depositOptions = client.GetBusinesDepositOptions();
                    CacheHelper.Add(depositOptions, cacheKey);
                });
            }
            return depositOptions;

        }

        public static Dictionary<string, string> GetRegions(int country)
        {
            Dictionary<string, string> regions = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                regions = client.GetRegions(country);
            });
            return regions;
        }

        public static Dictionary<string, string> GetArmenianPlaces(int region)
        {
            Dictionary<string, string> places = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                places = client.GetArmenianPlaces(region);
            });
            return places;
        }


        public static Dictionary<string, string> GetTypeOfLoanRepaymentSource()
        {
            string cacheKey = "Info_TypeOfLoanRepaymentSource";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetTypeOfLoanRepaymentSource();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;


        }

        public static CardTariffAdditionalInformation GetCardTariffAdditionalInformation(int officeID, int cardType)
        {
            CardTariffAdditionalInformation cardTariffAdditionalInformation = new CardTariffAdditionalInformation();
            InfoService.Use(client =>
            {
                cardTariffAdditionalInformation = client.GetCardTariffAdditionalInformation(officeID, cardType);
            });
            return cardTariffAdditionalInformation;
        }

        public static string GetDepositDataChangeFieldTypeDescription(ushort type)
        {
            string fieldTypeDescription = "";
            InfoService.Use(client =>
            {
                fieldTypeDescription = client.GetDepositDataChangeFieldTypeDescription(type);
            });
            return fieldTypeDescription;
        }


        public static Dictionary<string, string> GetInsuranceCompaniesByInsuranceType(ushort insuranceType)
        {
            Dictionary<string, string> insuranceCompanies = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                insuranceCompanies = client.GetInsuranceCompaniesByInsuranceType(insuranceType);
            });
            return insuranceCompanies;
        }

        public static Dictionary<string, string> GetInsuranceTypesByProductType(bool isLoanProduct, bool isSeparatelyProduct)
        {
            Dictionary<string, string> insuranceTypes = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                insuranceTypes = client.GetInsuranceTypesByProductType(isLoanProduct, isSeparatelyProduct);
            });
            return insuranceTypes;
        }
        public static Dictionary<string, string> GetLoanTypes()
        {
            string cacheKey = "Info_LoanTypes";

            Dictionary<string, string> loanTypes = CacheHelper.GetDictionary(cacheKey);

            if (loanTypes == null)
            {
                InfoService.Use(client =>
                {
                    loanTypes = client.GetLoanTypes();
                    CacheHelper.Add(loanTypes, cacheKey);
                });
            }

            return loanTypes;
        }



        public static Dictionary<string, string> GetLoanMatureTypes()
        {
            string cacheKey = "Info_LoanMatureTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetLoanMatureTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;


        }
        public static List<KeyValuePairOfintstring> GetPhoneBankingContractQuestions()
        {
            string cacheKey = "Info_PhoneBankingContractQuestions";
            List<KeyValuePairOfintstring> questionsList = CacheHelper.Get<List<KeyValuePairOfintstring>>(cacheKey);
            if (questionsList == null)
            {
                InfoService.Use(client =>
                {
                    questionsList = client.GetPhoneBankingContractQuestions();
                    CacheHelper.Add(questionsList, cacheKey);
                });
            }
            return questionsList;


        }

        public static Dictionary<string, string> GetCashBookRowTypes()
        {
            string cacheKey = "Info_CashBookRowTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetCashBookRowTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;


        }


        public static Dictionary<string, string> GetListOfLoanApplicationAmounts()
        {
            string cacheKey = "Info_ListOfLoanApplicationAmounts";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetListOfLoanApplicationAmounts();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static double GetFastOverdraftFeeAmount(double amount)
        {
            double feeAmount = 0;
            InfoService.Use(client =>
            {
                feeAmount = client.GetFastOverdraftFeeAmount(amount);
            });
            return feeAmount;
        }

        public static Dictionary<string, string> GetLoanMonitoringTypes()
        {
            string cacheKey = "Info_LoanMonitoringTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetLoanMonitoringTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetLoanMonitoringFactorGroupes()
        {
            string cacheKey = "Info_LoanMonitoringFactorGroupes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetLoanMonitoringFactorGroupes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetLoanMonitoringFactors(int loanType, int groupId = 0)
        {
            Dictionary<string, string> factors = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                factors = client.GetLoanMonitoringFactors(loanType, groupId);
            });
            return factors;
        }

        public static Dictionary<string, string> GetProfitReductionTypes()
        {
            string cacheKey = "Info_ProfitReductionTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetProfitReductionTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetProvisionCostConclusionTypes()
        {
            string cacheKey = "Info_ProvisionCostConclusionTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetProvisionCostConclusionTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetProvisionQualityConclusionTypes()
        {
            string cacheKey = "Info_ProvisionQualityConclusionTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetProvisionQualityConclusionTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }

        public static Dictionary<string, string> GetLoanMonitoringConclusions()
        {
            string cacheKey = "Info_LoanMonitoringConclusions";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetLoanMonitoringConclusions();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;


        }

        public static Dictionary<string, string> GetLoanMonitoringSubTypes()
        {
            string cacheKey = "Info_LoanMonitoringSubTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetLoanMonitoringSubTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;

        }


        public static Dictionary<string, string> GetDemandDepositsTariffGroups()
        {

            string cacheKey = "Info_DemandDepositsTariffGroups";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);
            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetDemandDepositsTariffGroups();
                    CacheHelper.Add(result, cacheKey);
                });
            }
            return result;


        }


        public static Dictionary<string, string> GetAccountRestrictionGroups()
        {
            Dictionary<string, string> accountRestrictionGroups = new Dictionary<string, string>();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            InfoService.Use(client =>
            {
                accountRestrictionGroups = client.GetAccountRestrictionGroups(customerNumber);
            });
            return accountRestrictionGroups;
        }



        public static KeyValuePairOfstringdateTime? GetDemandDepositRateTariffDocument()
        {
            KeyValuePairOfstringdateTime? result = new KeyValuePairOfstringdateTime?();
            InfoService.Use(client =>
            {
                result = client.GetDemandDepositRateTariffDocument(1);
            });
            return result;
        }

        public static Dictionary<string, string> GetProductNotificationInformationTypes()
        {
            string cacheKey = "Info_ProductNotificationInformationTypes";
            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);
            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetProductNotificationInformationTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }
            return types;


        }

        public static Dictionary<string, string> GetProductNotificationFrequencyTypes(byte informationType)
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetProductNotificationFrequencyTypes(informationType);
            });
            return types;
        }

        public static Dictionary<string, string> GetProductNotificationOptionTypes(byte informationType)
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetProductNotificationOptionTypes(informationType);
            });
            return types;
        }

        public static Dictionary<string, string> GetProductNotificationLanguageTypes(byte informationType)
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetProductNotificationLanguageTypes(informationType);
            });
            return types;
        }

        public static Dictionary<string, string> GetProductNotificationFileFormatTypes()
        {
            string cacheKey = "Info_ProductNotificationFileFormatTypes";
            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);
            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetProductNotificationFileFormatTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }
            return types;

        }

        public static Dictionary<string, string> GetSwiftMessageTypes()
        {
            string cacheKey = "Info_SwiftMessageTypes";
            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);
            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetSwiftMessageTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }
            return types;


        }

        public static Dictionary<string, string> GetSwiftMessageSystemTypes()
        {
            string cacheKey = "Info_SwiftMessageSystemTypes";
            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);
            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetSwiftMessageSystemTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;


        }

        public static Dictionary<string, string> GetSwiftMessagMtCodes()
        {
            string cacheKey = "Info_SwiftMessagMtCodes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetSwiftMessagMtCodes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;



        }

        public static Dictionary<string, string> GetSwiftMessageAttachmentExistenceTypes()
        {
            string cacheKey = "Info_SwiftMessageAttachmentExistenceTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetSwiftMessageAttachmentExistenceTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;



        }

        public static Dictionary<string, string> GetArcaCardSMSServiceActionTypes()
        {
            string cacheKey = "Info_ArcaCardSMSServiceActionTypes";

            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);

            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetArcaCardSMSServiceActionTypes();
                    CacheHelper.Add(result, cacheKey);
                });
            }

            return result;


        }

        /// <summary>
        /// Վերադարձնում է պարտատոմսի թողարկման կարգավիճակների տեսակները
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, string> GetBondIssueQualities()
        {
            string cacheKey = "Info_BondIssueQualities";

            Dictionary<string, string> bondissueQualities = CacheHelper.GetDictionary(cacheKey);

            if (bondissueQualities == null)
            {
                InfoService.Use(client =>
                {
                    bondissueQualities = client.GetBondIssueQuality();
                    CacheHelper.Add(bondissueQualities, cacheKey);
                });
                foreach (var item in bondissueQualities.Where(kvp => kvp.Key == "99").ToList())
                {
                    bondissueQualities.Remove(item.Key);
                }
            }

            return bondissueQualities;
        }

        public static Dictionary<string, string> GetBondIssuerTypes()
        {
            string cacheKey = "Info_BondIssuerTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetBondIssuerTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetBondIssuePeriodTypes()
        {
            string cacheKey = "Info_BondIssuePeriodTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetBondIssuePeriodTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }


        public static List<int> GetATSFilials()
        {
            string cacheKey = "Info_ATSFilials";

            List<int> types = CacheHelper.Get<List<int>>(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetATSFilials();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }


        public static DateTime GetFastOverdrafEndDate(DateTime startDate)
        {
            DateTime result = DateTime.Now.Date;
            InfoService.Use(client =>
            {
                result = client.GetFastOverdrafEndDate(startDate);
            });
            return result;
        }
        public static Dictionary<string, string> GetBanks()
        {
            string cacheKey = "Info_Banks";

            Dictionary<string, string> banks = CacheHelper.GetDictionary(cacheKey);

            if (banks == null)
            {
                InfoService.Use(client =>
                {
                    banks = client.GetBanks(Languages.hy);
                });
            }

            return banks;
        }

        public static Dictionary<string, string> GetCurrenciesForBondIssue()
        {
            string cacheKey = "Info_Currency_Bond_Issue";

            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {
                InfoService.Use(client =>
                {
                    currencies = client.GetCurrencies();

                    CacheHelper.Add(currencies, cacheKey);
                });
            }

            Dictionary<string, string> currenciesNew = new Dictionary<string, string>();
            foreach (var item in currencies)
            {
                if (item.Key == "AMD" || item.Key == "USD")
                {
                    currenciesNew.Add(item.Key, item.Value);
                }
            }
            currencies = currenciesNew;



            return currencies;
        }


        public static Dictionary<string, string> GetAnalyseTypes()
        {
            string cacheKey = "Info_AnalyseTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = new Dictionary<string, string>();
                    //types = client.GetAnalyseTypes();
                    types.Add("1", "Սքոր");
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetContractSalaries()
        {
            string cacheKey = "Info_ContractSalaries";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = new Dictionary<string, string>();
                    //types = client.GetContractSalaries();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetLoanTypesForLoanApplication(string loanApplicationType)
        {
            string cacheKey = "Info_LoanTypesForLoanApplication";
            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);
            if (types == null)
            {
                types = new Dictionary<string, string>();
                if (loanApplicationType == "loan")
                {
                    types.Add("5", "Սպառողական այլ վարկ");
                }
                else if (loanApplicationType == "creditLine")
                {
                    types.Add("8", "Քարտային վարկային գիծ");
                    types.Add("50", "Նվազող սահմանաչափով վարկային գիծ");
                    types.Add("51", "Չվերականգնվող քարտային վարկային գիծ");
                }
            }

            return types;
        }
        public static Dictionary<string, string> GetBondRejectReasonTypes()
        {
            string cacheKey = "Info_BondRejectReasonTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetBondRejectReasonTypes();
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetBondQualityTypes()
        {
            string cacheKey = "Info_BondQualityTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetBondQualityTypes();
                });

                types.Remove(((byte)XBS.BondQuality.Deleted).ToString());
                types.Add("100", "Բացված");
                CacheHelper.Add(types, cacheKey);
            }

            return types;
        }


        public static Dictionary<string, string> GetTypeOfPaymentDescriptions()
        {
            string cacheKey = "Info_TypeOfPaymentDescriptions";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetTypeOfPaymentDescriptions();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }


        public static Dictionary<string, string> GetTypeofPaymentReasonAboutOutTransfering()
        {
            string cacheKey = "Info_TypeofPaymentReasonAboutOutTransfering";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetTypeofPaymentReasonAboutOutTransfering();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }


        public static Dictionary<string, string> GetTypeofOperDayClosingOptions()
        {
            string cacheKey = "Info_TypeofTypeofOperDayClosingOptions";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetTypeofOperDayClosingOptions();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }


        public static Dictionary<string, string> GetTypeOf24_7Modes()
        {
            string cacheKey = "Info_TypeOf24_7ModesFront";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetTypeOf24_7Modes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetProblemLoanTaxQualityTypes()
        {
            string cacheKey = "Info_GetProblemLoanTaxQualityTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetProblemLoanTaxQualityTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        //public static Dictionary<string, string> GetTypeOfDeposit()
        //{
        //    string cacheKey = "Info_GetTypeOfDeposit";

        //    Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

        //    if (types == null)
        //    {
        //        InfoService.Use(client =>
        //        {
        //            types = client.GetTypeOfDeposit();
        //            CacheHelper.Add(types, cacheKey);
        //        });
        //    }


        //    return types;
        //}

        //public static Dictionary<string, string> GetTypeOfDepositStatus()
        //{
        //    string cacheKey = "Info_GetTypeOfDepositStatus";

        //    Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

        //    if (types == null)
        //    {
        //        InfoService.Use(client =>
        //        {
        //            types = client.GetTypeOfDepositStatus();
        //            CacheHelper.Add(types, cacheKey);
        //        });
        //    }

        //    return types;
        //}
        public static Dictionary<string, string> GetProblemLoanTaxCourtDecisionTypes()
        {
            string cacheKey = "Info_GetProblemLoanTaxCourtDecisionTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetProblemLoanTaxCourtDecisionTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }


        public static Dictionary<string, string> GetTypeOfCommunals()
        {
            string cacheKey = "Info_TypeOfCommunals";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetTypeOfCommunals();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetActionsForCardTransaction()
        {
            string cacheKey = "ActionsForCardTransaction";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetActionsForCardTransaction();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetReasonsForCardTransactionAction()
        {
            string cacheKey = "CardTransactionActionReasons";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetReasonsForCardTransactionAction();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }


        public static Dictionary<string, string> GetCardLimitChangeOrderActionTypes()
        {
            string cacheKey = "CardLimitChangeOrderActionTypes";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.Use(client =>
                {
                    types = client.GetCardLimitChangeOrderActionTypes();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetUnFreezeReasonTypesForOrder(int freezeId)
        {
            string cacheKey = "Info_UnfreezeTypes_" + freezeId.ToString();

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            //if (types == null)
            //{
            InfoService.Use(client =>
            {
                types = client.GetUnFreezeReasonTypesForOrder(freezeId);
                CacheHelper.Add(types, cacheKey);
            });
            //}

            return types;
        }


        public static Dictionary<string, string> GetSwiftPurposeCode()
        {
            string cacheKey = "Info_GetSwiftPurposeCode";
            Dictionary<string, string> purposeCode = CacheHelper.GetDictionary(cacheKey);

            if (purposeCode == null)
            {
                InfoService.Use(client =>
                {
                    purposeCode = client.GetSwiftPurposeCode();
                    CacheHelper.Add(purposeCode, cacheKey);
                });
            }
            return purposeCode;
        }

        public static List<Shop> GetShopList()
        {
            List<Shop> shopList = new List<Shop>();

            InfoService.Use(client =>
                {
                    shopList = client.GetShopList();
                });

            return shopList;
        }

        public static Dictionary<string, string> GetSSTOperationTypes()
        {
            string cacheKey = "Info_SSTOperationTypes";

            Dictionary<string, string> SSTOperationTypes = CacheHelper.GetDictionary(cacheKey);

            if (SSTOperationTypes == null)
            {
                InfoService.Use(client =>
                {
                    SSTOperationTypes = client.GetSSTOperationTypes();
                    CacheHelper.Add(SSTOperationTypes, cacheKey);
                });
            }

            return SSTOperationTypes;
        }

        public static Dictionary<string, string> GetSSTerminals()
        {
            Dictionary<string, string> SSTerminals = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            ushort filialCode = user.filialCode;

            InfoService.Use(client =>
                {
                    SSTerminals = client.GetSSTerminals(filialCode);
                });

            return SSTerminals;
        }

        public static Dictionary<string, string> GetCardReportReceivingTypes()
        {
            string cacheKey = "Info_CardReportReceivingTypes";

            Dictionary<string, string> CardReportReceivingTypes = CacheHelper.GetDictionary(cacheKey);

            if (CardReportReceivingTypes == null)
            {
                InfoService.Use(client =>
                {
                    CardReportReceivingTypes = client.GetCardReportReceivingTypes();
                    CacheHelper.Add(CardReportReceivingTypes, cacheKey);
                });
            }

            return CardReportReceivingTypes;
        }

        public static Dictionary<string, string> GetCardPINCodeReceivingTypes()
        {
            string cacheKey = "Info_CardPINCodeReceivingTypess";

            Dictionary<string, string> CardPINCodeReceivingTypess = CacheHelper.GetDictionary(cacheKey);

            if (CardPINCodeReceivingTypess == null)
            {
                InfoService.Use(client =>
                {
                    CardPINCodeReceivingTypess = client.GetCardPINCodeReceivingTypes();
                    CacheHelper.Add(CardPINCodeReceivingTypess, cacheKey);
                });
            }

            return CardPINCodeReceivingTypess;
        }

        public static string TranslateArmToEnglish(string armString, bool isUnicode)
        {
            string transalatedText = "";

            InfoService.Use(client =>
            {
                transalatedText = client.TranslateArmToEnglish(armString, isUnicode);
            });

            return transalatedText;
        }


        public static Dictionary<string, string> GetOrderableCardSystemTypes()
        {
            string cacheKey = "Info_OrderableCardSystemTypes";

            Dictionary<string, string> cardSystemTypes = CacheHelper.GetDictionary(cacheKey);

            if (cardSystemTypes == null)
            {
                InfoService.Use(client =>
                {
                    cardSystemTypes = client.GetOrderableCardSystemTypes();
                    CacheHelper.Add(cardSystemTypes, cacheKey);
                });
            }

            return cardSystemTypes;
        }

        public static string GetCustomerAddressEng(ulong customerNumber)
        {
            string cacheKey = "Info_CustomerAddressEng";

            string addressEng = "";

            InfoService.Use(client =>
            {
                addressEng = client.GetCustomerAddressEng(customerNumber);
            });

            return addressEng;
        }


        public static Dictionary<string, string> GetCardRemovalReasons()
        {
            string cacheKey = "Info_CardRemovalReasons";

            Dictionary<string, string> reasons = CacheHelper.GetDictionary(cacheKey);

            InfoService.Use(client =>
            {
                reasons = client.GetCardRemovalReasons();
                CacheHelper.Add(reasons, cacheKey);
            });

            return reasons;

        }


        public static Dictionary<string, string> GetInsuranceContractTypes(bool isLoanProduct, bool isSeparatelyProduct, bool isProvision)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                result = client.GetInsuranceContractTypes(isLoanProduct, isSeparatelyProduct, isProvision);
            });
            return result;
        }

        public static Dictionary<string, string> GetInsuranceTypesByContractType(int insuranceContractType, bool isLoanProduct, bool isSeparatelyProduct, bool isProvision)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                result = client.GetInsuranceTypesByContractType(insuranceContractType, isLoanProduct, isSeparatelyProduct, isProvision);
            });
            return result;
        }

        //HB
        public static Dictionary<string, string> GetHBSourceTypes()
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetHBSourceTypes();
            });
            return types;
        }
        public static Dictionary<string, string> GetHBRejectTypes()
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetHBRejectTypes();
            });
            return types;
        }
        public static Dictionary<string, string> GetHBQualityTypes()
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetHBQualityTypes();
            });
            return types;
        }
        public static Dictionary<string, string> GetHBDocumentTypes()
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetHBDocumentTypes();
            });
            return types;
        }
        public static Dictionary<string, string> GetHBDocumentSubtypes()
        {
            Dictionary<string, string> types = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                types = client.GetHBDocumentSubtypes();
            });
            return types;
        }

        public static Dictionary<string, string> GetCallTransferRejectionReasons()
        {
            Dictionary<string, string> reasons = new Dictionary<string, string>();

            InfoService.Use(client =>
            {

                reasons = client.GetCallTransferRejectionReasons();

            });
            return reasons;
        }
        public static Dictionary<string, string> GetCardReceivingTypes()
        {
            string cacheKey = "Info_CardReceivingTypes";

            Dictionary<string, string> cardReceivingTypes = CacheHelper.GetDictionary(cacheKey);

            if (cardReceivingTypes == null)
            {
                InfoService.Use(client =>
                {
                    cardReceivingTypes = client.GetCardReceivingTypes();
                    CacheHelper.Add(cardReceivingTypes, cacheKey);
                });
            }

            return cardReceivingTypes;
        }

        public static Dictionary<string, string> GetCardApplicationAcceptanceTypes()
        {
            string cacheKey = "Info_CardApplicationAcceptanceTypes";

            Dictionary<string, string> cardApplicationAcceptanceTypes = CacheHelper.GetDictionary(cacheKey);

            if (cardApplicationAcceptanceTypes == null)
            {
                InfoService.Use(client =>
                {
                    cardApplicationAcceptanceTypes = client.GetCardApplicationAcceptanceTypes();
                    CacheHelper.Add(cardApplicationAcceptanceTypes, cacheKey);
                });
            }
            return cardApplicationAcceptanceTypes;
        }



        public static Dictionary<string, string> GetVirtualCardStatusChangeReasons()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                result = client.GetVirtualCardStatusChangeReasons();
            });
            return result;
        }

        public static Dictionary<string, string> GetVirtualCardChangeActions(int status)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            InfoService.Use(client =>
            {
                result = client.GetVirtualCardChangeActions(status);
            });
            return result;
        }

        public static void UseForARUS(Action<IXBInfoService> action)
        {

            string ipAddress = HttpContext.Current.Request["REMOTE_ADDR"];

            IXBInfoService client = ProxyManager<IXBInfoService>.GetProxy(nameof(IXBInfoService));
            bool success = false;

            try
            {
                string guid = "";

                if (HttpContext.Current.Request.Headers["SessionId"] != null)
                {
                    guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
                }

                XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];
                XBSInfo.User infoUser = new XBSInfo.User();

                infoUser.userID = user.userID;
                infoUser.userName = user.userName;
                infoUser.filialCode = user.filialCode;

                client.InitForARUS(ipAddress, 1, infoUser);
                action(client);
                ((IClientChannel)client).Close();

                success = true;
            }
            catch (FaultException ex)
            {
                ((IClientChannel)client).Close();

                throw;
            }
            catch (TimeoutException e)
            {
                ((IClientChannel)client).Close();

                throw;
            }
            catch (Exception e)
            {
                ((IClientChannel)client).Abort();

                throw;
            }
            finally
            {
                if (!success)
                {
                    ((IClientChannel)client).Abort();

                }
                ((IClientChannel)client).Dispose();
            }

        }

        public static Dictionary<string, string> GetARUSSexes(string authorizedUserSessionToken)
        {
            string cacheKey = "ARUSInfo_Sexes";

            Dictionary<string, string> sexes = CacheHelper.GetDictionary(cacheKey);

            if (sexes == null)
            {
                InfoService.UseForARUS(client =>
                {
                    sexes = client.GetARUSSexes(authorizedUserSessionToken);
                    CacheHelper.AddForSTAK(sexes, cacheKey);
                });

            }

            return sexes;
        }

        public static Dictionary<string, string> GetARUSYesNo(string authorizedUserSessionToken)
        {
            string cacheKey = "ARUSInfo_YesNo";

            Dictionary<string, string> YesNoList = CacheHelper.GetDictionary(cacheKey);

            if (YesNoList == null)
            {
                InfoService.UseForARUS(client =>
                {
                    YesNoList = client.GetARUSYesNo(authorizedUserSessionToken);
                    CacheHelper.AddForSTAK(YesNoList, cacheKey);
                });
            }

            return YesNoList;
        }

        public static Dictionary<string, string> GetARUSDocumentTypes(string authorizedUserSessionToken, string MTOAgentCode)
        {
            string cacheKey = "ARUSInfo_DocumentTypes_" + MTOAgentCode;

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {
                InfoService.UseForARUS(client =>
                {
                    types = client.GetARUSDocumentTypes(authorizedUserSessionToken, MTOAgentCode);
                    CacheHelper.AddForSTAK(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetARUSCountriesByMTO(string authorizedUserSessionToken, string MTOAgentCode)
        {
            string cacheKey = "ARUSInfo_Countries_" + MTOAgentCode;

            Dictionary<string, string> countries = CacheHelper.GetDictionary(cacheKey);

            if (countries == null)
            {
                InfoService.UseForARUS(client =>
                {
                    countries = client.GetARUSCountriesByMTO(authorizedUserSessionToken, MTOAgentCode);
                    CacheHelper.AddForSTAK(countries, cacheKey);
                });
            }

            return countries;
        }

        public static Dictionary<string, string> GetARUSSendingCurrencies(string authorizedUserSessionToken, string MTOAgentCode)
        {
            string cacheKey = "ARUSInfo_Currencies_" + MTOAgentCode;

            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {
                InfoService.UseForARUS(client =>
                {
                    currencies = client.GetARUSSendingCurrencies(authorizedUserSessionToken, MTOAgentCode);
                    CacheHelper.AddForSTAK(currencies, cacheKey);
                });
            }

            return currencies;
        }

        public static Dictionary<string, string> GetARUSCitiesByCountry(string authorizedUserSessionToken, string MTOAgentCode, string countryCode)
        {
            string cacheKey = "ARUSInfo_CitiesByCountry_" + MTOAgentCode + "_" + countryCode;

            Dictionary<string, string> cities = CacheHelper.GetDictionary(cacheKey);

            if (cities == null)
            {
                InfoService.UseForARUS(client =>
                {
                    cities = client.GetARUSCitiesByCountry(authorizedUserSessionToken, MTOAgentCode, countryCode);
                    CacheHelper.AddForSTAK(cities, cacheKey);
                });
            }

            return cities;
        }

        public static Dictionary<string, string> GetARUSStates(string authorizedUserSessionToken, string MTOAgentCode, string countryCode)
        {
            string cacheKey = "ARUSInfo_States_" + MTOAgentCode + "_" + countryCode;

            Dictionary<string, string> states = CacheHelper.GetDictionary(cacheKey);

            if (states == null)
            {
                InfoService.UseForARUS(client =>
                {
                    states = client.GetARUSStates(authorizedUserSessionToken, MTOAgentCode, countryCode);
                    CacheHelper.AddForSTAK(states, cacheKey);
                });
            }

            return states;
        }

        public static Dictionary<string, string> GetARUSCitiesByState(string authorizedUserSessionToken, string MTOAgentCode, string countryCode, string stateCode)
        {
            string cacheKey = "ARUSInfo_Cities_" + MTOAgentCode + "_" + countryCode + "_" + stateCode;

            Dictionary<string, string> states = CacheHelper.GetDictionary(cacheKey);

            if (states == null)
            {
                InfoService.UseForARUS(client =>
                {
                    states = client.GetARUSCitiesByState(authorizedUserSessionToken, MTOAgentCode, countryCode, stateCode);
                    CacheHelper.AddForSTAK(states, cacheKey);
                });
            }

            return states;
        }

        public static Dictionary<string, string> GetARUSMTOList(string authorizedUserSessionToken)
        {
            string cacheKey = "ARUSInfo_MTOList";

            Dictionary<string, string> MTList = CacheHelper.GetDictionary(cacheKey);

            if (MTList == null)
            {
                InfoService.UseForARUS(client =>
                {
                    MTList = client.GetARUSMTOList(authorizedUserSessionToken);
                    CacheHelper.AddForSTAK(MTList, cacheKey);
                });
            }

            return MTList;
        }

        public static Dictionary<string, string> GetCountriesWithA3()
        {

            string cacheKey = "Info_Countries_A3";
            Dictionary<string, string> countries = CacheHelper.GetDictionary(cacheKey);

            if (countries == null)
            {
                InfoService.Use(client =>
                {
                    countries = client.GetCountriesWithA3();
                    CacheHelper.Add(countries, cacheKey);
                });
            }

            return countries;

        }

        public static string GetARUSDocumentTypeCode(int ACBADocumentTypeCode)
        {
            string cacheKey = "GetARUSDocumentTypeCode" + ACBADocumentTypeCode;

            string typeCode = CacheHelper.Get<string>(cacheKey);

            InfoService.Use(client =>
            {
                typeCode = client.GetARUSDocumentTypeCode(ACBADocumentTypeCode);
                CacheHelper.AddForSTAK(typeCode, cacheKey);
            });

            return typeCode;
        }

        public static Dictionary<string, string> GetARUSCancellationReversalCodes(string authorizedUserSessionToken, string MTOAgentCode)
        {
            string cacheKey = "ARUSInfo_CancellationReversalCodes_" + MTOAgentCode;

            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {
                InfoService.UseForARUS(client =>
                {
                    currencies = client.GetARUSCancellationReversalCodes(authorizedUserSessionToken, MTOAgentCode);
                    CacheHelper.AddForSTAK(currencies, cacheKey);
                });
            }

            return currencies;
        }

        public static Dictionary<string, string> GetARUSPayoutDeliveryCodes(string authorizedUserSessionToken, string MTOAgentCode)
        {
            string cacheKey = "ARUSInfo_PayoutDeliveryCodes_" + MTOAgentCode;

            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {
                InfoService.UseForARUS(client =>
                {
                    currencies = client.GetARUSPayoutDeliveryCodes(authorizedUserSessionToken, MTOAgentCode);
                    CacheHelper.AddForSTAK(currencies, cacheKey);
                });
            }

            return currencies;
        }

        public static Dictionary<string, string> GetRemittancePurposes(string authorizedUserSessionToken, string MTOAgentCode)
        {
            string cacheKey = "ARUSInfo_RemittancePurposes_" + MTOAgentCode;

            Dictionary<string, string> currencies = CacheHelper.GetDictionary(cacheKey);

            if (currencies == null)
            {
                InfoService.UseForARUS(client =>
                {
                    currencies = client.GetRemittancePurposes(authorizedUserSessionToken, MTOAgentCode);
                    CacheHelper.AddForSTAK(currencies, cacheKey);
                });
            }

            return currencies;
        }

        public static Dictionary<string, string> GetMTOAgencies(string authorizedUserSessionToken, string MTOAgentCode, string countryCode, string cityCode, string currencyCode, string stateCode)
        {
            string cacheKey = "ARUSInfo_Cities_" + MTOAgentCode + "_" + countryCode + "_" + stateCode;

            Dictionary<string, string> states = CacheHelper.GetDictionary(cacheKey);

            if (states == null)
            {
                InfoService.UseForARUS(client =>
                {
                    states = client.GetMTOAgencies(authorizedUserSessionToken, MTOAgentCode, countryCode, cityCode, currencyCode, stateCode);
                    CacheHelper.AddForSTAK(states, cacheKey);
                });
            }

            return states;
        }

        public static Dictionary<string, string> GetARUSAmendmentReasons(string authorizedUserSessionToken, string MTOAgentCode)
        {
            string cacheKey = "ARUSInfo_AmendmentReasons_" + MTOAgentCode;

            Dictionary<string, string> reasons = CacheHelper.GetDictionary(cacheKey);

            if (reasons == null)
            {
                InfoService.UseForARUS(client =>
                {
                    reasons = client.GetARUSAmendmentReasons(authorizedUserSessionToken, MTOAgentCode);
                    CacheHelper.AddForSTAK(reasons, cacheKey);
                });
            }

            return reasons;
        }
        internal static Dictionary<string, string> GetCardAdditionalDataTypes(string cardNumber, string expiryDate)
        {

            Dictionary<string, string> CardAdditionalDataTypes = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                CardAdditionalDataTypes = client.GetCardAdditionalDataTypes(cardNumber, expiryDate);
            });

            return CardAdditionalDataTypes;
        }

        public static Dictionary<string, string> GetReferenceReceiptTypes()
        {
            string cacheKey = "Info_ReferenceReceiptTypes";
            Dictionary<string, string> result = CacheHelper.GetDictionary(cacheKey);

            if (result == null)
            {
                InfoService.Use(client =>
                {
                    result = client.GetReferenceReceiptTypes();
                    CacheHelper.Add(result, cacheKey);
                });

            }
            return result;

        }

        public static Dictionary<string, string> GetCustomerAllPassports()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> result = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                result = client.GetCustomerAllPassports(customerNumber);
            });

            return result;
        }

        public static Dictionary<string, string> GetCustomerAllPhones()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> result = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                result = client.GetCustomerAllPhones(customerNumber);
            });

            return result;
        }

        public static Dictionary<string, string> GetSTAKPayoutDeliveryCodesByBenificiaryAgentCode(string authorizedUserSessionToken, string MTOAgentCode, string parent)
        {
            string cacheKey = "ARUSInfo_PayoutDeliveryCodesByBenificiaryAgentCode_" + MTOAgentCode + "_" + parent;

            Dictionary<string, string> countries = CacheHelper.GetDictionary(cacheKey);

            if (countries == null)
            {
                InfoService.UseForARUS(client =>
                {
                    countries = client.GetSTAKPayoutDeliveryCodesByBenificiaryAgentCode(authorizedUserSessionToken, MTOAgentCode, parent);
                    CacheHelper.AddForSTAK(countries, cacheKey);
                });
            }

            return countries;
        }

        public static Dictionary<string, string> GetCardNotRenewReasons()
        {
            string cacheKey = "Info_CardNotRenewReasons";

            Dictionary<string, string> cardNotRenewReasons = CacheHelper.GetDictionary(cacheKey);

            if (cardNotRenewReasons == null)
            {
                InfoService.Use(client =>
                {
                    cardNotRenewReasons = client.GetCardNotRenewReasons();
                    CacheHelper.Add(cardNotRenewReasons, cacheKey);
                });
            }

            return cardNotRenewReasons;
        }

        public static Dictionary<string, string> GetAllReasonsForCardTransactionAction()
        {
            string cacheKey = "CardAllTransactionActionReasons";

            Dictionary<string, string> types = CacheHelper.GetDictionary(cacheKey);

            if (types == null)
            {               
                InfoService.Use(client =>
                {
                    types = client.GetAllReasonsForCardTransactionAction();
                    CacheHelper.Add(types, cacheKey);
                });
            }

            return types;
        }

        public static Dictionary<string, string> GetTypeOfLoanDelete()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                result = client.GetTypeOfLoanDelete();
            });

            return result;
        }

        public static Dictionary<string, string> GetCommissionNonCollectionReasons()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();

            InfoService.Use(client =>
            {
                result = client.GetCommissionNonCollectionReasons();
            });

            return result;
        }
    }
}
