// API Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let selectedPlanType = 'daily';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    loadUserData();
    showPage('dashboard-page');
  }
});

// Page Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

function showDashboardSection(sectionId) {
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId + '-section').classList.add('active');

  document.querySelectorAll('.nav-items a').forEach(link => {
    link.classList.remove('active');
  });
  event.target.classList.add('active');

  // Load section data
  switch(sectionId) {
    case 'overview':
      loadOverviewData();
      break;
    case 'hives':
      loadMyHives();
      break;
    case 'transactions':
      loadTransactions();
      break;
    case 'leaderboard':
      loadLeaderboard();
      break;
    case 'profile':
      loadProfile();
      break;
  }
}

// Authentication
async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  };

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      authToken = result.token;
      localStorage.setItem('authToken', authToken);
      currentUser = result.user;
      showNotification('Login successful!', 'success');
      showPage('dashboard-page');
      loadUserData();
    } else {
      showNotification(result.message || 'Login failed', 'error');
    }
  } catch (error) {
    showNotification('Error connecting to server', 'error');
    console.error('Login error:', error);
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    country: formData.get('country'),
    password: formData.get('password'),
    referredBy: formData.get('referredBy')
  };

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      authToken = result.token;
      localStorage.setItem('authToken', authToken);
      currentUser = result.user;
      showNotification('Registration successful!', 'success');
      showPage('dashboard-page');
      loadUserData();
    } else {
      showNotification(result.message || 'Registration failed', 'error');
    }
  } catch (error) {
    showNotification('Error connecting to server', 'error');
    console.error('Registration error:', error);
  }
}

function handleLogout() {
  localStorage.removeItem('authToken');
  authToken = null;
  currentUser = null;
  showPage('landing-page');
  showNotification('Logged out successfully', 'success');
}

function toggleAuthForm() {
  document.getElementById('login-form').classList.toggle('active');
  document.getElementById('register-form').classList.toggle('active');
}

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Load User Data
async function loadUserData() {
  try {
    const user = await apiCall('/users/me');
    currentUser = user;
    
    document.getElementById('user-name').textContent = user.firstName;
    document.getElementById('referral-code').value = user.referralCode;
    
    loadOverviewData();
  } catch (error) {
    console.error('Error loading user data:', error);
    handleLogout();
  }
}

async function loadOverviewData() {
  try {
    const stats = await apiCall('/users/stats');
    
    document.getElementById('total-saved').textContent = `$${stats.totalSaved}`;
    document.getElementById('user-points').textContent = stats.points;
    document.getElementById('user-streak').textContent = `${stats.consistencyStreak} days`;
    document.getElementById('user-level').textContent = stats.level;

    loadBadges();
  } catch (error) {
    console.error('Error loading overview:', error);
  }
}

