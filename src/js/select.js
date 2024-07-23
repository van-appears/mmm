module.exports = function (id) {
  function addFunctions(element) {
    const baseClass = element.className || "";
    element.addClass = function (className) {
      this.className = `${baseClass} ${className || ""}`;
    };
    element.show = function (bool) {
      if (bool) {
        this.removeAttribute("data-hide");
      } else {
        this.setAttribute("data-hide", "true");
      }
    };

    if (element.tagName === "BUTTON") {
      element.selected = function () {
        this.setAttribute("data-selected", "true");
      };
      element.unselect = function () {
        this.removeAttribute("data-selected");
      };
    } else if (element.tagName === "INPUT" && element.type === "checkbox") {
      element.checked = false;
    } else if (element.tagName === "SELECT") {
      element.value = null;
    }

    return element;
  }

  function addFunctionsAll(elements) {
    const allElements = Array.from(elements);
    return allElements.map(addFunctions);
  }

  const nodes = document.querySelectorAll(id);
  return nodes.length > 1 ? addFunctionsAll(nodes) : addFunctions(nodes[0]);
};
