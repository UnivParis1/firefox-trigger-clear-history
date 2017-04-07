function extrapolateUrlFromCookie(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
        prefix += "www";

    return prefix + cookie.domain + cookie.path;
}
function removeCookie(cookie) {
    browser.cookies.remove({ url: extrapolateUrlFromCookie(cookie), name: cookie.name })
}

function removeCookies() {
  browser.cookies.getAll({}).then((cookies) => {
     for (cookie of cookies) removeCookie(cookie);
  });
}

browser.cookies.onChanged.addListener(function(changeInfo) {
    if (changeInfo.cookie && changeInfo.cookie.name === "forceBrowserExit") {
        browser.history.deleteAll();
        removeCookies();
    }
});