async function loadBadges() {
  try {
    const badges = await apiCall('/gamification/badges');
    const container = document.getElementById('badges-container');
    
    container.innerHTML = badges.map(badge => `
      <div class="badge ${badge.earned ? '' : 'locked'}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <p style="font-size: 0.8rem; color: var(--text-light);">${badge.description}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading badges:', error);
  }
}

// Hive Management
function selectPlan(type) {
  selectedPlanType = type;
  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.closest('.plan-btn').classList.add('active');
}

async function joinHive() {
  const contributionAmount = document.getElementById('contribution-amount').value;

  try {
    const result = await apiCall('/hives/join', 'POST', {
      type: selectedPlanType,
      contributionAmount: Number(contributionAmount),
      currency: 'USD'
    });

    showNotification('Successfully joined hive!', 'success');
    loadMyHives();
    showDashboardSection('hives');
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function loadMyHives() {
  try {
    const hives = await apiCall('/hives/my-hives');
    const container = document.getElementById('my-hives-container');

    if (hives.length === 0) {
      container.innerHTML = '<p>You haven\'t joined any hives yet. <a href="#" onclick="showDashboardSection(\'join\'); return false;">Join one now!</a></p>';
      return;
    }

    container.innerHTML = hives.map(hive => {
      const myMember = hive.members.find(m => m.user._id === currentUser.id);
      return `
        <div class="hive-card">
          <div class="hive-header">
            <div>
              <h3>${hive.name}</h3>
              <p>Status: ${hive.status.toUpperCase()}</p>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">
                $${hive.contributionAmount}
              </p>
              <p style="font-size: 0.9rem; color: var(--text-light);">${hive.type}</p>
            </div>
          </div>
          
          <div class="hive-members">
            ${hive.members.map(member => `
              <img src="${member.user.profilePicture}" 
                   alt="${member.user.firstName}" 
                   class="member-avatar"
                   title="${member.user.firstName} ${member.user.lastName}">
            `).join('')}
            ${Array(hive.maxMembers - hive.members.length).fill(0).map(() => `
              <div class="member-avatar" style="background: #ddd; display: flex; align-items: center; justify-content: center;">?</div>
            `).join('')}
          </div>

          <div style="margin-top: 1rem;">
            <p><strong>Your Position:</strong> #${myMember?.payoutOrder}</p>
            <p><strong>Total Contributed:</strong> $${myMember?.totalContributed || 0}</p>
            <p><strong>Pool Amount:</strong> $${hive.poolAmount}</p>
          </div>

          ${hive.status === 'active' ? `
            <button class="btn-primary" style="margin-top: 1rem;" onclick="makeContribution('${hive._id}', ${hive.contributionAmount})">
              Make Contribution ($${hive.contributionAmount})
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading hives:', error);
  }
}

async function makeContribution(hiveId, amount) {
  try {
    await apiCall('/transactions/contribute', 'POST', {
      hiveId,
      paymentMethod: 'card',
      paymentReference: `PAY-${Date.now()}`
    });

    showNotification(`Contribution of $${amount} successful!`, 'success');
    loadMyHives();
    loadOverviewData();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Transactions
async function loadTransactions() {
  try {
    const result = await apiCall('/transactions/my-transactions');
    const container = document.getElementById('transactions-container');

    if (result.transactions.length === 0) {
      container.innerHTML = '<p>No transactions yet.</p>';
      return;
    }

    container.innerHTML = result.transactions.map(txn => `
      <div class="transaction-item">
        <div>
          <h4>${txn.type.toUpperCase()}</h4>
          <p style="color: var(--text-light); font-size: 0.9rem;">${txn.description}</p>
          <p style="color: var(--text-light); font-size: 0.8rem;">${new Date(txn.createdAt).toLocaleDateString()}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 1.3rem; font-weight: 700; color: ${txn.type === 'payout' ? 'var(--success-color)' : 'var(--secondary-color)'};">
            ${txn.type === 'payout' ? '+' : '-'}$${txn.amount}
          </p>
          <p style="font-size: 0.8rem; color: var(--text-light);">${txn.status}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
}

// Leaderboard
async function loadLeaderboard() {
  try {
    const leaderboard = await apiCall('/users/leaderboard');
    const container = document.getElementById('leaderboard-container');

    container.innerHTML = leaderboard.map((user, index) => `
      <div class="leaderboard-item">
        <div class="rank">#${index + 1}</div>
        <img src="${user.profilePicture}" alt="${user.firstName}" class="leaderboard-avatar">
        <div style="flex: 1;">
          <h4>${user.firstName} ${user.lastName}</h4>
          <p style="font-size: 0.9rem; color: var(--text-light);">${user.country}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 1.2rem; font-weight: 700; color: var(--primary-color);">
            ${user.points} pts
          </p>
          <p style="font-size: 0.9rem; color: var(--text-light);">
            Level ${user.level} | ${user.badges.length} badges
          </p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading leaderboard:', error);
  }
}

// Profile
async function loadProfile() {
  if (!currentUser) return;

  try {
    const user = await apiCall('/users/me');
    
    document.getElementById('profile-picture').src = user.profilePicture;
    document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-country').textContent = user.country;
    document.getElementById('profile-phone').textContent = user.phone;
    document.getElementById('profile-verified').textContent = user.isVerified ? '✅ Verified' : '❌ Not Verified';
    document.getElementById('profile-joined').textContent = new Date(user.createdAt).toLocaleDateString();
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// Utility Functions
function copyReferralCode() {
  const input = document.getElementById('referral-code');
  input.select();
  document.execCommand('copy');
  showNotification('Referral code copied!', 'success');
}

function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
