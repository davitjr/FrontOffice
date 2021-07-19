using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FrontOffice.Models
{
    public class TestLogin
    {
        [Required(ErrorMessage = "Մուտքագրեք անունը")]
        [RegularExpression(@"^[0-9a-zA-Z'!#$%&'*+/=?^_`{|}~.-]*$", ErrorMessage = "Անունը կարող է լինել միայն լատինատառ, թվեր և հատուկ նշաններ")]
        [StringLength(50, ErrorMessage = "Մուտքանունը պետք է լինի առնվազն {2} նիշ", MinimumLength = 4)]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Մուտքագրեք գաղտնաբառը")]
        [StringLength(50, ErrorMessage = "Գաղտնաբառը պետք է առնվազն {2} նիշ լինի", MinimumLength = 8)]
        [RegularExpression(@"^[0-9a-zA-Z'!#$%&'*+/=?^_`{|}~.-]*$", ErrorMessage = "Գաղտնաբառը կարող է լինել միայն լատինատառ, թվեր և հատուկ նշաններ")]
        [DataType(DataType.Password)]
        public string Password { get; set; }


    }
}