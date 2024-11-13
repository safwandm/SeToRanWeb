function checkRedirect() {

    if (document.layout == undefined) {
        let reg = /\/(.*?)\.html/
        let title = window.location.href.match(reg)[1]

        const otherParams = urlParams.toString();
        window.location.href = `layout.html?page=${title}${otherParams ? '&' + otherParams : ''}`;
    }
}