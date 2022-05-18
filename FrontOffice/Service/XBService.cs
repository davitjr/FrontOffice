using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.XBS;
using System.ServiceModel;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Net.Sockets;
using System.Web.Script.Serialization;
using System.Threading.Tasks;

namespace FrontOffice.Service
{
    public class XBService
    {
        public static List<Account> GetAccounts()
        {
            List<Account> accounts = null;
            XBService.Use(client =>
            {
                accounts = client.GetAccounts();
            }
          );

            return accounts;
        }

        public static Account GetAccount(string accountNumber)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetAccount(accountNumber);
            }
            );

            return account;
        }


        public static Account GetCurrentAccount(string accountNumber)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetCurrentAccount(accountNumber);
                if (account.JointType != 0)
                {
                    account.JointPerson = GetAccountJointCustomers(accountNumber);
                }
                else
                {
                    account.JointPerson = new List<JointCustomerModel>();
                }



            }
            );

            return account;
        }

        public static List<Account> GetCurrentAccounts(ProductQualityFilter filter)
        {
            List<Account> currentAccounts = new List<Account>();
            XBService.Use(client =>
            {
                currentAccounts = client.GetCurrentAccounts(filter);


                foreach (Account ac in currentAccounts)
                {
                    if (ac.JointType != 0)
                    {
                        ac.JointPerson = GetAccountJointCustomers(ac.AccountNumber);
                    }
                    else
                    {
                        ac.JointPerson = new List<JointCustomerModel>();
                    }

                }


            }
           );


            return currentAccounts;
        }


        public static List<MembershipRewardsBonusHistory> GetCardMembershipRewardsBonusHistory(string cardNumber, DateTime startDate, DateTime endDate)
        {
            List<MembershipRewardsBonusHistory> mrBonusHistory = new List<MembershipRewardsBonusHistory>();
            XBService.Use(client =>
            {
                mrBonusHistory = client.GetCardMembershipRewardsBonusHistory(cardNumber, startDate, endDate);
            }
           );
            return mrBonusHistory;
        }

        internal static void DeleteDepoAccounts(ulong customerNumber)
        {
            XBService.Use(client =>
            {
                client.DeleteDepoAccounts(customerNumber);
            }
           );

        }

        public static List<Card> GetCards(ProductQualityFilter filter)
        {
            List<Card> cards = null;
            XBService.Use(client =>
            {
                cards = client.GetCards(filter, false);
            }
           );
            bool isDAHKAvailability = IsDAHKAvailability(GetAuthorizedCustomerNumber());
            if (filter == ProductQualityFilter.Closed)
            {
                List<Card> closedCards = new List<Card>();
                closedCards.AddRange(cards);
                closedCards = closedCards.OrderByDescending(m => m.OpenDate).GroupBy(i => i.CardAccount.AccountNumber).Select(g => g.First()).ToList();

                foreach (Card card in cards)
                {
                    foreach (Card closedCard in closedCards)
                    {
                        if (card.ProductId == closedCard.ProductId && isDAHKAvailability)
                        {
                            card.DAHKDetail = GetCardDAHKDetails(card.CardNumber);
                        }
                    }
                }
            }
            else
            {
                if (isDAHKAvailability)
                {
                    cards.ForEach(m => m.DAHKDetail = GetCardDAHKDetails(m.CardNumber));
                }
            }

            return cards;
        }


        public static List<Deposit> GetDeposits(ProductQualityFilter filter)
        {
            List<Deposit> deposits = new List<Deposit>();
            XBService.Use(client =>
            {
                deposits = client.GetDeposits(filter);
            }
           );
            return deposits;
        }

        public static List<Loan> GetLoans(ProductQualityFilter filter)
        {
            List<Loan> loans = new List<Loan>();
            XBService.Use(client =>
            {
                loans = client.GetLoans(filter);
            });

            if (filter == ProductQualityFilter.Opened)
            {


                if (loans.Exists(m => m.Quality == 5))
                {
                    List<Loan> overdueloans = new List<Loan>();
                    overdueloans = loans.FindAll(m => m.Quality == 5);
                    loans.RemoveAll(m => m.Quality == 5);
                    overdueloans.Sort((l1, l2) => l1.NextRepayment.RepaymentDate.CompareTo(l2.NextRepayment.RepaymentDate));
                    List<Loan> otherloans = new List<Loan>();
                    otherloans = loans;
                    loans = new List<Loan>();
                    otherloans.Sort((l1, l2) => l1.NextRepayment.RepaymentDate.CompareTo(l2.NextRepayment.RepaymentDate));
                    loans.AddRange(overdueloans);
                    loans.AddRange(otherloans);
                }
                else
                {
                    loans.Sort((l1, l2) => l1.NextRepayment.RepaymentDate.CompareTo(l2.NextRepayment.RepaymentDate));
                }
            }

            return loans;
        }


        public static List<PeriodicTransfer> GetPeriodicTransfers(ProductQualityFilter filter)
        {
            List<PeriodicTransfer> periodicTransfers = new List<PeriodicTransfer>();
            XBService.Use(client =>
            {
                periodicTransfers = client.GetPeriodicTransfers(filter);
            }
             );

            return periodicTransfers;
        }

        public static PeriodicTransfer GetPeriodicTransfer(ulong productID)
        {
            PeriodicTransfer periodicTransfer = new PeriodicTransfer();
            XBService.Use(client =>
            {
                periodicTransfer = client.GetPeriodicTransfer(productID);
            }
            );
            return periodicTransfer;
        }


        public static AccountStatement GetAccountStatement(string accountNumber, DateTime dateFrom, DateTime dateTo)
        {
            AccountStatement accountStatement = null;
            string guid = "";

            if (HttpContext.Current.Request.Headers["SessionId"] != null)
            {
                guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
            }
            User user = (User)HttpContext.Current.Session[guid + "_User"];
            if (XBService.AccountAccessible(accountNumber, user.AccountGroup))
            {
                XBService.Use(client =>
                {
                    accountStatement = client.AccountStatement(accountNumber, dateFrom, dateTo, -1, -1, null, 0, 0);
                }
               );
            }
            return accountStatement;
        }

        public static Card GetCard(ulong productId)
        {
            Card card = new Card();
            XBService.Use(client =>
            {
                card = client.GetCard(productId);
            }
           );
            return card;
        }
        public static Deposit GetDeposit(ulong productId)
        {
            Deposit deposit = new Deposit();
            XBService.Use(client =>
            {
                deposit = client.GetDeposit(productId);
                if (deposit != null)
                {
                    deposit.ThirdPersonDescription = new List<string>();
                    deposit.ThirdPersonDescription.AddRange(GetDepositJointCustomers(productId));
                }
            }
           );


            return deposit;
        }

        public static List<string> GetDepositJointCustomers(ulong productId)
        {
            List<ulong> list = new List<ulong>();
            List<string> fullnames = new List<string>();
            XBService.Use(client =>
            {
                list = client.GetDepositJointCustomers(productId);
            });

            for (int i = 0; i < list.Count; i++)
            {
                string fullname = ACBAOperationService.GetCustomerDescription(list[i]);
                fullnames.Add(Utility.ConvertAnsiToUnicode(fullname));
            }


            return fullnames;
        }


        public static ReferenceOrder GetReferenceOrder(long id)
        {
            ReferenceOrder reference = new ReferenceOrder();
            XBService.Use(client =>
            {
                reference = client.GetReferenceOrder(id);

            }
           );
            return reference;
        }

        public static Loan GetLoan(ulong productId)
        {
            Loan loan = new Loan();
            XBService.Use(client =>
            {
                loan = client.GetLoan(productId);
            }
          );
            return loan;
        }

        public static ActionResult SavePaymentOrder(PaymentOrder paymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;
                result = client.SaveAndApprovePaymentOrder(paymentOrder);
            }
          );

            return result;
        }
        public static ActionResult SaveBudgetPaymentOrder(BudgetPaymentOrder paymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;

                result = client.SaveAndApproveBudgetPaymentOrder(paymentOrder);
            }
          );

            return result;
        }
        public static ActionResult SaveInternationalPaymentOrder(InternationalPaymentOrder paymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;

                result = client.SaveAndApproveInternationalPaymentOrder(paymentOrder);
            }
          );

            return result;
        }

        public static ActionResult SaveFastTransferPaymentOrder(FastTransferPaymentOrder paymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;

                result = client.SaveAndApproveFastTransferPaymentOrder(paymentOrder);
            }
          );

            return result;
        }

        public static ActionResult SaveReceivedFastTransferPaymentOrder(ReceivedFastTransferPaymentOrder paymentOrder, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;

                result = client.SaveAndApproveReceivedFastTransferPaymentOrder(paymentOrder, authorizedUserSessionToken);
            }
          );

            return result;
        }

        public static double GetFastTransferFeeAcbaPercent(byte transferType)
        {
            double percent = 0;
            XBService.Use(client =>
            {

                percent = client.GetFastTransferFeeAcbaPercent(transferType);
            });

            return percent;
        }

        public static double GetReceivedFastTransferFeePercent(byte transferType, string code = "", string countryCode = "", double amount = 0, string currency = "", DateTime date = new DateTime())
        {
            double percent = 0;
            XBService.Use(client =>
            {

                percent = client.GetReceivedFastTransferFeePercent(transferType, code, countryCode, amount, currency, date);
            });

            return percent;
        }

        public static byte GetFastTransferAcbaCommisionType(byte transferType, string code)
        {
            byte type = 0;
            XBService.Use(client =>
            {

                type = client.GetFastTransferAcbaCommisionType(transferType, code);
            });

            return type;
        }

        public static ActionResult SaveReferenceOrder(ReferenceOrder reference)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                reference.RegistrationDate = reference.RegistrationDate.Date;
                result = client.SaveAndApproveReferenceOrder(reference);
            }
         );

            return result;

        }

        public static List<Account> GetAccountsForOrder(short orderType, byte orderSubType, byte accountType)
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetAccountsForOrder(orderType, orderSubType, accountType, false);

            }
         );
            return accounts;
        }

        public static List<Account> GetCustomerAccountsForOrder(ulong customerNumber, short orderType, byte orderSubType, byte accountType)
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {

                accounts = client.GetCustomerAccountsForOrder(customerNumber, orderType, orderSubType, accountType);
            }
         );
            return accounts;
        }

        public static List<Communal> FindUtilityPayments(SearchCommunal searchCommunal, bool isSearch = true)
        {
            List<Communal> utilityPayments = new List<Communal>();
            XBService.Use(client =>
            {
                utilityPayments = client.GetCommunals(searchCommunal, isSearch);
            }
             );
            return utilityPayments;
        }

        public static ActionResult SaveDepositOrder(DepositOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.Deposit;
                order.SubType = 1;
                order.RegistrationDate = order.RegistrationDate.Date;
                if (order.AccountType == 0)
                {
                    order.AccountType = 1;
                }
                else if (order.AccountType == 1)
                {
                    order.AccountType = 2;
                }
                else if (order.AccountType == 2)
                {
                    order.AccountType = 3;
                }
                if (order.DepositType == DepositType.ChildrensDeposit)
                {
                    order.RecontractPossibility = YesNo.No;
                }
                result = client.SaveAndApproveDepositOrder(order);
            }
             );
            return result;
        }
        public static ActionResult SaveTerminateDepositOrder(DepositTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.OrderNumber = "";
                order.Type = OrderType.DepositTermination;
                order.RegistrationDate = DateTime.Now.Date;
                order.OperationDate = XBService.GetCurrentOperDay();
                result = client.SaveAndApproveDepositTermination(order);
            }
             );
            return result;
        }


        public static double GetLastRates(string currency, RateType rateType, ExchangeDirection direction)
        {
            double rate = 0;

            string guid = Utility.GetSessionId();

            XBService.Use(client =>
            {
                User user = (User)System.Web.HttpContext.Current.Session[guid + "_User"];
                rate = client.GetLastExchangeRate(currency, rateType, direction, user.filialCode);
            });

            return rate;
        }
        public static DepositOrderCondition GetDepositCondition(DepositOrder order)
        {
            DepositOrderCondition condition = new DepositOrderCondition();
            XBService.Use(client =>
            {

                condition = client.GetDepositCondition(order);

            });
            return condition;
        }

        public static XBS.ActionResult CheckDepositOrderCondition(DepositOrder order)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            XBService.Use(client =>
            {

                order.Type = OrderType.Deposit;

                result = (XBS.ActionResult)client.CheckDepositOrderCondition(order);

            });
            return result;
        }
        public static ChequeBookOrder GetChequeBookOrder(long orderID)
        {
            ChequeBookOrder order = new ChequeBookOrder();
            XBService.Use(client =>
            {
                order = client.GetChequeBookOrder(orderID);


            });
            return order;
        }
        public static ActionResult SaveChequeBookOrder(ChequeBookOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveChequeBookOrder(order);
            });
            return result;
        }



        public static CashOrder GetCashOrder(long orderID)
        {
            CashOrder order = new CashOrder();
            XBService.Use(client =>
            {

                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetCashOrder(orderID);
            });
            return order;
        }
        public static ActionResult SaveCashOrder(CashOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveCashOrder(order);
            });
            return result;
        }



        public static List<DepositRepayment> GetDepositRepayments(ulong productId)
        {
            List<DepositRepayment> repayments = new List<DepositRepayment>();
            XBService.Use(client =>
            {
                repayments = client.GetDepositRepayments(productId);
            });
            return repayments;
        }

        public static ActionResult SaveStatmentByEmailOrder(StatmentByEmailOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveStatmentByEmailOrder(order);
            });
            return result;
        }
        public static SwiftCopyOrder GetSwiftCopyOrder(long orderID)
        {
            SwiftCopyOrder order = new SwiftCopyOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetSwiftCopyOrder(orderID);


            });
            return order;
        }
        public static ActionResult SaveSwiftCopyOrder(SwiftCopyOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                order.Currency = "AMD";
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveSwiftCopyOrder(order);



            });
            return result;
        }
        public static Dictionary<ulong, string> GetThirdPersons()
        {
            Dictionary<ulong, string> AllThirdPerson = new Dictionary<ulong, string>();

            XBService.Use(client =>
            {

                AllThirdPerson = client.GetThirdPersons();

            });
            return AllThirdPerson;
        }
        public static StatmentByEmailOrder GetStatmentByEmailOrder(long orderID)
        {
            StatmentByEmailOrder order = new StatmentByEmailOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetStatmentByEmailOrder(orderID);
            });
            return order;
        }


        public static Boolean ManuallyRateChangingAccess(double amount, string currency, string currencyConvertation, SourceType sourceType)
        {
            Boolean result = new Boolean();
            XBService.Use(client =>
            {
                result = client.ManuallyRateChangingAccess(amount, currency, currencyConvertation, sourceType);

            });
            return result;
        }

        ////////////////////
        public static TransferByCallList GetTransferList(TransferByCallFilter filter)
        {
            TransferByCallList transfers = new TransferByCallList();
            ulong customerNumber = GetAuthorizedCustomerNumber();
            XBService.Use(client =>
            {
                if (customerNumber == 0)
                    transfers = client.GetTransfersbyCall(filter);
                else
                {
                    filter.CustomerNumber = customerNumber;
                    transfers = client.GetCustomerTransfersbyCall(filter);
                }
            });

            return transfers;
        }

        public static List<Transfer> GetTransfers(TransferFilter filter)
        {
            List<Transfer> transfers = new List<Transfer>();

            XBService.Use(client =>
            {
                transfers = client.GetTransfers(filter);
            });

            return transfers;
        }

        public static List<Transfer> GetTransfersForHB(TransferFilter filter)
        {
            List<Transfer> transfers = new List<Transfer>();

            XBService.Use(client =>
            {
                transfers = client.GetTransfersForHB(filter);
            });

            return transfers;
        }

        public static List<ReceivedBankMailTransfer> GetReceivedBankMailTransfers(TransferFilter filter)
        {

            List<ReceivedBankMailTransfer> transfers = new List<ReceivedBankMailTransfer>();

            XBService.Use(client =>
            {
                transfers = client.GetReceivedBankMailTransfers(filter);
            });

            return transfers;
        }



        public static CustomerDataOrder GetCustomerDataOrder(long orderID)
        {
            CustomerDataOrder order = new CustomerDataOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetCustomerDataOrder(orderID);
            });
            return order;
        }
        public static ActionResult SaveCustomerDataOrder(CustomerDataOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                if (order.Password == null)
                {
                    order.Password = "";
                }
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveCustomerDataOrder(order);

            });
            return result;
        }


        public static DepositOrder GetDepositOrder(long orderID)
        {
            DepositOrder order = new DepositOrder();
            XBService.Use(client =>
            {
                order = client.GetDepositorder(orderID);

            });
            return order;
        }


        public static List<LoanRepaymentGrafik> GetLoanGrafik(Loan loan)
        {
            List<LoanRepaymentGrafik> grafik = new List<LoanRepaymentGrafik>();
            XBService.Use(client =>
            {
                grafik = client.GetLoanGrafik(loan);
            });

            foreach (LoanRepaymentGrafik item in grafik)
            {
                if (item.RescheduledAmount > 0)
                {
                    if (item.FeeRepayment - item.RescheduledAmount > 0)
                        item.FeeRepayment = item.FeeRepayment - item.RescheduledAmount;
                }
            }

            return grafik;
        }

        public static List<LoanRepaymentGrafik> GetLoanInceptiveGrafik(Loan loan, ulong customerNumber)
        {
            List<LoanRepaymentGrafik> grafik = new List<LoanRepaymentGrafik>();
            XBService.Use(client =>
            {
                grafik = client.GetLoanInceptiveGrafik(loan, customerNumber);
            });

            foreach (LoanRepaymentGrafik item in grafik)
            {
                if (item.RescheduledAmount > 0)
                {
                    if (item.FeeRepayment - item.RescheduledAmount > 0)
                        item.FeeRepayment = item.FeeRepayment - item.RescheduledAmount;
                }
            }

            return grafik;
        }

        public static ActionResult SaveTransferCall(TransferByCall transferCall)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveTransferbyCall(transferCall);
            });

            return result;
        }

        public static ActionResult SaveAndApproveCallTransferChangeOrder(TransferByCallChangeOrder transferCall)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                transferCall.RegistrationDate = transferCall.RegistrationDate.Date;
                result = client.SaveAndApproveCallTransferChangeOrder(transferCall);
            });

            return result;
        }
        public static ActionResult SendTransfeerCallForPay(ulong transferID)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SendTransfeerCallForPay(transferID);
            });

            return result;
        }

        public static List<CommunalDetails> GetUtilityPaymentDetails(short communalType, string abonentNumber, short checkType, string branchCode, short abonentType)
        {
            List<CommunalDetails> details = new List<CommunalDetails>();
            XBService.Use(client =>
            {

                details = client.GetCommunalDetails(communalType, abonentNumber, checkType, branchCode, abonentType == 1 ? AbonentTypes.physical : AbonentTypes.legal);
            });
            return details;
        }

        public static ActionResult SaveUtilityPaymentOrder(UtilityPaymentOrder paymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;
                result = client.SaveAndApproveUtilityPaymentOrder(paymentOrder);
            });

            return result;
        }

        public static CardStatement GetCardStatement(Card card, DateTime dateFrom, DateTime dateTo)
        {
            CardStatement cardStatement = null;
            string guid = "";

            if (HttpContext.Current.Request.Headers["SessionId"] != null)
            {
                guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
            }
            User user = (User)HttpContext.Current.Session[guid + "_User"];
            if (XBService.AccountAccessible(card.CardAccount.AccountNumber, user.AccountGroup))
            {
                XBService.Use(client =>
                {

                    cardStatement = client.GetCardStatement(card.CardNumber, dateFrom, dateTo, -1, -1, null, 0, 0);
                });
            }

            return cardStatement;
        }
        public static List<PeriodicTransferHistory> GetTransfersHistory(long ProductId, DateTime dateFrom, DateTime dateTo)
        {
            List<PeriodicTransferHistory> transferHistory = new List<PeriodicTransferHistory>();
            XBService.Use(client =>
            {

                transferHistory = client.GetPeriodicTransferHistory(ProductId, dateFrom, dateTo);
            });
            return transferHistory;
        }

        public static List<Order> GetOrders(SearchOrders searchParams)
        {
            List<Order> orders = new List<Order>();

            if (searchParams.IsATSAccountOrders)
            {
                string guid = Utility.GetSessionId();

                User user = (User)HttpContext.Current.Session[guid + "_User"];
                searchParams.OperationFilialCode = user.filialCode;
            }

            List<KeyValuePair<string, string>> autoconfirmTypes = InfoService.GetAutoConfirmOrderTypes();
            XBService.Use(client =>
            {
                orders = client.GetOrders(searchParams);
            });

            for (int i = 0; i < orders.Count; i++)
            {   //Արագ փոխանցումների դեպքում նայում ենք sub_type=1-ի համար
                //   if ((short)orders[i].Type == 79)
                if ((short)orders[i].Type == 79 || (short)orders[i].Type == 76 || (short)orders[i].Type == 102)
                {
                    if (autoconfirmTypes.Contains(new KeyValuePair<string, string>(((short)orders[i].Type).ToString(), "1")))
                    {
                        orders[i].HasAoutomaticConfirmation = true;
                    }
                }
                else if (autoconfirmTypes.Contains(new KeyValuePair<string, string>(((short)orders[i].Type).ToString(), ((short)orders[i].SubType).ToString())))
                {
                    orders[i].HasAoutomaticConfirmation = true;
                }
            }

            return orders;
        }


        public static List<CreditLineGrafik> GetCreditLineGrafik(CreditLine creditLine)
        {
            List<CreditLineGrafik> grafik = new List<CreditLineGrafik>();
            XBService.Use(client =>
            {
                grafik = client.GetCreditLineGrafik((ulong)creditLine.ProductId);
            });
            return grafik;
        }



        public static List<CreditLine> GetCreditLines(ProductQualityFilter filter)
        {
            List<CreditLine> list = new List<CreditLine>();

            XBService.Use(client =>
            {
                list = client.GetCreditLines(filter);

            });

            list = list.FindAll(m => m.Type == 25 || m.Type == 18 || m.Type == 46 || m.Type == 36 || m.Type == 60);
            return list;
        }

        public static List<CreditLine> GetCardClosedCreditLines(string cardNumber)
        {
            List<CreditLine> list = new List<CreditLine>();

            XBService.Use(client =>
            {
                list = client.GetCardClosedCreditLines(cardNumber);
            });

            return list;
        }

        public static CreditLine GetCreditLine(ulong productId)
        {
            CreditLine creditline = new CreditLine();
            XBService.Use(client =>
            {
                creditline = client.GetCreditLine(productId);
            });

            return creditline;
        }
        public static DepositCase GetDepositCase(ulong productId)
        {
            DepositCase depositCase = new DepositCase();
            XBService.Use(client =>
            {
                depositCase = client.GetDepositCase(productId);

            });
            return depositCase;
        }
        public static List<DepositCase> GetDepositCases(ProductQualityFilter filter)
        {
            List<DepositCase> list = new List<DepositCase>();
            XBService.Use(client =>
            {
                list = client.GetDepositCases(filter);
            });
            return list;
        }

        public static HasHB HasACBAOnline()
        {
            HasHB hasOnline = new HasHB();
            hasOnline = HasHB.No;
            XBService.Use(client =>
            {
                hasOnline = client.HasACBAOnline();
            });

            return hasOnline;
        }

        public static string GetArCaBalance(Card card)
        {
            string text = "";
            string guid = "";

            if (HttpContext.Current.Request.Headers["SessionId"] != null)
            {
                guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
            }
            User user = (User)HttpContext.Current.Session[guid + "_User"];
            if (XBService.AccountAccessible(card.CardAccount.AccountNumber, user.AccountGroup))
            {
                XBService.Use(client =>
                {
                    try
                    {
                        KeyValuePairOfstringdouble keyvalue = new KeyValuePairOfstringdouble();

                        keyvalue = client.GetArCaBalance(card.CardNumber);
                        string key = keyvalue.key.ToString();
                        double value = keyvalue.value;

                        if (key == "00")
                        {
                            text = value.ToString("#,0.00");
                        }
                        else
                            text = "0";
                    }
                    catch
                    {
                        text = "0";
                    }
                });
            }
            return text;
        }

        public static ArcaBalanceResponseData GetArCaBalanceResponseData(Card card)
        {
            string guid = "";

            ArcaBalanceResponseData result = new ArcaBalanceResponseData();

            if (HttpContext.Current.Request.Headers["SessionId"] != null)
            {
                guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
            }
            User user = (User)HttpContext.Current.Session[guid + "_User"];
            if (XBService.AccountAccessible(card.CardAccount.AccountNumber, user.AccountGroup))
            {
                XBService.Use(client =>
                {
                    result = client.GetArCaBalanceResponseData(card.CardNumber);
                });
            }
            return result;
        }

        public static PaymentOrder GetPaymentOrder(long orderID)
        {
            PaymentOrder order = new PaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetPaymentOrder(orderID);
                order.Receiver = Utility.ConvertAnsiToUnicode(order.Receiver);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }
        public static BudgetPaymentOrder GetBudgetPaymentOrder(long orderID)
        {
            BudgetPaymentOrder order = new BudgetPaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetBudgetPaymentOrder(orderID);
                order.Receiver = Utility.ConvertAnsiToUnicode(order.Receiver);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }

        public static InternationalPaymentOrder GetInternationalPaymentOrder(long orderID)
        {
            InternationalPaymentOrder order = new InternationalPaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetInternationalPaymentOrder(orderID);
                order.Receiver = Utility.ConvertAnsiToUnicode(order.Receiver);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }

        public static FastTransferPaymentOrder GetFastTransferPaymentOrder(long orderID, string authorizedUserSessionToken)
        {
            FastTransferPaymentOrder order = new FastTransferPaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetFastTransferPaymentOrder(orderID, authorizedUserSessionToken);
                order.Receiver = Utility.ConvertAnsiToUnicode(order.Receiver);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }

        public static ReceivedFastTransferPaymentOrder GetReceivedFastTransferPaymentOrder(long orderID, string authorizedUserSessionToken)
        {
            ReceivedFastTransferPaymentOrder order = new ReceivedFastTransferPaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetReceivedFastTransferPaymentOrder(orderID, authorizedUserSessionToken);
                order.Receiver = Utility.ConvertAnsiToUnicode(order.Receiver);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }

        public static Transfer GetTransfer(ulong transferID)
        {
            Transfer transfer = new Transfer();
            XBService.Use(client =>
            {
                transfer = client.GetTransfer(transferID);

            });

            return transfer;
        }

        public static Transfer GetApprovedTransfer(ulong transferID)
        {
            Transfer transfer = new Transfer();
            XBService.Use(client =>
            {
                transfer = client.GetApprovedTransfer(transferID);

            });

            return transfer;
        }



        public static ReceivedBankMailTransfer GetReceivedBankMailTransfer(ulong transferID)
        {
            ReceivedBankMailTransfer transfer = new ReceivedBankMailTransfer();
            XBService.Use(client =>
            {
                transfer = client.GetReceivedBankMailTransfer(transferID);

            });

            return transfer;
        }
        public static UtilityPaymentOrder GetUtilityPaymentOrder(long orderID)
        {
            UtilityPaymentOrder utilityPayment = new UtilityPaymentOrder();
            XBService.Use(client =>
            {
                utilityPayment = client.GetUtilityPaymentOrder(orderID);
            });

            return utilityPayment;
        }

        public static List<OrderHistory> GetOrderHistory(long orderId)
        {
            List<OrderHistory> orders = new List<OrderHistory>();
            XBService.Use(client =>
            {
                orders = client.GetOrderHistory(orderId);
            });

            return orders;
        }

        public static List<CustomerDebts> GetCustomerDebts(ulong customerNumber)
        {
            List<CustomerDebts> list = new List<CustomerDebts>();

            XBService.Use(client =>
            {
                list = client.GetCustomerDebts(customerNumber);
            }
            );

            return list;
        }

        public static List<OverdueDetail> GetOverdueDetails()
        {
            List<OverdueDetail> list = new List<OverdueDetail>();


            XBService.Use(client =>
            {
                list = client.GetOverdueDetails();
            }
            );
            return list;
        }

        public static List<OverdueDetail> GetCurrentProductOverdueDetails(long productId)
        {
            List<OverdueDetail> list = new List<OverdueDetail>();


            XBService.Use(client =>
            {
                list = client.GetCurrentProductOverdueDetails(productId);
            }
            );

            return list;
        }

        public static void GenerateLoanOverdueUpdate(long productId, DateTime startDate, DateTime? endDate, string updateReason, short setNumber)
        {
            XBService.Use(client =>
            {
                client.GenerateLoanOverdueUpdate(productId, startDate, endDate, updateReason, setNumber);
            });
        }

        public static void SaveExternalBankingLogOutHistory(string authorizedUserSessionToken)
        {
            Use(client =>
            {
                client.SaveExternalBankingLogOutHistory(authorizedUserSessionToken);
            });
        }


        //public static FrontOffice.XBS.ActionResult SendSMSAuthorizationCode()
        //{
        //    FrontOffice.XBS.ActionResult result = new FrontOffice.XBS.ActionResult();
        //    XBService.Use(client =>
        //    {
        //        result = client.SendAutorizationSMS();
        //    }
        //  );

        //    return result;
        //}

        //public static FrontOffice.XBS.ActionResult VerifySMSAuthorizationCode(string smsCode)
        //{
        //    FrontOffice.XBS.ActionResult result = new FrontOffice.XBS.ActionResult();
        //    XBService.Use(client =>
        //    {
        //        result = client.VerifyAuthorizationSMS(smsCode);
        //    }
        //  );

        //    return result;
        //}

        public static void Use(Action<IXBService> action)
        {

            string guid = "";

            if (HttpContext.Current.Request.Headers["SessionId"] != null)
            {
                guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
            }

            User user = (User)HttpContext.Current.Session[guid + "_User"];

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

            IXBService client = ProxyManager<IXBService>.GetProxy(nameof(IXBService));

            try
            {
                checkCustomerSession = client.Init(authorisedCustomerSessionId, 1, ipAddress, user, source, serviceType);

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


                ////For new XBService
                //using (new OperationContextScope((IContextChannel)client))
                //{
                //    Utility.SetAuthorizationHeadersForXBService();

                //    action(client);
                //    ((IClientChannel)client).Close();

                //    success = true;
                //}


            }
            catch (FaultException ex)
            {
                ((IClientChannel)client).Close();

                if (ex.Message == "Unauthorized")
                {
                    System.Web.HttpContext.Current.Response.StatusCode = 419;
                    System.Web.HttpContext.Current.Response.StatusDescription = "CustomerSessionExpired";
                }
                else
                {

                    throw;
                }
            }

            catch (TimeoutException e)
            {

            }
            catch (Exception e)
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
                ((IClientChannel)client).Close();
                ((IClientChannel)client).Dispose();

            }
        }

        public static double GetPaymentOrderFee(PaymentOrder paymentOrder, int feeType)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetPaymentOrderFee(paymentOrder, feeType);
            }
          );

            return fee;
        }
        public static double GetInternationalPaymentOrderFee(InternationalPaymentOrder paymentOrder)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetInternationalPaymentOrderFee(paymentOrder);
            }
          );

            return fee;
        }
        public static double GetCardFee(PaymentOrder paymentOrder)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetCardFee(paymentOrder);
            }
          );

            return fee;
        }

        public static List<JointCustomerModel> GetAccountJointCustomers(string accountNumber)
        {
            List<KeyValuePairOfunsignedLongdouble> list = new List<KeyValuePairOfunsignedLongdouble>();
            List<JointCustomerModel> JointCustomers = new List<JointCustomerModel>();

            XBService.Use(client =>
            {
                list = client.GetAccountJointCustomers(accountNumber);
            });

            for (int i = 0; i < list.Count; i++)
            {
                JointCustomerModel jointCustomer = new JointCustomerModel();
                jointCustomer.CustomerNumber = list[i].key;
                jointCustomer.CustomerName = Utility.ConvertAnsiToUnicode(ACBAOperationService.GetCustomerDescription(list[i].key));
                jointCustomer.Part = list[i].value;
                JointCustomers.Add(jointCustomer);
            }

            return JointCustomers;
        }

        //public static List<TupleOfstringstring> GetCustomerAuthorizationData(ulong customerNumber)
        //{
        //    List<TupleOfstringstring> result = new List<TupleOfstringstring>();
        //    Use(client =>
        //    {
        //        result = client.GetCustomerAuthorizationData(customerNumber);
        //    }

        //        );

        //    return result;

        //}

        public static AuthorizedCustomer AuthorizeCustomer(ulong customerNumber, string authorizedUserSessionToken)
        {
            AuthorizedCustomer result = new AuthorizedCustomer();
            Use(client =>
            {
                result = client.AuthorizeCustomer(customerNumber, authorizedUserSessionToken);
            });
            return result;
        }

        public static ulong GetAuthorizedCustomerNumber()
        {
            ulong result = 0;
            Use(client =>
            {
                result = client.GetAuthorizedCustomerNumber();
            });
            return result;
        }


        public static List<TransferCallContract> GetContractsForTransfersCall(string customerNumber, string accountNumber, string cardNumber)
        {
            List<TransferCallContract> transfersCallContracts = new List<TransferCallContract>();
            XBService.Use(client =>
            {
                transfersCallContracts = client.GetContractsForTransfersCall(customerNumber, accountNumber, cardNumber);
            });
            return transfersCallContracts;
        }

        public static TransferCallContract GetContractDetails(long ContractId)
        {
            TransferCallContract transferCallContract = new TransferCallContract();
            XBService.Use(client =>
            {
                transferCallContract = client.GetContractDetails(ContractId);
            });
            return transferCallContract;
        }
        public static List<ExchangeRate> GetExchangeRates()
        {
            List<ExchangeRate> rateList = new List<ExchangeRate>();
            XBService.Use(client =>
            {
                rateList = client.GetExchangeRates();
            });
            return rateList;
        }


        public static TransferByCall GetTransferDetails(long transferId)
        {
            TransferByCall transferCall = new TransferByCall();
            XBService.Use(client =>
            {
                transferCall = client.GetTransferbyCall(transferId);
            });
            return transferCall;
        }

        public static ActionResult ConfirmTransfer(ulong transferID, short allowTransferConfirm, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.ConfirmTransfer(transferID, allowTransferConfirm, authorizedUserSessionToken);
            });
            return result;

        }

        public static ActionResult DeleteTransfer(ulong transferID, string description)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.DeleteTransfer(transferID, description);
            });
            return result;

        }

        public static ActionResult ApproveTransfer(TransferApproveOrder transferApproveOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.ApproveTransfer(transferApproveOrder);
            });
            return result;

        }
        public static List<AttachmentDocument> GetHBAttachmentsInfo(ulong documentId)
        {
            List<AttachmentDocument> attachmentDocumentList = new List<AttachmentDocument>();

            XBService.Use(client =>
            {
                attachmentDocumentList = client.GetHBAttachmentsInfo(documentId);
            });
            return attachmentDocumentList;
        }
        public static byte[] GetOneHBAttachment(ulong id)
        {
            byte[] attachment = null;
            XBService.Use(client =>
            {
                attachment = client.GetOneHBAttachment(id);
            });
            return attachment;
        }
        public static List<ProductDocument> GetProductDocuments(ulong productId)
        {
            List<ProductDocument> productDocumentsList = new List<ProductDocument>();

            XBService.Use(client =>
            {
                productDocumentsList = client.GetProductDocuments(productId);
            });
            return productDocumentsList;
        }
        public static ActionResult SaveMatureOrder(MatureOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveMatureOrder(order);
            }
         );

            return result;

        }
        public static MatureOrder GetMatureOrder(long id)
        {
            MatureOrder order = new MatureOrder();
            XBService.Use(client =>
            {
                order = client.GetMatureOrder(id);

            }
           );
            return order;
        }

        //public static ActionResult SavePlasticCardOrder(PlasticCardOrder cardOrder)
        //{
        //    ActionResult result = new ActionResult();
        //    XBService.Use(client =>
        //    {

        //        result = client.SavePlasticCardOrder(cardOrder);
        //    }
        //  );

        //    return result;
        //}
        public static ActionResult SaveAccountOrder(AccountOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                if (order.AccountType == 1)
                {
                    order.Type = OrderType.CurrentAccountOpen;
                }
                else if (order.AccountType == 2)
                {
                    order.Type = OrderType.JointCurrentAccountOpen;
                }
                else
                {
                    order.Type = OrderType.ThirdPersonDeposit;
                }
                result = client.SaveAndApproveAccountOrder(order);
            }
             );
            return result;
        }
        public static AccountOrder GetAccountOrder(long orderID)
        {
            AccountOrder order = new AccountOrder();
            XBService.Use(client =>
            {
                order = client.GetAccountOrder(orderID);
            });
            return order;
        }



        public static bool IsPoliceAccount(string accountNumber)
        {
            bool isPoliceAccount = false;

            XBService.Use(client =>
            {
                isPoliceAccount = client.IsPoliceAccount(accountNumber);
            }
          );

            return isPoliceAccount;
        }

        public static bool CheckAccountForPSN(string accountNumber)
        {
            bool forPSN = false;

            XBService.Use(client =>
            {
                forPSN = client.CheckAccountForPSN(accountNumber);
            }
          );

            return forPSN;
        }


        public static MembershipRewards GetCardMembershipRewards(string cardNumber)
        {
            MembershipRewards mr = new MembershipRewards();
            XBService.Use(client =>
            {
                mr = client.GetCardMembershipRewards(cardNumber);

            }
           );
            return mr;
        }


        public static Guarantee GetGuarantee(ulong productId)
        {
            Guarantee guarantee = new Guarantee();
            XBService.Use(client =>
            {
                guarantee = client.GetGuarantee(productId);
            }
          );
            return guarantee;
        }
        public static List<Guarantee> GetGuarantees(ProductQualityFilter filter)
        {
            List<Guarantee> guarantees = new List<Guarantee>();
            XBService.Use(client =>
            {
                guarantees = client.GetGuarantees(filter);
            }
          );
            return guarantees;
        }

        public static Accreditive GetAccreditive(ulong productId)
        {
            Accreditive accreditive = new Accreditive();
            XBService.Use(client =>
            {
                accreditive = client.GetAccreditive(productId);
            }
          );
            return accreditive;
        }
        public static List<Accreditive> GetAccreditives(ProductQualityFilter filter)
        {
            List<Accreditive> accreditives = new List<Accreditive>();
            XBService.Use(client =>
            {
                accreditives = client.GetAccreditives(filter);
            }
          );
            return accreditives;
        }

        public static PaidGuarantee GetPaidGuarantee(ulong productId)
        {
            PaidGuarantee paidGuarantee = new PaidGuarantee();
            XBService.Use(client =>
            {
                paidGuarantee = client.GetPaidGuarantee(productId);
            }
          );
            return paidGuarantee;
        }
        public static List<PaidGuarantee> GetPaidGuarantees(ProductQualityFilter filter)
        {
            List<PaidGuarantee> paidGuarantees = new List<PaidGuarantee>();
            XBService.Use(client =>
            {
                paidGuarantees = client.GetPaidGuarantees(filter);
            }
          );
            return paidGuarantees;
        }

        public static PaidAccreditive GetPaidAccreditive(ulong productId)
        {
            PaidAccreditive paidAccreditive = new PaidAccreditive();
            XBService.Use(client =>
            {
                paidAccreditive = client.GetPaidAccreditive(productId);
            }
          );
            return paidAccreditive;
        }
        public static List<PaidAccreditive> GetPaidAccreditives(ProductQualityFilter filter)
        {
            List<PaidAccreditive> paidAccreditives = new List<PaidAccreditive>();
            XBService.Use(client =>
            {
                paidAccreditives = client.GetPaidAccreditives(filter);
            }
          );
            return paidAccreditives;
        }

        public static Factoring GetFactoring(ulong productId)
        {
            Factoring factoring = new Factoring();
            XBService.Use(client =>
            {
                factoring = client.GetFactoring(productId);
            }
          );
            return factoring;
        }
        public static List<Factoring> GetFactorings(ProductQualityFilter filter)
        {
            List<Factoring> factorings = new List<Factoring>();
            XBService.Use(client =>
            {
                factorings = client.GetFactorings(filter);
            }
          );
            return factorings;
        }

        public static PaidFactoring GetPaidFactoring(ulong productId)
        {
            PaidFactoring paidFactoring = new PaidFactoring();
            XBService.Use(client =>
            {
                paidFactoring = client.GetPaidFactoring(productId);
            }
          );
            return paidFactoring;
        }
        public static List<PaidFactoring> GetPaidFactorings(ProductQualityFilter filter)
        {
            List<PaidFactoring> paidFactorings = new List<PaidFactoring>();
            XBService.Use(client =>
            {
                paidFactorings = client.GetPaidFactorings(filter);
            }
          );
            return paidFactorings;
        }

        public static ActionResult SaveAccountClosingOrder(AccountClosingOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CurrentAccountClose;
                result = client.SaveAndApproveAccountClosing(order);
            }
             );
            return result;
        }

        public static AccountClosingOrder GetAccountClosingOrder(long orderID)
        {
            AccountClosingOrder order = new AccountClosingOrder();
            XBService.Use(client =>
            {
                order = client.GetAccountClosingOrder(orderID);
            });
            return order;
        }

        public static List<SearchAccountResult> GetSearchedAccounts(SearchAccounts searchParams)
        {
            List<SearchAccountResult> searchedAccounts = new List<SearchAccountResult>();
            XBService.Use(client =>
            {
                searchedAccounts = client.GetSearchedAccounts(searchParams);
            });
            return searchedAccounts;
        }


        public static ActionResult SavePeriodicPaymentOrder(PeriodicPaymentOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndAprovePeriodicPaymentOrder(order);
            });
            return result;
        }
        public static ActionResult SavePeriodicUtilityPaymentOrder(PeriodicUtilityPaymentOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndAprovePeriodicUtilityPaymentOrder(order);
            });
            return result;
        }

        public static ActionResult SavePeriodicBudgetPaymentOrder(PeriodicBudgetPaymentOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndAprovePeriodicBudgetPaymentOrder(order);
            });
            return result;
        }

        public static List<SearchCardResult> GetSearchedCards(SearchCards searchParams)
        {
            List<SearchCardResult> cards = new List<SearchCardResult>();
            XBService.Use(client =>
            {
                cards = client.GetSearchedCards(searchParams);
            });

            return cards;
        }

        public static List<SearchSwiftCodes> GetSearchedSwiftCodes(SearchSwiftCodes searchParams)
        {
            List<SearchSwiftCodes> swiftCodes = new List<SearchSwiftCodes>();
            XBService.Use(client =>
            {
                swiftCodes = client.GetSearchedSwiftCodes(searchParams);
            });
            return swiftCodes;
        }

        public static ActionResult SaveCardClosingOrder(CardClosingOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CardClosing;
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveCardClosingOrder(order);
            }
             );
            return result;
        }
        public static CardClosingOrder GetCardClosingOrder(long orderID)
        {
            CardClosingOrder order = new CardClosingOrder();
            XBService.Use(client =>
            {
                order = client.GetCardClosingOrder(orderID);
            });
            return order;
        }

        public static List<string> GetCardClosingWarnings(ulong productId)
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetCardClosingWarnings(productId);
            });
            return warnings;
        }

        public static List<string> GetCredentialClosingWarnings(ulong assignId)
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetCredentialClosingWarnings(assignId);
            });
            return warnings;
        }

        public static PeriodicBudgetPaymentOrder GetPeriodicBudgetPaymentOrder(long orderID)
        {
            PeriodicBudgetPaymentOrder order = new PeriodicBudgetPaymentOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetPeriodicBudgetPaymentOrder(orderID);
            });
            return order;
        }
        public static PeriodicUtilityPaymentOrder GetPeriodicUtilityPaymentOrder(long orderID)
        {
            PeriodicUtilityPaymentOrder order = new PeriodicUtilityPaymentOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetPeriodicUtilityPaymentOrder(orderID);
            });
            return order;
        }
        public static PeriodicPaymentOrder GetPeriodicPaymentOrder(long orderID)
        {
            PeriodicPaymentOrder order = new PeriodicPaymentOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetPeriodicPaymentOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveAccountReOpenOrder(AccountReOpenOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CurrentAccountReOpen;
                result = client.SaveAndApproveAccountReOpenOrder(order);
            }
             );
            return result;
        }


        public static AccountReOpenOrder GetAccountReOpenOrder(long orderID)
        {
            AccountReOpenOrder order = new AccountReOpenOrder();
            XBService.Use(client =>
            {
                order = client.GetAccountReOpenOrder(orderID);

            });
            return order;
        }


        public static List<string> GetReceiverAccountWarnings(string accountNumber)
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetReceiverAccountWarnings(accountNumber);
            });
            return warnings;
        }

        public static ActionResult SavePeriodicTerminationOrder(PeriodicTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.OrderNumber = "";
                order.Type = OrderType.PeriodicTransferStop;
                order.RegistrationDate = DateTime.Now.Date;
                order.OperationDate = GetCurrentOperDay();
                result = client.SaveAndApprovePeriodicTerminationOrder(order);
            }
             );
            return result;
        }
        public static PeriodicTerminationOrder GetPeriodicTerminationOrder(long orderID)
        {
            PeriodicTerminationOrder order = new PeriodicTerminationOrder();
            XBService.Use(client =>
            {
                order = client.GetPeriodicTerminationOrder(orderID);
            });
            return order;
        }

        public static List<Account> GetAccountsForNewDeposit(DepositOrder order)
        {
            List<Account> accounts = new List<Account>();

            XBService.Use(client =>
            {
                accounts = client.GetAccountsForNewDeposit(order);
            }
           );

            return accounts;
        }



        public static List<AdditionalDetails> GetAccountAdditionalDetails(string accountNumber)
        {
            List<AdditionalDetails> additionalDetails = new List<AdditionalDetails>();
            XBService.Use(client =>
            {
                additionalDetails = client.GetAccountAdditionalDetails(accountNumber);
            });
            return additionalDetails;
        }

        public static Dictionary<string, string> GetAccountAdditionsTypes()
        {
            Dictionary<string, string> additionsTypes = new Dictionary<string, string>();
            XBService.Use(client =>
            {
                additionsTypes = client.GetAccountAdditionsTypes();
            });
            return additionsTypes;
        }

        public static string CreateSerialNumber(int currencyCode, byte operationType)
        {
            string SerialNumber = "";

            XBService.Use(client =>
            {
                SerialNumber = client.CreateSerialNumber(currencyCode, operationType);
            }
          );

            return SerialNumber;
        }

        public static ActionResult SaveCreditLineTerminationOrder(CreditLineTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCreditLineTerminationOrder(order);
            }
             );
            return result;
        }

        public static ulong GenerateNewOrderNumber(OrderNumberTypes orderNumberType)
        {
            ulong OrderNumber = 0;
            string guid = Utility.GetSessionId();

            User user = (User)HttpContext.Current.Session[guid + "_User"];

            XBService.Use(client =>
            {
                OrderNumber = client.GenerateNewOrderNumber(orderNumberType, user.filialCode);
            }
          );

            return OrderNumber;
        }


        public static List<KeyValuePair<string, string>> GetCommunalReportParameters(short utilityType, short abonentType, string searchData, string branch)
        {
            SearchCommunal searchCommunal = new SearchCommunal();
            searchCommunal.CommunalType = (CommunalTypes)utilityType;
            searchCommunal.AbonentType = abonentType;
            searchCommunal.Branch = branch;
            searchCommunal.AbonentNumber = searchData;
            searchCommunal.PhoneNumber = "";


            List<KeyValuePairOfstringstring> utilityPayments = new List<KeyValuePairOfstringstring>();

            List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();


            XBService.Use(client =>
            {
                utilityPayments = client.GetCommunalReportParameters(searchCommunal);

                //utilityPayments = client.GetCommunalReportParameters(searchCommunal);
            }
             );

            foreach (KeyValuePairOfstringstring oneParam in utilityPayments)
            {
                parameters.Add(new KeyValuePair<string, string>(key: oneParam.key, value: oneParam.value));
            }


            return parameters;
        }



        public static List<string> GetAccountOpenWarnings()
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetAccountOpenWarnings();
            });
            return warnings;
        }


        public static ActionResult SaveAccountDataChangeOrder(AccountDataChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.AccountDataChange;
                result = client.SaveAndApproveAccountDataChangeOrder(order);
            }
             );
            return result;
        }


        public static string GetCommunalPaymentDescription(short utilityType, short abonentType, string searchData, string branch, ushort paymentType = 0)
        {
            SearchCommunal communal = new SearchCommunal();
            communal.AbonentType = abonentType;
            communal.CommunalType = (CommunalTypes)utilityType;
            communal.AbonentNumber = searchData;
            communal.PhoneNumber = "";
            communal.Branch = branch;
            communal.PaymentType = paymentType;

            string description = "";
            XBService.Use(client =>
            {
                description = client.GetCommunalPaymentDescription(communal);
            });

            return description;
        }
        public static List<OPPerson> GetOrderOPPersons(string accountNumber, OrderType orderType)
        {
            List<OPPerson> persons = new List<OPPerson>();
            XBService.Use(client =>
            {
                persons = client.GetOrderOPPersons(accountNumber, orderType);
            });
            return persons;
        }
        public static List<string> GetCustomerDocumentWarnings(ulong customerNumber)
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetCustomerDocumentWarnings(customerNumber);
            });
            return warnings;
        }


        public static int GetAccountStatementDeliveryType(string accountNumber)
        {
            int DeliveryType = 0;

            XBService.Use(client =>
            {
                DeliveryType = client.GetAccountStatementDeliveryType(accountNumber);
            }
          );

            return DeliveryType;
        }

        public static SourceType GetSourceType()
        {
            SessionProperties sessionProperties = new SessionProperties();

            string guid = Utility.GetSessionId();
            sessionProperties = (SessionProperties)HttpContext.Current.Session[guid + "_SessionProperties"];
            SourceType source = SourceType.NotSpecified;

            if (sessionProperties != null)
            {
                source = (SourceType)sessionProperties.SourceType;
            }
            return source;
        }
        public static double GetThreeMonthLoanRate(ulong productId)
        {
            double rate = 0;

            XBService.Use(client =>
            {
                rate = client.GetThreeMonthLoanRate(productId);
            }
          );

            return rate;
        }



        public static OrderHistory GetOrderRejectHistory(long orderId)
        {
            OrderHistory orderHistory = new OrderHistory();

            List<OrderHistory> orderHistoryList = new List<OrderHistory>();

            orderHistoryList = XBService.GetOrderHistory(orderId);

            orderHistory = orderHistoryList.Find(m => m.Quality == OrderQuality.Declined);

            return orderHistory;
        }

        public static List<OrderAttachment> GetOrderAttachments(long orderId)
        {
            List<OrderAttachment> orderAttachmentsList = new List<OrderAttachment>();

            XBService.Use(client =>
            {
                orderAttachmentsList = client.GetOrderAttachments(orderId);
            }
        );

            return orderAttachmentsList;
        }

        public static OrderAttachment GetOrderAttachment(string id)
        {
            OrderAttachment attachment = null;
            XBService.Use(client =>
            {
                attachment = client.GetOrderAttachment(id);
            });
            return attachment;
        }

        public static OrderAttachment GetTransferAttachmentInfo(long Id)
        {
            OrderAttachment Attachment = new OrderAttachment();

            XBService.Use(client =>
            {
                Attachment = client.GetTransferAttachmentInfo(Id);
            }
        );

            return Attachment;
        }

        public static OrderAttachment GetTransferAttachment(ulong id)
        {
            OrderAttachment attachment = null;
            XBService.Use(client =>
            {
                attachment = client.GetTransferAttachment(id);
            });
            return attachment;
        }
        public static double GetLoanMatureCapitalPenalty(XBS.MatureOrder order)
        {
            double loanMatureCapitalPenalty = 0;
            string guid = Utility.GetSessionId();
            User user = (User)HttpContext.Current.Session[guid + "_User"];

            XBService.Use(client =>
            {
                loanMatureCapitalPenalty = client.GetLoanMatureCapitalPenalty(order, user);
            }
          );

            return loanMatureCapitalPenalty;
        }

        public static AccountDataChangeOrder GetAccountDataChangeOrder(long orderID)
        {
            AccountDataChangeOrder order = new AccountDataChangeOrder();
            XBService.Use(client =>
            {
                order = client.GetAccountDataChangeOrder(orderID);
            });
            return order;
        }

        public static TupleOfbooleanstring IsBigAmountForPaymentOrder(PaymentOrder paymentOrder)
        {
            TupleOfbooleanstring isBigAmount = new TupleOfbooleanstring();

            XBService.Use(client =>
            {
                isBigAmount = client.IsBigAmountForPaymentOrder(paymentOrder);
            }
          );

            return isBigAmount;
        }

        public static TupleOfbooleanstring IsBigAmountForCurrencyExchangeOrder(CurrencyExchangeOrder paymentOrder)
        {
            TupleOfbooleanstring isBigAmount = new TupleOfbooleanstring();

            XBService.Use(client =>
            {
                isBigAmount = client.IsBigAmountForCurrencyExchangeOrder(paymentOrder);
            }


          );

            return isBigAmount;
        }

        public static double GetOrderServiceFee(XBS.OrderType type, int urgent)
        {
            double serviceFee = 0;

            XBService.Use(client =>
            {
                serviceFee = client.GetOrderServiceFee(type, urgent);
            }
          );

            return serviceFee;
        }

        public static ActionResult SaveCurrencyExchangeOrder(CurrencyExchangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveCurrencyExchangeOrder(order);
            }
             );
            return result;
        }

        public static ActionResult SaveTransitPaymentOrder(TransitPaymentOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveTransitPaymentOrder(order);
            });
            return result;
        }

        public static TransitPaymentOrder GetTransitPaymentOrder(long orderID)
        {
            TransitPaymentOrder order = new TransitPaymentOrder();
            XBService.Use(client =>
            {

                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetTransitPaymentOrder(orderID);
            });
            return order;
        }

        public static double GetLoanCalculatedRest(Loan loan, ulong customerNumber, short matureType)
        {
            double calculatedRest = 0;

            XBService.Use(client =>
            {
                calculatedRest = client.GetLoanCalculatedRest(loan, customerNumber, matureType);
            }
          );

            return calculatedRest;
        }


        public static string GetPaymentOrderDescription(PaymentOrder order)
        {
            string description = "";

            XBService.Use(client =>
            {
                description = client.GetPaymentOrderDescription(order, GetAuthorizedCustomerNumber());
            }
          );

            return description;
        }

        public static bool CheckCustomerCashOuts(string currency, double amount)
        {
            double cashOuts = 0;
            bool check = false;

            amount = amount * XBService.GetCBKursForDate(DateTime.Now.Date, currency);

            XBService.Use(client =>
            {
                cashOuts = client.GetCustomerCashOuts(currency);
            }
            );

            if (cashOuts + amount > 6000000)
            {
                check = true;
            }

            return check;
        }

        public static CurrencyExchangeOrder GetShortChangeAmount(CurrencyExchangeOrder order)
        {
            XBService.Use(client =>
            {
                order = client.GetShortChangeAmount(order);
            }
          );

            return order;
        }

        public static ActionResult ConfirmOrder(long orderID)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ConfirmOrder(orderID);
            }
             );
            return result;
        }

        public static CardServiceFee GetCardServiceFee(ulong productId)
        {
            CardServiceFee serviceFee = new CardServiceFee();
            XBService.Use(client =>
            {
                serviceFee = client.GetCardServiceFee(productId);
            });
            return serviceFee;
        }
        public static ActionResult SaveServicePaymentOrder(ServicePaymentOrder servicePaymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                servicePaymentOrder.RegistrationDate = DateTime.Now.Date;

                result = client.SaveAndApproveServicePaymentOrder(servicePaymentOrder);
            }
          );

            return result;
        }

        public static Account GetOperationSystemAccount(Order order, OrderAccountType accountType, string operationCurrency, ushort filialCode = 0, string utilityBranch = "", ulong customerNumber = 0, ushort customerType = 0)
        {
            Account operationAccount = new Account();

            if (filialCode == 0)
            {
                string guid = "";

                if (HttpContext.Current.Request.Headers["SessionId"] != null)
                {
                    guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
                }
                User user = (User)HttpContext.Current.Session[guid + "_User"];

                filialCode = user.filialCode;
            }

            XBService.Use(client =>
            {
                operationAccount = client.GetOperationSystemAccount(order, accountType, operationCurrency, filialCode, utilityBranch, customerNumber, customerType);
            });

            return operationAccount;

        }

        public static Account GetTransitCurrencyExchangeOrderSystemAccount(TransitCurrencyExchangeOrder order, OrderAccountType accountType, string operationCurrency)
        {
            Account operationAccount = new Account();

            XBService.Use(client =>
            {
                operationAccount = client.GetTransitCurrencyExchangeOrderSystemAccount(order, accountType, operationCurrency);
            });

            return operationAccount;

        }


        public static ushort GetCrossConvertationVariant(string debitCurrency, string creditCurrency)
        {
            ushort crossVariant = 0;
            XBService.Use(client =>
            {
                crossVariant = client.GetCrossConvertationVariant(debitCurrency, creditCurrency);
            });
            return crossVariant;
        }


        public static List<AccountFreezeDetails> GetAccountFreezeHistory(string accountNumber, ushort freezeStatus, ushort reasonId)
        {
            List<AccountFreezeDetails> accountFreezeHistory = new List<AccountFreezeDetails>();
            XBService.Use(client =>
            {
                accountFreezeHistory = client.GetAccountFreezeHistory(accountNumber, freezeStatus, reasonId);
            }
           );
            return accountFreezeHistory;
        }


        public static AccountFreezeDetails GetAccountFreezeDetails(string freezeId)
        {

            AccountFreezeDetails accountFreezeDetails = new AccountFreezeDetails();
            XBService.Use(client =>
            {
                accountFreezeDetails = client.GetAccountFreezeDetails(freezeId);
            }
           );
            return accountFreezeDetails;
        }


        public static Account GetRAFoundAccount()
        {
            Account raAccount = new Account();
            XBService.Use(client =>
            {
                raAccount = client.GetRAFoundAccount();
            });
            return raAccount;
        }

        public static int GetCardType(string cardNumber)
        {
            int cardType = 0;
            XBService.Use(client =>
            {
                cardType = client.GetCardType(cardNumber);
            });
            return cardType;
        }

        public static double GetCashPosPaymentOrderFee(CashPosPaymentOrder cashPosPaymentOrder, int feeType)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetCashPosPaymentOrderFee(cashPosPaymentOrder, feeType);
            }
          );

            return fee;
        }

        public static ActionResult SaveCashPosPaymentOrder(CashPosPaymentOrder cashPosPaymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                cashPosPaymentOrder.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveCashPosPaymentOrder(cashPosPaymentOrder);
            }
          );

            return result;
        }


        public static double GetCBKursForDate(DateTime date, string currency)
        {
            double kurs = 0;
            XBService.Use(client =>
            {
                kurs = client.GetCBKursForDate(date, currency);
            });
            return kurs;
        }
        public static double GetCardTotalDebt(string cardNumber)
        {
            double fee = 0;
            XBService.Use(client =>
            {
                fee = client.GetCardTotalDebt(cardNumber);
            });
            return fee;
        }
        public static double GetMRFeeAMD(string cardNumber)
        {
            double fee = 0;
            XBService.Use(client =>
            {
                fee = client.GetMRFeeAMD(cardNumber);
            });
            return fee;
        }
        public static double GetPetTurk(long productId)
        {
            double fee = 0;
            XBService.Use(client =>
            {
                fee = client.GetPetTurk(productId);
            });
            return fee;
        }

        public static DateTime GetNextOperDay()
        {
            DateTime OperDay = new DateTime();
            XBService.Use(client =>
            {
                OperDay = client.GetNextOperDay();
            });
            return OperDay;
        }

        public static ActionResult SaveLoanProductOrder(LoanProductOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveLoanProductOrder(order);
            }
             );
            return result;
        }
        public static LoanProductOrder GetLoanOrder(long orderID)
        {
            LoanProductOrder order = new LoanProductOrder();
            XBService.Use(client =>
            {
                order = client.GetLoanOrder(orderID);
            });
            return order;
        }

        public static LoanProductOrder GetCreditLineOrder(long orderID)
        {
            LoanProductOrder order = new LoanProductOrder();
            XBService.Use(client =>
            {
                order = client.GetCreditLineOrder(orderID);
            });
            return order;
        }

        public static double GetCustomerAvailableAmount(string currency)
        {
            double availableAmount = 0;

            XBService.Use(client =>
            {
                availableAmount = client.GetCustomerAvailableAmount(currency);
            }
          );

            return availableAmount;
        }

        public static double GetLoanProductInterestRate(LoanProductOrder order, string cardNumber)
        {
            double interestRate = 0;

            XBService.Use(client =>
            {
                interestRate = client.GetLoanProductInterestRate(order, cardNumber);
            }
          );

            return interestRate;
        }




        public static ActionResult SaveAccountFreezeOrder(AccountFreezeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                order.Type = OrderType.AccountFreeze;
                result = client.SaveAndApproveAccountFreezeOrder(order);
            }
             );
            return result;
        }

        public static AccountFreezeOrder GetAccountFreezeOrder(long orderID)
        {
            AccountFreezeOrder order = new AccountFreezeOrder();
            XBService.Use(client =>
            {
                order = client.GetAccountFreezeOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveAccountUnFreezeOrder(AccountUnfreezeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                order.Type = OrderType.AccountUnfreeze;
                result = client.SaveAndApproveAccountUnfreezeOrder(order);
            }
             );
            return result;
        }

        public static AccountUnfreezeOrder GetAccountUnfreezeOrder(long orderID)
        {
            AccountUnfreezeOrder order = new AccountUnfreezeOrder();
            XBService.Use(client =>
            {
                order = client.GetAccountUnfreezeOrder(orderID);
            });
            return order;
        }

        public static double GetServiceProvidedOrderFee(OrderType orderType, ushort serviceType)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetServiceProvidedOrderFee(orderType, serviceType);
            }
          );

            return fee;
        }

        public static ActionResult SaveFeeForServiceProvidedOrder(FeeForServiceProvidedOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveFeeForServiceProvidedOrder(order);
            }
          );

            return result;
        }
        public static ActionResult SaveLoanProductActivationOrder(LoanProductActivationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveLoanProductActivationOrder(order);
            }
             );
            return result;
        }
        public static LoanProductActivationOrder GetLoanProductActivationOrder(long orderID)
        {
            LoanProductActivationOrder order = new LoanProductActivationOrder();
            XBService.Use(client =>
            {
                order = client.GetLoanProductActivationOrder(orderID);
            });
            return order;
        }

        public static List<Provision> GetProductProvisions(ulong productId)
        {
            List<Provision> provisions = new List<Provision>();
            XBService.Use(client =>
            {
                provisions = client.GetProductProvisions(productId);
            }
             );
            return provisions;
        }




        public static HasHB HasPhoneBanking()
        {
            HasHB hasOnline = new HasHB();
            hasOnline = HasHB.No;
            XBService.Use(client =>
            {
                hasOnline = client.HasPhoneBanking();
            });

            return hasOnline;

        }

        public static FeeForServiceProvidedOrder GetFeeForServiceProvidedOrder(long orderID)
        {
            FeeForServiceProvidedOrder order = new FeeForServiceProvidedOrder();
            XBService.Use(client =>
            {
                order = client.GetFeeForServiceProvidedOrder(orderID);
            });

            return order;
        }

        public static CashPosPaymentOrder GetCashPosPaymentOrder(long orderID)
        {
            CashPosPaymentOrder order = new CashPosPaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetCashPosPaymentOrder(orderID);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }

        public static ActionResult SaveCardUnpaidPercentPaymentOrder(CardUnpaidPercentPaymentOrder order)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                order.Type = OrderType.CardUnpayedPercentPayment;
                result = client.SaveAndApproveCardUnpaidPercentPaymentOrder(order);
            });

            return result;
        }

        public static CardUnpaidPercentPaymentOrder GetCardUnpaidPercentPaymentOrder(long ID)
        {
            CardUnpaidPercentPaymentOrder order = new CardUnpaidPercentPaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetCardUnpaidPercentPaymentOrder(ID);
            });

            return order;
        }

        public static ActionResult SaveRemovalOrder(RemovalOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveRemovalOrder(order);
            }
          );

            return result;
        }

        public static RemovalOrder GetRemovalOrder(long orderID)
        {
            RemovalOrder order = new RemovalOrder();
            XBService.Use(client =>
            {
                order = client.GetRemovalOrder(orderID);
            });

            return order;
        }
        public static List<ulong> GetProvisionOwners(ulong productId)
        {
            List<ulong> customerNumbers = new List<ulong>();
            XBService.Use(client =>
            {
                customerNumbers = client.GetProvisionOwners(productId);
            });


            return customerNumbers;
        }

        public static LoanMainContract GetLoanMainContract(ulong productId)
        {
            LoanMainContract contract = new LoanMainContract();
            XBService.Use(client =>
            {
                contract = client.GetLoanMainContract(productId);
            });

            return contract;
        }




        public static bool IsOurCard(string cardNumber)
        {
            bool isOurCard = true;
            XBService.Use(client =>
            {
                isOurCard = client.IsOurCard(cardNumber);
            });

            return isOurCard;
        }


        public static SourceType GetDepositSource(ulong productId)
        {
            SourceType source = new SourceType();
            XBService.Use(client =>
            {
                source = client.GetDepositSource(productId);
            });

            return source;
        }

        public static SourceType GetAccountSource(string accountNumber)
        {
            SourceType source = new SourceType();
            XBService.Use(client =>
            {
                source = client.GetAccountSource(accountNumber);
            });

            return source;
        }

        public static double GetAcccountAvailableBalance(string accountNumber)
        {
            double balance = 0;
            XBService.Use(client =>
            {
                balance = client.GetAcccountAvailableBalance(accountNumber);

            });

            return balance;
        }

        public static List<LoanMainContract> GetCreditLineMainContract()
        {
            List<LoanMainContract> contracts = new List<LoanMainContract>();
            XBService.Use(client =>
            {
                contracts = client.GetCreditLineMainContract();
            });

            return contracts;
        }

        public static List<LoanProductProlongation> GetLoanProductProlongations(ulong productId)
        {
            List<LoanProductProlongation> list = new List<LoanProductProlongation>();
            XBService.Use(client =>
            {
                list = client.GetLoanProductProlongations(productId);
            });
            return list;
        }

        public static List<MembershipRewardsStatusHistory> GetCardMembershipRewardsStatusHistory(string cardNumber)
        {
            List<MembershipRewardsStatusHistory> mr = new List<MembershipRewardsStatusHistory>();
            XBService.Use(client =>
            {
                mr = client.GetCardMembershipRewardsStatusHistory(cardNumber);

            }
           );
            return mr;
        }

        public static List<ProductOtherFee> GetProductOtherFees(ulong productId)
        {
            List<ProductOtherFee> list = new List<ProductOtherFee>();

            XBService.Use(client =>
            {
                list = client.GetProductOtherFees(productId);
            });

            return list;
        }


        public static List<Claim> GetProductClaims(ulong productId, short productType)
        {
            List<Claim> claims = new List<Claim>();
            XBService.Use(client =>
            {
                claims = client.GetProductClaims(productId, productType);
            });

            return claims;
        }


        public static List<ClaimEvent> GetClaimEvents(int claimNumber)
        {
            List<ClaimEvent> events = new List<ClaimEvent>();
            XBService.Use(client =>
            {
                events = client.GetClaimEvents(claimNumber);
            });

            return events;
        }

        public static Tax GetTax(int claimNumber, int eventNumber)
        {
            Tax tax = new Tax();
            XBService.Use(client =>
            {
                tax = client.GetTax(claimNumber, eventNumber);
            });
            return tax;
        }

        public static ChequeBookReceiveOrder GetChequeBookReceiveOrder(long orderID)
        {
            ChequeBookReceiveOrder order = new ChequeBookReceiveOrder();
            XBService.Use(client =>
            {
                order = client.GetChequeBookReceiveOrder(orderID);

            });
            return order;
        }

        public static ActionResult SaveChequeBookReceiveOrder(ChequeBookReceiveOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveChequeBookReceiveOrder(order);
            });
            return result;
        }

        public static XBS.UserAccessForCustomer GetUserAccessForCustomer(string userSessionToken, string customerSessionToken)
        {
            XBS.UserAccessForCustomer result = new XBS.UserAccessForCustomer();
            XBService.Use(client =>
            {
                result = client.GetUserAccessForCustomer(userSessionToken, customerSessionToken);
            });
            return result;
        }

        public static CardTariff GetCardTariff(ulong productId)
        {
            CardTariff cardTariffs = new CardTariff();
            XBService.Use(client =>
            {
                cardTariffs = client.GetCardTariff(productId);
            });
            return cardTariffs;
        }
        public static bool HasAccountPensionApplication(string accountNumber)
        {
            bool hasPensionApplication = false;

            XBService.Use(client =>
            {
                hasPensionApplication = client.HasAccountPensionApplication(accountNumber);
            });
            return hasPensionApplication;
        }
        public static CardTariffContract GetCardTariffContract(long officeID)
        {
            CardTariffContract tariffContract = null;

            XBService.Use(client =>
            {
                tariffContract = client.GetCardTariffContract(officeID);
            });
            return tariffContract;
        }
        public static List<CardServiceFeeGrafik> GetCardServiceFeeGrafik(ulong productId)
        {
            List<CardServiceFeeGrafik> feeGrafik = new List<CardServiceFeeGrafik>();
            XBService.Use(client =>
            {
                feeGrafik = client.GetCardServiceFeeGrafik(productId);
            });
            return feeGrafik;
        }

        public static List<Credential> GetCredentials(ProductQualityFilter filter)
        {
            List<Credential> credentials = new List<Credential>();
            XBService.Use(client =>
            {
                credentials = client.GetCredentials(filter);
            }
           );
            return credentials;
        }

        public static List<Account> GetAccountsForCredential(int operationType)
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetAccountsForCredential(operationType);
            }
           );
            return accounts;
        }

        public static ActionResult SaveCredentialOrder(CredentialOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CredentialOrder;
                order.SubType = 1;
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveCredentialOrder(order);
            });

            return result;
        }

        public static ActionResult SaveCredentialTerminationOrder(CredentialTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                //order.Type = OrderType.CredentialOrder;
                order.SubType = 1;
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveCredentialTerminationOrder(order);
            });

            return result;
        }

        public static Account GetFeeForServiceProvidedOrderCreditAccount(FeeForServiceProvidedOrder order)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetFeeForServiceProvidedOrderCreditAccount(order);
            });

            return account;
        }

        public static CardStatus GetCardStatus(ulong productId)
        {
            CardStatus cardStatus = new CardStatus();
            XBService.Use(client =>
            {
                cardStatus = client.GetCardStatus(productId);
            });
            return cardStatus;
        }

        public static DateTime GetCurrentOperDay()
        {
            DateTime OperDay = new DateTime();
            XBService.Use(client =>
            {
                OperDay = client.GetCurrentOperDay();
            });
            return OperDay;
        }

        public static List<SearchInternationalTransfer> GetSearchedInternationalTransfers(SearchInternationalTransfer searchParams)
        {
            List<SearchInternationalTransfer> internationalTransfers = new List<SearchInternationalTransfer>();
            XBService.Use(client =>
            {
                internationalTransfers = client.GetSearchedInternationalTransfers(searchParams);
            });
            return internationalTransfers;
        }

        public static List<SearchReceivedTransfer> GetSearchedReceivedTransfers(SearchReceivedTransfer searchParams)
        {
            List<SearchReceivedTransfer> receivedTransfers = new List<SearchReceivedTransfer>();
            XBService.Use(client =>
            {
                receivedTransfers = client.GetSearchedReceivedTransfers(searchParams);
            });
            return receivedTransfers;
        }


        public static List<SearchTransferBankMail> GetSearchedTransfersBankMail(SearchTransferBankMail searchParams)
        {
            List<SearchTransferBankMail> transfersBankMail = new List<SearchTransferBankMail>();
            XBService.Use(client =>
            {
                transfersBankMail = client.GetSearchedTransfersBankMail(searchParams);
            });
            return transfersBankMail;
        }

        public static List<SearchBudgetAccount> GetSearchedBudgetAccounts(SearchBudgetAccount searchParams)
        {
            List<SearchBudgetAccount> budgetAccounts = new List<SearchBudgetAccount>();
            XBService.Use(client =>
            {
                budgetAccounts = client.GetSearchedBudgetAccount(searchParams);
            });
            return budgetAccounts;
        }

        internal static double GetLoanProductActivationFee(ulong productId, short withTax)
        {
            double feeAmount = 0;
            XBService.Use(client =>
            {
                feeAmount = client.GetLoanProductActivationFee(productId, withTax);
            });
            return feeAmount;
        }

        public static bool IsTransferFromBusinessmanToOwnerAccount(string debitAccountNumber, string creditAccountNumber)
        {
            bool check = false;
            XBService.Use(client =>
            {
                check = client.IsTransferFromBusinessmanToOwnerAccount(debitAccountNumber, creditAccountNumber);
            });
            return check;

        }

        public static Account GetOperationSystemAccountForFee(Order order, short feeType)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetOperationSystemAccountForFee(order, feeType);
            });
            return account;
        }

        public static CurrencyExchangeOrder GetCurrencyExchangeOrder(long orderID)
        {
            CurrencyExchangeOrder order = new CurrencyExchangeOrder();
            XBService.Use(client =>
            {
                order = client.GetCurrencyExchangeOrder(orderID);
                order.Receiver = Utility.ConvertAnsiToUnicode(order.Receiver);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }

        public static string GenerateNextOrderNumber(ulong customerNumber)
        {
            string OrderNumber = "0";

            XBService.Use(client =>
            {
                OrderNumber = client.GenerateNextOrderNumber(customerNumber);
            }
          );

            return OrderNumber;
        }




        public static List<string> GetChequeBookReceiveOrderWarnings(ulong customerNumber, string accountNumber)
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetChequeBookReceiveOrderWarnings(customerNumber, accountNumber);
            });
            return warnings;
        }

        public static CredentialOrder GetCredentialOrder(long orderID)
        {
            CredentialOrder order = new CredentialOrder();
            XBService.Use(client =>
            {
                order = client.GetCredentialOrder(orderID);
            });
            return order;
        }

        public static List<AssigneeOperation> GetAllOperations()
        {
            List<AssigneeOperation> operationList = new List<AssigneeOperation>();
            XBService.Use(client =>
            {
                operationList = client.GetAllOperations();
            });
            return operationList;
        }


        public static ulong GetAccountCustomerNumber(Account account)
        {
            ulong customerNumber = 0;
            XBService.Use(client =>
            {
                customerNumber = client.GetAccountCustomerNumber(account);
            });
            return customerNumber;
        }

        public static ActionResult ValidateRenewedOtherTypeCardApplicationForPrint(string cardNumber)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ValidateRenewedOtherTypeCardApplicationForPrint(cardNumber);
            }
             );
            return result;
        }

        public static bool IsNormCardStatus(string cardNumber)
        {
            bool isNorm = false;
            XBService.Use(client =>
            {
                isNorm = client.IsNormCardStatus(cardNumber);
            });
            return isNorm;
        }

        public static bool IsCardRegistered(string cardNumber)
        {
            bool isNorm = false;
            XBService.Use(client =>
            {
                isNorm = client.IsCardRegistered(cardNumber);
            });
            return isNorm;
        }

        public static double GetTransitPaymentOrderFee(TransitPaymentOrder transitPaymentOrder, int feeType)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetTransitPaymentOrderFee(transitPaymentOrder, feeType);
            }
          );

            return fee;
        }


        public static string GetSpesialPriceMessage(string accountNumber, short additionID)
        {
            string message = "";
            XBService.Use(client =>
            {
                message = client.GetSpesialPriceMessage(accountNumber, additionID);
            });
            return message;
        }


        public static double GetCardFeeForCurrencyExchangeOrder(CurrencyExchangeOrder paymentOrder)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetCardFeeForCurrencyExchangeOrder(paymentOrder);
            }
          );

            return fee;
        }

        public static double GetAccountReopenFee(short customerType)
        {
            double feeAmount = 0;

            XBService.Use(client =>
            {
                feeAmount = client.GetAccountReopenFee(customerType);
            }
          );

            return feeAmount;
        }

        public static short GetCustomerSyntheticStatus(ulong customerNumber)
        {
            short customerSyntheticStatus = 0;
            XBService.Use(client =>
            {
                customerSyntheticStatus = client.GetCustomerSyntheticStatus(customerNumber);
            });
            return customerSyntheticStatus;
        }



        public static List<string> GetLoanProductActivationWarnings(long productId, short productType)
        {
            List<string> warnings = null;
            XBService.Use(client =>
            {
                warnings = client.GetLoanActivationWarnings(productId, productType);
            });
            return warnings;
        }

        public static CreditLineTerminationOrder GetCreditLineTerminationOrder(long orderID)
        {
            CreditLineTerminationOrder order = new CreditLineTerminationOrder();
            XBService.Use(client =>
            {
                order = client.GetCreditLineTerminationOrder(orderID);
            });
            return order;
        }


        public static DepositTerminationOrder GetDepositTerminationOrder(long orderID)
        {
            DepositTerminationOrder order = new DepositTerminationOrder();
            XBService.Use(client =>
            {
                order = client.GetDepositTerminationOrder(orderID);
            });
            return order;
        }


        public static CreditLine GetClosedCreditLine(ulong productId)
        {
            CreditLine creditline = new CreditLine();
            XBService.Use(client =>
            {
                creditline = client.GetClosedCreditLine(productId);
            });
            return creditline;
        }

        public static List<LoanRepaymentGrafik> GetDecreaseLoanGrafik(CreditLine creditLine)
        {
            List<LoanRepaymentGrafik> grafik = new List<LoanRepaymentGrafik>();
            XBService.Use(client =>
            {
                grafik = client.GetDecreaseLoanGrafik(creditLine);
            });

            return grafik;
        }

        public static List<CashBook> GetCashBooks(SearchCashBook searchParams)
        {
            List<CashBook> cashBooks = null;
            XBService.Use(client =>
            {
                cashBooks = client.GetCashBooks(searchParams);
            });
            return cashBooks;
        }

        public static ActionResult SaveAndApprove(CashBookOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCashBookOrder(order);
            });
            return result;
        }

        public static int GetCorrespondentSetNumber()
        {
            int correspondentSetNumber = 0;
            XBService.Use(client =>
            {
                correspondentSetNumber = client.GetCorrespondentSetNumber();
            });
            return correspondentSetNumber;
        }

        public static ActionResult RemoveCashBook(int cashBookID)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.RemoveCashBook(cashBookID);
            });
            return result;
        }

        public static List<SearchLeasingCustomer> GetSearchedLeasingCustomers(SearchLeasingCustomer searchParams)
        {
            List<SearchLeasingCustomer> getSearchedLeasingCustomers = new List<SearchLeasingCustomer>();
            XBService.Use(client =>
            {
                getSearchedLeasingCustomers = client.GetSearchedLeasingCustomers(searchParams);
            });
            return getSearchedLeasingCustomers;
        }


        public static List<LeasingLoan> GetSearchedLeasingLoans(SearchLeasingLoan searchParams)
        {
            List<LeasingLoan> getSearchedLeasingLoans = new List<LeasingLoan>();
            XBService.Use(client =>
            {
                getSearchedLeasingLoans = client.GetSearchedLeasingLoans(searchParams);
            });
            return getSearchedLeasingLoans;
        }




        public static List<KeyValuePairOfintdouble> GetRest(SearchCashBook searchParams)
        {
            List<KeyValuePairOfintdouble> rest = null;
            XBService.Use(client =>
            {
                rest = client.GetRest(searchParams);
            });
            return rest;
        }

        public static ActionResult SaveTransitCurrencyExchangeOrder(TransitCurrencyExchangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveTransitCurrencyExchangeOrder(order);
            }
             );
            return result;
        }


        public static Account GetOperationSystemAccountForLeasing(string operationCurrency, ushort filialCode)
        {
            Account operationAccount = new Account();

            XBService.Use(client =>
            {
                operationAccount = client.GetOperationSystemAccountForLeasing(operationCurrency, filialCode);
            });

            return operationAccount;

        }

        public static ActionResult ChangeCashBookStatus(int cashBookID, int newStatus)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ChangeCashBookStatus(cashBookID, newStatus);
            });
            return result;
        }

        public static List<Account> GetReferenceOrderAccounts()
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetReferenceOrderAccounts();
            });
            return accounts;
        }

        public static LoanRepaymentGrafik GetLoanNextRepayment(Loan loan)
        {
            LoanRepaymentGrafik nextRepayment = new LoanRepaymentGrafik();
            XBService.Use(client =>
            {
                nextRepayment = client.GetLoanNextRepayment(loan);
            });

            return nextRepayment;
        }

        public static List<AccountClosingHistory> GetAccountClosinghistory()
        {
            List<AccountClosingHistory> histories = new List<AccountClosingHistory>();
            XBService.Use(client =>
            {
                histories = client.GetAccountClosinghistory();
            }
           );
            return histories;
        }


        public static ProblemLoanCalculationsDetail GetProblemLoanCalculationsDetail(int claimNumber, int eventNumber)
        {
            ProblemLoanCalculationsDetail problemLoanCalculationsDetail = new ProblemLoanCalculationsDetail();
            XBService.Use(client =>
            {
                problemLoanCalculationsDetail = client.GetProblemLoanCalculationsDetail(claimNumber, eventNumber);
            }
           );
            return problemLoanCalculationsDetail;

        }

        public static List<VehicleViolationResponse> GetVehicleViolationById(string violationId)
        {
            List<VehicleViolationResponse> responses = new List<VehicleViolationResponse>();
            XBService.Use(client =>
            {
                responses = client.GetVehicleViolationById(violationId);
            }
           );
            return responses;
        }

        public static List<VehicleViolationResponse> GetVehicleViolationByPsnVehNum(string psn, string vehNum)
        {
            List<VehicleViolationResponse> responses = new List<VehicleViolationResponse>();
            XBService.Use(client =>
            {
                responses = client.GetVehicleViolationByPsnVehNum(psn, vehNum);
            }
           );
            return responses;
        }

        public static List<DahkDetails> GetDahkBlockages(ulong customerNumber)
        {
            List<DahkDetails> blockages = new List<DahkDetails>();
            XBService.Use(client =>
            {
                blockages = client.GetDahkBlockages(customerNumber);
            }
                            );
            return blockages;
        }

        public static List<DahkDetails> GetDahkCollections(ulong customerNumber)
        {
            List<DahkDetails> collections = new List<DahkDetails>();
            XBService.Use(client =>
            {
                collections = client.GetDahkCollections(customerNumber);
            }
                            );
            return collections;
        }


        public static List<DahkEmployer> GetDahkEmployers(ulong customerNumber, ProductQualityFilter quality, string inquestId)
        {
            List<DahkEmployer> employers = new List<DahkEmployer>();
            XBService.Use(client =>
            {
                employers = client.GetDahkEmployers(customerNumber, quality, inquestId);
            }
                            );
            return employers;
        }

        public static List<DahkAmountTotals> GetDahkAmountTotals(ulong customerNumber)
        {
            List<DahkAmountTotals> amountTotals = new List<DahkAmountTotals>();
            XBService.Use(client =>
            {
                amountTotals = client.GetDahkAmountTotals(customerNumber);
            }
                            );
            return amountTotals;
        }

        public static List<GoodsDetails> GetGoodsDetails(ulong productId)
        {
            List<GoodsDetails> goodsDetails = new List<GoodsDetails>();
            XBService.Use(client =>
            {
                goodsDetails = client.GetGoodsDetails(productId);
            }
            );
            return goodsDetails;
        }

        public static AccountFlowDetails GetAccountFlowDetails(string accountNumber, DateTime startDate, DateTime endDate)
        {
            AccountFlowDetails accountFlowDetails = null;


            string guid = "";

            if (HttpContext.Current.Request.Headers["SessionId"] != null)
            {
                guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
            }
            User user = (User)HttpContext.Current.Session[guid + "_User"];

            if (XBService.AccountAccessible(accountNumber, user.AccountGroup))
            {
                XBService.Use(client =>
                {
                    accountFlowDetails = client.GetAccountFlowDetails(accountNumber, startDate, endDate);
                }
            );
            }
            return accountFlowDetails;
        }

        public static double GetDepositLoanAndProvisionCoefficent(string loanCurrency, string provisionCurrency)
        {
            double coefficent = 0;
            XBService.Use(client =>
            {
                coefficent = client.GetDepositLoanAndProvisionCoefficent(loanCurrency, provisionCurrency);
            }
        );
            return coefficent;
        }

        public static ActionResult SavePensionApplicationOrder(PensionApplicationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApprovePensionApplicationOrder(order);
            }
             );
            return result;
        }

        public static List<PensionApplication> GetPensionApplicationHistory(ProductQualityFilter filter)
        {
            List<PensionApplication> list = new List<PensionApplication>();
            XBService.Use(client =>
            {
                list = client.GetPensionApplicationHistory(filter);
            }
             );
            return list;
        }

        public static ActionResult SavePensionApplicationTerminationOrder(PensionApplicationTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApprovePensionApplicationTerminationOrder(order);
            }
             );
            return result;
        }

        public static List<ServicePaymentNote> GetServicePaymentNoteList()
        {
            List<ServicePaymentNote> servicePaymentNotes = new List<ServicePaymentNote>();

            XBService.Use(client =>
            {
                servicePaymentNotes = client.GetServicePaymentNoteList();
            }
           );

            return servicePaymentNotes;
        }

        public static ActionResult SaveAndApproveServicePaymentNoteOrder(ServicePaymentNoteOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveServicePaymentNoteOrder(order);
            }
          );

            return result;
        }

        public static ServicePaymentNoteOrder GetServicePaymentNoteOrder(long orderID)
        {
            ServicePaymentNoteOrder order = new ServicePaymentNoteOrder();
            XBService.Use(client =>
            {
                order = client.GetServicePaymentNoteOrder(orderID);

            });
            return order;
        }


        public static ServicePaymentNoteOrder GetDelatedServicePaymentNoteOrder(long orderID)
        {
            ServicePaymentNoteOrder order = new ServicePaymentNoteOrder();
            XBService.Use(client =>
            {
                order = client.GetDelatedServicePaymentNoteOrder(orderID);

            });
            return order;
        }


        public static List<int> GetTransferCriminalLogId(ulong transferID)
        {
            List<int> logId = new List<int>();

            XBService.Use(client =>
            {
                logId = client.GetTransferCriminalLogId(transferID);


            });
            return logId;
        }


        public static PensionApplicationTerminationOrder GetPensionApplicationTerminationOrder(long id)
        {
            PensionApplicationTerminationOrder order = new PensionApplicationTerminationOrder();
            XBService.Use(client =>
            {
                order = client.GetPensionApplicationTerminationOrder(id);

            }
           );
            return order;
        }

        public static PensionApplicationOrder GetPensionApplicationOrder(long id)
        {
            PensionApplicationOrder order = new PensionApplicationOrder();
            XBService.Use(client =>
            {
                order = client.GetPensionApplicationOrder(id);

            }
           );
            return order;
        }


        public static ActionResult UpdateTransferVerifiedStatus(ulong transferId, int verified)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.UpdateTransferVerifiedStatus(transferId, verified);
            }
          );

            return result;
        }

        public static List<Account> GetClosedDepositAccountList(DepositOrder order)
        {
            List<Account> accounts = null;
            XBService.Use(client =>
            {
                accounts = client.GetClosedDepositAccountList(order);
            }
           );

            return accounts;
        }

        public static ActionResult SaveTransferCallContractOrder(TransferCallContractOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveTransferCallContractOrder(order);
            }
             );
            return result;
        }

        public static TransferCallContractOrder GetTransferCallContractOrder(long id)
        {
            TransferCallContractOrder order = new TransferCallContractOrder();
            XBService.Use(client =>
            {
                order = client.GetTransferCallContractOrder(id);

            }
           );
            return order;
        }

        public static List<TransferCallContractDetails> GetTransferCallContractsDetails()
        {
            List<TransferCallContractDetails> contracts = new List<TransferCallContractDetails>();
            XBService.Use(client =>
            {
                contracts = client.GetTransferCallContractsDetails();
            }
                );
            return contracts;
        }

        public static TransferCallContractDetails GetTransferCallContractDetails(long contractId)
        {
            TransferCallContractDetails contract = new TransferCallContractDetails();
            XBService.Use(client =>
            {
                contract = client.GetTransferCallContractDetails(contractId);
            });
            return contract;
        }

        public static ActionResult SaveTransferCallContractTerminationOrder(TransferCallContractTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveTransferCallContractTerminationOrder(order);
            }
             );
            return result;
        }

        public static TransferCallContractTerminationOrder GetTransferCallContractTerminationOrder(long id)
        {
            TransferCallContractTerminationOrder order = new TransferCallContractTerminationOrder();
            XBService.Use(client =>
            {
                order = client.GetTransferCallContractTerminationOrder(id);

            }
           );
            return order;
        }

        public static ActionResult SaveReestrTransferOrder(ReestrTransferOrder paymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;
                result = client.SaveAndApproveReestrTransferOrder(paymentOrder);
            }
          );

            return result;
        }

        public static ReestrTransferOrder GetReestrTransferOrder(long orderID)
        {
            ReestrTransferOrder order = new ReestrTransferOrder();
            XBService.Use(client =>
            {
                order = client.GetReestrTransferOrder(orderID);
                order.Receiver = Utility.ConvertAnsiToUnicode(order.Receiver);
                order.Description = Utility.ConvertAnsiToUnicode(order.Description);
            });

            return order;
        }


        public static List<Order> GetNotConfirmedOrders(int start = 0, int count = 0)
        {
            List<Order> orders = new List<Order>();
            XBService.Use(client =>
            {
                orders = client.GetNotConfirmedOrders(start, count);
            });

            return orders;
        }

        public static Order GetOrder(long orderID)
        {
            Order order = new Order();
            XBService.Use(client =>
            {
                order = client.GetOrder(orderID);
            });

            return order;
        }
        public static List<RejectedOrderMessage> GetRejectedMessages(int filter, int start = 0, int end = 0)
        {
            List<RejectedOrderMessage> rejectedMessages = new List<RejectedOrderMessage>();
            XBService.Use(client =>
            {
                rejectedMessages = client.GetRejectedMessages(filter, start, end);
            });

            return rejectedMessages;
        }


        public static void CloseRejectedMessage(int messageId)
        {
            XBService.Use(client =>
            {
                client.CloseRejectedMessage(messageId);
            });


        }
        internal static int GetTotalRejectedUserMessages()
        {
            int total = 0;
            XBService.Use(client =>
            {
                total = client.GetTotalRejectedUserMessages();
            });
            return total;
        }

        internal static int GetTotalNotConfirmedOrder()
        {
            int total = 0;
            XBService.Use(client =>
            {
                total = client.GetTotalNotConfirmedOrder();
            });
            return total;
        }

        public static bool AccountAccessible(string accountNumber, long accountGroup)
        {
            bool accessible = false;
            XBService.Use(client =>
            {
                accessible = client.AccountAccessible(accountNumber, accountGroup);
            });

            return accessible;
        }

        public static ActionResult SaveDepositCaseOrder(DepositCaseOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveDepositCaseOrder(order);
            }
          );

            return result;
        }

        public static ulong GetDepositCaseOrderContractNumber()
        {
            ulong contractNumber = 0;
            XBService.Use(client =>
            {
                contractNumber = client.GetDepositCaseOrderContractNumber();

            }
            );

            return contractNumber;
        }

        public static List<DepositCaseMap> GetDepositCaseMap(short caseSide)
        {
            List<DepositCaseMap> map = null;
            XBService.Use(client =>
            {
                map = client.GetDepositCaseMap(caseSide);

            }
            );

            return map;
        }

        public static double GetDepositCasePrice(string caseNumber, short contractDuration)
        {
            double price = 0;

            string guid = Utility.GetSessionId();
            User user = (User)System.Web.HttpContext.Current.Session[guid + "_User"];
            XBService.Use(client =>
            {
                price = client.GetDepositCasePrice(caseNumber, user.filialCode, contractDuration);

            }
            );

            return price;
        }


        public static DepositCaseOrder GetDepositCaseOrder(long orderID)
        {
            DepositCaseOrder order = new DepositCaseOrder();
            XBService.Use(client =>
            {
                order = client.GetDepositCaseOrder(orderID);

            });

            return order;
        }

        internal static bool HasPosTerminal()
        {
            bool hasPosTerminal = false;
            XBService.Use(client =>
            {
                hasPosTerminal = client.HasPosTerminal();
            });
            return hasPosTerminal;
        }

        public static List<CardTariffContract> GetCustomerCardTariffContracts(ProductQualityFilter filter)
        {
            List<CardTariffContract> customerCardTariffContracts = new List<CardTariffContract>();
            XBService.Use(client =>
            {
                customerCardTariffContracts = client.GetCustomerCardTariffContracts(filter);
            });

            return customerCardTariffContracts;
        }

        internal static bool HasCardTariffContract()
        {
            bool hasCardTariffContract = false;
            XBService.Use(client =>
            {
                hasCardTariffContract = client.HasCardTariffContract();
            });
            return hasCardTariffContract;
        }


        internal static int GetCardTariffContractActiveCardsCount(int contractId)
        {
            int cardsCount = 0;
            XBService.Use(client =>
            {
                cardsCount = client.GetCardTariffContractActiveCardsCount(contractId);
            });
            return cardsCount;
        }



        public static List<PosLocation> GetCustomerPosLocations(ProductQualityFilter filter)
        {
            List<PosLocation> customerPosLocations = new List<PosLocation>();
            XBService.Use(client =>
            {
                customerPosLocations = client.GetCustomerPosLocations(filter);
            });

            return customerPosLocations;
        }

        public static PosLocation GetPosLocation(int posLocationId)
        {
            PosLocation posLocation = null;

            XBService.Use(client =>
            {
                posLocation = client.GetPosLocation(posLocationId);
            });
            return posLocation;
        }

        public static List<PosRate> GetPosRates(int code)
        {
            List<PosRate> posRates = new List<PosRate>();
            XBService.Use(client =>
            {
                posRates = client.GetPosRates(code);
            });
            return posRates;
        }
        public static List<PosCashbackRate> GetPosCashbackRates(int terminalId)
        {
            List<PosCashbackRate> posCashbackRates = new List<PosCashbackRate>();
            XBService.Use(client =>
            {
                posCashbackRates = client.GetPosCashbackRates(terminalId);
            });
            return posCashbackRates;
        }

        public static short IsCustomerSwiftTransferVerified(ulong customerNummber, string swiftCode = "", string receiverAaccount = "")
        {
            short IsVerified = 0;

            XBService.Use(client =>
            {
                IsVerified = client.IsCustomerSwiftTransferVerified(customerNummber, swiftCode, receiverAaccount);
            }
          );

            return IsVerified;
        }

        public static bool IsExistingTransferByCall(short transferSystem, string code, long transferId)
        {
            bool IsExisting = false;

            XBService.Use(client =>
            {
                IsExisting = client.IsExistingTransferByCall(transferSystem, code, transferId);
            }
          );

            return IsExisting;
        }

        public static void SetTransferByCallType(short type, long id)
        {


            XBService.Use(client =>
            {
                client.SetTransferByCallType(type, id);
            }
          );


        }
        public static string GetTerm(short id, System.Collections.Generic.List<string> param, FrontOffice.XBS.Languages language)
        {
            string description = "";

            XBService.Use(client =>
            {
                description = client.GetTerm(id, param, language);
            }
          );

            return description;
        }

        public static ActionResult SaveDepositCasePenaltyMatureOrder(DepositCasePenaltyMatureOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveAndApproveDepositCasePenaltyMatureOrder(order);
            }
          );

            return result;
        }

        public static DepositCasePenaltyMatureOrder GetDepositCasePenaltyMatureOrder(long orderID)
        {
            DepositCasePenaltyMatureOrder order = new DepositCasePenaltyMatureOrder();
            XBService.Use(client =>
            {
                order = client.GetDepositCasePenaltyMatureOrder(orderID);

            });

            return order;
        }

        public static List<PlasticCard> GetCardsForRegistration()
        {
            List<PlasticCard> cards = null;
            XBService.Use(client =>
            {
                cards = client.GetCardsForRegistration();
            }
           );

            return cards;
        }

        public static ActionResult SaveCardRegistrationOrder(CardRegistrationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CardRegistrationOrder;
                result = client.SaveAndApproveCardRegistrationOrder(order);
            }
             );
            return result;
        }

        public static List<Account> GetAccountListForCardRegistration(string cardCurrency, int cardFililal)
        {
            List<Account> currentAccounts = new List<Account>();
            XBService.Use(client =>
            {
                currentAccounts = client.GetAccountListForCardRegistration(cardCurrency, cardFililal);
            }
           );


            return currentAccounts;
        }

        public static List<Account> GetOverdraftAccountsForCardRegistration(string cardCurrency, int cardFililal)
        {
            List<Account> currentAccounts = new List<Account>();
            XBService.Use(client =>
            {
                currentAccounts = client.GetOverdraftAccountsForCardRegistration(cardCurrency, cardFililal);
            }
           );


            return currentAccounts;
        }

        public static CardRegistrationOrder GetCardRegistrationOrder(long orderID)
        {
            CardRegistrationOrder order = new CardRegistrationOrder();
            XBService.Use(client =>
            {
                order = client.GetCardRegistrationOrder(orderID);
            });
            return order;
        }

        public static ActionResult SavePeriodicSwiftStatementOrder(PeriodicSwiftStatementOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndAprovePeriodicSwiftStatementOrder(order);
            });
            return result;
        }

        public static double GetPeriodicSwiftStatementOrderFee()
        {
            double fee = 0;
            XBService.Use(client =>
            {
                fee = client.GetPeriodicSwiftStatementOrderFee();
            });
            return fee;
        }

        public static PeriodicSwiftStatementOrder GetPeriodicSwiftStatementOrder(long orderID)
        {
            PeriodicSwiftStatementOrder order = new PeriodicSwiftStatementOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetPeriodicSwiftStatementOrder(orderID);
            });
            return order;
        }


        public static ActionResult SaveTransferToShopOrder(TransferToShopOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveTransferToShopOrder(order);
            });
            return result;
        }

        public static bool CheckTransferToShopPayment(ulong productId)
        {
            bool check = false;

            XBService.Use(client =>
            {
                check = client.CheckTransferToShopPayment(productId);
            }
          );

            return check;
        }


        public static Account GetShopAccount(ulong productId)
        {
            Account shoppAccount = null;

            XBService.Use(client =>
            {
                shoppAccount = client.GetShopAccount(productId);
            }
          );

            return shoppAccount;
        }


        public static TransferToShopOrder GetTransferToShopOrder(long orderID)
        {
            TransferToShopOrder order = new TransferToShopOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetTransferToShopOrder(orderID);
            });
            return order;
        }


        public static double GetCOWaterOrderAmount(string abonentNumber, string branchCode, ushort paymentType)
        {
            double amount = 0;

            XBService.Use(client =>
            {
                amount = client.GetCOWaterOrderAmount(abonentNumber, branchCode, paymentType);
            });

            return amount;
        }


        public static List<Provision> GetCustomerProvisions(string currency, ushort type, ushort quality)
        {
            List<Provision> provisions = new List<Provision>();
            XBService.Use(client =>
            {
                provisions = client.GetCustomerProvisions(currency, type, quality);
            });

            return provisions;
        }

        public static List<ProvisionLoan> GetProvisionLoans(ulong provisionId)
        {
            List<ProvisionLoan> provisionLoans = new List<ProvisionLoan>();
            XBService.Use(client =>
            {
                provisionLoans = client.GetProvisionLoans(provisionId);
            }
             );
            return provisionLoans;
        }

        public static List<string> GetCardRegistrationWarnings(PlasticCard plasticCard)
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetCardRegistrationWarnings(plasticCard);
            });
            return warnings;
        }


        public static List<Insurance> GetInsurances(ProductQualityFilter filter)
        {
            List<Insurance> insurances = new List<Insurance>();
            XBService.Use(client =>
            {
                insurances = client.GetInsurances(filter);
            }
           );
            return insurances;
        }

        public static Insurance GetInsurance(ulong productId)
        {
            Insurance insurance = new Insurance();
            XBService.Use(client =>
            {
                insurance = client.GetInsurance(productId);
            }
           );
            return insurance;
        }

        public static ActionResult SaveInsuranceOrder(InsuranceOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveInsuranceOrder(order);
            });
            return result;
        }

        public static InsuranceOrder GetInsuranceOrder(long orderID)
        {
            InsuranceOrder order = new InsuranceOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetInsuranceOrder(orderID);
            });
            return order;
        }

        public static Account GetInsuraceCompanySystemAccount(ushort companyID, ushort insuranceType)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetInsuraceCompanySystemAccount(companyID, insuranceType);

            }
            );

            return account;
        }




        public static uint GetInsuranceCompanySystemAccountNumber(ushort companyID, ushort insuranceType)
        {
            uint insuranceCompanySystemAccountNumber = 0;
            XBService.Use(client =>
            {
                insuranceCompanySystemAccountNumber = client.GetInsuranceCompanySystemAccountNumber(companyID, insuranceType);

            }
            );

            return insuranceCompanySystemAccountNumber;
        }

        public static bool CheckAccountForDAHK(string accountNumber)
        {
            bool check = false;

            XBService.Use(client =>
            {
                check = client.CheckAccountForDAHK(accountNumber);
            }
          );

            return check;
        }



        public static ActionResult SaveCardServiceFeeDataChangeOrder(CardDataChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardDataChangeOrder(order);
            });
            return result;
        }

        public static CardDataChangeOrder GetCardDataChangeOrder(long orderID)
        {
            CardDataChangeOrder order = new CardDataChangeOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetCardDataChangeOrder(orderID);
            });
            return order;
        }

        public static bool CheckCardDataChangeOrderFieldTypeIsRequaried(short fieldType)
        {
            bool check = false;
            XBService.Use(client =>
            {
                check = client.CheckCardDataChangeOrderFieldTypeIsRequaried(fieldType);
            });
            return check;
        }


        public static ActionResult SaveCardServiceFeeGrafikDataChangeOrder(CardServiceFeeGrafikDataChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardServiceFeeGrafikDataChangeOrder(order);
            });
            return result;
        }

        public static CardServiceFeeGrafikDataChangeOrder GetCardServiceFeeGrafikDataChangeOrder(long orderID)
        {
            CardServiceFeeGrafikDataChangeOrder order = new CardServiceFeeGrafikDataChangeOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetCardServiceFeeGrafikDataChangeOrder(orderID);
            });
            return order;
        }


        public static List<CardServiceFeeGrafik> SetNewCardServiceFeeGrafik(ulong productId)
        {
            List<CardServiceFeeGrafik> cardServiceFeeGrafik = null;
            XBService.Use(client =>
            {
                cardServiceFeeGrafik = client.SetNewCardServiceFeeGrafik(productId);
            });
            return cardServiceFeeGrafik;
        }
        public static List<CreditLine> GetCardsCreditLines(ProductQualityFilter filter)
        {
            List<CreditLine> list = new List<CreditLine>();

            XBService.Use(client =>
            {
                list = client.GetCreditLines(filter);

            });

            list = list.FindAll(m => m.Type == 8);
            return list;
        }
        public static List<GivenGuaranteeReduction> GetGivenGuaranteeReductions(ulong productId)
        {
            List<GivenGuaranteeReduction> givenGuaranteeReductions = null;
            XBService.Use(client =>
            {
                givenGuaranteeReductions = client.GetGivenGuaranteeReductions(productId);
            });
            return givenGuaranteeReductions;
        }


        public static ActionResult SaveReestrUtilityPaymentOrder(ReestrUtilityPaymentOrder paymentOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                paymentOrder.RegistrationDate = paymentOrder.RegistrationDate.Date;
                result = client.SaveAndApproveReestrUtilityPaymentOrder(paymentOrder);
            });

            return result;
        }

        public static ReestrUtilityPaymentOrder GetReestrUtilityPaymentOrder(long orderID)
        {
            ReestrUtilityPaymentOrder utilityPayment = new ReestrUtilityPaymentOrder();
            XBService.Use(client =>
            {
                utilityPayment = client.GetReestrUtilityPaymentOrder(orderID);
            });

            return utilityPayment;
        }

        public static List<Insurance> GetPaidInsurance(ulong loanProductId)
        {
            List<Insurance> insurances = new List<Insurance>();
            XBService.Use(client =>
            {
                insurances = client.GetPaidInsurance(loanProductId);
            }
           );
            return insurances;
        }

        public static ActionResult SaveAccountAdditionalDataRemovableOrder(AccountAdditionalDataRemovableOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveAccountAdditionalDataRemovableOrder(order);
            });

            return result;
        }

        public static DAHKDetail GetCardDAHKDetails(string cardNumber)
        {
            DAHKDetail DAHK_Detail = null;
            XBService.Use(client =>
            {
                DAHK_Detail = client.GetCardDAHKDetails(cardNumber);
            });

            return DAHK_Detail;

        }

        public static bool IsDAHKAvailability(ulong customerNumber)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.IsDAHKAvailability(customerNumber);
            });
            return result;
        }

        public static int GetPoliceResponseDetailsIDWithoutRequest(string violationID, DateTime violationDate)
        {
            int id = 0;

            XBService.Use(client =>
            {
                id = client.GetPoliceResponseDetailsIDWithoutRequest(violationID, violationDate);
            }
          );

            return id;
        }

        public static PlasticCard GetPlasticCard(ulong productId, bool productIdType)
        {
            PlasticCard card = null;

            XBService.Use(client =>
            {
                card = client.GetPlasticCard(productId, productIdType);
            }
          );

            return card;
        }

        public static ulong GetOrderTransactionsGroupNumber(long orderID)
        {
            ulong transactionsGroupNumber = 0;
            XBService.Use(client =>
            {
                transactionsGroupNumber = client.GetOrderTransactionsGroupNumber(orderID);
            });
            return transactionsGroupNumber;
        }

        public static List<Account> GetATSSystemAccounts(string currency)
        {
            List<Account> accounts = null;
            XBService.Use(client =>
            {
                accounts = client.GetATSSystemAccounts(currency);
            });
            return accounts;
        }

        public static bool HasATSSystemAccountInFilial()
        {
            bool hasATSAccount = false;
            XBService.Use(client =>
            {
                hasATSAccount = client.HasATSSystemAccountInFilial();
            });
            return hasATSAccount;
        }


        public static List<LoanProductClassification> GetLoanProductClassifications(ulong productId, DateTime dateFrom)
        {
            List<LoanProductClassification> classifications = new List<LoanProductClassification>();
            XBService.Use(client =>
            {
                classifications = client.GetLoanProductClassifications(productId, dateFrom);
            }
     );
            return classifications;
        }

        public static List<SafekeepingItem> GetSafekeepingItems(ProductQualityFilter filter)
        {
            List<SafekeepingItem> items = new List<SafekeepingItem>();
            XBService.Use(client =>
            {
                items = client.GetSafekeepingItems(filter);
            }
           );


            return items;
        }

        public static SafekeepingItem GetSafekeepingItem(ulong productId)
        {
            SafekeepingItem item = new SafekeepingItem();
            XBService.Use(client =>
            {
                item = client.GetSafekeepingItem(productId);
            }
          );
            return item;
        }

        public static List<ExchangeRate> GetExchangeRatesHistory(int filialCode, string currency, DateTime startDate)
        {
            List<ExchangeRate> rateList = new List<ExchangeRate>();
            XBService.Use(client =>
            {
                rateList = client.GetExchangeRatesHistory(filialCode, currency, startDate);
            });
            return rateList;
        }

        public static List<CrossExchangeRate> GetCrossExchangeRatesHistory(DateTime startDate)
        {

            string guid = Utility.GetSessionId();
            User user = (User)System.Web.HttpContext.Current.Session[guid + "_User"];
            List<CrossExchangeRate> rateList = new List<CrossExchangeRate>();
            XBService.Use(client =>
            {
                rateList = client.GetCrossExchangeRatesHistory(user.filialCode, startDate);
            });
            return rateList;
        }

        public static List<Account> GetTransitAccountsForDebitTransactions()
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetTransitAccountsForDebitTransactions();
            });
            return accounts;
        }

        public static List<CorrespondentBankAccount> GetCorrespondentBankAccounts(CorrespondentBankAccount filter)
        {
            List<CorrespondentBankAccount> accounts = new List<CorrespondentBankAccount>();
            XBService.Use(client =>
            {
                accounts = client.GetCorrespondentBankAccounts(filter);
            });
            return accounts;
        }
        public static Account GetCardCashbackAccount(ulong productId)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetCardCashbackAccount(productId);
            });
            return account;
        }

        public static string GetCardMotherName(ulong productId)
        {
            string motherName = "";
            XBService.Use(client =>
            {
                motherName = client.GetCardMotherName(productId);
            });
            return motherName;
        }

        public static List<ExchangeRate> GetCBExchangeRatesHistory(string currency, DateTime startDate)
        {
            List<ExchangeRate> rateList = new List<ExchangeRate>();
            XBService.Use(client =>
            {
                rateList = client.GetCBExchangeRatesHistory(currency, startDate);
            });
            return rateList;
        }

        public static ActionResult SaveCardStatusChangeOrder(CardStatusChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardStatusChangeOrder(order);
            });
            return result;
        }

        public static CardStatusChangeOrder GetCardStatusChangeOrder(long orderID)
        {
            CardStatusChangeOrder order = new CardStatusChangeOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetCardStatusChangeOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveCardMembershipRewardsOrder(MembershipRewardsOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardMembershipRewardsOrder(order);
            });
            return result;
        }

        public static MembershipRewardsOrder GetCardMembershipRewardsOrder(long orderID)
        {
            MembershipRewardsOrder order = new MembershipRewardsOrder();
            XBService.Use(client =>
            {
                order = client.GetCardMembershipRewardsOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveTransitAccountForDebitTransactions(TransitAccountForDebitTransactions account)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveTransitAccountForDebitTransactions(account);
            });
            return result;
        }
        public static ActionResult UpdateTransitAccountForDebitTransactions(TransitAccountForDebitTransactions account)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.UpdateTransitAccountForDebitTransactions(account);
            });
            return result;
        }

        public static List<TransitAccountForDebitTransactions> GetAllTransitAccountsForDebitTransactions(ProductQualityFilter quality)
        {
            List<TransitAccountForDebitTransactions> accounts = new List<TransitAccountForDebitTransactions>();
            XBService.Use(client =>
            {
                accounts = client.GetAllTransitAccountsForDebitTransactions(quality);
            });
            return accounts;
        }
        public static ActionResult CloseTransitAccountForDebitTransactions(TransitAccountForDebitTransactions account)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.CloseTransitAccountForDebitTransactions(account);
            });
            return result;
        }


        public static double GetBusinesDepositOptionRate(ushort depositOption, string currency)
        {
            double rate = 0;
            XBService.Use(client =>
            {
                rate = client.GetBusinesDepositOptionRate(depositOption, currency);
            });
            return rate;
        }


        public static List<CardActivationInArCa> GetCardActivationInArCa(string cardNumber, DateTime startDate, DateTime endDate)
        {
            List<CardActivationInArCa> list = new List<CardActivationInArCa>();
            XBService.Use(client =>
            {
                list = client.GetCardActivationInArCa(cardNumber, startDate, endDate);
            });
            return list;
        }


        public static List<CardActivationInArCaApigateDetails> GetCardActivationInArCaApigateDetail(ulong Id)
        {
            List<CardActivationInArCaApigateDetails> list = new List<CardActivationInArCaApigateDetails>();
            XBService.Use(client =>
            {
                list = client.GetCardActivationInArCaApigateDetail(Id);
            });
            return list;
        }

        public static DateTime? GetLastSendedPaymentFileDate()
        {
            DateTime? sendDate = null;
            XBService.Use(client =>
            {
                sendDate = client.GetLastSendedPaymentFileDate();
            });
            return sendDate;
        }

        public static ActionResult SaveCustomerCommunalCard(CustomerCommunalCard customerCommunalCard)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveCustomerCommunalCard(customerCommunalCard);
            });

            return result;
        }

        public static ActionResult ChangeCustomerCommunalCardQuality(CustomerCommunalCard customerCommunalCard)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ChangeCustomerCommunalCardQuality(customerCommunalCard);
            });

            return result;
        }

        public static List<CustomerCommunalCard> GetCustomerCommunalCards()
        {
            List<CustomerCommunalCard> result = new List<CustomerCommunalCard>();
            XBService.Use(client =>
            {
                result = client.GetCustomerCommunalCards();
            });

            return result;
        }
        public static List<double> GetComunalAmountPaidThisMonth(string code, short comunalType, short abonentType, DateTime DebtListDate, string texCode, int waterCoPaymentType)
        {
            List<double> comunalPayments = new List<double>();
            XBService.Use(client =>
            {
                comunalPayments = client.GetComunalAmountPaidThisMonth(code, comunalType, abonentType, DebtListDate, texCode, waterCoPaymentType);
            });

            return comunalPayments;
        }

        public static ActionResult SaveFactoringTerminationOrder(FactoringTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveFactoringTerminationOrder(order);
            }
             );
            return result;
        }
        public static FactoringTerminationOrder GetFactoringTerminationOrder(long orderID)
        {
            FactoringTerminationOrder order = new FactoringTerminationOrder();
            XBService.Use(client =>
            {
                order = client.GetFactoringTerminationOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveLoanProductTerminationOrder(LoanProductTerminationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveLoanProductTerminationOrder(order);
            }
             );
            return result;
        }
        public static LoanProductTerminationOrder GetLoanProductTerminationOrder(long orderID)
        {
            LoanProductTerminationOrder order = new LoanProductTerminationOrder();
            XBService.Use(client =>
            {
                order = client.GetLoanProductTerminationOrder(orderID);
            });
            return order;
        }

        public static double GetShopTransferAmount(ulong productId)
        {
            double amount = 0;
            XBService.Use(client =>
            {
                amount = client.GetShopTransferAmount(productId);
            });
            return amount;
        }

        public static ActionResult SaveDepositDataChangeOrder(DepositDataChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveDepositDataChangeOrder(order);
            }
             );
            return result;
        }

        public static DepositDataChangeOrder GetDepositDataChangeOrder(long orderID)
        {
            DepositDataChangeOrder order = new DepositDataChangeOrder();
            XBService.Use(client =>
            {
                order = client.GetDepositDataChangeOrder(orderID);
            });
            return order;
        }

        public static List<DepositAction> GetDepositActions(DepositOrder order)
        {
            List<DepositAction> actions = new List<DepositAction>();
            XBService.Use(client =>
            {
                actions = client.GetDepositActions(order);
            });
            return actions;
        }
        public static List<ENAPayments> GetENAPayments(string abonentNumber, string branch)
        {
            List<ENAPayments> list = new List<ENAPayments>();
            XBService.Use(client =>
            {
                list = client.GetENAPayments(abonentNumber, branch);
            });
            return list;
        }

        public static List<DateTime> GetENAPaymentDates(string abonentNumber, string branch)
        {
            List<DateTime> list = new List<DateTime>();
            XBService.Use(client =>
            {
                list = client.GetENAPaymentDates(abonentNumber, branch);
            });
            return list;
        }
        public static double GetLoanTotalInsuranceAmount(ulong productId)
        {
            double totalInsuranceAmount = 0;
            XBService.Use(client =>
            {
                totalInsuranceAmount = client.GetLoanTotalInsuranceAmount(productId);
            });
            return totalInsuranceAmount;
        }
        public static Account GetProductAccount(ulong productId, ushort productType, ushort accountType)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetProductAccount(productId, productType, accountType);

            }
            );

            return account;
        }

        public static CashBookOrder GetCashBookOrder(long orderID)
        {
            CashBookOrder order = new CashBookOrder();
            XBService.Use(client =>
            {
                order = client.GetCashBookOrder(orderID);
            });
            return order;
        }


        public static Account GetCashBookOperationSystemAccount(CashBookOrder order, OrderAccountType accountType)
        {
            Account operationAccount = new Account();

            ushort filialCode = 0;
            if (filialCode == 0)
            {
                string guid = "";

                if (HttpContext.Current.Request.Headers["SessionId"] != null)
                {
                    guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
                }
                User user = (User)HttpContext.Current.Session[guid + "_User"];

                filialCode = user.filialCode;
            }

            XBService.Use(client =>
            {
                operationAccount = client.GetCashBookOperationSystemAccount(order, accountType, filialCode);
            });

            return operationAccount;

        }


        public static Account GetProductAccountFromCreditCode(string creditCode, ushort productType, ushort accountType)
        {
            Account account = null;
            XBService.Use(client =>
            {
                account = client.GetProductAccountFromCreditCode(creditCode, productType, accountType);
            });
            return account;
        }

        public static LoanApplication GetLoanApplication(ulong productId)
        {
            LoanApplication loanApplication = new LoanApplication();
            XBService.Use(client =>
            {
                loanApplication = client.GetLoanApplication(productId);

            }
           );
            return loanApplication;
        }

        public static List<LoanApplication> GetLoanApplications()
        {
            List<LoanApplication> loanApplications = new List<LoanApplication>();
            XBService.Use(client =>
            {
                loanApplications = client.GetLoanApplications();
            }
           );
            return loanApplications;
        }

        public static List<FicoScoreResult> GetLoanApplicationFicoScoreResults(ulong productId, DateTime requestDate)
        {
            List<FicoScoreResult> results = new List<FicoScoreResult>();
            XBService.Use(client =>
            {
                results = client.GetLoanApplicationFicoScoreResults(productId, requestDate);
            }
           );
            return results;
        }

        public static LoanApplication GetLoanApplicationByDocId(long docId)
        {
            LoanApplication loanApplication = new LoanApplication();
            XBService.Use(client =>
            {
                loanApplication = client.GetLoanApplicationByDocId(docId);

            }
           );
            return loanApplication;
        }

        public static List<ActionError> FastOverdraftValidations(string cardNumber)
        {
            List<ActionError> errors = new List<ActionError>();
            XBService.Use(client =>
            {
                errors = client.FastOverdraftValidations(cardNumber);

            }
          );
            return errors;
        }

        public static object GetCardTariffContracts(ProductQualityFilter filter, ulong customerNumber)
        {
            List<CardTariffContract> cardTariffContracts = new List<CardTariffContract>();
            XBService.Use(client =>
            {
                cardTariffContracts = client.GetCardTariffContracts(filter, customerNumber);
            });

            return cardTariffContracts;
        }

        public static ActionResult SaveLoanMonitoringConclusion(LoanMonitoringConclusion monitoring)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.SaveLoanMonitoringConclusion(monitoring);
            }
             );
            return result;
        }

        public static ActionResult ApproveLoanMonitoringConclusion(long monitoringId)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ApproveLoanMonitoringConclusion(monitoringId);
            }
             );
            return result;
        }

        public static ActionResult DeleteLoanMonitoringConclusion(long monitoringId)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.DeleteLoanMonitoringConclusion(monitoringId);
            }
             );
            return result;
        }

        public static List<LoanMonitoringConclusion> GetLoanMonitoringConclusions(long productId)
        {
            List<LoanMonitoringConclusion> loanMonitorings = new List<LoanMonitoringConclusion>();
            XBService.Use(client =>
            {
                loanMonitorings = client.GetLoanMonitoringConclusions(productId);
            }
             );
            return loanMonitorings;
        }

        public static LoanMonitoringConclusion GetLoanMonitoringConclusion(long monitoringId, long productId)
        {
            LoanMonitoringConclusion loanMonitoring = new LoanMonitoringConclusion();
            XBService.Use(client =>
            {
                loanMonitoring = client.GetLoanMonitoringConclusion(monitoringId, productId);
            }
             );
            return loanMonitoring;
        }

        public static List<MonitoringConclusionLinkedLoan> GetLinkedLoans(long productId)
        {
            List<MonitoringConclusionLinkedLoan> linkedLoans = new List<MonitoringConclusionLinkedLoan>();
            XBService.Use(client =>
            {
                linkedLoans = client.GetLinkedLoans(productId);
            }
             );
            return linkedLoans;
        }

        public static float GetProvisionCoverCoefficient(long productId)
        {
            float coefficient = 0;
            XBService.Use(client =>
            {
                coefficient = client.GetProvisionCoverCoefficient(productId);
            }
             );
            return coefficient;
        }

        public static short GetLoanMonitoringType()
        {
            short type = 0;
            XBService.Use(client =>
            {
                type = client.GetLoanMonitoringType();
            }
             );
            return type;
        }


        public static ActionResult SaveDepositCaseStoppingPenaltyCalculationOrder(DepositCaseStoppingPenaltyCalculationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveDepositCaseStoppingPenaltyCalculationOrder(order);
            }
             );
            return result;
        }

        public static DepositCaseStoppingPenaltyCalculationOrder GetDepositCaseStoppingPenaltyCalculationOrder(long orderID)
        {
            DepositCaseStoppingPenaltyCalculationOrder order = new DepositCaseStoppingPenaltyCalculationOrder();
            XBService.Use(client =>
            {
                order = client.GetDepositCaseStoppingPenaltyCalculationOrder(orderID);
            });
            return order;
        }


        public static CTPaymentOrder GetCTPaymentOrder(long orderID)
        {
            CTPaymentOrder order = new CTPaymentOrder();
            XBService.Use(client =>
            {
                order = client.GetCTPaymentOrder(orderID);
            });
            return order;
        }

        public static CTLoanMatureOrder GetCTLoanMatureOrder(long orderID)
        {
            CTLoanMatureOrder order = new CTLoanMatureOrder();
            XBService.Use(client =>
            {
                order = client.GetCTLoanMatureOrder(orderID);
            });
            return order;
        }

        public static List<CreditHereAndNow> GetCreditsHereAndNow(SearchCreditHereAndNow searchParams)
        {
            List<CreditHereAndNow> credits = new List<CreditHereAndNow>();
            XBService.Use(client =>
            {
                GetCreditsHereAndNowRequest r = new GetCreditsHereAndNowRequest(searchParams);
                GetCreditsHereAndNowResponse rp = client.GetCreditsHereAndNow(r);
                credits = rp.GetCreditsHereAndNowResult;
                if (credits.Count > 0)
                    credits[0].RowCount = rp.RowCount;
            });
            return credits;
        }
        public static ActionResult SaveCreditHereAndNowActivationPreOrder(CreditHereAndNowActivationOrders creditHereAndNowActivationOrders)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCreditHereAndNowActivationOrders(creditHereAndNowActivationOrders);
            });

            return result;
        }
        public static List<PreOrderDetails> GetSearchedPreOrderDetails(SearchPreOrderDetails searchParams)
        {
            List<PreOrderDetails> preOrderDetails = new List<PreOrderDetails>();
            XBService.Use(client =>
            {
                GetSearchedPreOrderDetailsRequest r = new GetSearchedPreOrderDetailsRequest(searchParams);
                GetSearchedPreOrderDetailsResponse rp = client.GetSearchedPreOrderDetails(r);
                preOrderDetails = rp.GetSearchedPreOrderDetailsResult;
                if (preOrderDetails.Count > 0)
                    preOrderDetails[0].RowCount = rp.RowCount;
            });
            return preOrderDetails;
        }

        public static List<ActionResult> ApproveCreditHereAndNowActivationPreOrder(long preOrderID)
        {
            List<ActionResult> result = new List<ActionResult>();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveAutomaticGenaratedPreOrdersLoanActivation(preOrderID);
            });

            return result;
        }
        public static ulong AuthorizeCustomerByLoanApp(ulong productId)
        {
            ulong result = 0;
            XBService.Use(client =>
            {
                result = client.AuthorizeCustomerByLoanApp(productId);
            });

            return result;
        }

        public static ActionResult SaveCredentialActivationOrder(CredentialActivationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCredentialActivationOrder(order);
            }
             );
            return result;
        }

        public static CredentialActivationOrder GetCredentialActivationOrder(long orderID)
        {
            CredentialActivationOrder order = new CredentialActivationOrder();
            XBService.Use(client =>
            {
                order = client.GetCredentialActivationOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveAndApproveAssigneeIdentificationOrder(AssigneeIdentificationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveAssigneeIdentificationOrder(order);
            }
             );
            return result;
        }

        public static bool HasPropertyProvision(ulong productId)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.HasPropertyProvision(productId);
            });
            return result;
        }

        public static ulong GetNextCredentialDocumentNumber()
        {
            ulong result = 0;
            XBService.Use(client =>
            {
                result = client.GetNextCredentialDocumentNumber();
            });
            return result;
        }

        public static ActionResult SaveDemandDepositRateChangeOrder(DemandDepositRateChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveDemandDepositRateChangeOrder(order);
            }
             );
            return result;
        }

        public static int GetCredentialDocId(ulong credentialId)
        {
            int docId = 0;
            XBService.Use(client =>
            {
                docId = client.GetCredentialDocId(credentialId);
            });
            return docId;
        }

        public static AssigneeIdentificationOrder GetAssigneeIdentificationOrder(long orderID)
        {
            AssigneeIdentificationOrder order = new AssigneeIdentificationOrder();
            XBService.Use(client =>
            {
                order = client.GetAssigneeIdentificationOrder(orderID);
            });
            return order;
        }

        public static DemandDepositRateChangeOrder GetDemandDepositRateChangeOrder(long orderID)
        {
            DemandDepositRateChangeOrder order = new DemandDepositRateChangeOrder();
            XBService.Use(client =>
            {
                order = client.GetDemandDepositRateChangeOrder(orderID);
            });
            return order;
        }

        public static List<AccountOpeningClosingDetail> GetAccountOpeningClosingDetails(string accountNumber)
        {
            List<AccountOpeningClosingDetail> list = new List<AccountOpeningClosingDetail>();
            XBService.Use(client =>
            {
                list = client.GetAccountOpeningClosingDetails(accountNumber);
            });
            return list;
        }

        public static AccountOpeningClosingDetail GetAccountOpeningDetail(string accountNumber)
        {
            AccountOpeningClosingDetail openingDetail = new AccountOpeningClosingDetail();
            XBService.Use(client =>
            {
                openingDetail = client.GetAccountOpeningDetail(accountNumber);
            });
            return openingDetail;
        }

        public static DemandDepositRate GetDemandDepositRate(string accountNumber)
        {
            DemandDepositRate result = null;
            XBService.Use(client =>
            {
                result = client.GetDemandDepositRate(accountNumber);
            });
            return result;
        }


        public static List<DemandDepositRate> GetDemandDepositRateTariffs()
        {
            List<DemandDepositRate> result = new List<DemandDepositRate>();
            XBService.Use(client =>
            {
                result = client.GetDemandDepositRateTariffs();
            });
            return result;
        }

        public static ulong GetBankruptcyManager(string accountNumber)
        {
            ulong bankruptcyManagerCustNumber = 0;
            XBService.Use(client =>
            {
                bankruptcyManagerCustNumber = client.GetBankruptcyManager(accountNumber);

            });
            return bankruptcyManagerCustNumber;

        }
        public static double GetDepositLoanCreditLineAndProfisionCoefficent(string loanCurrency, string provisionCurrency, bool mandatoryPayment, int creditLineType)
        {
            double coefficent = 0;
            XBService.Use(client =>
            {
                coefficent = client.GetDepositLoanCreditLineAndProfisionCoefficent(loanCurrency, provisionCurrency, mandatoryPayment, creditLineType);
            }
        );
            return coefficent;
        }
        public static int GetStatementFixedReceivingType(string cardNumber)
        {
            int communicationType = 0;
            XBService.Use(client =>
            {
                communicationType = client.GetStatementFixedReceivingType(cardNumber);
            }
               );
            return communicationType;

        }

        public static List<CashierCashLimit> GetCashierLimits(int setNumber)
        {
            List<CashierCashLimit> list = new List<CashierCashLimit>();
            XBService.Use(client =>
            {
                list = client.GetCashierLimits(setNumber);

            });
            return list;
        }


        public static ActionResult GenerateCashierCashDefaultLimits(int setNumber, int changeSetNumber)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.GenerateCashierCashDefaultLimits(setNumber, changeSetNumber);

            });
            return result;
        }

        public static ActionResult SaveCashierCashLimits(List<CashierCashLimit> limit)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveCashierCashLimits(limit);
            });
            return result;

        }

        public static int GetCashierFilialCode(int setNumber)
        {
            int filial_code = 0;
            XBService.Use(client =>
            {
                filial_code = client.GetCashierFilialCode(setNumber);
            });
            return filial_code;
        }



        public static List<ClassifiedLoan> GetClassifiedLoans(SearchClassifiedLoan searchParams)
        {
            int RowCount = 0;
            List<ClassifiedLoan> loans = new List<ClassifiedLoan>();
            XBService.Use(client =>
            {
                GetClassifiedLoansRequest r = new GetClassifiedLoansRequest(searchParams);
                GetClassifiedLoansResponse rp = new GetClassifiedLoansResponse(loans, RowCount);
                rp = client.GetClassifiedLoans(r);
                loans = rp.GetClassifiedLoansResult;
                if (loans.Count > 0)
                    loans[0].RowCount = rp.RowCount;
            });
            return loans;
        }
        public static ActionResult SaveClassifiedLoanActionPreOrder(ClassifiedLoanActionOrders classifiedLoanActionOrders)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveClassifiedLoanActionOrders(classifiedLoanActionOrders);
            });

            return result;
        }
        public static List<ActionResult> ApproveClassifiedLoanActionPreOrder(long preOrderID, short preOrderType)
        {
            List<ActionResult> result = new List<ActionResult>();
            XBService.Use(client =>
            {
                switch ((PreOrderType)preOrderType)
                {
                    case PreOrderType.ClassifiedLoanRemoveClassificationOrdersCreation:
                        result = client.SaveAndApproveAutomaticGenaratedPreOrdersClassificationRemove(preOrderID);
                        break;
                    case PreOrderType.ClassifiedLoanMakeOutOrdersCreation:
                        result = client.SaveAndApproveAutomaticGenaratedPreOrdersMakeLoanOut(preOrderID);
                        break;
                }


            });

            return result;
        }

        public static Order GetClassifiedLoanOrder(long orderID)
        {
            Order order = new Order();
            XBService.Use(client =>
            {
                order = client.GetOrder(orderID);
            });
            return order;
        }
        public static ActionResult SaveLoanProductMakeOutOrder(LoanProductMakeOutOrder order, bool includingSurcharge)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveLoanProductMakeOutOrder(order, includingSurcharge);
            }
             );
            return result;
        }
        public static ActionResult SaveLoanProductClassificationRemoveOrder(LoanProductClassificationRemoveOrder order, bool includingSurcharge)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveClassificationRemoveOrder(order, includingSurcharge);
            }
             );
            return result;
        }
        public static ActionResult SaveProductNotificationConfigurationsOrder(ProductNotificationConfigurationsOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveProductNotificationConfigurationsOrder(order);
            }
             );
            return result;
        }
        public static List<ProductNotificationConfigurations> GetProductNotificationConfigurations(ulong productid)
        {
            List<ProductNotificationConfigurations> configs = new List<ProductNotificationConfigurations>();
            XBService.Use(client =>
            {
                configs = client.GetProductNotificationConfigurations(productid);

            });
            return configs;
        }

        public static ActionResult SaveBranchDocumentSignatureSetting(DocumentSignatureSetting setting)
        {
            ActionResult result = new ActionResult();
            setting.RegistartionDate = DateTime.Now;
            XBService.Use(client =>
            {
                result = client.SaveBranchDocumentSignatureSetting(setting);
            }
             );
            return result;
        }

        public static DocumentSignatureSetting GetBranchDocumentSignatureSetting()
        {
            DocumentSignatureSetting setting = new DocumentSignatureSetting();
            XBService.Use(client =>
            {
                setting = client.GetBranchDocumentSignatureSetting();
            }
             );
            return setting;
        }

        public static List<SwiftMessage> GetSearchedSwiftMessages(SearchSwiftMessage searchSwiftMessage)
        {

            List<SwiftMessage> result = new List<SwiftMessage>();
            XBService.Use(client =>
            {
                result = client.GetSearchedSwiftMessages(searchSwiftMessage);
            }
            );

            return result;

        }

        public static SwiftMessage GetSwiftMessage(ulong messageUnicNumber)
        {
            SwiftMessage swiftMessage = new SwiftMessage();

            XBService.Use(client =>
            {
                swiftMessage = client.GetSwiftMessage(messageUnicNumber);
            }
           );

            return swiftMessage;
        }

        public static CardServiceQualities GetCardUSSDService(ulong productID)
        {
            CardServiceQualities result = CardServiceQualities.NotRegistered;

            XBService.Use(client =>
            {
                result = client.GetCardUSSDService(productID);
            }
             );
            return result;
        }

        public static ActionResult SaveAndApproveCardUSSDServiceOrder(CardUSSDServiceOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardUSSDServiceOrder(order);
            });
            return result;
        }

        public static string GetCardMobilePhone(ulong productID)
        {
            string phoneNumber = "";
            XBService.Use(client =>
            {
                phoneNumber = client.GetCardMobilePhone(productID);
            });
            return phoneNumber;
        }

        public static CardUSSDServiceOrder GetCardUSSDServiceOrder(long orderID)
        {
            CardUSSDServiceOrder order = new CardUSSDServiceOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetCardUSSDServiceOrder(orderID);
            });
            return order;
        }

        public static List<float> GetCardUSSDServiceTariff(ulong productID)
        {
            List<float> list = new List<float>();
            XBService.Use(client =>
            {
                list = client.GetCardUSSDServiceTariff(productID);
            });
            return list;
        }

        public static ActionResult CustomersClassification()
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.CustomersClassification();
            }
             );
            return result;
        }

        public static ActionResult SaveTransactionSwiftConfirmOrder(TransactionSwiftConfirmOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveTransactionSwiftConfirmOrder(order);
            }
             );
            return result;
        }

        public static ActionResult SaveSwiftMessageRejectOrder(SwiftMessageRejectOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveSwiftMessageRejectOrder(order);
            }
             );
            return result;
        }
        public static List<BondIssue> GetBondIssuesList(BondIssueFilter bondIssueFilter)
        {
            List<BondIssue> bondIssueList = new List<BondIssue>();
            XBService.Use(client =>
            {
                bondIssueList = client.SearchBondIssues(bondIssueFilter);

            }
           );
            return bondIssueList;
        }

        public static ActionResult ApproveBondIssue(int id)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ApproveBondIssue(id);

            }
           );
            return result;
        }


        public static ActionResult DeleteBondIssue(int id)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.DeleteBondIssue(id);

            }
           );
            return result;
        }


        public static ActionResult SaveBondIssue(BondIssue bondissue)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveBondIssue(bondissue);

            }
           );
            return result;
        }



        public static BondIssue GetBondIssue(int id)
        {
            BondIssue bond = new BondIssue();
            XBService.Use(client =>
            {
                bond = client.GetBondIssue(id);

            }
           );
            return bond;
        }

        public static List<DateTime> CalculateCouponRepaymentSchedule(BondIssue bondIssue)
        {
            List<DateTime> schedule = new List<DateTime>();
            XBService.Use(client =>
            {
                schedule = client.CalculateCouponRepaymentSchedule(bondIssue);

            }
           );
            return schedule;
        }

        public static List<DateTime> GetCouponRepaymentSchedule(BondIssue bondIssue)
        {
            List<DateTime> schedule = new List<DateTime>();
            XBService.Use(client =>
            {
                schedule = client.GetCouponRepaymentSchedule(bondIssue);

            }
           );
            return schedule;
        }

        public static Bond GetBondByID(int ID)
        {
            Bond bond = new Bond();
            XBService.Use(client =>
            {
                bond = client.GetBondByID(ID);
            }
           );

            return bond;
        }

        public static List<Bond> GetBonds(BondFilter filter)
        {
            List<Bond> bond = new List<Bond>();
            XBService.Use(client =>
            {
                bond = client.GetBonds(filter);
            }
           );
            return bond;
        }

        public static ActionResult SaveBondOrder(BondOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.BondRegistrationOrder;
                order.RegistrationDate = order.RegistrationDate.Date;

                result = client.SaveAndApproveBondOrder(order);
            }
             );
            return result;
        }

        public static BondOrder GetBondOrder(long orderID)
        {
            BondOrder order = new BondOrder();
            XBService.Use(client =>
            {
                order = client.GetBondOrder(orderID);
            });
            return order;
        }



        public static int GetNonDistributedBondsCount(int bondIssueId)
        {
            int count = 0;

            XBService.Use(client =>
            {
                count = client.GetNonDistributedBondsCount(bondIssueId);
            }
          );

            return count;
        }

        public static List<Account> GetAccountsForCouponRepayment()
        {
            List<Account> accounts = new List<Account>();

            XBService.Use(client =>
            {
                accounts = client.GetAccountsForCouponRepayment();
            }
           );

            return accounts;
        }

        public static List<Account> GetAccountsForBondRepayment(string currency)
        {
            List<Account> accounts = new List<Account>();

            XBService.Use(client =>
            {
                accounts = client.GetAccountsForBondRepayment(currency);
            }
           );

            return accounts;
        }

        public static double GetBondPrice(int bondIssueId)
        {
            double price = 0;

            XBService.Use(client =>
            {
                price = client.GetBondPrice(bondIssueId);
            }
           );

            return price;
        }

        public static ActionResult SaveBondQualityUpdateOrder(BondQualityUpdateOrder order)
        {


            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.BondQualityUpdateOrder;
                order.RegistrationDate = order.RegistrationDate.Date;

                result = client.SaveAndApproveBondQualityUpdateOrder(order);
            }
             );
            return result;
        }

        public static BondQualityUpdateOrder GetBondQualityUpdateOrder(long orderID)
        {
            BondQualityUpdateOrder order = new BondQualityUpdateOrder();
            XBService.Use(client =>
            {
                order = client.GetBondQualityUpdateOrder(orderID);
            });
            return order;
        }

        public static bool HasCustomerDepositaryAccountInBankDB(ulong customerNumber)
        {
            bool hasAccount = false;

            XBService.Use(client =>
            {
                hasAccount = client.HasCustomerDepositaryAccountInBankDB(customerNumber);
            });
            return hasAccount;
        }

        public static DepositaryAccount GetCustomerDepositaryAccount(ulong customerNumber)
        {
            DepositaryAccount account = new DepositaryAccount();
            XBService.Use(client =>
            {
                account = client.GetCustomerDepositaryAccount(customerNumber);
            });
            return account;
        }

        public static List<DepositaryAccount> GetCustomerDepositaryAccounts(ulong customerNumber)
        {
            List<DepositaryAccount> account = new List<DepositaryAccount>();
            XBService.Use(client =>
            {
                account = client.GetCustomerDepositaryAccounts(customerNumber);
            });
            return account;
        }


        public static List<Bond> GetBondsForDealing(BondFilter filter, string bondFilterType)
        {
            List<Bond> bond = new List<Bond>();
            XBService.Use(client =>
            {
                bond = client.GetBondsForDealing(filter, bondFilterType);
            }
           );

            return bond;
        }
        public static ActionResult SaveDepositaryAccountOrder(DepositaryAccountOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                order.Source = SourceType.Bank;
                order.SubType = 1;
                //string guid = Utility.GetSessionId();
                //XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

                result = client.SaveAndApproveDepositaryAccountOrder(order);
            }
             );
            return result;
        }

        public static ActionResult SaveBondAmountChargeOrder(BondAmountChargeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.BondAmountChargeOrder;
                order.RegistrationDate = order.RegistrationDate.Date;

                result = client.SaveAndApproveBondAmountChargeOrder(order);
            }
             );
            return result;
        }

        public static BondAmountChargeOrder GetBondAmountChargeOrder(long orderID)
        {
            BondAmountChargeOrder order = new BondAmountChargeOrder();
            XBService.Use(client =>
            {
                order = client.GetBondAmountChargeOrder(orderID);
            });
            return order;
        }


        public static DepositaryAccountOrder GetDepositaryAccountOrder(int id)
        {
            DepositaryAccountOrder depoAccountOrder = new DepositaryAccountOrder();
            XBService.Use(client => { depoAccountOrder = client.GetDepositaryAccountOrder(id); });
            return depoAccountOrder;
        }


        public static DepositaryAccount GetDepositaryAccountById(int id)
        {
            DepositaryAccount depositaryAccount = new DepositaryAccount();
            XBService.Use(client =>
            {
                depositaryAccount = client.GetDepositaryAccountById(id);
            }
           );

            return depositaryAccount;
        }

        public static Account GetAccountInfo(string accountNumber)
        {
            Account account = new Account();
            XBService.Use(client =>
            {
                account = client.GetAccountInfo(accountNumber);
            }
            );

            return account;
        }
        public static string GetAccountDescription(string accountNumber)
        {
            string accountDescription = "";
            XBService.Use(client =>
            {
                accountDescription = client.GetAccountDescription(accountNumber);
            }
            );

            return accountDescription;
        }

        public static TransactionSwiftConfirmOrder GetTransactionSwiftConfirmOrder(long orderID)
        {
            TransactionSwiftConfirmOrder order = new TransactionSwiftConfirmOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetTransactionSwiftConfirmOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveCard3DSecureServiceOrder(Card3DSecureServiceOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCard3DSecureServiceOrder(order);
            }
             );
            return result;
        }
        public static List<Card3DSecureService> GetCard3DSecureServiceHistory(ulong productId)
        {
            List<Card3DSecureService> history = new List<Card3DSecureService>();
            XBService.Use(client =>
            {
                history = client.GetCard3DSecureServiceHistory(productId);
            }
            );
            return history;

        }

        public static Card3DSecureService GetCard3DSecureService(ulong productID)
        {
            Card3DSecureService result = new Card3DSecureService();

            XBService.Use(client =>
            {
                result = client.GetCard3DSecureService(productID);
            }
             );
            return result;
        }

        public static List<CardUSSDServiceHistory> GetCardUSSDServiceHistory(ulong productId)
        {
            List<CardUSSDServiceHistory> history = new List<CardUSSDServiceHistory>();
            XBService.Use(client =>
            {
                history = client.GetCardUSSDServiceHistory(productId);
            }
            );
            return history;
        }

        public static List<LoanEquipment> GetSearchedLoanEquipment(SearchLoanEquipment searchLoanEquipment)
        {

            List<LoanEquipment> result = new List<LoanEquipment>();
            XBService.Use(client =>
            {
                result = client.GetSearchedLoanEquipment(searchLoanEquipment);
            }
            );

            return result;

        }
        //todo Anna 
        //public static List<DepositProductPrices> GetSearchedDepositProductPrices(SearchDepositProductPrices searchDepositProductPrices)
        //{

        //    List<DepositProductPrices> result = new List<DepositProductPrices>();
        //    XBService.Use(client =>
        //    {
        //        result = client.GetDepositProductPrices(searchDepositProductPrices);
        //    }
        //    );

        //    return result;

        //}
        //todo Anna
        public static LoanEquipment GetSumsOfEquipmentPrices(SearchLoanEquipment searchLoanEquipment)
        {

            LoanEquipment equipment = new LoanEquipment();
            XBService.Use(client =>
            {
                equipment = client.GetSumsOfEquipmentPrices(searchLoanEquipment);
            }
            );

            return equipment;

        }
        public static Card GetCardWithOutBallance(string accountNumber)
        {
            Card card = new Card();
            XBService.Use(client =>
            {
                card = client.GetCardWithOutBallance(accountNumber);
            });
            return card;
        }

        public static void initUSerBySessionToken(string authorizedUserSessionToken, ref xbs.AuthorizedUser authorizedUser, ref xbs.User user)
        {
            bool success = false;
            IXBService client = ProxyManager<IXBService>.GetProxy(nameof(IXBService));

            try
            {
                authorizedUser = client.AuthorizeUserBySessionToken(authorizedUserSessionToken);
                user = client.InitUser(authorizedUser);
                success = true;
                ((IClientChannel)client).Close();
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
                ((IClientChannel)client).Close();
                ((IClientChannel)client).Dispose();

            }
        }


        public static bool AuthorizeUserBySessionToken(string authorizedUserSessionToken)
        {
            bool isAuthorized = false;
            IXBService client = ProxyManager<IXBService>.GetProxy(nameof(IXBService));

            try
            {
                XBS.AuthorizedUser authorizedUser = client.AuthorizeUserBySessionToken(authorizedUserSessionToken);
                isAuthorized = authorizedUser.isAutorized;
                ((IClientChannel)client).Close();
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
                ((IClientChannel)client).Close();
                ((IClientChannel)client).Dispose();
            }

            return isAuthorized;
        }

        public static LoanEquipment GetEquipmentDetails(int equipmentID)
        {

            LoanEquipment loanEquipment = new LoanEquipment();
            XBService.Use(client =>
            {
                loanEquipment = client.GetEquipmentDetails(equipmentID);
            }
            );

            return loanEquipment;

        }
        public static string GetEquipmentClosingReason(int equipmentID)
        {
            string closingReason = "";
            XBService.Use(client =>
            {
                closingReason = client.GetEquipmentClosingReason(equipmentID);
            });
            return closingReason;
        }
        public static ActionResult LoanEquipmentClosing(int equipmentID, int setNumber, string closingReason)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.LoanEquipmentClosing(equipmentID, setNumber, closingReason);
            }
             );
            return result;
        }
        public static ActionResult ChangeCreditProductMatureRestriction(double appID, int setNumber, int allowMature)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ChangeCreditProductMatureRestriction(appID, setNumber, allowMature);
            }
             );
            return result;
        }
        public static ProductNotificationConfigurationsOrder GetProductNotificationConfigurationOrder(long id)
        {
            ProductNotificationConfigurationsOrder order = new ProductNotificationConfigurationsOrder();
            XBService.Use(client =>
            {
                order = client.GetProductNotificationConfigurationOrder(id);
            }
           );
            return order;
        }


        public static List<Account> GetCustomerTransitAccounts(ProductQualityFilter filter)
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetCustomerTransitAccounts(filter);
            });
            return accounts;
        }
        public static ActionResult ReopenTransitAccountForDebitTransactions(TransitAccountForDebitTransactions account)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ReopenTransitAccountForDebitTransactions(account);
            });
            return result;
        }
        public static ActionResult SaveLoanProductMakeOutBalanceOrder(LoanProductMakeOutBalanceOrder order, bool includingSurcharge)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveLoanProductMakeOutBalanceOrder(order, includingSurcharge);
            }
             );
            return result;
        }

        public static double GetCashBookAmount(int cashBookId)
        {
            double cashBookAmount = 0;
            XBService.Use(client =>
            {

                cashBookAmount = client.GetCashBookAmount(cashBookId);
            });

            return cashBookAmount;
        }


        public static bool HasUnconfirmedOrder(int cashBookId)
        {
            bool flag = false;
            XBService.Use(client =>
            {

                flag = client.HasUnconfirmedOrder(cashBookId);
            });

            return flag;
        }


        public static ActionResult SaveFondOrder(FondOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveFondOrderr(order);
            }
             );
            return result;
        }


        public static ActionResult SavePeriodicDataChangeOrder(PeriodicTransferDataChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApprovePeriodicDataChangeOrder(order);
            }
             );
            return result;
        }

        public static FondOrder GetFondOrder(long id)
        {
            FondOrder order = new FondOrder();
            XBService.Use(client =>
            {
                order = client.GetFondOrder(id);
            }
           );
            return order;
        }

        public static List<Fond> GetFonds(ProductQualityFilter filter)
        {
            List<Fond> result = new List<Fond>();
            XBService.Use(client =>
            {
                result = client.GetFonds(filter);
            }
           );
            return result;
        }
        public static PeriodicTransferDataChangeOrder GetPeriodicDataChangeOrder(long orderID)
        {
            PeriodicTransferDataChangeOrder order = new PeriodicTransferDataChangeOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetPeriodicDataChangeOrder(orderID);
            });
            return order;
        }




        public static Fond GetFondByID(int ID)
        {
            Fond result = new Fond();
            XBService.Use(client =>
            {
                result = client.GetFondByID(ID);
            }
           );
            return result;
        }

        public static ActionResult SaveCreditLineProlongationOrder(CreditLineProlongationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.SaveAndApproveCreditLineProlongationOrder(order);
            }
             );
            return result;
        }


        public static CreditLineProlongationOrder GetCreditLineProlongationOrder(int id)
        {
            CreditLineProlongationOrder order = new CreditLineProlongationOrder();
            XBService.Use(c =>
            {
                order = c.GetCreditLineProlongationOrder(id);
            });
            return order;
        }



        public static ActionResult SaveLoanProductDataChangeOrder(LoanProductDataChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveLoanProductDataChangeOrder(order);
            });
            return result;
        }

        public static FTPRate GetFTPRateDetails(FTPRateType rateType)
        {
            FTPRate result = new FTPRate();
            XBService.Use(client =>
            {
                result = client.GetFTPRateDetails(rateType);
            }
           );
            return result;
        }



        public static LoanProductDataChangeOrder GetLoanProductDataChangeOrder(long orderID)
        {
            LoanProductDataChangeOrder order = new LoanProductDataChangeOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetLoanProductDataChangeOrder(orderID);
            });
            return order;
        }



        public static bool ExistsLoanProductDataChange(ulong appId)
        {
            bool check = false;
            XBService.Use(client =>
            {
                check = client.ExistsLoanProductDataChange(appId);
            });
            return check;
        }
        public static List<Account> GetCreditCodesTransitAccounts(ProductQualityFilter filter)
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetCreditCodesTransitAccounts(filter);
            });
            return accounts;
        }

        public static List<Account> GetFactoringCustomerCardAndCurrencyAccounts(ulong productId, string currency)
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetFactoringCustomerCardAndCurrencyAccounts(productId, currency);
            });
            return accounts;
        }
        public static List<Account> GetFactoringCustomerFeeCardAndCurrencyAccounts(ulong productId)
        {
            List<Account> accounts = new List<Account>();
            XBService.Use(client =>
            {
                accounts = client.GetFactoringCustomerFeeCardAndCurrencyAccounts(productId);
            });
            return accounts;
        }

        public static ActionResult SaveFTPRateOrder(FTPRateOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveFTPRateOrder(order);
            }
             );
            return result;
        }


        public static FTPRateOrder GetFTPRateOrder(long id)
        {
            FTPRateOrder order = new FTPRateOrder();
            XBService.Use(client =>
            {
                order = client.GetFTPRateOrder(id);
            }
           );
            return order;
        }

        public static List<OperDayOptions> GetOperDayOptionsList(OperDayOptionsFilter operDayOptionsFilter)
        {
            List<OperDayOptions> operDayOptions = new List<OperDayOptions>();
            XBService.Use(client =>
            {
                operDayOptions = client.SearchOperDayOptions(operDayOptionsFilter);

            }
           );
            return operDayOptions;
        }


        public static ActionResult SaveOperDayOptions(List<OperDayOptions> operDayOptions)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveOperDayOptions(operDayOptions);
            });
            return result;
        }

        public static ActionResult SaveOperDayMode(OperDayMode operDayMode)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveOperDayMode(operDayMode);
            });
            return result;
        }

        public static List<OperDayMode> GetOperDayModeHistory(OperDayModeFilter operDayMode)
        {
            List<OperDayMode> result = new List<OperDayMode>();
            XBService.Use(client =>
            {
                result = client.GetOperDayModeHistory(operDayMode);
            });
            return result;
        }

        public static KeyValuePairOfstringstring GetCurrentOperDay24_7_Mode()
        {
            KeyValuePairOfstringstring dictionary = new KeyValuePairOfstringstring();

            XBService.Use(client =>
            {
                dictionary = client.GetCurrentOperDay24_7_Mode();
            });
            return dictionary;
        }

        public static List<ProblemLoanTax> SearchProblemLoanTax(ProblemLoanTaxFilter problemLoanTaxFilter, bool Cache)
        {
            string cacheKeyLenght = "Info_ProblemLoanTaxLenght";

            Dictionary<int, List<ProblemLoanTax>> searchResults = new Dictionary<int, List<ProblemLoanTax>>();
            List<ProblemLoanTax> problemLoanTaxes = new List<ProblemLoanTax>();
            int totalRowCount;

            XBService.Use(client =>
            {
                searchResults = client.SearchProblemLoanTax(problemLoanTaxFilter, Cache);
            });

            problemLoanTaxes = searchResults.FirstOrDefault(x => x.Key >= 0).Value.ToList();

            if (Cache == false)
            {
                totalRowCount = searchResults.First(x => x.Key >= 0).Key;
                CacheHelper.Add(totalRowCount.ToString(), cacheKeyLenght);
            }

            return problemLoanTaxes;
        }

        public static string GetProblemLoanTaxesLenght() => CacheHelper.Get<string>("Info_ProblemLoanTaxLenght").ToString();

        public static string GetDepositProductPricesLenght() => CacheHelper.Get<string>("Info_DepositProductPricesLenght").ToString();

        public static ProblemLoanTax GetProblemLoanTaxDetails(long ClaimNumber)
        {
            ProblemLoanTax problemLoanTaxes = new ProblemLoanTax();
            XBService.Use(client =>
            {
                problemLoanTaxes = client.GetProblemLoanTaxDetails(ClaimNumber);
            });

            return problemLoanTaxes;
        }

        //public static CreditCommitmentForgiveness GetForgivableLoanCommitment(CreditCommitmentForgiveness creditCommitmentForgiveness)
        //{
        //    CreditCommitmentForgiveness creditCommitment = new CreditCommitmentForgiveness();
        //    XBService.Use(client =>
        //    {
        //        creditCommitment = client.GetForgivableLoanCommitment(creditCommitmentForgiveness);
        //    });

        //    return creditCommitment;
        //}

        //public static ActionResult SaveForgivableLoanCommitment(CreditCommitmentForgiveness creditCommitmentForgiveness)
        //{
        //    ActionResult result = new ActionResult();
        //    XBService.Use(client =>
        //    {
        //        creditCommitmentForgiveness.OperationDate = GetCurrentOperDay();
        //        result = client.SaveForgivableLoanCommitment(creditCommitmentForgiveness);
        //    });
        //    return result;
        //}

        public static List<UtilityOptions> GetUtilityOptions(UtilityOptionsFilter filter)
        {
            List<UtilityOptions> utilityOptions = new List<UtilityOptions>();
            XBService.Use(client =>
            {
                utilityOptions = client.SearchUtilityOptions(filter);

            }
           );
            return utilityOptions;
        }

        public static List<UtilityOptions> GetUtiltyForChange()
        {
            List<UtilityOptions> list = new List<UtilityOptions>();
            XBService.Use(client =>
            {
                list = client.GetUtiltyForChange();

            }
           );
            return list;
        }



        public static ActionResult SaveUtilityConfigurationsAndHistory(List<UtilityOptions> utilityOptions)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveUtilityConfigurationsAndHistory(utilityOptions);
            });
            return result;
        }


        public static ActionResult SaveAllUtilityConfigurationsAndHistory(List<UtilityOptions> utilityOptions, int a)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAllUtilityConfigurationsAndHistory(utilityOptions, a);
            });
            return result;
        }


        public static List<string> GetExistsNotSentAndSettledRows(Dictionary<int, bool> keyValues)
        {
            List<string> list = new List<string>();
            XBService.Use(client =>
            {
                list = client.GetExistsNotSentAndSettledRows(keyValues);

            });
            return list;

        }


        //public static BeelineAbonentSearch GetBeelineAbonentBalance(string abonentNumber, string amount = "10")
        //{
        //    BeelineAbonentSearch result = new BeelineAbonentSearch();
        //    XBService.Use(client =>
        //    {
        //        result = client.GetBeelineAbonentBalance(abonentNumber, amount);

        //    });

        //    return result;
        //}

        public static ActionResult SaveArcaCardsTransactionOrder(ArcaCardsTransactionOrder order)
        {
            string ipAddress = HttpContext.Current.Request["REMOTE_ADDR"];
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveArcaCardsTransactionOrder(order);
            });
            return result;
        }

        internal static ArcaCardsTransactionOrder GetArcaCardsTransactionOrder(long orderId)
        {
            ArcaCardsTransactionOrder order = new ArcaCardsTransactionOrder();
            XBService.Use(client =>
            {
                order = client.GetArcaCardsTransactionOrder(orderId);
            });
            return order;
        }

        public static ActionResult SaveCardLimitChangeOrder(CardLimitChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardLimitChangeOrder(order);
            });
            return result;
        }

        internal static object GetCardLimitChangeOrder(long orderId)
        {
            CardLimitChangeOrder order = new CardLimitChangeOrder();
            XBService.Use(client =>
            {
                order = client.GetCardLimitChangeOrder(orderId);
            });
            return order;
        }

        internal static object GetBlockingReasonForBlockedCard(string cardNumber)
        {
            short reasonId = 0;
            XBService.Use(client =>
            {
                reasonId = client.GetBlockingReasonForBlockedCard(cardNumber);
            });
            return reasonId;
        }


        public static Dictionary<string, string> GetAccountFreezeReasonsTypesForOrder(bool isHb = false)
        {
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            string cacheKey = "Info_FreezeReasonsTypes_" + user.userPermissionId.ToString();

            Dictionary<string, string> freezeReasonsTypes = CacheHelper.GetDictionary(cacheKey);

            if (freezeReasonsTypes == null)
            {
                XBService.Use(client =>
                {
                    freezeReasonsTypes = client.GetAccountFreezeReasonsTypesForOrder(isHb);
                });

                CacheHelper.Add(freezeReasonsTypes, cacheKey);
            }
            return freezeReasonsTypes;
        }


        //internal static double GetTaxForForgiveness(ulong customerNumber, double? capital, string RebetType,string currency)
        //{
        //    double tax = 0; 
        //    XBService.Use(client =>
        //    {
        //        tax = client.GetTaxForForgiveness(customerNumber, capital, RebetType, currency);
        //    });
        //    return tax;

        //}

        internal static Dictionary<string, string> GetCardLimits(long productId)
        {
            Dictionary<string, string> cardLimits = new Dictionary<string, string>();
            XBService.Use(client =>
            {
                cardLimits = client.GetCardLimits(productId);
            });
            return cardLimits;
        }

        public static void InitUSerBySAPTicket(string SAPTicket, ref xbs.AuthorizedUser authorizedUser, ref xbs.User user)
        {
            bool success = false;
            IXBService client = ProxyManager<IXBService>.GetProxy(nameof(IXBService));

            try
            {
                authorizedUser = client.AuthorizeUserBySAPTicket(SAPTicket, "FrontOffice");
                user = client.InitUser(authorizedUser);
                success = true;
                ((IClientChannel)client).Close();
            }
            catch (FaultException ex)
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
                ((IClientChannel)client).Close();
                ((IClientChannel)client).Dispose();

            }
        }

        public static CreditCommitmentForgivenessOrder GetCreditCommitmentForgiveness(long orderID)
        {
            CreditCommitmentForgivenessOrder order = new CreditCommitmentForgivenessOrder();
            XBService.Use(client =>
            {
                order = client.GetCreditCommitmentForgiveness(orderID);
            });
            return order;
        }

        public static CreditCommitmentForgivenessOrder GetForgivableLoanCommitment(CreditCommitmentForgivenessOrder creditCommitmentForgiveness)
        {
            CreditCommitmentForgivenessOrder creditCommitment = new CreditCommitmentForgivenessOrder();
            XBService.Use(client =>
            {
                creditCommitment = client.GetForgivableLoanCommitment(creditCommitmentForgiveness);
            });

            return creditCommitment;
        }

        public static ActionResult SaveForgivableLoanCommitment(CreditCommitmentForgivenessOrder creditCommitmentForgiveness)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                creditCommitmentForgiveness.OperationDate = GetCurrentOperDay();
                result = client.SaveForgivableLoanCommitment(creditCommitmentForgiveness);
            });
            return result;
        }


        internal static double GetTaxForForgiveness(ulong customerNumber, double? capital, string RebetType, string currency)
        {
            double tax = 0;
            XBService.Use(client =>
            {
                tax = client.GetTaxForForgiveness(customerNumber, capital, RebetType, currency);
            });
            return tax;

        }

        /// <summary>
        /// Հասանելի հաշվետվությունների ցանկի ստացում
        /// </summary>
        /// <param name="userReportPermissionInfo"></param>
        /// <returns></returns>
        public static List<xbs.ApplicationClientPermissions> GetPermittedReports(xbs.ApplicationClientPermissionsInfo userReportPermissionInfo)
        {

            List<xbs.ApplicationClientPermissions> list = new List<ApplicationClientPermissions>();

            XBService.Use(client =>
            {
                list = client.GetPermittedReports(userReportPermissionInfo);
            });
            return list;
        }

        public static InterestMargin GetInterestMarginDetails(InterestMarginType marginType)
        {
            InterestMargin result = new InterestMargin();
            XBService.Use(client =>
            {
                result = client.GetInterestMarginDetails(marginType);
            });
            return result;
        }

        public static InterestMargin GetInterestMarginDetailsByDate(InterestMarginType marginType, DateTime marginDate)
        {
            InterestMargin result = new InterestMargin();
            XBService.Use(client =>
            {
                result = client.GetInterestMarginDetailsByDate(marginType, marginDate);
            });
            return result;
        }

        public static ActionResult SaveInterestMarginOrder(InterestMarginOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                result = client.SaveAndApproveInterestMarginOrder(order);
            });
            return result;
        }

        public static InterestMarginOrder GetInterestMarginOrder(long id)
        {
            InterestMarginOrder order = new InterestMarginOrder();
            XBService.Use(client =>
            {
                order = client.GetInterestMarginOrder(id);
            });
            return order;
        }

        public static ActionResult SavePlasticCardOrder(xbs.PlasticCardOrder cardOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApprovePlasticCardOrder(cardOrder);
            }
          );
            return result;
        }
        public static PlasticCardOrder GetPlasticCardOrder(long orderID)
        {
            PlasticCardOrder plasticCardOrder = new PlasticCardOrder();
            XBService.Use(client =>
            {
                plasticCardOrder = client.GetPlasticCardOrder(orderID);
            });
            return plasticCardOrder;
        }


        public static List<PlasticCard> GetCustomerMainCards()
        {
            List<PlasticCard> cards = new List<PlasticCard>();
            XBService.Use(client =>
            {
                cards = client.GetCustomerMainCards();
            });

            return cards;
        }


        public static ActionResult SavePlasticCardRemovalOrder(xbs.PlasticCardRemovalOrder cardOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApprovePlasticCardRemovalOrder(cardOrder);
            }
          );
            return result;
        }
        public static PlasticCardRemovalOrder GetPlasticCardRemovalOrder(long orderID)
        {
            PlasticCardRemovalOrder plasticCardRemovalOrder = new PlasticCardRemovalOrder();
            XBService.Use(client =>
            {
                plasticCardRemovalOrder = client.GetPlasticCardRemovalOrder(orderID);
            });
            return plasticCardRemovalOrder;
        }
        public static ActionResult SaveCardAccountRemovalOrder(xbs.CardAccountRemovalOrder cardOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardAccountRemovalOrder(cardOrder);
            }
          );
            return result;
        }
        public static List<PlasticCard> GetCustomerPlasticCards()
        {
            List<PlasticCard> result = new List<PlasticCard>();

            XBService.Use(client =>
            {
                result = client.GetCustomerPlasticCards();
            }
          );
            return result;
        }
        /// <summary>
        /// Չձևավորված նախնական ապառիկ հայտերի հեռացում
        /// </summary>
        public static ActionResult ResetIncompletePreOrderDetailQuality()
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ResetIncompletePreOrderDetailQuality();
            }
          );
            return result;
        }
        /// <summary>
        /// Չձևավորված նախնական ապառիկ հայտերի քանակի ստացում
        /// </summary>
        public static int GetIncompletePreOrdersCount()
        {
            int result = 0;
            XBService.Use(client =>
            {
                result = client.GetIncompletePreOrdersCount();
            }
          );
            return result;
        }

        public static void DeleteInsurance(long insuranceid)
        {
            XBService.Use(client =>
            {
                client.DeleteInsurance(insuranceid);
            });
        }

        public static bool HasPermissionForDelete(short setNumber)
        {
            bool res = false;
            XBService.Use(client =>
            {
                res = client.HasPermissionForDelete(setNumber);
            });
            return res;
        }

        public static CardAccountRemovalOrder GetCardAccountRemovalOrder(long orderID)
        {
            CardAccountRemovalOrder plasticCardRemovalOrder = new CardAccountRemovalOrder();
            XBService.Use(client =>
            {
                plasticCardRemovalOrder = client.GetCardAccountRemovalOrder(orderID);
            });
            return plasticCardRemovalOrder;
        }

        public static string GetArrestTypesList()
        {
            string result = "";
            XBService.Use(client =>
            {
                result = client.GetArrestTypesList();
            }
            );

            return result;
        }

        public static string GetArrestsReasonTypesList()
        {
            string result = "";
            XBService.Use(client =>
            {
                result = client.GetArrestsReasonTypesList();
            });

            return result;
        }

        public static string PostNewAddedLoanArrest(CustomerArrestInfo obj)
        {
            string result = "";
            XBService.Use(client =>
            {
                result = client.PostNewAddedCustomerArrestInfo(obj);
            });
            return result;
        }

        public static string RemoveCustomerArrestInfo(CustomerArrestInfo obj)
        {
            string result = "";
            XBService.Use(client =>
            {
                result = client.RemoveCustomerArrestInfo(obj);
            });
            return result;
        }

        public static string GetCustomerArrestsInfo(ulong customerNumber)
        {
            string result = "";
            XBService.Use(client =>
            {
                result = client.GetCustomerArrestsInfo(customerNumber);
            });

            return result;
        }

        public static ulong GetCustomerNumberForArrests()
        {
            ulong customerNumber = 0;
            XBService.Use(client =>
            {
                customerNumber = client.GetCustomerNumberForArrests();
            });

            return customerNumber;
        }

        public static string GetSetNumberInfo(xbs.UserInfoForArrests obj)
        {
            string result = "";
            XBService.Use(client =>
            {
                result = client.GetSetNumberInfo(obj);
            });

            return result;
        }

        public static CheckCustomerArrests GetCustomerHasArrests(ulong customerNumber)
        {
            CheckCustomerArrests customer = new CheckCustomerArrests();

            XBService.Use(client =>
            {
                customer = client.GetCustomerHasArrests(customerNumber);
            });

            return customer;
        }

        public static int GetCustomerfillialCode(ulong customerNumber)
        {
            int fillial = 0;

            XBService.Use(client =>
            {
                fillial = client.GetCustomerFilial();
            });

            return fillial;
        }

        public static Dictionary<string, string> SerchGasPromForReport(string abonentNumber, string branchCode)
        {
            Dictionary<string, string> SearchResult = new Dictionary<string, string>();

            XBService.Use(client =>
            {
                SearchResult = client.SerchGasPromForReport(abonentNumber, branchCode);
            });

            return SearchResult;
        }
        public static bool CheckForTransactionLimit(Order order)
        {
            bool limit = false;

            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.CheckForTransactionLimit(order);
            });

            if (result.ResultCode == ResultCode.ValidationError)
                limit = true;

            return limit;
        }

        public static ActionResult ChangeProblemLoanTaxQuality(ulong taxAppId)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.ChangeProblemLoanTaxQuality(taxAppId);
            }
            );
            return result;
        }

        public static int GetTransactionLimit()
        {
            string guid = Utility.GetSessionId();
            User user = (User)System.Web.HttpContext.Current.Session[guid + "_User"];
            return user.TransactionLimit;
        }

        public static ActionResult DownloadOrderXMLs(DateTime DateFrom, DateTime DateTo)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.DownloadOrderXMLs(DateFrom, DateTo);

            });
            return result;
        }


        //HB

        public static HBMessageFiles GetMsgSelectedFile(int fileId)
        {
            HBMessageFiles result = new HBMessageFiles();

            XBService.Use(client =>
            {
                result = client.GetMsgSelectedFile(fileId);
            });
            return result;
        }
        public static List<string> GetTreansactionConfirmationDetails(int docId, long debitAccount)
        {
            List<string> result = new List<string>();
            XBService.Use(client =>
            {
                result = client.GetTreansactionConfirmationDetails(docId, debitAccount);
            });
            return result;
        }

        public static string ConfirmReestrTransaction(int docId, int bankCode, short setNumber)
        {
            string result = "";
            XBService.Use(client =>
            {
                result = client.ConfirmReestrTransaction(docId, bankCode, setNumber);
            });
            return result;
        }

        public static List<xbs.ReestrTransferAdditionalDetails> CheckHBReestrTransferAdditionalDetails(int orderId, List<xbs.ReestrTransferAdditionalDetails> details)
        {
            List<xbs.ReestrTransferAdditionalDetails> obj = new List<xbs.ReestrTransferAdditionalDetails>();
            XBService.Use(client =>
            {
                obj = client.CheckHBReestrTransferAdditionalDetails(orderId, details);
            });
            return obj;
        }
        public static List<xbs.HBDocuments> GetHBDocumentsList(xbs.HBDocumentFilters obj)
        {
            List<xbs.HBDocuments> searchedObj = new List<xbs.HBDocuments>();
            XBService.Use(client =>
            {
                searchedObj = client.GetHBDocumentsList(obj);
            });
            return searchedObj;
        }

        public static List<xbs.HBDocuments> GetSearchedHBDocuments(xbs.HBDocumentFilters obj)
        {
            List<xbs.HBDocuments> searchedObj = new List<xbs.HBDocuments>();
            XBService.Use(client =>
            {
                searchedObj = client.GetSearchedHBDocuments(obj);
            });
            return searchedObj;
        }


        public static xbs.HBDocumentTransactionError GetTransactionErrorDetails(int transactionCode)
        {
            xbs.HBDocumentTransactionError details = new xbs.HBDocumentTransactionError();
            XBService.Use(client =>
            {
                details = client.GetTransactionErrorDetails(transactionCode);
            });
            return details;
        }

        public static List<xbs.HBDocumentConfirmationHistory> GetConfirmationHistoryDetails(int transactionCode)
        {
            List<xbs.HBDocumentConfirmationHistory> details = new List<xbs.HBDocumentConfirmationHistory>();
            XBService.Use(client =>
            {
                details = client.GetConfirmationHistoryDetails(transactionCode);
            });
            return details;
        }

        public static string GetCheckingProductAccordance(int transactionCode)
        {
            string details = "";
            XBService.Use(client =>
            {
                details = client.GetCheckingProductAccordance(transactionCode);
            });
            return details;
        }

        public static xbs.HBDocumentConfirmationHistory GetProductAccordanceDetails(int transactionCode)
        {
            xbs.HBDocumentConfirmationHistory details = new xbs.HBDocumentConfirmationHistory();
            XBService.Use(client =>
            {
                details = client.GetProductAccordanceDetails(transactionCode);
            });
            return details;
        }
        public static bool SetHBDocumentAutomatConfirmationSign(xbs.HBDocumentFilters obj)
        {
            bool done = false;
            XBService.Use(client =>
            {
                done = client.SetHBDocumentAutomatConfirmationSign(obj);
            });

            return done;
        }

        public static bool ExcludeCardAccountTransactions(xbs.HBDocumentFilters obj)
        {
            bool done = false;
            XBService.Use(client =>
            {
                done = client.ExcludeCardAccountTransactions(obj);
            });

            return done;
        }

        public static bool SelectOrRemoveFromAutomaticExecution(xbs.HBDocumentFilters obj)
        {
            bool done = false;
            XBService.Use(client =>
            {
                done = client.SelectOrRemoveFromAutomaticExecution(obj);
            });
            return done;
        }

        public static bool FormulateAllHBDocuments(xbs.HBDocumentFilters obj)
        {
            bool done = false;
            XBService.Use(client =>
            {
                done = client.FormulateAllHBDocuments(obj);
            });
            return done;
        }

        public static string GetHBArCaBalancePermission(int transactionCode, long accountGroup)
        {
            string details = "";
            XBService.Use(client =>
            {
                details = client.GetHBArCaBalancePermission(transactionCode, accountGroup);
            });
            return details;
        }

        public static string GetHBAccountNumber(string cardNumber)
        {
            string accountNumber = "";
            XBService.Use(client =>
            {
                accountNumber = client.GetHBAccountNumber(cardNumber);
            });
            return accountNumber;
        }

        public static string PostTransactionRejectConfirmation(xbs.HBDocuments document)
        {
            string done = "";
            XBService.Use(client =>
            {
                done = client.ConfirmTransactionReject(document);
            });
            return done;
        }


        public static string ChangeTransactionQuality(int transactionCode)
        {
            string details = "";
            XBService.Use(client =>
            {
                details = client.ChangeTransactionQuality(transactionCode);
            });
            return details;
        }

        public static string ChangeAutomatedConfirmTime(List<string> info)
        {
            string date = "";
            XBService.Use(client =>
            {
                date = client.ChangeAutomatedConfirmTime(info);
            });
            return date;
        }

        public static string GetAutomatedConfirmTime()
        {
            string date = "";
            XBService.Use(client =>
            {
                date = client.GetAutomatedConfirmTime();
            });
            return date;
        }

        public static xbs.HBDocuments GetCustomerAccountAndInfoDetails(xbs.HBDocuments obj)
        {
            xbs.HBDocuments result = new xbs.HBDocuments();

            XBService.Use(client =>
            {
                result = client.GetCustomerAccountAndInfoDetails(obj);
            });

            return result;
        }
        public static void PostReestrPaymentDetails(XBS.ReestrTransferOrder order)
        {
            XBService.Use(client =>
            {
                client.PostReestrPaymentDetails(order);
            });

        }
        public static string GetcheckedReestrTransferDetails(int docId)
        {
            string json = "";

            XBService.Use(client =>
            {
                json = client.GetcheckedReestrTransferDetails(docId);
            });

            return json;
        }

        public static bool GetReestrTransactionIsChecked(int docId)
        {
            bool done = false;

            XBService.Use(client =>
            {
                done = client.CheckReestrTransactionIsChecked(docId);
            });

            return done;
        }
        public static bool PostInternationalPaymentAddresses(InternationalPaymentOrder order)
        {
            bool done = false;

            XBService.Use(client =>
            {
                done = client.SaveInternationalPaymentAddresses(order);
            });

            return done;
        }


        public static List<XBS.ReestrTransferAdditionalDetails> GetTransactionIsChecked(long orderId, List<XBS.ReestrTransferAdditionalDetails> details)
        {
            List<XBS.ReestrTransferAdditionalDetails> obj = new List<ReestrTransferAdditionalDetails>();

            XBService.Use(client =>
            {
                obj = client.GetTransactionIsChecked(orderId, details);
            });

            return obj;
        }

        public static bool GetReestrFromHB(FrontOffice.XBS.HBDocuments order)
        {
            bool done = false;

            XBService.Use(client =>
            {
                done = client.GetReestrFromHB(order);
            });


            return done;
        }

        public static List<HBMessages> GetHBMessages()
        {
            List<HBMessages> msg = new List<HBMessages>();

            XBService.Use(client =>
            {
                msg = client.GetHBMessages();
            });

            return msg;
        }

        public static List<HBMessages> GetSearchedHBMessages(xbs.HBMessagesSreach obj)
        {
            List<HBMessages> msg = new List<HBMessages>();

            XBService.Use(client =>
            {
                msg = client.GetSearchedHBMessages(obj);
            });

            return msg;
        }

        public static string PostMessageAsRead(int msgId, int setNumber)
        {
            string json = "";

            XBService.Use(client =>
            {
                json = client.PostMessageAsRead(msgId, setNumber);
            });

            return json;
        }

        public static string PostSentMessageToCustomer(FrontOffice.XBS.HBMessages obj)
        {
            string json = "";

            XBService.Use(client =>
            {
                json = client.PostSentMessageToCustomer(obj);
            });

            return json;
        }

        public static List<HBMessageFiles> GetMessageUploadedFilesList(int msgId, bool showUploadFilesContent)
        {
            List<HBMessageFiles> files = new List<HBMessageFiles>();

            XBService.Use(client =>
            {
                files = client.GetMessageUploadedFilesList(msgId, showUploadFilesContent);
            });

            return files;
        }

        public static int GetCancelTransactionDetails(int docId)
        {
            int quality = 0;

            XBService.Use(client =>
            {
                quality = client.GetCancelTransactionDetails(docId);
            });

            return quality;
        }


        public static string PostBypassHistory(FrontOffice.XBS.HBDocumentBypassTransaction obj)
        {
            string done = "";

            XBService.Use(client =>
            {
                done = client.PostBypassHistory(obj);
            });

            return done;
        }

        public static string PostApproveUnconfirmedOrder(long docId, int setNumber)
        {
            string done = "";

            XBService.Use(client =>
            {
                done = client.PostApproveUnconfirmedOrder(docId, setNumber);
            });

            return done;
        }

        public static void PostDAHKPaymentType(long orderId, int paymentType, int setNumber)
        {
            XBService.Use(client =>
            {
                client.SaveDAHKPaymentType(orderId, paymentType, setNumber);
            });
        }

        public static string GetcheckedArmTransferDetails(long docId)
        {
            string done = "";

            XBService.Use(client =>
            {
                done = client.GetcheckedArmTransferDetails(docId);
            });

            return done;
        }

        public static string CreateLogonTicket(string userSessionToken)
        {
            string logonTicket = null;
            XBService.Use(client =>
            {
                logonTicket = client.CreateLogonTicket(userSessionToken);
            });
            return logonTicket;
        }

        public static TupleOfstringstring GetSintAccounts(string accountNumber)
        {
            TupleOfstringstring result = new TupleOfstringstring();

            XBService.Use(client =>
            {
                result = client.GetSintAccountForHB(accountNumber);
            });

            return result;
        }

        public static void PostResetEarlyRepaymentFee(ulong productId, string description, bool recovery)
        {
            XBService.Use(client =>
            {
                client.PostResetEarlyRepaymentFee(productId, description, recovery);
            });

        }

        public static bool GetResetEarlyRepaymentFeePermission(ulong productId)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.GetResetEarlyRepaymentFeePermission(productId);
            });

            return result;
        }

        public static ActionResult MigrateOldUserToCas(int userId)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.MigrateOldUserToCas(userId);
            });
            return result;
        }

        public static object GetOrdersForCashRegister(SearchOrders searchOrders)
        {

            List<OrderForCashRegister> result = new List<OrderForCashRegister>();
            XBService.Use(client =>
            {
                result = client.GetOrdersForCashRegister(searchOrders);

            });
            return result;

        }


        public static ActionResult SaveVirtualCardStatusChangeOrder(VirtualCardStatusChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveVirtualCardStatusChangeOrder(order);
            });
            return result;
        }

        public static VirtualCardStatusChangeOrder GetVirtualCardStatusChangeOrder(long orderID)
        {
            VirtualCardStatusChangeOrder order = new VirtualCardStatusChangeOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetVirtualCardStatusChangeOrder(orderID);
            });
            return order;
        }

        public static ActionResult ReSendVirtualCardRequest(int requestId)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ReSendVirtualCardRequest(requestId);
            });
            return result;
        }

        public static ActionResult SaveLoanDelayOrder(LoanDelayOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveLoanDelayOrder(order);
            });
            return result;
        }
        public static LoanDelayOrder GetLoanDelayOrder(long orderID)
        {
            LoanDelayOrder order = new LoanDelayOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetLoanDelayOrder(orderID);
            });
            return order;
        }

        public static LoanRepaymentDelayDetails GetLoanRepaymentDelayDetails(ulong productId)
        {
            var delayDetails = new LoanRepaymentDelayDetails();
            XBService.Use(client =>
            {

                delayDetails = client.GetLoanRepaymentDelayDetails(productId);
            });
            return delayDetails;
        }

        public static RemittanceDetailsRequestResponse GetRemittanceDetailsByURN(string URN, string authorizedUserSessionToken)
        {
            RemittanceDetailsRequestResponse result = new RemittanceDetailsRequestResponse();
            XBService.Use(client =>
            {
                result = client.GetRemittanceDetailsByURN(URN, authorizedUserSessionToken);
            });
            return result;
        }


        public static ActionResult SaveRemittanceCancellationOrder(RemittanceCancellationOrder order, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.SaveRemittanceCancellationOrder(order, authorizedUserSessionToken);
            }
          );

            return result;
        }

        public static ActionResult ApproveRemittanceCancellationOrder(long orderId, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.ApproveRemittanceCancellationOrder(orderId, authorizedUserSessionToken);
            }
          );

            return result;
        }

        public static RemittanceCancellationOrder GetRemittanceCancellationOrder(long orderId, string authorizedUserSessionToken)
        {
            RemittanceCancellationOrder result = new RemittanceCancellationOrder();
            XBService.Use(client =>
            {
                result = client.GetRemittanceCancellationOrder(orderId, authorizedUserSessionToken);
            });
            return result;
        }

        public static RemittanceFeeDataRequestResponse GetRemittanceFeeData(RemittanceFeeInput feeInput, string authorizedUserSessionToken)
        {
            RemittanceFeeDataRequestResponse result = new RemittanceFeeDataRequestResponse();
            XBService.Use(client =>
            {
                result = client.GetRemittanceFeeData(feeInput, authorizedUserSessionToken);
            });
            return result;
        }

        public static ActionResult SaveFastTransferOrder(FastTransferPaymentOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.RegistrationDate = order.RegistrationDate.Date;
                result = client.SaveFastTransferOrder(order);
            }
          );

            return result;
        }

        public static ActionResult ApproveFastTransferOrder(long orderId, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.ApproveFastTransferOrder(orderId, authorizedUserSessionToken);
            }
          );

            return result;
        }

        public static RemittanceAmendmentOrder GetRemittanceAmendmentOrder(long orderId)
        {
            RemittanceAmendmentOrder result = new RemittanceAmendmentOrder();
            XBService.Use(client =>
            {
                result = client.GetRemittanceAmendmentOrder(orderId);
            });
            return result;
        }


        public static ActionResult SaveRemittanceAmendmentOrder(RemittanceAmendmentOrder order, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.SaveRemittanceAmendmentOrder(order, authorizedUserSessionToken);
            }
          );

            return result;
        }


        public static ActionResult ApproveRemittanceAmendmentOrder(long orderId, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {

                result = client.ApproveRemittanceAmendmentOrder(orderId, authorizedUserSessionToken);
            }
          );

            return result;
        }

        public static bool IsDebetExportAndImportCreditLine(double debAccountNumber)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.IsDebetExportAndImportCreditLine(debAccountNumber.ToString());
            });

            return result;
        }
        public static ActionResult SaveCancelLoanDelayOrder(CancelDelayOrder order)
        {
            order.CancelDelayDate = DateTime.Now.Date;
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCancelLoanDelayOrder(order);
            });
            return result;
        }

        public static CancelDelayOrder GetCancelLoanDelayOrder(long orderID)
        {
            CancelDelayOrder order = new CancelDelayOrder(); XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetCancelLoanDelayOrder(orderID);
            });
            return order;
        }

        public static double GetOrderServiceFeeByIndex(int indexID)
        {
            double serviceFee = 0;

            XBService.Use(client =>
            {
                serviceFee = client.GetOrderServiceFeeByIndex(indexID);
            });

            return serviceFee;
        }


        public static bool CheckForCurrencyExchangeOrderTransactionLimit(CurrencyExchangeOrder order)
        {
            bool limit = false;

            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.CheckForCurrencyExchangeOrderTransactionLimit(order);
            });

            if (result.ResultCode == ResultCode.ValidationError)
                limit = true;

            return limit;
        }

        public static ReplacedCardAccountRegOrder GetReplacedCardAccountRegOrder(long orderID)
        {
            ReplacedCardAccountRegOrder order = new ReplacedCardAccountRegOrder();
            XBService.Use(client =>
            {
                order = client.GetReplacedCardAccountRegOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveReplacedCardAccountRegOrder(ReplacedCardAccountRegOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.ReplacedCardAccountRegOrder;
                result = client.SaveAndApproveReplacedCardAccountRegOrder(order);
            }
             );
            return result;
        }

        public static PINRegenerationOrder GetPINRegenerationOrder(long orderID)
        {
            PINRegenerationOrder order = new PINRegenerationOrder();
            XBService.Use(client =>
            {
                order = client.GetPINRegenerationOrder(orderID);
            });
            return order;
        }

        public static ActionResult SavePINRegenerationOrder(xbs.PINRegenerationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.PINRegenerationOrder;
                result = client.SaveAndApprovePINRegOrder(order);
            }
             );
            return result;
        }

        public static NonCreditLineCardReplaceOrder GetNonCreditLineCardReplaceOrder(long orderID)
        {
            NonCreditLineCardReplaceOrder order = new NonCreditLineCardReplaceOrder();
            XBService.Use(client =>
            {
                order = client.GetNonCreditLineCardReplaceOrder(orderID);
            });
            return order;
        }

        public static ActionResult SaveNonCreditLineCardReplaceOrder(xbs.NonCreditLineCardReplaceOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.NonCreditLineCardReplaceOrder;
                result = client.SaveAndApproveNonCreditLineCardReplaceOrder(order);
            }
                );
            return result;
        }

        public static CreditLineCardReplaceOrder GetCreditLineCardReplaceOrder(long orderID)
        {
            CreditLineCardReplaceOrder order = new CreditLineCardReplaceOrder();
            XBService.Use(client =>
            {
                order = client.GetCreditLineCardReplaceOrder(orderID);
            });
            return order;
        }
        public static ActionResult SaveCreditLineCardReplaceOrder(xbs.CreditLineCardReplaceOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CreditLineCardReplaceOrder;
                result = client.SaveAndApproveCreditLineCardReplaceOrder(order);
            }
                );
            return result;
        }

        public static int GetCardArCaStatus(ulong productId)
        {
            int result = 0;
            XBService.Use(client =>
            {
                result = client.GetCardArCaStatus(productId);
            });

            return result;
        }
        public static List<CardAdditionalData> GetCardAdditionalDatas(string cardnumber, string expirydate)
        {
            List<CardAdditionalData> cardAdditionalDatas = new List<CardAdditionalData>();

            XBService.Use(client =>
            {
                cardAdditionalDatas = client.GetCardAdditionalDatas(cardnumber, expirydate);
            });

            return cardAdditionalDatas;
        }

        public static ActionResult SaveCardAdditionalDataOrder(CardAdditionalDataOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveCardAdditionalDataOrder(order);
            }
          );
            return result;
        }

        internal static CardAdditionalDataOrder GetCardAdditionalDataOrder(long orderID)
        {
            CardAdditionalDataOrder CardAdditionalDataOrder = new CardAdditionalDataOrder();

            XBService.Use(client =>
            {
                CardAdditionalDataOrder = client.GetCardAdditionalDataOrder(orderID);
            });

            return CardAdditionalDataOrder;
        }

        internal static List<PlasticCard> GetCustomerPlasticCardsForAdditionalData(bool IsClosed)
        {
            List<PlasticCard> plasticCards = new List<PlasticCard>();

            XBService.Use(client =>
            {
                plasticCards = client.GetCustomerPlasticCardsForAdditionalData(IsClosed);
            });
            return plasticCards;
        }
        public static bool IsCreditLineActivateOnApiGate(long orderId)
        {
            bool isApiGate = false;

            XBService.Use(client =>
            {
                isApiGate = client.IsCreditLineActivateOnApiGate(orderId);
            }
          );

            return isApiGate;
        }

        public static string GetPreviousBlockUnblockOrderComment(string cardNumber)
        {
            string orderComment = "";

            XBService.Use(client =>
            {
                orderComment = client.GetPreviousBlockUnblockOrderComment(cardNumber);
            });

            return orderComment;
        }
        public static CardToOtherCardsOrder GetCardToOtherCardOrder(long orderId)
        {
            CardToOtherCardsOrder result = new CardToOtherCardsOrder();
            XBService.Use(client =>
            {
                result = client.GetCardToOtherCardsOrder(orderId);
            });
            return result;
        }

        public static List<LoanInterestRateChangeHistory> GetLoanInterestRateChangeHistoryDetails(ulong productID)
        {
            List<LoanInterestRateChangeHistory> details = new List<LoanInterestRateChangeHistory>();

            XBService.Use(client =>
            {
                details = client.GetLoanInterestRateChangeHistoryDetails(productID);
            });

            return details;
        }
        public static string GetCardTechnology(ulong productId)
        {
            string cardTechnology = "";
            XBService.Use(client =>
            {
                cardTechnology = client.GetCardTechnology(productId);
            });
            return cardTechnology;
        }

        public static ActionResult SaveChangeBranchOrder(ChangeBranchOrder order)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                order.RegistrationDate = DateTime.Now.Date;
                order.Type = OrderType.ChangeBranch;
                result = client.SaveAndApproveChangeBranchOrder(order);
            });

            return result;
        }

        public static ChangeBranchOrder GetChangeBranchOrder(long ID)
        {
            ChangeBranchOrder order = new ChangeBranchOrder();
            XBService.Use(client =>
            {
                order = client.GetChangeBranchOrder(ID);
            });

            return order;
        }

        public static ChangeBranchOrder GetFilialCode(long cardNumber)
        {
            ChangeBranchOrder order = new ChangeBranchOrder();
            order.CardNumber = cardNumber;
            XBService.Use(client =>
            {
                order = client.GetFilialCode(cardNumber);
            });

            return order;
        }

        public static CardNotRenewOrder GetCardNotRenewOrder(long orderID)
        {
            CardNotRenewOrder order = new CardNotRenewOrder();
            XBService.Use(client =>
            {
                order = client.GetCardNotRenewOrder(orderID);
            });
            return order;
        }
        public static ActionResult SaveCardNotRenewOrder(xbs.CardNotRenewOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CardNotRenewOrder;
                result = client.SaveAndApproveCardNotRenewOrder(order);
            }
             );
            return result;
        }
        public static string GetCardHolderFullName(ulong productId)
        {
            string fullName = "";
            XBService.Use(client =>
            {
                fullName = client.GetCardHolderFullName(productId);
            });
            return fullName;
        }


        public static ActionResult SaveCardAccountClosingOrder(CardAccountClosingOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveCardAccountClosingOrder(order);
            }
          );
            return result;
        }
        internal static CardAccountClosingOrder GetCardAccountClosingOrder(long orderID)
        {
            CardAccountClosingOrder cardAccountClosingOrder = new CardAccountClosingOrder();
            XBService.Use(client =>
            {
                cardAccountClosingOrder = client.GetCardAccountClosingOrder(orderID);
            });
            return cardAccountClosingOrder;
        }


        public static Dictionary<string, string> GetAccountsForBlockingAvailableAmount(ulong customerNumber)
        {

            Dictionary<string, string> result = new Dictionary<string, string>();

            XBService.Use(client =>
            {
                result = client.GetAccountsForBlockingAvailableAmount(customerNumber);
            }
            );
            return result;
        }

        public static double GetTransitAccountNumberFromCardAccount(double cardAccountNumber)
        {

            double result = 0;

            XBService.Use(client =>
            {
                result = client.GetTransitAccountNumberFromCardAccount(cardAccountNumber);
            }
            );

            return result;
        }

        public static List<ulong> GetDAHKproductAccounts(ulong accountNumber)
        {
            List<ulong> accounts = new List<ulong>();
            XBService.Use(client =>
            {
                accounts = client.GetDAHKproductAccounts(accountNumber);
            }
                            );
            return accounts;
        }

        public static Dictionary<string, string> GetFreezedAccounts(ulong customerNumber)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();

            XBService.Use(client =>
            {
                result = client.GetFreezedAccounts(customerNumber);
            }
            );
            return result;

        }

        public static ActionResult MakeAvailable(List<long> freezeIdList, float availableAmount, ushort filialCode, short userId)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.MakeAvailable(freezeIdList, availableAmount, filialCode, userId);
            });

            return result;
        }

        public static ActionResult BlockingAmountFromAvailableAccount(double accountNumber, float blockingAmount, List<XBS.DahkDetails> inquestDetailsList, int userID)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.BlockingAmountFromAvailableAccount(accountNumber, blockingAmount, inquestDetailsList, userID);
            });

            return result;
        }

        public static List<AccountDAHKfreezeDetails> GetCurrentInquestDetails(ulong customerNumber)
        {
            List<AccountDAHKfreezeDetails> details = new List<AccountDAHKfreezeDetails>();
            XBService.Use(client =>
            {
                details = client.GetCurrentInquestDetails(customerNumber);
            }
                            );
            return details;
        }

        public static List<AccountDAHKfreezeDetails> GetAccountDAHKFreezeDetails(ulong customerNumber, string inquestId, ulong accountNumber)
        {
            List<AccountDAHKfreezeDetails> freezeDetails = new List<AccountDAHKfreezeDetails>();
            XBService.Use(client =>
            {
                freezeDetails = client.GetAccountDAHKFreezeDetails(customerNumber, inquestId, accountNumber);
            }
                            );
            return freezeDetails;
        }

        //---9316
        public static LeasingCustomerClassification GetLeasingCustomerInfo(long customerNumber)
        {
            LeasingCustomerClassification result = new LeasingCustomerClassification();
            XBService.Use(client =>
            {
                result = client.GetLeasingCustomerInfo(customerNumber);
            });

            return result;
        }

        public static List<LeasingCustomerClassification> GetLeasingCustomerSubjectiveClassificationGrounds(long customerNumber, bool isActive)
        {
            List<LeasingCustomerClassification> result = new List<LeasingCustomerClassification>();
            XBService.Use(client =>
            {
                result = client.GetLeasingCustomerSubjectiveClassificationGrounds(customerNumber, isActive);
            });

            return result;
        }

        public static Dictionary<string, string> GetLeasingReasonTypes(short classificationType)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            XBService.Use(client =>
            {
                result = client.GetLeasingReasonTypes(classificationType);
            });

            return result;
        }

        public static TupleOfintstring GetLeasingRiskDaysCountAndName(byte riskClassCode)
        {
            TupleOfintstring result = null;
            XBService.Use(client =>
            {
                result = client.GetLeasingRiskDaysCountAndName(riskClassCode);
            });
            return result;
        }

        public static ActionResult AddLeasingCustomerSubjectiveClassificationGrounds(LeasingCustomerClassification obj)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.AddLeasingCustomerSubjectiveClassificationGrounds(obj);
            });

            return result;
        }

        public static LeasingCustomerClassification GetLeasingCustomerSubjectiveClassificationGroundsByID(int Id)
        {
            LeasingCustomerClassification result = new LeasingCustomerClassification();
            XBService.Use(client =>
            {
                result = client.GetLeasingCustomerSubjectiveClassificationGroundsByID(Id);
            });

            return result;
        }

        public static ActionResult CloseLeasingCustomerSubjectiveClassificationGrounds(int Id)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.CloseLeasingCustomerSubjectiveClassificationGrounds(Id);
            });

            return result;
        }



        public static ActionResult AddLeasingConnectionGroundsForNotClassifyingWithCustomer(LeasingCustomerClassification obj)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.AddLeasingConnectionGroundsForNotClassifyingWithCustomer(obj);
            });

            return result;
        }

        public static List<LeasingCustomerClassification> GetLeasingConnectionGroundsForNotClassifyingWithCustomer(long customerNumber, byte isActing)
        {
            List<LeasingCustomerClassification> list = new List<LeasingCustomerClassification>();
            Use(client =>
            {
                list = client.GetLeasingConnectionGroundsForNotClassifyingWithCustomer(customerNumber, isActing);
            });

            return list;
        }
        public static LeasingCustomerClassification GetLeasingConnectionGroundsForNotClassifyingWithCustomerByID(int id)
        {
            LeasingCustomerClassification result = new LeasingCustomerClassification();
            XBService.Use(client =>
            {
                result = client.GetLeasingConnectionGroundsForNotClassifyingWithCustomerByID(id);
            });

            return result;
        }

        public static ActionResult CloseLeasingConnectionGroundsForNotClassifyingWithCustomer(string docNumber, DateTime docDate, int deletedId)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.CloseLeasingConnectionGroundsForNotClassifyingWithCustomer(docNumber, docDate, deletedId);
            });

            return result;
        }

        public static List<LeasingCustomerClassification> GetLeasingConnectionGroundsForClassifyingWithCustomer(long customerNumber, byte isActing)
        {
            List<LeasingCustomerClassification> result = new List<LeasingCustomerClassification>();
            XBService.Use(client =>
            {
                result = client.GetLeasingConnectionGroundsForClassifyingWithCustomer(customerNumber, isActing);
            });

            return result;
        }


        public static ActionResult AddOrCloseLeasingConnectionGroundsForClassifyingWithCustomer(LeasingCustomerClassification obj, byte addORClose)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.AddOrCloseLeasingConnectionGroundsForClassifyingWithCustomer(obj, addORClose);
            });

            return result;
        }

        public static LeasingCustomerClassification GetLeasingConnectionGroundsForClassifyingWithCustomerByID(int id, long customerNumber)
        {
            LeasingCustomerClassification result = new LeasingCustomerClassification();
            XBService.Use(client =>
            {
                result = client.GetLeasingConnectionGroundsForClassifyingWithCustomerByID(id, customerNumber);
            });

            return result;
        }

        public static long GetLeasingCustomerNumber(int leasingCustomerNumber)
        {
            long result = 0;
            XBService.Use(client =>
            {
                result = client.GetLeasingCustomerNumber(leasingCustomerNumber);
            });

            return result;
        }

        public static List<LeasingCustomerClassification> GetLeasingCustomerClassificationHistory(int leasingCustomerNumer, DateTime date)
        {
            List<LeasingCustomerClassification> result = new List<LeasingCustomerClassification>();
            XBService.Use(client =>
            {
                result = client.GetLeasingCustomerClassificationHistory(leasingCustomerNumer, date);
            });

            return result;
        }

        public static LeasingCustomerClassification GetLeasingCustomerClassificationHistoryByID(int id, long loanFullNumber, int lpNumber)
        {
            LeasingCustomerClassification customer = new LeasingCustomerClassification();
            Use(client =>
            {
                customer = client.GetLeasingCustomerClassificationHistoryByID(id, loanFullNumber, lpNumber);
            });

            return customer;
        }

        public static bool LeasingCustomerConnectionResult(int customerNumberN1, int customerNumberN2)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.LeasingCustomerConnectionResult(customerNumberN1, customerNumberN2);
            });

            return result;
        }

        public static List<KeyValuePairOfstringstring> GetLeasingInterconnectedPersonNumber(long customerNumber)
        {
            List<KeyValuePairOfstringstring> result = new List<KeyValuePairOfstringstring>();
            XBService.Use(client =>
            {
                result = client.GetLeasingInterconnectedPersonNumber(customerNumber);
            });

            return result;
        }

        public static List<LeasingCustomerClassification> GetLeasingGroundsForNotClassifyingCustomerLoan(int leasingCustomerNumber, byte isActive)
        {
            List<LeasingCustomerClassification> result = new List<LeasingCustomerClassification>();
            XBService.Use(client =>
            {
                result = client.GetLeasingGroundsForNotClassifyingCustomerLoan(leasingCustomerNumber, isActive);
            });

            return result;
        }

        public static Dictionary<string, string> GetLeasingLoanInfo(int leasingCustNumber)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            XBService.Use(client =>
            {
                result = client.GetLeasingLoanInfo(leasingCustNumber);
            });

            return result;
        }

        public static ActionResult AddLeasingGroundsForNotClassifyingCustomerLoan(LeasingCustomerClassification obj)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.AddLeasingGroundsForNotClassifyingCustomerLoan(obj);
            });

            return result;
        }

        public static LeasingCustomerClassification GetLeasingGroundsForNotClassifyingCustomerLoanByID(int id)
        {
            LeasingCustomerClassification customer = new LeasingCustomerClassification();
            Use(client =>
            {
                customer = client.GetLeasingGroundsForNotClassifyingCustomerLoanByID(id);
            });

            return customer;
        }

        public static ActionResult CloseLeasingGroundsForNotClassifyingCustomerLoan(long appId, int id, string docNumber, DateTime docDate)
        {
            ActionResult result = new ActionResult();
            Use(client =>
            {
                result = client.CloseLeasingGroundsForNotClassifyingCustomerLoan(appId, id, docNumber, docDate);
            });
            return result;
        }

        public static ActionResult EditLeasingCustomerSubjectiveClassificationGrounds(LeasingCustomerClassification obj)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.EditLeasingCustomerSubjectiveClassificationGrounds(obj);
            });

            return result;
        }

        public static LeasingCustomerClassification GetLeasingSubjectiveClassificationGroundsByIDForEdit(int Id)
        {
            LeasingCustomerClassification result = new LeasingCustomerClassification();
            XBService.Use(client =>
            {
                result = client.GetLeasingSubjectiveClassificationGroundsByIDForEdit(Id);
            });

            return result;
        }

        public static List<CardDataChangeOrder> GetRelatedOfficeNumberChangeHistory(long productAppId, short fieldType)
        {
            List<CardDataChangeOrder> cardDataChangeOrders = new List<CardDataChangeOrder>();
            XBService.Use(client => { cardDataChangeOrders = client.GetCardDataChangesByProduct(productAppId, fieldType); });

            return cardDataChangeOrders;
        }
        //----

        public static ActionResult SaveLoanInterestRateConcessionOrder(LoanInterestRateConcessionOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveLoanInterestRateConcessionOrder(order);
            });
            return result;
        }

        public static LoanInterestRateConcessionOrder GetLoanInterestRateConcessionDetails(ulong productId)
        {
            var concessionDetails = new LoanInterestRateConcessionOrder();
            XBService.Use(client =>
            {

                concessionDetails = client.GetLoanInterestRateConcessionDetails(productId);
            });
            return concessionDetails;
        }
        public static bool IsCustomerConnectedToOurBank(ulong customerNumber)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.IsCustomerConnectedToOurBank(customerNumber);
            });
            return result;
        }

        internal static ActionResult SavePensionPaymentOrder(PensionPaymentOrder order)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.SavePensionPaymentOrder(order);
            });
            return result;
        }

        public static List<PensionPaymentOrder> GetAllPensionPayment(string socialCardNumber)
        {
            List<PensionPaymentOrder> pensionPayments = new List<PensionPaymentOrder>();

            XBService.Use(client =>
            {
                pensionPayments = client.GetAllPensionPayment(socialCardNumber);
            });
            return pensionPayments;
        }

        public static PensionPaymentOrder GetPensionPaymentOrderDetails(uint orderid)
        {
            PensionPaymentOrder pensionPayments = new PensionPaymentOrder();

            XBService.Use(client =>
            {
                pensionPayments = client.GetPensionPaymentOrderDetails(orderid);
            });
            return pensionPayments;
        }

        public static List<PlasticCard> GetCustomerMainCardsForAttachedCardOrder()
        {
            List<PlasticCard> cards = new List<PlasticCard>();
            XBService.Use(client =>
            {
                cards = client.GetCustomerMainCardsForAttachedCardOrder();
            });

            return cards;
        }

        public static LoanInterestRateConcessionOrder GetLoanInterestRateConcessionOrder(long orderID)
        {
            LoanInterestRateConcessionOrder order = new LoanInterestRateConcessionOrder();
            XBService.Use(client =>
            {
                order.Quality = XBS.OrderQuality.Draft;
                order = client.GetLoanInterestRateConcessionOrder(orderID);
            });
            return order;
        }

        public static int GetRemittanceAmendmentCount(ulong transferID)
        {
            int count = 0;
            XBService.Use(client =>
            {
                count = client.GetRemittanceAmendmentCount(transferID);
            });

            return count;
        }

        internal static Dictionary<string, string> GetRemittanceContractDetails(ulong docId, string authorizedUserSessionToken)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();

            XBService.Use(client =>
            {
                result = client.GetRemittanceContractDetails(docId, authorizedUserSessionToken);
            });

            return result;
        }

        public static DateTime GetLeasingOperDayForStatements()
        {
            DateTime OperDay = new DateTime();
            XBService.Use(client =>
            {
                OperDay = client.GetLeasingOperDayForStatements();
            });
            return OperDay;
        }

        public static double GetCurrencyExchangeOrderFee(CurrencyExchangeOrder currencyExchangeOrder, int feeType)
        {
            double fee = 0;

            XBService.Use(client =>
            {
                fee = client.GetCurrencyExchangeOrderFee(currencyExchangeOrder, feeType);
            }
          );

            return fee;
        }

        public static LeasingDetailedInformation GetLeasingDetailedInformation(long loanFullNumber, DateTime dateOfBeginning)
        {
            LeasingDetailedInformation result = new LeasingDetailedInformation();
            XBService.Use(client =>
            {
                result = client.GetLeasingDetailedInformation(loanFullNumber, dateOfBeginning);
            });

            return result;
        }

        public static List<LeasingInsuranceDetails> GetLeasingInsuranceInformation(long loanFullNumber, DateTime dateOfBeginning)
        {
            List<LeasingInsuranceDetails> result = new List<LeasingInsuranceDetails>();
            XBService.Use(client =>
            {
                result = client.GetLeasingInsuranceInformation(loanFullNumber, dateOfBeginning);
            });

            return result;
        }

        public static DateTime GetLeasingOperDay()
        {
            DateTime OperDay = new DateTime();
            XBService.Use(client =>
            {
                OperDay = client.GetLeasingOperDay();
            });
            return OperDay;
        }


        public static List<MTOListAndBestChoiceOutput> GetSTAKMTOListAndBestChoice(MTOListAndBestChoiceInput bestChoice, string authorizedUserSessionToken)
        {
            List<MTOListAndBestChoiceOutput> result = new List<MTOListAndBestChoiceOutput>();
            XBService.Use(client =>
            {
                result = client.GetSTAKMTOListAndBestChoice(bestChoice, authorizedUserSessionToken);
            });
            return result;
        }

        public static ActionResult ResponseConfirmForSTAK(STAKResponseConfirm input, string authorizedUserSessionToken)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ResponseConfirmForSTAK(input, authorizedUserSessionToken);
            });
            return result;
        }
        /////start 8997
        public static ActionResult SaveAndApprovePlasticCardSMSServiceOrder(PlasticCardSMSServiceOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApprovePlasticCardSMSServiceOrder(order);
            });
            return result;
        }

        // GetPlasticCardSMSServiceHistory

        public static List<PlasticCardSMSServiceHistory> GetPlasticCardSMSServiceHistory(ulong cardNumber)
        {
            List<PlasticCardSMSServiceHistory> order = new List<PlasticCardSMSServiceHistory>();
            XBService.Use(client =>
            {
                order = client.GetPlasticCardAllSMSServiceHistory(cardNumber);
            });
            return order;
        }

        //GetPlasticCardSMSServiceOrder
        public static PlasticCardSMSServiceOrder GetPlasticCardSMSServiceOrder(long orderID)
        {
            PlasticCardSMSServiceOrder order = new PlasticCardSMSServiceOrder();
            XBService.Use(client =>
            {
                order = client.GetPlasticCardSMSServiceOrder(orderID);
            });
            return order;
        }

        //GetPlasticCardSmsServiceActions

        public static Dictionary<string, string> GetPlasticCardSmsServiceActions(string cardNumber)
        {
            Dictionary<string, string> SmsServiceActions = new Dictionary<string, string>();

            InfoService.Use(client =>
            {

                SmsServiceActions = client.GetPlasticCardSmsServiceActions(cardNumber);

            });
            return SmsServiceActions;
        }
        //GetAllTypesOfPlasticCardsSMS


        public static Dictionary<string, string> GetAllTypesOfPlasticCardsSMS()
        {
            Dictionary<string, string> AllTypesOfPlasticCardsSMS = new Dictionary<string, string>();

            InfoService.Use(client =>
            {

                AllTypesOfPlasticCardsSMS = client.GetAllTypesOfPlasticCardsSMS();

            });
            return AllTypesOfPlasticCardsSMS;
        }

        //GetCardMobilePhones 

        public static List<XBSInfo.TupleOfstringboolean> GetCardMobilePhones(ulong customerNumber, ulong cardNumber)
        {
            List<XBSInfo.TupleOfstringboolean> CardMobilePhones = new List<XBSInfo.TupleOfstringboolean>();

            InfoService.Use(client =>
            {

                CardMobilePhones = client.GetCardMobilePhones(customerNumber, cardNumber);

            });
            return CardMobilePhones;
        }

        //GetCurrentPhone
        public static string GetCurrentPhone(ulong cardNumber)
        {
            string currentPhone = null;

            InfoService.Use(client =>
            {

                currentPhone = client.GetCurrentPhone(cardNumber);

            });
            return currentPhone;
        }
        //GetCardHolderEmail
        public static string GetCustomerEmailByCardNumber(string cardNumber)
        {
            string currentEmail = null;

            InfoService.Use(client =>
            {

                currentEmail = client.GetCustomerEmailByCardNumber(cardNumber);

            });
            return currentEmail;
        }
        //SMSTypeAndValue
        public static string SMSTypeAndValue(string cardNumber)
        {
            string smsTypeAndValue = null;

            InfoService.Use(client =>
            {

                smsTypeAndValue = client.SMSTypeAndValue(cardNumber);

            });
            return smsTypeAndValue;
        }
        /////end 8997
        public static ActionResult SaveCardRenewOrder(CardRenewOrder order)
        {
            ActionResult result = new ActionResult();
            Use(client =>
            {
                order.Type = OrderType.CardRenewOrder;
                result = client.SaveAndApproveCardRenewOrder(order);
            }
             );
            return result;
        }

        public static CardRenewOrder GetCardRenewOrder(long orderID)
        {
            CardRenewOrder order = new CardRenewOrder();
            Use(client =>
            {
                order = client.GetCardRenewOrder(orderID);
            });
            return order;
        }

        public static List<string> CheckCardRenewOrder(CardRenewOrder order)
        {
            List<string> messages = new List<string>();
            Use(client =>
            {
                messages = client.CheckCardRenewOrder(order);
            });
            return messages;
        }

        public static string GetPhoneForCardRenew(long productId)
        {
            string phone = "";
            Use(client =>
            {
                phone = client.GetPhoneForCardRenew(productId);
            });
            return phone;
        }

        public static string GetCardHolderData(ulong productId, string dataType)
        {
            string fullName = "";
            Use(client =>
            {
                fullName = client.GetCardHolderData(productId, dataType);
            });
            return fullName;
        }

        public static ActionResult SaveRenewedCardAccountRegOrder(RenewedCardAccountRegOrder order)
        {
            ActionResult result = new ActionResult();
            Use(client =>
            {
                order.Type = OrderType.RenewedCardAccountRegOrder;
                result = client.SaveAndApproveRenewedCardAccountRegOrder(order);
            }
             );
            return result;
        }

        public static RenewedCardAccountRegOrder GetRenewedCardAccountRegOrder(long orderID)
        {
            RenewedCardAccountRegOrder order = new RenewedCardAccountRegOrder();
            Use(client =>
            {
                order = client.GetRenewedCardAccountRegOrder(orderID);
            });
            return order;
        }
        public static List<CardRetainHistory> GetCardRetainHistory(string cardNumber)
        {
            List<CardRetainHistory> historyList = new List<CardRetainHistory>();
            XBService.Use(client =>
            {
                historyList = client.GetCardRetainHistory(cardNumber);
            });
            return historyList;
        }

        public static ActionResult SaveAndApproveLoanDeleteOrder(xbs.DeleteLoanOrder deleteLoanOrder)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveLoanDeleteOrder(deleteLoanOrder);
            });
            return result;
        }

        public static DeleteLoanOrderDetails GetLoanDeleteOrderDetails(uint orderId)
        {
            DeleteLoanOrderDetails result = new DeleteLoanOrderDetails();
            XBService.Use(client =>
            {
                result = client.GetLoanDeleteOrderDetails(orderId);
            });
            return result;
        }

        public static ActionResult SaveAndApproveAccountRemoving(AccountRemovingOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveAccountRemoving(order);
            }
            );

            return result;
        }

        public static double GetPartlyMatureAmount(string contractNumber)
        {
            Double result = 0;
            XBService.Use(client =>
            {
                result = client.GetPartlyMatureAmount(contractNumber);
            });

            return result;
        }

        //START9878

        public static ActionResult SaveCardReOpenOrder(CardReOpenOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                order.Type = OrderType.CardReOpenOrder;
                result = client.SaveAndApproveCardReOpenOrder(order);
            }
             );
            return result;
        }



        public static CardReOpenOrder GetCardReOpenOrder(long orderID)
        {
            CardReOpenOrder order = new CardReOpenOrder();
            XBService.Use(client =>
            {
                order = client.GetCardReOpenOrder(orderID);
            });
            return order;
        }

        public static Dictionary<string, string> GetCardReOpenReason()
        {
            Dictionary<string, string> cardReOpenReason = new Dictionary<string, string>();

            XBService.Use(client =>
            {

                cardReOpenReason = client.GetCardReOpenReason();

            });
            return cardReOpenReason;
        }


        public static bool IsCardOpen(string cardNumber)
        {
            bool isCardOpen = true;

            InfoService.Use(client =>
            {

                isCardOpen = client.IsCardOpen(cardNumber);

            });
            return isCardOpen;
        }
        //END 9878

        public static ulong CheckCustomerFreeFunds(string accountNumber)
        {
            ulong result = 0;
            XBService.Use(client =>
            {
                result = client.CheckCustomerFreeFunds(accountNumber);
            });
            return result;
        }

        public static ActionResult SaveAndApproveThirdPersonAccountRightsTransfer(ThirdPersonAccountRightsTransferOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveThirdPersonAccountRightsTransfer(order);
            }
            );

            return result;
        }

        public static bool GetRightsTransferAvailability(string accountNumber)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.GetRightsTransferAvailability(accountNumber);
            }
            );

            return result;
        }

        public static bool GetRightsTransferVisibility(string accountNumber)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.GetRightsTransferVisibility(accountNumber);
            }
            );

            return result;
        }


        public static bool GetCheckCustomerIsThirdPerson(string accountNumber, ulong customerNumber)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.GetCheckCustomerIsThirdPerson(accountNumber, customerNumber);
            }
            );

            return result;
        }

        public static List<string> GetRenewedCardAccountRegWarnings(Card card)
        {
            List<string> warnings = new List<string>();
            XBService.Use(client =>
            {
                warnings = client.GetRenewedCardAccountRegWarnings(card);
            });
            return warnings;
        }


        public static bool GetMRDataChangeAvailability(int mrID)
        {
            bool result = false;
            XBService.Use(client =>
            {
                result = client.GetMRDataChangeAvailability(mrID);
            }
            );

            return result;
        }

        public static ActionResult SaveAndApproveMRDataChangeOrder(MRDataChangeOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveMRDataChangeOrder(order);
            }
            );

            return result;
        }

        public static CardlessCashoutOrder GetCardLessCashOutOrder(long id)
        {
            CardlessCashoutOrder cardlessCashoutOrder = null;
            XBService.Use(client =>
            {
                cardlessCashoutOrder = client.GetCardLessCashOutOrder(id);
            }
          );

            return cardlessCashoutOrder;
        }

        public static LoanRepaymentFromCardDataChange GetLoanRepaymentFromCardDataChangeHistory(ulong appId)
        {
            LoanRepaymentFromCardDataChange result = new LoanRepaymentFromCardDataChange();

            XBService.Use(client =>
            {
                result = client.GetLoanRepaymentFromCardDataChangeHistory(appId);
            });
            return result;
        }

        public static LoanRepaymentFromCardDataChange SaveLoanRepaymentFromCardDataChange(LoanRepaymentFromCardDataChange loanRepaymentFromCardDataChange)
        {
            XBService.Use(client =>
            {
                loanRepaymentFromCardDataChange = client.SaveLoanRepaymentFromCardDataChange(loanRepaymentFromCardDataChange);
            });
            return loanRepaymentFromCardDataChange;
        }

        public static ActionResult SaveAndApproveVisaAliasOrder(VisaAliasOrder order)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.SaveAndApproveVisaAliasOrder(order);
            });
            return result;
        }

        public static VisaAliasOrder VisaAliasOrderDetails(long orderId)
        {
            VisaAliasOrder result = new VisaAliasOrder();

            XBService.Use(client =>
            {
                result = client.VisaAliasOrderDetails(orderId);
            });
            return result;
        }



        public static int GetBondOrderIssueSeria(int bondIssueId)
        {
            int issueSeria = 0;
            XBService.Use(client =>
            {
                issueSeria = client.GetBondOrderIssueSeria(bondIssueId);
            }
           );

            return issueSeria;

        }

        public static double GetUnitPrice(int bondIssueId)
        {
            double result = 0;
            XBService.Use(client =>
            {
                result = client.GetUnitPrice(bondIssueId);
            });

            return result;
        }

        public static List<Account> GetAccountsForStock()
        {
            List<Account> accounts = new List<Account>();

            XBService.Use(client =>
            {
                accounts = client.GetAccountsForStock();
            }
           );

            return accounts;
        }

        public static ActionResult ConfirmStockOrder(int bondId)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.ConfirmStockOrder(bondId);
            }
            );

            return result;
        }

        public static double GetBuyKursForDate(string currency)
        {
            double result = 0;
            XBService.Use(client =>
            {
                result = client.GetBuyKursForDate(currency);
            });

            return result;
        }

        public static CardHolderAndCardType GetCardTypeAndCardHolder(string cardNumber)
        {
            CardHolderAndCardType cardHolderAndCardType = new CardHolderAndCardType();

            XBService.Use(client =>
            {
                cardHolderAndCardType = client.GetCardTypeAndCardHolder(cardNumber);

            });

            return cardHolderAndCardType;
        }

        public static ActionResult SaveAndApproveCardlessCashoutCancellationOrder(CardlessCashoutCancellationOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveCardlessCashoutCancellationOrder(order);
            });
            return result;
        }

        public static CardlessCashoutOrder GetCardlessCashoutOrder(uint orderid)
        {
            CardlessCashoutOrder cardlessCashoutOrder = new CardlessCashoutOrder();

            XBService.Use(client =>
            {
                cardlessCashoutOrder = client.GetCardLessCashOutOrder(orderid);
            });
            return cardlessCashoutOrder;
        }

        public static string CheckCreditLineForRenewedCardAccountRegOrder(RenewedCardAccountRegOrder order)
        {
            string message = "";
            Use(client =>
            {
                message = client.CheckCreditLineForRenewedCardAccountRegOrder(order);
            });
            return message;
        }
        public static List<FrontOffice.XBS.KeyValuePairOfstringstring> GetLoanGrafikChangeDates(string productId)
        {
            List<FrontOffice.XBS.KeyValuePairOfstringstring> Dates = new List<FrontOffice.XBS.KeyValuePairOfstringstring>();
            XBService.Use(client =>
            {
                Dates = client.GetLoanGrafikChangeDates(productId);
            });

            return Dates;
        }

        public static List<LoanRepaymentGrafik> GetLoanGrafikBeforeChange(string productId, string changeDateStr)
        {
            List<LoanRepaymentGrafik> grafik = null;
            DateTime changeDate = new DateTime();
            if (changeDateStr != "" && changeDateStr != null)
            {
                changeDate = new DateTime(Convert.ToInt32(changeDateStr.Substring(13, 4)),
                                           Convert.ToInt32(changeDateStr.Substring(10, 2)),
                                           Convert.ToInt32(changeDateStr.Substring(7, 2)));
                XBService.Use(client =>
                {
                    grafik = client.GetLoanGrafikBeforeChange(productId, changeDate);
                });
            }
            if (grafik != null)
            {
                foreach (LoanRepaymentGrafik item in grafik)
                {
                    if (item.RescheduledAmount > 0)
                    {
                        if (item.FeeRepayment - item.RescheduledAmount > 0)
                            item.FeeRepayment = item.FeeRepayment - item.RescheduledAmount;
                    }
                }
            }
            return grafik;
        }

        public static List<string> CheckPlasticCardRemovalOrder(PlasticCardRemovalOrder order)
        {
            List<string> messages = new List<string>();
            Use(client =>
            {
                messages = client.CheckPlasticCardRemovalOrder(order);
            });
            return messages;
        }

        public static List<Borrower> GetLoanBorrowers(ulong productId)
        {
            var borrowers = new List<Borrower>();
            Use(client =>
            {
                borrowers = client.GetLoanBorrowers(productId);
            });
            return borrowers;
        }

        internal static ActionResult SaveTaxRefundAgreementDetails(ulong customerNumber, ulong productId, byte agreementExistence, int setNumber)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveTaxRefundAgreementDetails(customerNumber, productId, agreementExistence, setNumber);
            });
            return result;
        }

        internal static List<ChangeDetails> GetTaxRefundAgreementHistory(int agreementId)
        {
            var history = new List<ChangeDetails>();
            Use(client =>
            {
                history = client.GetTaxRefundAgreementHistory(agreementId);
            });
            return history;
        }

        public static List<SentSecuritiesTradingOrder> GetSentSecuritiesTradingOrders(SecuritiesTradingFilter filter)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string cacheKey = "Info_SecuritiesTradings" + customerNumber.ToString();
            string cacheKeyCount = "Info_SecuritiesCount" + customerNumber.ToString();

            Dictionary<int, List<SentSecuritiesTradingOrder>> searchResults = new Dictionary<int, List<SentSecuritiesTradingOrder>>();
            List<SentSecuritiesTradingOrder> securitiesTrading;
            int totalRowCount;

            if (!filter.FromCach)
            {
                XBService.Use(client =>
                {
                    searchResults = client.GetSentSecuritiesTradingOrders(filter);
                });

                securitiesTrading = searchResults.FirstOrDefault(x => x.Key >= 0).Value.ToList();
                totalRowCount = searchResults.First(x => x.Key >= 0).Key;
                CacheHelper.Add(securitiesTrading, cacheKey);
                CacheHelper.Add(totalRowCount, cacheKeyCount);
            }
            else
            {
                securitiesTrading = CacheHelper.Get<List<SentSecuritiesTradingOrder>>(cacheKey);

                switch (filter.Sort)
                {
                    case SortBy.NotDefined:
                        break;
                    case SortBy.AmountMinToMax:
                        securitiesTrading = securitiesTrading.OrderBy(a => a.Amount ).ToList();
                        break;
                    case SortBy.AmountMaxToMin:
                        securitiesTrading = securitiesTrading.OrderByDescending(a => a.Amount).ToList();
                        break;
                    case SortBy.DateMinToMax:
                        securitiesTrading = securitiesTrading.OrderBy(a => a.RegistrationDate).ToList();
                        break;
                    case SortBy.DateMaxToMin:
                        securitiesTrading = securitiesTrading.OrderByDescending(a => a.RegistrationDate).ToList();
                        break;
                    default:
                        break;
                }
            }


            return securitiesTrading;
        }

        public static string GetSecuritiesTradingLenght()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string cacheKeyCount = "Info_SecuritiesCount" + customerNumber.ToString();
            return CacheHelper.Get<int>(cacheKeyCount).ToString();
        }


        internal static ActionResult SaveAndApproveSecuritiesMarketTradingOrder(SecuritiesMarketTradingOrder order)
        {
            var result = new ActionResult();
            Use(client =>
            {
                result = client.SaveAndApproveSecuritiesMarketTradingOrder(order);
            });
            return result;
        }

        internal static SecuritiesTradingOrder GetSecuritiesTradingOrderById(long orderId)
        {
            var result = new SecuritiesTradingOrder();
            Use(client =>
            {
                result = client.GetSecuritiesTradingOrderById(orderId);
            });
            return result;
        }

        internal static List<SecuritiesMarketTradingOrder> GetSecuritiesMarketTradingOrder(long orderId)
        {
            var result = new List<SecuritiesMarketTradingOrder>();
            Use(client =>
            {
                result = client.GetSecuritiesMarketTradingOrder(orderId);
            });
            return result;
        }

        internal static SecuritiesTradingOrderCancellationOrder GetSecuritiesTradingOrderCancellationOrder(long id)
        {
            var result = new SecuritiesTradingOrderCancellationOrder();
            Use(client =>
            {
                result = client.GetSecuritiesTradingOrderCancellationOrder(id);
            });
            return result;
        }


        internal static ActionResult ConfirmSecuritiesTradingOrderCancellationOrder(SecuritiesTradingOrderCancellationOrder order)
        {
            var result = new ActionResult();
            Use(client =>
            {
                result = client.ConfirmSecuritiesTradingOrderCancellationOrder(order);
            });
            return result;
        }


        internal static ActionResult ConfirmSecuritiesTradingOrder(SecuritiesTradingOrder order)
        {
            var result = new ActionResult();
            Use(client =>
            {
                result = client.ConfirmSecuritiesTradingOrder(order);
            });
            return result;
        }

        internal static ActionResult RejectSecuritiesTradingOrderCancellationOrder(SecuritiesTradingOrderCancellationOrder order)
        {
            var result = new ActionResult();
            Use(client =>
            {
                result = client.RejectSecuritiesTradingOrderCancellationOrder(order);
            });
            return result;
        }


        internal static ActionResult RejectSecuritiesTradingOrder(SecuritiesTradingOrder order)
        {
            var result = new ActionResult();
            Use(client =>
            {
                result = client.RejectSecuritiesTradingOrder(order);
            });
            return result;
        }

        public static List<CustomerLeasingLoans> GetLeasings()
        {
            List<CustomerLeasingLoans> leasings = new List<CustomerLeasingLoans>();
            XBService.Use(client =>
            {
                leasings = client.GetLeasings();
            });           

            return leasings;
        }

        public static CustomerLeasingLoans GetLeasing(ulong productId)
        {
            CustomerLeasingLoans leasing = new CustomerLeasingLoans();
            XBService.Use(client =>
            {
                leasing = client.GetLeasing(productId);
            });

            return leasing;
        }

        public static List<LeasingLoanRepayments> GetLeasingGrafik(ulong productId, byte firstReschedule = 0)
        {            
            List<LeasingLoanRepayments> repayments = new List<LeasingLoanRepayments>();
            XBService.Use(client =>
            {
                repayments = client.GetLeasingRepayments(productId, firstReschedule);
            });

            return repayments;
        }

        public static List<LeasingOverdueDetail> GetLeasingOverdueDetails(ulong productId)
        {
            List<LeasingOverdueDetail> leasingOverdueDetails = new List<LeasingOverdueDetail>();
            XBService.Use(client =>
            {
                leasingOverdueDetails = client.GetLeasingOverdueDetails(productId);
            });

            return leasingOverdueDetails;
        }

        public static ulong GetManagerCustomerNumber(ulong customerNumber)
        {
            ulong managerCustomerNumber = 0;            
            XBService.Use(client =>
            {
                managerCustomerNumber = client.GetManagerCustomerNumber(customerNumber);
            });

            return managerCustomerNumber;
        }        

        public static ActionResult SaveAndEditLeasingCredential(LeasingCredential credential)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndEditLeasingCredential(credential);
            });

            return result;
        }

        public static List<LeasingCredential> GetLeasingCredentials(int customerNumber, ProductQualityFilter filter)
        {
            List<LeasingCredential> result = new List<LeasingCredential>();
            XBService.Use(client =>
            {
                result = client.GetLeasingCredentials(customerNumber, filter);
            });

            return result;
        }

        public static ActionResult SaveRemovedLeasingCredential(int credentialId)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveRemovedLeasingCredential(credentialId);
            });

            return result;
        }

        public static ActionResult SaveClosedLeasingCredential(LeasingCredential credential)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveClosedLeasingCredential(credential);
            });

            return result;
        }
        internal static ActionResult SaveAndApproveBrokerContractOrder(BrokerContractOrder order)
        {
            ActionResult result = new ActionResult();
            XBService.Use(client =>
            {
                result = client.SaveAndApproveBrokerContractOrder(order);
            });
            return result;
        }

        internal static BrokerContract GetBrokerContractProduct(ulong customerNumber)
        {
            BrokerContract brokerContract = new BrokerContract();
            Use(client =>
            {
                brokerContract = client.GetBrokerContractProduct(customerNumber);
            });
            return brokerContract;
        }
        public static void UpdateSecuritiesTradingOrderDeposited(ulong docId)
        {
            XBService.Use(client =>
            {
                client.UpdateSecuritiesTradingOrderDeposited(docId);
            });
        }

        public static ActionResult SaveAndApproveNewPosLocationOrder(XBS.NewPosLocationOrder newPosLocationOrder)
        {
            ActionResult result = new ActionResult();

            XBService.Use(client =>
            {
                result = client.SaveAndApproveNewPosLocationOrder(newPosLocationOrder);
            });
            return result;
        }

        public static XBS.NewPosLocationOrder NewPosApplicationOrderDetails(long orderId)
        {
            XBS.NewPosLocationOrder result = new XBS.NewPosLocationOrder();

            XBService.Use(client =>
            {
                result = client.NewPosApplicationOrderDetails(orderId);
            });
            return result;
        }

        public static List<string> GetPosTerminalActivitySphere()
        {
            List<string> ActivitySphere = new List<string>();

            XBService.Use(client =>
            {
                ActivitySphere = client.GetPosTerminalActivitySphere();
            });
            return ActivitySphere;
        }

    }
}
