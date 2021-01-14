let breakpoint = {};

window.onload = function() {
  breakpoint.refreshValue = function () {
    this.value = window.getComputedStyle(document.querySelector('body'),':before').getPropertyValue('content').replace(/\"/g, '');
  };

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      breakpoint.refreshValue();
    }
  });

  resizeObserver.observe(document.body);


  let burgerMenuButtonContainer = document.querySelector('#menu-csr');
  let modalContainer = document.createElement("div");
  let header = document.querySelector('.fusion-header-v1');
  const targetNode = document.querySelector('.fusion-header-wrapper');

  let standardLogo = document.querySelector('.fusion-standard-logo')
  let stickyLogo = document.querySelector('.fusion-sticky-logo')

  burgerMenuButtonContainer.style.display = "block";
  modalContainer.innerHTML = burgerMenuButtonContainer.innerHTML
  modalContainer.classList.add('menuModal');


  document.querySelector('.fusion-header-wrapper').appendChild(modalContainer)


  burgerMenuButtonContainer.innerHTML = `
		<div class="menu-btn">
			<div class="menu-btn before"></div>
			<div class="menu-btn after"></div>
		</div>`;

  let burgerMenuButton = document.querySelector('.menu-btn');
  burgerMenuButtonContainer.addEventListener("click", function() {
    hideOnClickOutside(document.querySelector('.fusion-header-wrapper'))
    modalContainer.classList.toggle('modalShow')
    header.classList.toggle('modalShow')
    document.querySelector('.fusion-header').classList.toggle('strictness')
    burgerMenuButton.classList.toggle('menu-btn-closed')

    if (!targetNode.classList.contains('fusion-is-sticky')) {
      targetNode.classList.toggle('fusion-is-sticky');
    }
  });

  /* close menu if clicked outside of menu */

  function hideOnClickOutside(element) {
    const outsideClickListener = event => {
      if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
        modalContainer.classList.toggle('modalShow')
        header.classList.toggle('modalShow')
        document.querySelector('.fusion-header').classList.toggle('strictness')
        burgerMenuButton.classList.toggle('menu-btn-closed')

        if (!targetNode.classList.contains('fusion-is-sticky')) {
          targetNode.classList.toggle('fusion-is-sticky');
        }
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      document.removeEventListener('click', outsideClickListener)
    }

    document.addEventListener('click', outsideClickListener)
  }

  const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )


  /* mutation observer */

  const config = { attributes: true};

  const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName != 'style') {
        console.log(mutation)
        burgerMenuButton.classList.toggle('menu-btn-green')
        if (burgerMenuButton.classList.contains('menu-btn-closed')) {
          stickyLogo.style.display = 'block';
          standardLogo.style.display = 'none';
        } else {
          stickyLogo.style.display = '';
          standardLogo.style.display = '';
        }

      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
};


