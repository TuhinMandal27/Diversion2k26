/* ============================================
   RapidAid — auth.js
   Login, Signup & Session Management
   ============================================ */

/* ============================================
   UTILITIES
   ============================================ */

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

function showMsg(id, type) {
  document.querySelectorAll('.form-msg').forEach(m => m.style.display = 'none');
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('error', 'success');
    el.classList.add(type);
    el.style.display = 'flex';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }
}

/* ============================================
   PASSWORD STRENGTH METER
   ============================================ */

function checkStrength(value) {
  const bars  = ['bar1', 'bar2', 'bar3', 'bar4'];
  const label = document.getElementById('pwLabel');
  if (!label) return;

  bars.forEach(id => {
    const bar = document.getElementById(id);
    if (bar) { bar.className = 'pw-strength-bar'; }
  });

  let score = 0;
  if (value.length >= 8)   score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const cls = score <= 1 ? 'weak' : score <= 2 ? 'medium' : score <= 3 ? 'medium' : 'strong';
  const lblText = score <= 1 ? 'WEAK' : score <= 2 ? 'FAIR' : score <= 3 ? 'GOOD' : 'STRONG';
  label.textContent = lblText;

  for (let i = 0; i < score; i++) {
    const bar = document.getElementById(bars[i]);
    if (bar) bar.classList.add(cls);
  }
}

/* ============================================
   LOGIN FORM
   ============================================ */

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showMsg('loginError', 'error');
      return;
    }

    // Retrieve stored user from localStorage
    const stored = JSON.parse(localStorage.getItem('rapidaid_user') || 'null');

    if (stored && stored.email === email && stored.password === password) {
      // Store in session
      sessionStorage.setItem('rapidaid_user', JSON.stringify(stored));
      showMsg('loginSuccess', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    } else {
      // Demo fallback: allow any login with demo@rapidaid.com / demo1234
      if (email === 'demo@rapidaid.com' && password === 'demo1234') {
        const demoUser = {
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@rapidaid.com',
          password: 'demo1234',
          blood: 'B+',
          allergies: 'Aspirin',
          conditions: 'Hypertension',
          emergencyPhone: '+91 98765 00001'
        };
        sessionStorage.setItem('rapidaid_user', JSON.stringify(demoUser));
        showMsg('loginSuccess', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
      } else {
        showMsg('loginError', 'error');
      }
    }
  });
}

/* ============================================
   SIGNUP FORM
   ============================================ */

const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName      = document.getElementById('firstName').value.trim();
    const lastName       = document.getElementById('lastName').value.trim();
    const email          = document.getElementById('signupEmail').value.trim();
    const phone          = document.getElementById('signupPhone').value.trim();
    const password       = document.getElementById('signupPassword').value;
    const confirmPw      = document.getElementById('confirmPassword').value;
    const emergencyName  = document.getElementById('emergencyName').value.trim();
    const emergencyPhone = document.getElementById('emergencyPhone').value.trim();
    const agreeTerms     = document.getElementById('agreeTerms').checked;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !emergencyName || !emergencyPhone) {
      showMsg('signupError', 'error');
      return;
    }

    if (password !== confirmPw) {
      const err = document.getElementById('signupError');
      err.textContent = '⚠ Passwords do not match.';
      showMsg('signupError', 'error');
      return;
    }

    if (password.length < 8) {
      const err = document.getElementById('signupError');
      err.textContent = '⚠ Password must be at least 8 characters.';
      showMsg('signupError', 'error');
      return;
    }

    if (!agreeTerms) {
      const err = document.getElementById('signupError');
      err.textContent = '⚠ Please accept the Terms of Service.';
      showMsg('signupError', 'error');
      return;
    }

    // Get selected blood type
    const bloodInput = document.querySelector('input[name="blood"]:checked');
    const blood = bloodInput ? bloodInput.value : 'Unknown';

    const newUser = {
      firstName,
      lastName,
      email,
      phone,
      password,
      blood,
      allergies:      document.getElementById('allergies').value.trim() || 'None',
      conditions:     document.getElementById('conditions').value.trim() || 'None',
      dob:            document.getElementById('dob').value,
      gender:         document.getElementById('gender').value,
      emergencyName,
      emergencyPhone,
      createdAt:      new Date().toISOString()
    };

    // Save to localStorage & session
    localStorage.setItem('rapidaid_user', JSON.stringify(newUser));
    sessionStorage.setItem('rapidaid_user', JSON.stringify(newUser));

    showMsg('signupSuccess', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1400);
  });
}

/* ============================================
   NAVBAR USER DISPLAY (for auth pages nav if present)
   ============================================ */

window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(sessionStorage.getItem('rapidaid_user') || 'null');
  const navUser = document.getElementById('navUser');
  if (navUser && user) {
    navUser.textContent = (user.firstName || 'USER').toUpperCase();
  }
});