// DWC Systems LLC QNIS/PTNI Intelligence Platform
// Direct JavaScript implementation to ensure immediate functionality

document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  
  if (!root) return;
  
  // Clear loading screen
  root.innerHTML = '';
  
  // Create the landing page with login functionality
  const app = document.createElement('div');
  app.className = 'min-h-screen';
  app.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)';
  
  app.innerHTML = `
    <div class="relative z-10 bg-black bg-opacity-20 backdrop-blur-xl border-b border-white border-opacity-10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(45deg, #10b981, #06b6d4);">
              <span class="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">DWC Systems LLC</h1>
              <p class="text-emerald-400 text-sm font-medium">QNIS/PTNI Intelligence Platform</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="px-3 py-1 rounded-full" style="background: rgba(16, 185, 129, 0.2);">
              <span class="text-emerald-400 text-sm font-medium">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div>
            <h2 class="text-5xl font-bold text-white mb-4">Enterprise Intelligence Platform</h2>
            <p class="text-xl text-cyan-400 mb-8">Advanced AI-powered business analytics with quantum-level automation for institutional-grade decision making.</p>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white bg-opacity-5 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-10">
              <div class="w-8 h-8 text-emerald-400 mb-3">📈</div>
              <h3 class="text-white font-semibold mb-2">24 Active Leads</h3>
              <p class="text-gray-300 text-sm">Real-time pipeline management</p>
            </div>
            <div class="bg-white bg-opacity-5 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-10">
              <div class="w-8 h-8 text-cyan-400 mb-3">💰</div>
              <h3 class="text-white font-semibold mb-2">$485K Pipeline</h3>
              <p class="text-gray-300 text-sm">Verified business value</p>
            </div>
            <div class="bg-white bg-opacity-5 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-10">
              <div class="w-8 h-8 text-purple-400 mb-3">🛡️</div>
              <h3 class="text-white font-semibold mb-2">98.2% Uptime</h3>
              <p class="text-gray-300 text-sm">Enterprise reliability</p>
            </div>
            <div class="bg-white bg-opacity-5 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-10">
              <div class="w-8 h-8 text-orange-400 mb-3">🤖</div>
              <h3 class="text-white font-semibold mb-2">18 AI Modules</h3>
              <p class="text-gray-300 text-sm">Autonomous intelligence</p>
            </div>
          </div>
        </div>

        <div class="lg:max-w-md lg:mx-auto w-full">
          <div class="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-lg">
            <div class="text-center p-6 border-b border-white border-opacity-10">
              <h3 class="text-2xl text-white font-bold">Access Platform</h3>
              <p class="text-gray-300 mt-2">Secure login to DWC Systems intelligence dashboard</p>
            </div>
            <div class="p-6 space-y-6">
              <form id="loginForm" class="space-y-4">
                <div class="space-y-2">
                  <label class="text-white block">Username</label>
                  <input
                    id="username"
                    type="text"
                    class="w-full p-3 rounded bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-white block">Password</label>
                  <input
                    id="password"
                    type="password"
                    class="w-full p-3 rounded bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-400"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  class="w-full p-3 rounded font-medium text-white"
                  style="background: linear-gradient(45deg, #10b981, #06b6d4);"
                >
                  🔒 Access Platform
                </button>
              </form>

              <div class="space-y-3">
                <div class="text-center">
                  <p class="text-sm text-gray-400 mb-3">Quick Access Options</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <button onclick="quickLogin('watson', 'dwc2025')" class="p-2 rounded text-xs bg-white bg-opacity-5 border border-white border-opacity-20 text-white hover:bg-opacity-10">Master Admin</button>
                  <button onclick="quickLogin('dion', 'nexus2025')" class="p-2 rounded text-xs bg-white bg-opacity-5 border border-white border-opacity-20 text-white hover:bg-opacity-10">Level 15</button>
                  <button onclick="quickLogin('admin', 'qnis2025')" class="p-2 rounded text-xs bg-white bg-opacity-5 border border-white border-opacity-20 text-white hover:bg-opacity-10">Administrator</button>
                  <button onclick="quickLogin('intelligence', 'ptni2025')" class="p-2 rounded text-xs bg-white bg-opacity-5 border border-white border-opacity-20 text-white hover:bg-opacity-10">Intelligence</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  root.appendChild(app);
  
  // Login functionality
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch('/api/auth/quantum-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        showSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          if (username === 'watson' || username === 'dion') {
            window.location.href = '/admin';
          } else if (username === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        showError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      showError('Connection error. Please check your network.');
    }
  });
  
  console.log('DWC Systems LLC QNIS/PTNI Platform loaded successfully');
});

// Quick login helper
function quickLogin(username, password) {
  document.getElementById('username').value = username;
  document.getElementById('password').value = password;
}

// Toast notifications
function showSuccess(message) {
  showToast(message, 'success');
}

function showError(message) {
  showToast(message, 'error');
}

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 p-4 rounded-lg text-white z-50';
  toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}