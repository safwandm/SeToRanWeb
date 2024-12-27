// import ke page yang perlu redirect ke layout
if (document.layout == undefined) {
    let reg = /\/([^\/]*?)\.html/
    let title = window.location.href.match(reg)[1]
    console.log(title)
    const urlParams = new URLSearchParams(window.location.search);
    window.location.href = `layout.html?page=${title}&${urlParams.toString()}`;
}