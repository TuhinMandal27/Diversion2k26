
// function hideAllMessages() {
//   document.querySelectorAll('.form-msg').forEach(m => {
//     m.style.display = 'none';
//     m.textContent = '';
//   });
// }

// function showMessage(id, msg) {
//   hideAllMessages();
//   const el = document.getElementById(id);
//   if (!el) return;
//   el.textContent = msg;
//   el.style.display = 'flex';
// }

// /* ---------- LOGIN ---------- */
// const loginForm = document.getElementById('loginForm');

// if (loginForm) {
//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     hideAllMessages();

//     const email = loginForm.loginEmail.value.trim();
//     const password = loginForm.loginPassword.value;

//     if (!email || !password) {
//       showMessage('loginError', '⚠ Please fill all fields.');
//       return;
//     }

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();

//       if (!data.success) {
//         showMessage('loginError', '⚠ Invalid credentials.');
//         return;
//       }

//       showMessage('loginSuccess', '✓ Login successful! Redirecting...');
//       setTimeout(() => {
//         window.location.href = "index.html";
//       }, 1200);

//     } catch (err) {
//       showMessage('loginError', '⚠ Server error.');
//     }
//   });
// }

// /* ---------- SIGNUP ---------- */
// const signupForm = document.getElementById('signupForm');

// if (signupForm) {
//   signupForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     hideAllMessages();

//     const payload = {
//       name: signupForm.firstName.value.trim(),
//       email: signupForm.signupEmail.value.trim(),
//       password: signupForm.signupPassword.value
//     };

//     if (!payload.name || !payload.email || !payload.password) {
//       showMessage('signupError', '⚠ Please fill all fields.');
//       return;
//     }

//     try {
//       const res = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (!data.success) {
//         showMessage('signupError', '⚠ Account already exists.');
//         return;
//       }

//       showMessage('signupSuccess', '✓ Account created! Redirecting...');
//       setTimeout(() => {
//         window.location.href = "login.html";
//       }, 1200);

//     } catch (err) {
//       showMessage('signupError', '⚠ Server error.');
//     }
//   });
// }



/* ==============================
   AUTH MODULE – FINAL VERSION
   ============================== */

function hideAllMessages() {
  document.querySelectorAll('.form-msg').forEach(m => {
    m.style.display = 'none';
    m.textContent = '';
  });
}

function showMessage(id, msg) {
  hideAllMessages();
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'flex';
}

/* ==============================
   LOGIN
   ============================== */

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAllMessages();

    const email = loginForm.loginEmail.value.trim();
    const password = loginForm.loginPassword.value;

    if (!email || !password) {
      showMessage('loginError', '⚠ Please fill all fields.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!data.success) {
        showMessage('loginError', '⚠ Invalid credentials.');
        return;
      }

      /* 🔥 STORE USER SESSION */
      localStorage.setItem('user', JSON.stringify({
        name: data.user?.name || email.split('@')[0],
        email: data.user?.email || email
      }));

      /* Optional: store token if backend sends */
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      showMessage('loginSuccess', '✓ Login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    } catch (err) {
      showMessage('loginError', '⚠ Server error.');
    }
  });
}

/* ==============================
   SIGNUP
   ============================== */

const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAllMessages();

    const payload = {
      name: signupForm.firstName.value.trim(),
      email: signupForm.signupEmail.value.trim(),
      password: signupForm.signupPassword.value
    };

    if (!payload.name || !payload.email || !payload.password) {
      showMessage('signupError', '⚠ Please fill all fields.');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!data.success) {
        showMessage('signupError', '⚠ Account already exists.');
        return;
      }

      showMessage('signupSuccess', '✓ Account created! Redirecting...');

      /* 🔥 OPTIONAL: Auto login after signup */
      localStorage.setItem('user', JSON.stringify({
        name: payload.name,
        email: payload.email
      }));

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    } catch (err) {
      showMessage('signupError', '⚠ Server error.');
    }
  });
}