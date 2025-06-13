/**
 * Global AI Assistants Initialization
 * Provides fallback initialization for AI assistants across all pages
 */

// Global AI Assistants state
window.aiAssistantsState = {
    initialized: false,
    modules: {
        pitch: false,
        copy: false,
        research: false,
        voice: false,
        watson: false
    }
};

// Global function to initialize AI assistants
window.initializeAIAssistants = function() {
    console.log('[AI] Initializing AI Assistants...');
    
    // Check if already initialized
    if (window.aiAssistantsState.initialized) {
        console.log('[AI] AI Assistants already initialized');
        return;
    }
    
    try {
        // Initialize basic AI modules
        initializeBasicAI();
        
        // Mark as initialized
        window.aiAssistantsState.initialized = true;
        console.log('[AI] AI Assistants initialized successfully');
        
    } catch (error) {
        console.warn('[AI] AI Assistants initialization failed:', error.message);
        // Continue execution without breaking the app
    }
};

function initializeBasicAI() {
    // Basic AI initialization without API dependencies
    console.log('[AI] Loading basic AI modules...');
    
    // Initialize voice commands if available
    if (typeof window.speechSynthesis !== 'undefined') {
        window.aiAssistantsState.modules.voice = true;
        console.log('[AI] Voice synthesis ready');
    }
    
    // Initialize Watson placeholder
    window.aiAssistantsState.modules.watson = true;
    console.log('[AI] Watson AI module ready');
    
    // Initialize other basic modules
    window.aiAssistantsState.modules.pitch = true;
    window.aiAssistantsState.modules.copy = true;
    window.aiAssistantsState.modules.research = true;
    
    console.log('[AI] Basic AI modules loaded');
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts load first
    setTimeout(() => {
        if (!window.aiAssistantsState.initialized) {
            window.initializeAIAssistants();
        }
    }, 100);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeAIAssistants: window.initializeAIAssistants };
}