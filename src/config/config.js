const config = {
    rootLink: "http://localhost:57238/",
    //rootLink: "https://test.roughgroup.com",
    version: 1,
    shop: OTGetUrlParameter("shop"),
    admin: OTGetUrlParameter("admin"),
    hmac: window.location.href.split("&hmac=")[1],
    apiKey: 'd25dfc142a4000ef5a4598f5837d6012'
  };
  function OTGetUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }
  export default config;
  