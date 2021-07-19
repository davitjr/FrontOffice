using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Models;
using FrontOffice.ACBAServiceReference;
using System.ServiceModel;
using System.Net.Sockets;

namespace FrontOffice.Service
{
    public class ACBAOperationService
    {
        public static Customer GetCustomerData(ulong customerNumber)
        {
            Customer customer = new Customer();

            ACBAOperationService.Use(client =>
             {
                 customer = (Customer)(client.GetCustomer(customerNumber));
             }
            );

            return customer;
        }

        public static CustomerMainData GetCustomerMainData(ulong customerNumber)
        {
            CustomerMainData customerMainData = new CustomerMainData();
            ACBAOperationService.Use(client =>
            {
                customerMainData = (CustomerMainData)client.GetCustomerMainData(customerNumber);
            }
           );
            return customerMainData;
        }

        public static byte CheckCustomerUpdateExpired(ulong customerNumber)
        {
            byte updateExpired = 0;

            ACBAOperationService.Use(client =>
            {
                updateExpired = client.CheckCustomerUpdateExpired(customerNumber);
            }
            );

            return updateExpired;
        }


        public static byte CheckBirthDayOfCustomer(ulong customerNumber)
        {
            byte checkBirthDay = 0;

            ACBAOperationService.Use(client =>
            {
                checkBirthDay = client.CheckBirthDayOfCustomer(customerNumber);

            }
            );

            return checkBirthDay;
        }

        public static string GetCustomerDescription(ulong customerNumber)
        {
            string customerDescription = "";
            ACBAOperationService.Use(client =>
            {
                customerDescription = client.GetCustomerDescription(customerNumber);
            });

            return customerDescription;



        }

        public static string GetCasherDescription(int setNumber)
        {
            string casherDescription = "";

            ACBAOperationService.Use(client =>
             {
                 casherDescription = client.GetCasherDescription((uint)setNumber);
             });

            return casherDescription;
        }

        public static KeyValue GetCasherDepartment(short setNumber)
        {
            KeyValue casherDepartment = null;

            ACBAOperationService.Use(client =>
            {
                casherDepartment = client.GetCasherDepartment((uint)setNumber);

            });



            return casherDepartment;
        }

        public static Result SavePersonNote(PersonNote note, ulong customerNumber)
        {
            User user = new User();
            string guid = Utility.GetSessionId();
            user.userID = ((XBS.User)HttpContext.Current.Session[guid + "_User"]).userID;
            Result result = new Result();
            ACBAOperationService.Use(client =>
            {
                result = client.SavePersonNote(note, uint.Parse(GetIdentityId(customerNumber).ToString()), user);
            });
            return result;

        }
        public static List<PersonNoteHistory> GetPersonNotesHistory()
        {

            List<PersonNoteHistory> personNoteHistory = new List<PersonNoteHistory>();

            ACBAOperationService.Use(client =>
           {
               personNoteHistory = client.GetPersonNotesHistory(uint.Parse(GetIdentityId(XBService.GetAuthorizedCustomerNumber()).ToString()));


           });

            return personNoteHistory;
        }

        public static List<PersonNoteHistory> GetPersonNoteHistory(int noteId)
        {

            List<PersonNoteHistory> personNoteHistory = new List<PersonNoteHistory>();
            ACBAOperationService.Use(client =>
            {
                personNoteHistory = client.GetPersonNoteHistory(noteId);


            });

            return personNoteHistory;
        }

        public static ulong GetIdentityId(ulong customerNumber)
        {
            ulong identityID = 0;

            ACBAOperationService.Use(client =>
              {
                  identityID = client.GetIdentityId(customerNumber);
              });
            return identityID;
        }
        public static List<AttachmentDocument> GetAttachmentsInfo(ulong documentId)
        {

            List<AttachmentDocument> attDocumentList = new List<AttachmentDocument>();
            ACBAOperationService.Use(client =>
            {
                attDocumentList = client.GetAttachmentsInfo(documentId);

            });
            return attDocumentList;
        }

        public static byte[] GetOneAttachment(ulong Id)
        {

            byte[] attachment = null;
            ACBAOperationService.Use(client =>
            {
                attachment = client.GetOneAttachment(Id);

            });
            return attachment;
        }

