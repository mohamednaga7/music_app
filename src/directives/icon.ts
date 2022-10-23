export const Icon = {
  beforeMount: (el: HTMLElement, binding: any) => {
    let iconClass = `fa fa-${binding.value} text-green-400 text-xl`;
    if (binding.arg && binding.arg === 'full') {
      iconClass = binding.value;
    }

    if (binding.modifiers) {
      iconClass += ' float-right';
    }

    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400';
    } else {
      iconClass += ' text-green-400';
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
  mounted: () => {},
  beforeUpdate: () => {},
  updated: () => {},
  beforeUnmount: () => {},
  unmounted: () => {},
};
