module.exports = function (id) {
  const nodes = document.querySelectorAll(id);
  return nodes.length > 1 ? nodes : nodes[0];
};
