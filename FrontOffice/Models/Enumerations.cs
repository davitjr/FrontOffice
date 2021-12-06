using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.Models
{
    /// <summary>
    /// Հասանելիությունների տեսակներ
    /// </summary>
    public enum ActionType : short
    {
        Undefined = 0,
        /// <summary>
        /// Փոխանցումներ բանկի ներսում(1,1) հայտի պահպանում
        /// </summary>
        AcbaTransferOrderSave = 59,
        /// <summary>
        /// Փոխանցում ՀՀ տարածքում անկանխիկ(1,2) հայտի պահպանում
        /// </summary>
        RACashlessTransferOrderSave = 60,
        /// <summary>
        /// Սեփական հաշիվների միջև փոխանցման(1,3) hայտի պահպանում
        /// </summary>
        PersonalTransferOrderSave = 61,
        /// <summary>
        /// Բանկի ներսում փոխանցման (կանխիկ մուտք)(51,1) հայտի պահպանում
        /// </summary>
        AcbaCashInTransferOrderSave = 104,
        /// <summary>
        /// Բանկի ներսում փոխանցման (կանխիկ ելք)(52,1) հայտի պահպանում
        /// </summary>
        AcbaCashOutTransferOrderSave = 105,
        /// <summary>
        /// ՀՀ տարածքում փոխանցման (կանխիկ)(56,2) հայտի պահպանում 
        /// </summary>
        RACashTransferOrderSave = 116,
        /// <summary>
        /// Փոխանցում բյուջե անկանխիկ (1,5)
        /// </summary>
        BudgetCashlessTransferOrderSave = 63,
        /// <summary>
        /// Փոխանցում բյուջե կանխիկ (56,5)
        /// </summary>
        BudgetCashTransferOrderSave = 117,
        /// <summary>
        /// Փոխանցում սեփական հաշիվների միջև բաժնի բացում
        /// </summary>
        BudgetTransferOrderOpen = 142,
        /// <summary>
        /// Փոխանցում սեփական հաշիվների միջև բաժնի բացում
        /// </summary>
        PersonalPaymentOrderOpen = 141,
        /// <summary>
        /// Պարբերական ՀՀ տարածքում փոխանցման ձևակերպման հայտի պահպանում
        /// </summary>
        PeriodicRATransferOrderSave = 78,
        /// <summary>
        /// Պարբերական կոմունալ փոխանցման  ձևակերպման հայտի պահպանում
        /// </summary>
        PeriodicUtilityOrderSave = 79,
        /// <summary>
        /// Պարբերական Ձեր հաշիվների միջև փոխանցման ձևակերպման հայտի պահպանում
        /// </summary>
        PeriodicPersonalTransferOrderSave = 80,
        /// <summary>
        /// Պարբերական բյուջե փոխանցման ձևակերպման հայտի պահպանում
        /// </summary>
        PeriodicBudgetTransferOrderSave = 81,
        /// <summary>
        /// Կոմունալ վճարման հայտի պահպանում
        /// </summary>
        UtilityPaymentOrderSave = 86,
        /// <summary>
        /// Ընթացիկ հաշվի փակման  հայտի պահպանում
        /// </summary>
        CurrentAccountCloseOrderSave = 101,
        /// <summary>
        /// Հաշվի տվյալների խմբագրման հայտի ձևակերպման հայտի պահպանում
        /// </summary>
        RequestForAccountDataChangeOrderSave = 103,
        /// <summary>
        /// Հաշվի սառեցման հայտի ձևակերպան հայտի պահպանում
        /// </summary>
        RequestForAccountFreezeOrderSave = 128,
        /// <summary>
        /// Հաշվի ապասառեցման հայտի ձևակերպման հայտի պահպանում
        /// </summary>
        RequestForAccountUnfreezeOrderSave = 129,
        /// <summary>
        /// Հօգուտ երրորդ անձի ընթացիկ հաշվի բացման հայտի պահպանում (17,1)
        /// </summary>
        CurrentAccountInFavorOfAThirdPartyOrderSave = 100,
        /// <summary>
        /// Համատեղ ընթացիկ հաշվի բացման  հայտի պահպանում (28,1)
        /// </summary>
        JointCurrentFormulationOrderSave = 88,
        /// <summary>
        /// Ընթացիկ հաշվի վերաբացման հայտի պահպանում (12,1)
        /// </summary>
        CurrentAccountReopenOrderSave = 83,
        /// <summary>
        /// Քարտի դրական տոկոսագումարի վճարման հայտի պահպանում (70,1)
        /// </summary>
        CardPositiveInterestRepaymentOrderSave = 132,
        /// <summary>
        /// Առևտրային վարկային գծի/օվերդրաֆտի տրամադրման hայտի պահպանում	 
        /// </summary>
        CurrentAccountCreditLineOrOverdraftOrderSave = 62,
        /// <summary>
        /// Ճանապարհային Ոստիկանություն փոխանցման (անկանխիկ) hայտի պահպանում	
        /// </summary>
        RoadPoliceOrderSave = 64,
        /// <summary>
        /// Արտարժույթի վաճառք(Սեփական հաշիվների միջև) հայտի պահպանում	
        /// </summary>
        ExchangeSellPersonalAccountOrderSave = 65,
        /// <summary>
        /// Արտարժույթի  առք(Սեփական հաշիվների միջև) hայտի պահպանում	
        /// </summary>
        ExchangeBuyPersonalAccountOrderSave = 66,
        /// <summary>
        /// Արտարժույթի առք ու վաճառք(Սեփական հաշիվների միջև) hայտի պահպանում
        /// </summary>
        ExchangeCrossPersonalAccountOrderSave = 67,
        /// <summary>
        /// Միջազգային փոխանցման hայտի պահպանում	
        /// </summary>
        InternationalTransferOrderSave = 68,
        /// <summary>
        /// Ավանդի դադարեցման hայտի պահպանում
        /// </summary>
        DepositTerminationOrderSave = 69,
        /// <summary>
        /// Վարկի տոկոսի մարման hայտի պահպանում	
        /// </summary>
        LoanRateRepaymentOrderSave = 70,
        /// <summary>
        /// Վարկի մասնակի մարման hայտի պահպանում	(5,2)
        /// </summary>
        LoanPartialRepaymentOrderSave = 71,
        /// <summary>
        /// Վարկի լրիվ մարման hայտի պահպանում	(5,4)
        /// </summary>
        LoanFullRepaymentOrderSave = 72,
        /// <summary>
        /// Ռեեստրով փոխանցման hայտի պահպանում (միևնույն նկարագրությունով)		(6,1)
        /// </summary>
        RosterTransferSameDescription = 73,
        /// <summary>
        /// Ռեեստրով փոխանցման hայտի պահպանում (տարբեր նկարագրություններով)	(6,2)
        /// </summary>
        RosterTransferDifferentDescription = 74,
        /// <summary>
        /// Ընթացիկ հաշվի բացման հայտի պահպանում	
        /// </summary>
        CurrentAccountFormulationOrderSave = 75,
        /// <summary>
        /// Առևտրային վարկային գծի/օվերդրաֆտի մարման հայտի պահպանում
        /// </summary>
        CurrentAccountCreditLineOrOverdraftRepaymentOrderSave = 76,
        /// <summary>
        /// Ավանդի ձևակերպման հայտի պահպանում
        /// </summary>
        DepositFormulationOrderSave = 77,
        /// <summary>
        /// Պարբերական փոխանցման դադարեցման հայտի պահպանում	
        /// </summary>
        PeriodicTransferSuspensionOrderSave = 82,
        /// <summary>
        /// Ավանդի գրավով վարկի ձևակերպման հայտի պահպանում	(13,1)
        /// </summary>
        CreditFormulationSecuredWithDepositOrderSave = 84,
        /// <summary>
        /// Ավանդի գրավով վարկային գծի ձևակերպման հայտի պահպանում	 (14,1)
        /// </summary>
        CreditLineFormulationSecuredWithDepositOrderSave = 85,
        /// <summary>
        /// Ավանդի փոխարկմ հայտի պահպանում	(16,1)
        /// </summary>
        DepositAmountExchangeOrderSave = 87,
        /// <summary>
        ///  Գործարքից հրաժարման հայտի պահպանում(18,1)
        /// </summary>
        TransactionRemovalOrderSave = 89,
        /// <summary>
        /// Գործարքի հեռացման հայտի պահպանում	(19,1)
        /// </summary>
        TransactionCancelationOrderSave = 90,
        /// <summary>
        /// Տեղեկանքի ստացման հայտի պահպանում	(20,1)
        /// </summary>
        RequestForReferenceOrderSave = 91,
        /// <summary>
        ///  Քարտային վարկային գծի դադարեցման հայտի պահպանում (21,1)
        /// </summary>
        CardCreditLineTerminationOrderSave = 92,
        /// <summary>
        /// Չեկային գրքույկի պատվիրման հայտի ձևակերպման հայտի պահպանում (22, 1)
        /// </summary>
        RequestForChequebookOrderSave = 93,
        /// <summary>
        /// Գումարի կանխիկ ստացման հայտի ձևակերպման  հայտի պահպանում (23, 1)
        /// </summary>
        RequestForAmountCashDisbursementOrderSave = 94,
        /// <summary>
        /// Գումարի անկանխիկ փոխանցման հայտի ձևակերպման հայտի պահպանում (23,2)
        /// </summary>
        RequestForAmountNoncashTransferOrderSave = 95,
        /// <summary>
        /// Քաղվածքների էլեկտրոնային ստացման հայտի ձևակերպման հայտի պահպանում ( 24,1)
        /// </summary>
        ElectronicRequestOnProvisionOfStatements = 96,
        /// <summary>
        /// Քարտի վերաթողարկման հայտի պահպանում (25, 1)
        /// </summary>
        CardReReleaseOrderSave = 97,
        /// <summary>
        /// SWIFT հաղորդագրության պատճենի ստացման հայտի ձևակերպման հայտի պահպանում		(26,1)
        /// </summary>
        RequestOnReceiptOfSWIFTMessageCopyOrderSave = 98,
        /// <summary>
        /// Տվյալների խմբագրման հայտի ձևակերպման հայտի պահպանում	(27,1)
        /// </summary>
        RequestForDataEditionOrderSave = 99,
        /// <summary>
        /// Քարտի փակման հայտի պահպանում		(30,1)
        /// </summary>
        CardClosingOrderSave = 102,
        /// <summary>
        /// Արտարժույթի (Կանխիկ)վաճառքի հայտի պահպանում (53,1)
        /// </summary>
        ExchangeSellCashOrderSave = 106,
        /// <summary>
        /// Արտարժույթի (Կանխիկ)առքի հայտի պահպանում (53,2)
        /// </summary>
        ExchangeBuyCashOrderSave = 107,
        /// <summary>
        /// Արտարժույթի (Կանխիկ)առք ու վաճառք հայտի պահպանում	(53,3)
        /// </summary>
        ExchangeCrossCashOrderSave = 108,
        /// <summary>
        /// Արտարժույթի (Կանխիկ մուտք հաշվին)վաճառքի հայտի պահպանում	(54, 1)
        /// </summary>
        ExchangeSellCashInOrderSave = 109,
        /// <summary>
        /// Արտարժույթի  (Կանխիկ մուտք հաշվին)առքի հայտի պահպանում	(54, 2)
        /// </summary>
        ExchangeBuyCashInOrderSave = 110,
        /// <summary>
        /// Արտարժույթի (Կանխիկ մուտք հաշվին)առք ու վաճառքի հայտի պահպանում (54,3)
        /// </summary>
        ExchangeCrossCashInOrderSave = 111,
        /// <summary>
        /// Արտարժույթի (Կանխիկ ելք հաշվից)վաճառքի հայտի պահպանում	(55, 1)
        /// </summary>
        ExchangeSellCashOutOrderSave = 112,
        /// <summary>
        /// Արտարժույթի  (Կանխիկ ելք հաշվից)առքի հայտի պահպանում	(55, 2)
        /// </summary>
        ExchangeBuyCashOutOrderSave = 113,
        /// <summary>
        /// Արտարժույթի (Կանխիկ ելք հաշվից)առք ու վաճառքի հայտի պահպանում	(55, 3)
        /// </summary>
        ExchangeCrossCashOutOrderSave = 114,
        /// <summary>
        /// Ճանապարհային Ոստիկանություն փոխանցման (կանխիկ ) հայտի պահպանում	(56, 1)
        /// </summary>
        RoadPoliceCashOrderSave = 115,
        /// <summary>
        /// Հաշիվների սպասարկման վարձի գծով պարտավորության մարման հայտի պահպանում	(58, 1)
        /// </summary>
        RepaymentOfAccountServiceFeeDebtOrderSave = 118,
        /// <summary>
        /// HB սպասարկման վարձի գծով պարտավորության մարման հայտի պահպանում	(59	1)
        /// </summary>
        RepaymentOfHBServiceFeeOrderSave = 119,
        /// <summary>
        /// Կանխիկ կոմունալ վճարման հայտի պահպանում (60,1)
        /// </summary>
        UtilityCashPaymentOrderSave = 120,
        /// <summary>
        /// խնդրահարույց վարկերի տարանցիկ հաշվից հաշիվների սպասարկման պարտքի մարման հայտի պահպանում (61,1)
        /// </summary>
        ProblemLoanAccountServiceFeeRepaymentFromTransitAccountOrderSave = 121,
        /// <summary>
        /// խնդրահարույց վարկերի տարանցիկ հաշվից HB սպասարկման պարտքի մարման  հայտի պահպանում	(62, 1)
        /// </summary>
        ProblemLoanHBServiceFeeRepaymentFromTransitAccountOrderSave = 121,
        /// <summary>
        /// Տարանցիկ հաշվին փոխանցման հայտի պահպանում	 (63,1)
        /// </summary>
        TransferToTransitAccountOrderSave = 123,
        /// <summary>
        /// Տարանցիկ հաշվից միջազգային փոխանցման հայտի պահպանում	(64,1)
        /// </summary>
        InternationalTransferFromTransitAccountOrderSave = 124,
        /// <summary>
        /// Արտարժույթի (Բանկի ներսում)վաճառքի հայտի պահպանում (65,1)
        /// </summary>
	    ExchangeSellInsideAcbaOrderSave = 125,
        /// <summary>
        /// Արտարժույթի  (Բանկի ներսում)առքի հայտի պահպանում (65, 2)
        /// </summary>
	    ExchangeBuyInsideAcbaOrderSave = 126,
        /// <summary>
        /// Արտարժույթի (Բանկի ներսում)առք ու վաճառքի հայտի պահպանում	(65, 3)
        /// </summary>
        ExchangeCrossInsideAcbaOrderSave = 127,
        /// <summary>
        /// POS տերմինալով կանխիկացում հայտի պահպանում	(68, 1)
        /// </summary>
        CashOutByPOSOrderSave = 130,
        /// <summary>
        /// ՀԲ ծառայության ակտիվացման հայտի պահպանում		(69, 1)
        /// </summary>
        HBServiceAtivationOrderSave = 131,
        /// <summary>
        /// Հաճախորդին տրամադրվող ծառայությունների միջնորդավճարի գանձման հայտի պահպանում (71, 1)
        /// </summary>
        FeeForServiceProvidedToCustomersOrderSave = 133,
        /// <summary>
        /// Հաճախորդին տրամադրվող ծառայությունների միջնորդավճարի կանխիկ գանձման հայտի պահպանում	(72, 1)
        /// </summary>
        CashFeeForServiceProvidedToCustomersOrderSave = 134,
        /// <summary>
        /// Վարկի ակտիվացմամ հայտի պահպանում	(73, 1)
        /// </summary>
        LoanActivationOrderSave = 135,
        /// <summary>
        /// Վարկային գծի ակտիվացման հայտի պահպանում	(74, 1)
        /// </summary>
        CreditLineActivationOrderSave = 136,
        /// <summary>
        /// Չեկային գրքույկի ստացման հայտի ձակերպման հայտի պահպանում (75,	1)
        /// </summary>
        RequestForChequebookReceiveOrderSave = 137,
        /// <summary>
        /// Փոխանցում արագ համակարգերով հայտի պահպանում	 (76, 1)
        /// </summary>
        FastTransferOrderSave = 138,
        /// <summary>
        /// Լիազորագրի մուտքագրման հայտի ձևակերպան հայտի պահպանում  (77, 1)
        /// </summary>
        RequestForCredentialFormulationOrderSave = 139,
        /// <summary>
        /// Քարտային վարկային գծի մարման հայտի պահպանում		(78, 2)
        /// </summary>
        CardCreditLineRepaymentOrderSave = 140,
        /// <summary>
        /// Արտարժույթի (î³ñ³ÝóÇÏ Ñ³ßíÇó Ï³ÝËÇÏ »Éù)վաճառքի հայտի պահպանում	(81, 1)
        /// </summary>
        ExchangeSellTransitCashOutOrderSave = 145,
        /// <summary>
        /// Արտարժույթի  (î³ñ³ÝóÇÏ Ñ³ßíÇó Ï³ÝËÇÏ »Éù)առքի հայտի պահպանում	(81, 2)
        /// </summary>
        ExchangeBuyTransitCashOutOrderSave = 146,
        /// <summary>
        /// Արտարժույթի (î³ñ³ÝóÇÏ Ñ³ßíÇó Ï³ÝËÇÏ »Éù) առք ու վաճառքի հայտի պահպանում (81,3)
        /// </summary>
        ExchangeCrossTransitCashOutOrderSave = 147,
        /// <summary>
        /// Արտարժույթի (î³ñ³ÝóÇÏ Ñ³ßíÇó ³ÝÏ³ÝËÇÏ »Éù)վաճառքի հայտի պահպանում	(82, 1)
        /// </summary>
        ExchangeSellTransitNonCashOutOrderSave = 148,
        /// <summary>
        /// Արտարժույթի  (î³ñ³ÝóÇÏ Ñ³ßíÇó ³ÝÏ³ÝËÇÏ »Éù)առքի հայտի պահպանում	(82, 2)
        /// </summary>
        ExchangeBuyTransitNonCashOutOrderSave = 149,
        /// <summary>
        /// Արտարժույթի (î³ñ³ÝóÇÏ Ñ³ßíÇó ³ÝÏ³ÝËÇÏ »Éù) առք ու վաճառքի հայտի պահպանում (82,3)
        /// </summary>
        ExchangeCrossTransitNonCashOutOrderSave = 150,
        /// <summary>
        /// Տարանցիկ հաշվին մուտք փոխարկումով(առք)
        /// </summary>
        TransitCurrencyOrder_CellOrderSave = 151,
        /// <summary>
        /// Տարանցիկ հաշվին մուտք փոխարկումով(վաճառք)
        /// </summary>
        TransitCurrencyOrder_BuyOrderSave = 152,
        /// <summary>
        /// Տարանցիկ հաշվին մուտք փոխարկումով(քրոսս)
        /// </summary>
        TransitCurrencyOrder_CrossConvertationOrderSave = 153,

        /// <summary>
        /// Քարտի սպասարկման միջնորդավճարի գանձում
        /// </summary>
        CardServiceFeePaymentOrderSave = 154,

        /// <summary>
        /// Տարանցիկ հաշվից կանխիկ ելք
        /// </summary>
        TransitCashOutOrderSave = 155,

        /// <summary>
        /// Տարանցիկ անհաշվից կանխիկ ելք
        /// </summary>
        TransitNonCashOutOrderSave = 156,
        /// <summary>
        /// Միջմասնաճյուղային կանխիկ փոխանցում
        /// </summary>
        InterBankTransferNonCashOrderSave = 158,

        /// <summary>
        /// Միջմասնաճյուղային կանխիկ փոխանցում
        /// </summary>
        InterBankTransferCashOrderSave = 157,

        /// <summary>
        /// Ռեեստրով փոխանցում
        /// </summary>
        ReestrTransferOrderSave = 159,
        /// <summary>
        /// Հեռախոսազանգով փոխանցման համաձայնագրի հայտ
        /// </summary>
        TransferCallContractOrderSave = 160,

        /// <summary>
        /// Հեռախոսազանգով փոխանցման համաձայնագրի դադարեցման հայտ
        /// </summary>
        TransferCallContractTerminationOrderSave = 161,

        /// <summary>
        /// Կենաթոշակ ստանալու դիմում
        /// </summary>
        PensionApplicationOrderSave = 162,

        /// <summary>
        /// Կենաթոշակ ստանալու դիմումի ակտիվացում
        /// </summary>
        PensionApplicationActivationOrderSave = 163,

        /// <summary>
        /// Կենաթոշակ ստանալու դիմումի հեռացում
        /// </summary>
        PensionApplicationActivationRemovalOrderSave = 164,

        /// <summary>
        /// Կենաթոշակ ստանալու դադարեցման հայտ
        /// </summary>
        PensionApplicationTerminationOrderSave = 165,

        /// <summary>
        /// Կենաթոշակ ստանալու վերագրանցման հայտ
        /// </summary>
        PensionApplicationOverwriteOrderSave = 166,

        /// <summary>
        /// Կենաթոշակ ստանալու վերագրանցման հայտ
        /// </summary>
        FastTransferFromCustomerAccountOrderSave = 167,

        /// <summary>
        /// Երաշխիքի ակտիվացման հայտի պահպանում
        /// </summary>
        GuaranteeActivationOrderSave = 168,

        /// <summary>
        /// Ակրեդիտիվի ակտիվացման հայտի պահպանում
        /// </summary>
        AccreditiveActivationOrderSave = 169,

        /// <summary>
        /// Ֆակտորինգի ակտիվացման հայտի պահպանում
        /// </summary>
        FactoringActivationtOrderSave = 170,

        /// <summary>
        /// Փոխանցման ձևակերպում
        /// </summary>
        AllowTransferConfirm = 171,

        TransferToShopOrderSave = 173,

        /// <summary>
        /// Հաշվի լրացուցիչ տվյալների հեռացման հայտ պահպանում
        /// </summary>
        AccountAdditionalDataRemovableOrderSave = 180,

        /// <summary>
        /// Քարտի գրանցում
        /// </summary>
        CardRegistrationSave = 178,

        /// <summary>
        /// Քարտի վերաթողարկում
        /// </summary>
        CardReNewSave = 186,

        /// <summary>
        /// Քարտի փոխարինում
        /// </summary>
        CardRePlaceSave = 187,

        /// <summary>
        /// Քարտի կարգավիճակի փոփոխման հայտի պահպանում
        /// </summary>
        CardStatusChangeOrderSave = 190,
        /// <summary>
        /// Քարտի սպասարկման վարձի գրաֆիկի հեռացման հայտի պահպանում
        /// </summary>
        CardServiceFeeGrafikRemovableOrderSave = 191,
        /// <summary>
        /// Քարտի տվյալների փոփոխման հայտի պահպանում
        /// </summary>
        CardDataChangeOrderSave = 192,
        /// <summary>
        /// Քարտի սպասարկման միջնորդավճարի գանձում խնդրահարույց վարկերի տարանցիկ հաշվից 
        /// </summary>
        CardServiceFeePaymentFromProblematicLoanTransitAccountOrderSave = 179,
        /// <summary>
        ///  Ավանդային տվյալների փոփոխման հայտի պահպանում
        /// </summary>
        DepositDataChangeOrderSave = 193,
        /// <summary>
        /// Տոկենի PIN  կոդի ցուցադրում
        /// </summary>
        HBTokenPINCodeShow = 195,
        /// <summary>
        /// Հեռահար բանկինգ պայմանագրի մուտքագրում
        /// </summary>
        HBApplicationOrderSave = 194,
        /// <summary>
        /// Վարկային դիմումի հեռացում 
        /// </summary>
        DeleteLoanApplication = 200,
        /// <summary>
        /// Վարկային դիմումի հրաժարում 
        /// </summary>
        CancelLoanApplication = 199,
        /// <summary>
        /// Վարկային դիմումի հաստատում 
        /// </summary>
        LoanApplicationConfirmation = 198,
        /// <summary>
        /// Վարկային դիմումի վերլուծություն 
        /// </summary>
        LoanApplicationAnalysis = 197,
        /// <summary>
        /// Արագ օվերդրաֆտի դիմում 
        /// </summary>
        FastOverdraftApplication = 196,

        /// <summary>
        /// Պահատուփի տուժանքի դադարեցման հայտ
        /// </summary>
        DepositCasePenaltyCancelingOrder = 201,

        /// <summary>
        /// Ցպահանջ ավանդի տոկոսադրույքի փոփոխման հայտի պահպանում
        /// </summary>
        DemandDepositRateChangeOrderSave = 202,

        /// <summary>
        /// Լիազորագրի ատիվացման հայտի պահպանում
        /// </summary>
        CredentialActivationOrderSave = 203,

        /// <summary>
        /// Լիազորագրի ատիվացման կանխիկ հայտի պահպանում
        /// </summary>
        CredentialActivationCashOrderSave = 204,

        /// <summary>
        /// Պարտատոմսի մուտքագրման հայտի պահպանում
        /// </summary>
        BondOrderSave = 213,

        /// <summary>
        /// Պարտատոմսի հեռացման հայտի պահպանում
        /// </summary>
        BondDeleteOrderSave = 214,

        /// <summary>
        /// Պարտատոմսի հաստատման հայտի պահպանում
        /// </summary>
        BondApproveOrderSave = 215,

        /// <summary>
        /// Պարտատոմսի մերժման հայտի պահպանում
        /// </summary>
        BondRejectOrderSave = 216,

        /// <summary>
        /// Արժեթղթերի հաշվի բացման հայտի պահպանում
        /// </summary>
        DepositaryAccountOrderSave = 217,

        /// <summary>
        /// Պարտատտոմսի ձեռքբերման համար գումարի գանձման հայտի պահպանում
        /// </summary>
        BondAmountChargeOrderSave = 218,

        /// <summary>
        /// Դասակարգված վարկի հետբերման հայտի պահպանում,կատարում
        /// </summary>
        ClassifiedLoanProductClassificationRemoveOrder = 206,

        /// <summary>
        /// Դասակարգված վարկի դուրսգրման հայտի պահպանում,կատարում
        /// </summary>
        ClassifiedLoanProductMakeOutOrder = 207,

        /// <summary>
        /// Քարտի USSD ծառայության գրանցման հայտի պահպանում
        /// </summary>
        CardUSSDServiceOrderSave = 208,

        /// <summary>
        /// Վարկի  վաղաժամկետ մարման վճարի հայտ
        /// </summary>
        LoanProductDataChangeOrderSave = 219,

        /// <summary>
        /// սեփական միջոցների տոկոսների փոփոխման հայտ (ֆոնդեր)
        /// </summary>
        ChangeFTPRateOrder = 205,
        /// <summary>
        /// Հաճախորդի պրոդուկտների դիտարկում
        /// </summary>
        CustomerAllProductsOpen = 220,
        /// <summary>
        /// Հաճախորդի քարտային քաղվածքի դիտարկում 
        /// </summary>
        CardStatementOpen = 221,
        /// <summary>
        /// Հաճախորդի քարտային քաղվածքի տպում
        /// </summary>
        CardStatementPrint = 222,
        /// <summary>
        /// Հաճախորդի հաշվի քաղվածքի դիտարկում
        /// </summary>
        AccountStatementOpen = 223,
        /// <summary>
        /// Հաճախորդի հաշվի քաղվածքի տպում
        /// </summary>
        AccountStatementPrint = 224,
        /// <summary>
        /// Քարտի բլոկավորման/ապաբլոկավորման հայտի պահպանում
        /// </summary>
        ArcaCardsTransactionOrderSave = 225,
        /// <summary>
        /// Քարտի բլոկավորման/ապաբլոկավորման հայտերի հաշվետվության հասանելիություն
        /// </summary>
        ArcaCardsTransactionOrdersReport = 226,
        /// <summary>
        /// Քարտի սահմանաչափերի փոփոխման հայտի պահպանում
        /// </summary>
        CardLimitChangeOrderSave = 227,
        /// <summary>
        /// Քարտերի պատվիրման հայտերի հաշվետվության դիտարկման հասանելիություն
        /// </summary>
        PlasticCardOrdersReport = 242,
		/// <summary>
		/// Թոքենի կարգավիճակի փոփոխության հայտի պահպանում
		/// </summary>
		VirtualCardStatusChangeOrder = 241,
        /// <summary>
        /// Քարտի SMS ծառայության ակտիվացում, փոփոխում կամ դադարեցում
        /// </summary>
        PlasticCardSMSServiceOrderController = 243,
        /// <summary>
        /// Քարտի վերաբացում
        /// </summary>
        CardReOpenOrderController = 244
    }

    public enum SearchForSecuritiesTypes : short
    {
        GetAll = 0,
        GetOnlyOne = 1
    }
    public enum SecurityAccountUpdateTypes : short
    {
        UpdateAccountAllData = 0,
        UpdateBankAccount = 1
    }


    public enum BankAccountUpdateTypes : short
    {
        AddNew = 1,
        UpdateExisting = 2
    }
}
