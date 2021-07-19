using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.XBManagement;
using System.ServiceModel;
using FrontOffice.Models;
using xbs = FrontOffice.XBS; 

namespace FrontOffice.Service
{
    public class XBManagementService
    {

        public static void Use(Action<IXBManagementService> action)
        {
                string guid = "";

                if (HttpContext.Current.Request.Headers["SessionId"] != null)
                {
                    guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
                }
                
                xbs.User user = (xbs.User)HttpContext.Current.Session[guid + "_User"];
                User XBManagementServiceUser = new User();
                XBManagementServiceUser.userID = user.userID;

                XBManagementServiceUser.filialCode = user.filialCode;
                XBManagementServiceUser.userName = user.userName;
                XBManagementServiceUser.DepartmentId = user.DepartmentId;

                string authorisedCustomerSessionId = "";
                SessionProperties sessionProperties = new SessionProperties();

                sessionProperties = (SessionProperties)HttpContext.Current.Session[guid + "_SessionProperties"];

                SourceType source = SourceType.NotSpecified;
                ServiceType serviceType = ServiceType.CustomerService;

                if (sessionProperties != null)
                {
                    source = (SourceType)sessionProperties.SourceType;
                    if (sessionProperties.IsNonCustomerService)
                        serviceType = ServiceType.NonCustomerService;
                }

                if (HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"] != null)
                {
                    authorisedCustomerSessionId = HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();
                }
                else
                {
                    authorisedCustomerSessionId = "";
                }

                string ipAddress = HttpContext.Current.Request["REMOTE_ADDR"];
                bool success = false;
                bool checkCustomerSession = true;

            IXBManagementService client = ProxyManager<IXBManagementService>.GetProxy(nameof(IXBManagementService));

            try
                {
                    checkCustomerSession = client.Init(authorisedCustomerSessionId, 1, ipAddress, XBManagementServiceUser, source, serviceType);

                    if (!checkCustomerSession)
                    {
                        throw new Exception();
                    }
                    else
                    {
                        action(client);
                        ((IClientChannel)client).Close();
                       
                        success = true;
                    }
                }
                catch (FaultException ex)
                {
                    ((IClientChannel)client).Close();
                   
                    throw ex;
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
                   

                    if (!checkCustomerSession)
                    {
                        System.Web.HttpContext.Current.Response.StatusCode = 419;
                        System.Web.HttpContext.Current.Response.StatusDescription = "CustomerSessionExpired";
                    }
                    else
                    {
                        throw;
                    }



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

        public static ActionResult SaveXBUserGroup(XBUserGroup group)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                //result = client.SaveXBUserGroup(group);
            }
            );

            return result;
        }

        public static List<XBUserGroup> GetXBUserGroups()
        {
            List<XBUserGroup> groups = null;
            XBManagementService.Use(client =>
            {
                groups = client.GetXBUserGroups();
            }
          );

            return groups;
        }