        public static byte GetCustomerType(ulong customerNumber)
        {
            byte type = 0;
            ACBAOperationService.Use(client =>
                {
                    type = client.GetCustomerType(customerNumber);
                });
            return type;
        }

        public static ulong GetLinkedCustomerNumber(ulong customerNumber)
        {
            ulong linkCustomerNumber = 0;
            ACBAOperationService.Use(client =>
            {
                linkCustomerNumber = client.GetLinkedCustomerNumber(customerNumber);
            });
            return linkCustomerNumber;
        }

        public static List<AttachmentDocument> GetAttachmentDocumentList(ulong documentId, int docQuality = 0)
        {
            List<AttachmentDocument> attDocumentList = new List<AttachmentDocument>();
            ACBAOperationService.Use(client =>
            {
                attDocumentList = client.GetAttachmentDocumentList(documentId, false, docQuality);

            });
            return attDocumentList;
        }

        public static void Use(Action<ICustomerOperations> action)
        {
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            //ԴԱՀԿ որոնման համար անհրաժեշտ է User
            User acbaUser = new User
            {
                userID = user.userID,
                filialCode = user.filialCode,
                userName = user.userName,
                IsChiefAcc = user.IsChiefAcc,
                IsManager = user.IsManager
            };

            bool success = false;

            ICustomerOperations client = ProxyManager<ICustomerOperations>.GetProxy(nameof(ICustomerOperations));
            try
            {
                ////For new ACBAOperationAuthorization
                //using (new OperationContextScope((IContextChannel)client))
                //{
                //    Utility.SetAuthorizationHeadersForACBAOperation();

                //    action(client);
                //    ((IClientChannel)client).Close();

                //    success = true;
                //}



                client.SetCurrentUser(acbaUser);
                action(client);
                ((IClientChannel)client).Close();

                //success = true;
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
        }

        public static void Use(Action<IInfoService> action)
        {
            IInfoService client = ProxyManager<IInfoService>.GetProxy(nameof(IInfoService));

            bool success = false;


            try
            {
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
        }

        public static string GetUserLoginName(short setNumber)
        {
            string userLoginName = "";
            ACBAOperationService.Use(client =>
            {
                userLoginName = client.GetUserLoginName(setNumber);
            });
            return userLoginName;
        }

        public static List<AttachmentDocument> GetCustomerDocumentList(ulong customerNumber, int docQuality)
        {

            List<AttachmentDocument> attDocumentList = new List<AttachmentDocument>();
            byte customerType = GetCustomerType(customerNumber);
            uint identityId = uint.Parse(GetIdentityId(customerNumber).ToString());
            List<CustomerDocument> customerDocumentList = new List<CustomerDocument>();
            ACBAOperationService.Use(client =>
            {
                customerDocumentList = client.GetCustomerDocumentList(identityId, docQuality);

            });

            List<CustomerDocument> documentList = new List<CustomerDocument>();
            documentList.AddRange(customerDocumentList);
            if (customerType == 6)
            {


                //Հիմնական փաստաթուղթ
                attDocumentList.AddRange(documentList.Find(m => m.defaultSign == true).attachmentList);
                documentList.RemoveAll(m => m.defaultSign == true);

                //Այլ անձը հաստատող փաստաթուղթ
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 1 || m.documentType.key == 2
                    || m.documentType.key == 4 || m.documentType.key == 6 || m.documentType.key == 7 || m.documentType.key == 10 || m.documentType.key == 11
                    || m.documentType.key == 12 || m.documentType.key == 13 || m.documentType.key == 88))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentType.key == 1 || m.documentType.key == 2
                    || m.documentType.key == 4 || m.documentType.key == 6 || m.documentType.key == 7 || m.documentType.key == 10 || m.documentType.key == 11
                    || m.documentType.key == 12 || m.documentType.key == 13 || m.documentType.key == 88);
                //ՀԾՀ
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 56))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentType.key == 56);

                //Ծննդյան վկայական
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 8))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentType.key == 8);

                //Ստորագրության նմուշ
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 28))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentType.key == 28);


                //Լիազորագրեր
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentGroup.key == 11))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentGroup.key == 11);

                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 39))
                {
                    customerDocument.attachmentList.ForEach(m =>
                    m.DocumentType = 39
                        );
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }


            }
            //Իրավաբանական անձ
            else
            {
                //Ստորագրության նմուշ
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 28))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentType.key == 28);

                //ՀՎՀՀ
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 19))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentType.key == 19);

                //Լիազորագրեր
                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentGroup.key == 11))
                {
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }
                documentList.RemoveAll(m => m.documentGroup.key == 11);

                foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 39))
                {
                    customerDocument.attachmentList.ForEach(m =>
                    m.DocumentType = 39
                        );
                    attDocumentList.AddRange(customerDocument.attachmentList);
                }


            }

            foreach (AttachmentDocument attDocument in attDocumentList)
            {
                attDocument.Attachment = GetOneAttachment(attDocument.id);
            }



            return attDocumentList;
        }

        public static List<CriminalCheckResult> GetCriminalListFromLogById(List<int> logIdList)
        {
            List<CriminalCheckResult> results = new List<CriminalCheckResult>();

            ACBAOperationService.Use(client =>
            {
                logIdList.ForEach(m =>
                {
                    results.AddRange(client.GetCriminalListFromLogById(m));
                });
            });

            foreach (CriminalCheckResult item in results)
            {
                item.Name1 = Utility.ConvertAnsiToUnicode(item.Name1);
                item.Name2 = Utility.ConvertAnsiToUnicode(item.Name2);
                item.Name3 = Utility.ConvertAnsiToUnicode(item.Name3);
                item.Name4 = Utility.ConvertAnsiToUnicode(item.Name4);
            }

            return results;
        }


        public static List<LinkedCustomer> GetCustomerLinkedPersonsList(ulong customerNumber, int quality)
        {
            List<LinkedCustomer> results = new List<LinkedCustomer>();

            ACBAOperationService.Use(client =>
            {
                results = client.GetCustomerLinkedPersonsList(customerNumber, quality);

                results.ForEach(m =>
                {
                    m.CustomerDescription = client.GetCustomerDescription(m.linkedCustomerNumber);
                });
            });

            results.ForEach(m =>
            {
                m.CustomerDescription = Utility.ConvertAnsiToUnicode(m.CustomerDescription);
                m.linkType.value = Utility.ConvertAnsiToUnicode(m.linkType.value);

            });


            return results;
        }


        public static void SaveCustomerPhoto(byte[] photo, string extension, ulong photoId = 0)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            ACBAOperationService.Use(client =>
            {
                client.SaveCustomerPhoto(customerNumber, photo, extension, photoId);
            });
        }


        public static CustomerPhoto GetCustomerPhoto(ulong customerNumber)
        {

            CustomerPhoto customerPhoto = null;
            ACBAOperationService.Use(client =>
            {
                customerPhoto = client.GetCustomerPhoto(customerNumber);
            });
            return customerPhoto;

        }


        public static void DeleteCustomerPhoto(ulong photoId)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            ACBAOperationService.Use(client =>
            {
                client.DeleteCustomerPhoto(customerNumber, photoId);
            });
        }


        public static byte[] GetCustomerOnePhoto(ulong photoId)
        {
            byte[] customerPhoto = null;
            ACBAOperationService.Use(client =>
            {
                customerPhoto = client.GetCustomerOnePhoto(photoId);
            });
            return customerPhoto;

        }


        public static List<SearchPersonNotes> GetSearchedPersonNotes(SearchPersonNotes searchParams)
        {
            List<SearchPersonNotes> notes = new List<SearchPersonNotes>();

            ACBAOperationService.Use(client =>
            {
                notes = client.GetSearchedPersonNotes(searchParams);
            }
            );

            return notes;
        }

        public static void ChangePersonNoteReadingStatus(int noteId)
        {
            ACBAOperationService.Use(client =>
            {
                client.ChangePersonNoteReadingStatus(noteId);


            });
        }
        public static Cashier GetCashier(uint setNumber)
        {
            Cashier cashier = null;

            ACBAOperationService.Use(client =>
            {
                cashier = client.GetCashier(setNumber);
                cashier.firstName = Utility.ConvertAnsiToUnicode(cashier.firstName);
                cashier.lastName = Utility.ConvertAnsiToUnicode(cashier.lastName);
                cashier.position = Utility.ConvertAnsiToUnicode(cashier.position);
            });

            return cashier;
        }

        public static short GetCustomerFilial(ulong customerNumber)
        {
            short filial = 0;
            ACBAOperationService.Use(client =>
            {
                filial = client.GetCustomerFilial(customerNumber).key;
            }
            );

            return filial;
        }
        public static List<AttachmentDocument> GetCardTariffContractAttachment(ulong customerNumber, int docQuality)
        {
            List<AttachmentDocument> attDocumentList = new List<AttachmentDocument>();
            uint identityId = uint.Parse(GetIdentityId(customerNumber).ToString());
            List<CustomerDocument> customerDocumentList = new List<CustomerDocument>();
            ACBAOperationService.Use(client =>
            {
                customerDocumentList = client.GetCustomerDocumentList(identityId, docQuality);

            });

            List<CustomerDocument> documentList = new List<CustomerDocument>();
            documentList.AddRange(customerDocumentList);
            //Արտոնյալ պայմաններով վճարային քարտեր սպասարկելու պայմանագիր
            foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 74))
            {
                attDocumentList.AddRange(customerDocument.attachmentList);
            }
            documentList.RemoveAll(m => m.documentType.key == 74);
            //Վճարային քարտերով ծառայությունների մատուցման համագործակցության պայմանագիր
            foreach (CustomerDocument customerDocument in documentList.FindAll(m => m.documentType.key == 73))
            {
                attDocumentList.AddRange(customerDocument.attachmentList);
            }
            documentList.RemoveAll(m => m.documentType.key == 73);

            foreach (AttachmentDocument attDocument in attDocumentList)
            {
                attDocument.Attachment = GetOneAttachment(attDocument.id);
            }
            return attDocumentList;
        }



        public static List<Cashier> GetAllManagersOfUser(uint id)
        {
            List<Cashier> cashiers = null;
            ACBAOperationService.Use(client =>
            {
                cashiers = client.GetAllManagersOfUser(id);
            }
            );

            return cashiers;
        }


        public static bool HasCustomerBankruptBlockage(ulong customerNumber)
        {
            bool hasBankruptCustomers = false;
            ACBAOperationService.Use(client =>
            {
                hasBankruptCustomers = client.HasCustomerBankruptBlockage(customerNumber);
            });
            return hasBankruptCustomers;
        }

        public static bool HasCustomerArrests(ulong customerNumber)
        {
            bool hasArrests = false;

            ACBAOperationService.Use(client =>
            {
                hasArrests = client.HasCustomerArrests(customerNumber);

            }
            );

            return hasArrests;
        }

        public static string GenerateSAPREdirectUrl(ulong customerNumber)
        {
            string redirectURL = null;

            ACBAOperationService.Use(client =>
            {
                redirectURL = client.GenerateSAPREdirectUrl(customerNumber);
            }
            );

            return redirectURL;
        }

        public static bool CheckCustomerIsSoldier(ulong customerNumber)
        {
            bool isSoldier = false;

            ACBAOperationService.Use(client =>
            {
                isSoldier = client.CheckCustomerIsSoldier(customerNumber);

            }
            );

            return isSoldier;
        }

        public static short GetCustomerQuality(ulong customerNumber)
        {
            short results = 0;

            ACBAOperationService.Use(client =>
            {
                results = client.GetCustomerQuality(customerNumber);
            });

            return results;
        }

        public static CustomerEmail GetCustomerMainEmail(ulong customerNumber)
        {
            CustomerEmail customerEmail = new CustomerEmail();
                
            ACBAOperationService.Use(client =>
            {
                customerEmail = client.GetCustomerMainEmail(customerNumber);
            });
            return customerEmail;

        }

        public static List<CustomerDocument> GetCustomerDocuments(ulong customerNumber, int docQuality)
        {
            uint identityId = uint.Parse(GetIdentityId(customerNumber).ToString());
            List<CustomerDocument> customerDocumentList = new List<CustomerDocument>();
            ACBAOperationService.Use(client =>
            {
                customerDocumentList = client.GetCustomerDocumentList(identityId, docQuality);

            });

            return customerDocumentList;
        }

        public static CustomerPhone GetCustomerMainMobilePhone(ulong customerNumber)
        {
            CustomerPhone phoneNumber = new CustomerPhone();

            ACBAOperationService.Use(client =>
            {
                phoneNumber = client.GetCustomerMainMobilePhone(customerNumber);
            });

            return phoneNumber;
        }
    }
}