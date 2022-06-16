// Tippy tooltip js library
tippy(`.div-template`, {
  content(reference) {
    const id = reference.getAttribute("data-template");
    const template = document.getElementById(`template-${id}`);
    return template.innerHTML;
  },
  allowHTML: true,
  interactive: true,
  followCursor: true,
  placement: "right-end",
  arrow: true,
});
