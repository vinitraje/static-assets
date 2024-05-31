// Select all submit buttons once
const submitButtons = document.querySelectorAll(buttonSelectors.join(', '));

// Function to enable/disable submit buttons based on Turnstile token presence
function updateButtonsState() {
  submitButtons.forEach(submitButton => {
    const form = submitButton.closest('form');
    const token = form.querySelector('[name="cf-turnstile-response"]');
    submitButton.disabled = !token || !token.value; // Enable/disable based on token presence
  });
}

// Callback function triggered when Turnstile validation succeeds
function callback() {
  updateButtonsState();
}

// Expired and error callback function triggered when Turnstile token expires or fails validation
function expiredOrErrorCallback() {
  updateButtonsState();
}

// Append disabled attribute to the submit buttons on page load and fallback render for turnstile widget
window.addEventListener('DOMContentLoaded', () => {
  submitButtons.forEach(submitButton => {
    submitButton.disabled = true; // Disable all submit buttons on page load
  });

  // Retrieve all Turnstile widget elements
  const turnstileWidgets = document.querySelectorAll('.cf-turnstile');

  // Function to render the Turnstile widget
  function renderTurnstileWidget(widget, siteKey) {
    turnstile.render(widget, {
      sitekey: siteKey,
      theme: 'auto',
      callback: callback,
      expiredCallback: expiredOrErrorCallback,
      errorCallback: expiredOrErrorCallback,
      beforeInteractiveCallback: expiredOrErrorCallback,
    });
  }

  // Function to check and render the Turnstile widget
  function checkAndRenderWidget(widget, retries = 0) {
    try {
      if (!widget || widget.innerHTML.length > 1) return;

      const siteKey = widget.dataset.sitekey;
      if (siteKey) {
        renderTurnstileWidget(widget, siteKey);
      } else if (retries < 5) {
        setTimeout(() => checkAndRenderWidget(widget, retries + 1), 100);
      }
    } catch (error) {
      console.error('Error rendering Turnstile widget:', error);
    }
  }

  // Iterate through each Turnstile widget and check/render the widget
  turnstileWidgets.forEach(checkAndRenderWidget);
});