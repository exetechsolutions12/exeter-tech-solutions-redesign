const form = document.querySelector('#support-enquiry');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');

    if (!button || !message) return;

    button.disabled = true;
    button.textContent = 'Sending…';
    message.className = 'form-message';
    message.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      let result = {};
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result.message = await response.text();
      }

      if (!response.ok) {
        const detail = Array.isArray(result.errors)
          ? result.errors.map(item => item.message).filter(Boolean).join(' ')
          : (result.error || result.message || '');

        throw new Error(detail || `The form service returned error ${response.status}.`);
      }

      form.reset();
      if (window.turnstile) window.turnstile.reset();

      message.className = 'form-message success';
      message.textContent = 'Thanks, your enquiry has been sent. I’ll get back to you as soon as I can.';
    } catch (error) {
      if (window.turnstile) window.turnstile.reset();

      message.className = 'form-message error';
      message.textContent = error.message
        ? `The enquiry could not be sent: ${error.message} Please try again, email info@exetertechsolutions.co.uk or text 07480 256100.`
        : 'Sorry, the form could not be sent. Please try again, email info@exetertechsolutions.co.uk or text 07480 256100.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send my enquiry';
    }
  });
}