        public static ActionResult RemoveXBUserGroup(XBUserGroup group)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                //result = client.RemoveXBUserGroup(group);
            }
            );

            return result;
        }

        public static ApprovementSchema GetApprovementSchema()
        {
            ApprovementSchema schema = new ApprovementSchema();
            XBManagementService.Use(client =>
            {
                schema = client.GetApprovementSchema();
            }
          );

            return schema;
        }

        public static ActionResult saveApprovementSchemaDetails(ApprovementSchemaDetails schemaDetails, int schemaId)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
               // result = client.SaveApprovementSchemaDetails(schemaDetails, schemaId);
            }
            );

            return result;
        }

      

        public static HBApplication GetHBApplication()
        {
            HBApplication hbApp = new HBApplication();
            XBManagementService.Use(client =>
            {
                hbApp = client.GetHBApplication();
            }
           );
            return hbApp;
        }

        public static HBApplication GetHBApplicationShablon()
        {
            HBApplication hbApp = new HBApplication();
            XBManagementService.Use(client =>
            {
                hbApp = client.GetHBApplicationShablon();
            }
           );
            return hbApp;
        }


        public static ActionResult SaveHBApplicationOrder(HBApplicationOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.SaveAndApproveHBApplicationOrder(order);
            });

            return result;
        }

        public static List<HBUser> GetHBUsers(int hbAppID, ProductQualityFilter filter)
        {
            List<HBUser> hbUsers = new List<HBUser>();
            XBManagementService.Use(client =>
            {
                hbUsers = client.GetHBUsers(hbAppID, filter);
            });
            return hbUsers;
        }

        public static List<HBToken> GetHBTokens(int HBUserID, ProductQualityFilter filter)
        {
            List<HBToken> hbTokens = new List<HBToken>();
            XBManagementService.Use(client =>
            {
                hbTokens = client.GetHBTokens(HBUserID, filter);
            });
            return hbTokens;
        }

        public static List<string> GetHBTokenNumbers(HBTokenTypes tokenType)
        {
            List<string> tokenNumber = new List<string>();
            XBManagementService.Use(client =>
            {
                tokenNumber = client.GetHBTokenNumbers(tokenType);
            }
           );
            return tokenNumber;
        }

        public static bool CheckHBUserNameAvailability(HBUser hbuser)
        {
            bool result = false;
            XBManagementService.Use(client =>
            {
                result = client.CheckHBUserNameAvailability(hbuser);
            });

            return result;
        }

        public static PhoneBankingContract GetPhoneBankingContract()
        {
            PhoneBankingContract pbContract = new PhoneBankingContract();
            XBManagementService.Use(client =>
            {
                pbContract = client.GetPhoneBankingContract();
            }
           );
            return pbContract;
        }

        public static ActionResult SavePhoneBankingContractOrder(PhoneBankingContractOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.SaveAndApprovePhoneBankingContractOrder(order);
            });

            return result;
        }

        public static HBApplicationOrder GetHBApplicationOrder(long orderID)
        {
            HBApplicationOrder order = new HBApplicationOrder();
            XBManagementService.Use(client =>
            {
                order = client.GetHBApplicationOrder(orderID); 
            });
            return order;
        }

        public static ActionResult SaveAndApproveHBApplicationQualityChangeOrder(HBApplicationQualityChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.SaveAndApproveHBApplicationQualityChangeOrder(order);
            });

            return result;
        }

        public static ActionResult SavePhoneBankingContractClosingOrder(PhoneBankingContractClosingOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.SaveAndApprovePhoneBankingContractClosingOrder(order);
            });

            return result;
        }

        public static PhoneBankingContractClosingOrder GetPhoneBankingContractClosingOrder(long orderID)
        {
            PhoneBankingContractClosingOrder order = new PhoneBankingContractClosingOrder();
            XBManagementService.Use(client =>
            {
                order = client.GetPhoneBankingContractClosingOrder(orderID);
            });
            return order;
        }

        public static ActionResult CancelTokenNumberReservation(HBToken token)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.CancelTokenNumberReservation(token);
            });

            return result;
        }


        public static PhoneBankingContractOrder GetPhoneBankingContractOrder(long orderID)
        {
            PhoneBankingContractOrder order = new PhoneBankingContractOrder();
            XBManagementService.Use(client =>
            {
                order = client.GetPhoneBankingContractOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveAndApproveHBServletRequestOrder(HBServletRequestOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.SaveAndApproveHBServletRequestOrder(order);
            });

            return result;
        }

        public static List<AssigneeCustomer> GetHBAssigneeCustomers(ulong customerNumber)
        {
            List<AssigneeCustomer> result = new List<AssigneeCustomer>();
            XBManagementService.Use(client =>
            {
                result = client.GetHBAssigneeCustomers(customerNumber);
            });

            return result;
        }

        public static HBApplicationQualityChangeOrder GetHBApplicationQualityChangeOrder(long orderId)
        {
            HBApplicationQualityChangeOrder order = new HBApplicationQualityChangeOrder();
            XBManagementService.Use(client =>
            {
                order = client.GetHBApplicationQualityChangeOrder(orderId);
            });
            return order;
        }
        public static HBServletRequestOrder GetHBServletRequestOrder(long orderId)
        {
            HBServletRequestOrder order = new HBServletRequestOrder();
            XBManagementService.Use(client =>
            {
                order = client.GetHBServletRequestOrder(orderId);
            });
            return order;
        }

        public static ActionResult SaveHBActivationOrder(HBActivationOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveHBActivationOrder(order);
            });
            return result;
        }
        
        public static List<HBActivationRequest> GetHBRequests()
        {
            List<HBActivationRequest> list = new List<HBActivationRequest>();

            XBManagementService.Use(client =>
            {
                list = client.GetHBRequests();
            });
            return list;

        }

        public static HBActivationOrder GetHBActivationOrder(long orderID)
        {
            HBActivationOrder order = new HBActivationOrder();
            XBManagementService.Use(client =>
            {
                order = client.GetHBActivationOrder(orderID);


            });
            return order;
        }
        public static Account GetOperationSystemAccount(Order order, OrderAccountType accountType, string operationCurrency, ushort filialCode = 0, string utilityBranch = "", ulong customerNumber = 0)
        {
            Account operationAccount = new Account();

            if (filialCode == 0)
            {
                string guid = "";

                if (HttpContext.Current.Request.Headers["SessionId"] != null)
                {
                    guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
                }
                XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

                filialCode = user.filialCode;
            }

            XBManagementService.Use(client =>
            {
                operationAccount = client.GetOperationSystemAccount(order, accountType, operationCurrency, filialCode, utilityBranch, customerNumber);
            });

            return operationAccount;

        }

        public static Double GetTokenServiceFee(DateTime operationDate,HBServiceFeeRequestTypes requestType, HBTokenTypes tokenType, HBTokenSubType tokenSubType)
        {
            Double fee = 0; 
            XBManagementService.Use(client =>
            {
                fee = client.GetHBServiceFee(operationDate, requestType, tokenType, tokenSubType);
            });
            return fee;
        }
        public static Double GetEntryDataPermissionServiceFee( HBServiceFeeRequestTypes requestType)
        {
            Double fee = 0;
            DateTime operationDate = XBService.GetCurrentOperDay();
            XBManagementService.Use(client =>
            {
                fee = client.GetHBServiceFee(operationDate, requestType, HBTokenTypes.NotSpecified, HBTokenSubType.NotSpecified);
            });
            return fee;
        }

        public static String GetHBTokenGID(int hbuserID, HBTokenTypes tokenType)
        {
            String GID="";
            XBManagementService.Use(client =>
            {
                GID = client.GetHBTokenGID(hbuserID, tokenType);
            });
            return GID;
        }
        public static ActionResult SaveHBRegistrationCodeResendOrder(HBRegistrationCodeResendOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.SaveHBRegistrationCodeResendOrder(order);
            });

            return result;
        }
        public static ActionResult SaveHBActivationRejectionOrder(HBActivationRejectionOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveHBActivationRejectionOrder(order);
            });
            return result;
        }

        public static List<HBUserLog> GetHBUserLog(String userName)
        {
            List<HBUserLog> hbUserLog = new List<HBUserLog>();
            XBManagementService.Use(client =>
            {
                hbUserLog = client.GetHBUserLog(userName);
            });
            return hbUserLog;
        }

        public static PhoneBankingContractActivationRequest GetPhoneBankingRequests()
        {
            PhoneBankingContractActivationRequest req = new PhoneBankingContractActivationRequest();

            XBManagementService.Use(client =>
            {
                req = client.GetPhoneBankingRequests();
            });
            return req;

        }
        public static ActionResult SaveAndApprovePhoneBankingContractActivationOrder(PhoneBankingContractActivationOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApprovePhoneBankingContractActivationOrder(order);
            });
            return result;
        }


        public static List<string> GetUnusedTokensByFilialAndRange(string from,string to, int filial)
        {
            List<string> tokenNumbers = new List<string>();
            XBManagementService.Use(client =>
            {
                tokenNumbers = client.GetUnusedTokensByFilialAndRange(from, to,filial);
            });

            return tokenNumbers;
        }

        public static void MoveUnusedTokens(int filialToMove, List<String> unusedTokens)
        {
            XBManagementService.Use(client =>
            {
                client.MoveUnusedTokens(filialToMove, unusedTokens);
            });
        }

        public static ActionResult SaveAndApproveHBApplicationFullPermissionsGrantingOrder(HBApplicationFullPermissionsGrantingOrder order)
        {
            ActionResult result = new ActionResult();
            XBManagementService.Use(client =>
            {
                result = client.SaveAndApproveHBApplicationFullPermissionsGrantingOrder(order);
            });

            return result;
        }

        public static HBApplicationFullPermissionsGrantingOrder GetHBApplicationFullPermissionsGrantingOrder(long orderId)
        {
            HBApplicationFullPermissionsGrantingOrder order = new HBApplicationFullPermissionsGrantingOrder();
            XBManagementService.Use(client =>
            {
                order = client.GetHBApplicationFullPermissionsGrantingOrder(orderId);
            });
            return order;
        }


    }
}