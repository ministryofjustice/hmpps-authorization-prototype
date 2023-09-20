//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

function showDiv(divId, element, val) {
    console.log(divId, element, val)
    document.getElementById(divId).style.display = element.value === val ? 'block' : 'none';
}

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
    const select = document.getElementById("access-token-validity")
    const customInputId = "custom-access-token-validity-element"
    select.onchange = () =>showDiv(customInputId, select, "custom")
    showDiv(customInputId, select, "custom")
})
