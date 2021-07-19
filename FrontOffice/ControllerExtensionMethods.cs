using System.Web.Mvc;

namespace FrontOffice
{
    public static class ControllerExtensionMethods
    {
        public static string GetGuid(this Controller controller)
        {
            return controller.RouteData.Values["guid"].ToString();
        }

        public static void SetGuidSession(this Controller controller, string name, object value)
        {
            controller.Session[controller.GetGuid() + "_" + name] = value;
        }

        public static object GetGuidSession(this Controller controller, string name)
        {
            return controller.Session[controller.GetGuid() + "_" + name];
        }
    }
}