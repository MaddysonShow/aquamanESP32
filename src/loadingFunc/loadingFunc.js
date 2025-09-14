function up(ev) {
    if (ev == null) {console.dir(ev)}
        if (ev.onclick != null) {
            return ev
        }
        else {
            return up(ev.parentNode)
        }
}

function loader(ev) {
    const parent = up(ev.target)
    parent.querySelector(".loaderr").style.display = "block"
    parent.querySelector("svg").style.display = 'none'
    parent.disabled = "disabled"
    return {parent}
}

function afterLoader(parent) {
    setTimeout(() => {
        const loader = parent.querySelector(".loaderr")
        loader.style.display = "none"
        parent.querySelector("svg").style.display = 'block'
        parent.disabled = false
    },1500)
}
 export {afterLoader, loader}