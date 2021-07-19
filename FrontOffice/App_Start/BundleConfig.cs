using System.Web.Optimization;
using System.Web.Configuration;

namespace FrontOffice
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));


            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-messages.js",
                        "~/Scripts/angular-ui/ui-bootstrap.js",
                        "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                         "~/Scripts/angular-confirm.js",
                         "~/Scripts/ui-select/ngSanitize.js",
                         "~/Scripts/ui-select/select.js",
                         "~/Scripts/scrolling-tabs/jquery.scrolltabs.js",
                         "~/Scripts/scrolling-tabs/jquery.mousewheel.js",
                        "~/Scripts/angular-ui-tree-master/dist/angular-ui-tree.js",
                         "~/Scripts/ui-select/angular-filter.js",
                         "~/Scripts/angular-img-cropper.min.js",
                         "~/Scripts/jquery.zoom/jquery.zoom.js",
                         "~/Scripts/ui-grid.min.js"
                        ));


            bundles.Add(new ScriptBundle("~/bundles/grid").Include(
                        "~/Scripts/angularGrid-latest.js"
                        ));
            

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));


            const string ANGULAR_APP_ROOT = "~/Content/Angular/";
            const string VIRTUAL_BUNDLE_PATH = ANGULAR_APP_ROOT + "mainangular";

            bool isTestVersion = bool.Parse(WebConfigurationManager.AppSettings["TestVersion"].ToString());
            string javaScriptConfig = isTestVersion ? "~/Scripts/config/debug-config.js" : "~/Scripts/config/release-config.js";

            var scriptBundle = new ScriptBundle(VIRTUAL_BUNDLE_PATH)
                    .Include(ANGULAR_APP_ROOT + "Module/Module.js")
                    .Include(ANGULAR_APP_ROOT + "Service/LoginService.js")
                    .Include(ANGULAR_APP_ROOT + "Controllers/LoginCtrl.js")
                    .Include(javaScriptConfig)
                    .IncludeDirectory(ANGULAR_APP_ROOT, "*.js", searchSubdirectories: true);

            bundles.Add(scriptBundle);

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/ui-bootstrap-csp.css",
                        "~/Content/style.css",
                       "~/Content/media.css",
                        "~/Scripts/ui-select/css/select.css",
                        "~/Scripts/ui-select/css/selectize.default.css",
                         "~/Scripts/scrolling-tabs/scrolltabs.css",
                         "~/Scripts/angular-ui-tree-master/dist/angular-ui-tree.css",
                         "~/Content/ui-grid.min.css",
                         "~/Content/style.css"
                      ));


            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
              "~/Content/themes/base/core.css",
              "~/Content/themes/base/resizable.css",
              "~/Content/themes/base/selectable.css",
              "~/Content/themes/base/accordion.css",
              "~/Content/themes/base/autocomplete.css",
              "~/Content/themes/base/button.css",
              "~/Content/themes/base/dialog.css",
              "~/Content/themes/base/slider.css",
              "~/Content/themes/base/tabs.css",
              "~/Content/themes/base/datepicker.css",
              "~/Content/themes/base/progressbar.css",
              "~/Content/themes/base/theme.css"));



        }
    }
}
