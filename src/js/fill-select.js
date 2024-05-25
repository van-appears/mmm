module.exports = function (selectEl, currentVal, items, includeEmpty) {
  selectEl.replaceChildren();

  if (includeEmpty) {
    const unselected = document.createElement("option");
    unselected.setAttribute("value", "");
    unselected.text = "-";
    if (currentVal === null || currentVal === undefined || currentVal === "") {
      unselected.setAttribute("selected", true);
    }
    selectEl.appendChild(unselected);
  }

  for (let index = 0; index < items.length; index++) {
    const { value, label } = items[index];
    const option = document.createElement("option");
    option.setAttribute("value", value);
    option.text = label;
    if (String(currentVal) === String(value)) {
      option.setAttribute("selected", true);
    }
    selectEl.appendChild(option);
  }
};
