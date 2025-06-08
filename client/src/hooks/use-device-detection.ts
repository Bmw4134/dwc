import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  touchSupport: boolean;
  operatingSystem: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Unknown';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Unknown';
  isLandscape: boolean;
  prefersDarkMode: boolean;
  hasHover: boolean;
  connectionType: 'wifi' | '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
}

export function useDeviceDetection(): DeviceInfo {
  // Simplified implementation to prevent React hook errors
  return getInitialDeviceInfo();

  function getInitialDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080,
        devicePixelRatio: 1,
        touchSupport: false,
        operatingSystem: 'Unknown',
        browser: 'Unknown',
        isLandscape: true,
        prefersDarkMode: false,
        hasHover: true,
        connectionType: 'unknown'
      };
    }

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Enhanced device detection
    const userAgent = navigator.userAgent.toLowerCase();
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Mobile detection (enhanced)
    const isMobile = touchSupport && (
      screenWidth <= 768 ||
      /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    );
    
    // Tablet detection
    const isTablet = touchSupport && !isMobile && (
      screenWidth <= 1024 ||
      /ipad|tablet|kindle|playbook|silk/i.test(userAgent)
    );
    
    const isDesktop = !isMobile && !isTablet;
    
    // Operating system detection
    let operatingSystem: DeviceInfo['operatingSystem'] = 'Unknown';
    if (/iphone|ipad|ipod/i.test(userAgent)) operatingSystem = 'iOS';
    else if (/android/i.test(userAgent)) operatingSystem = 'Android';
    else if (/windows/i.test(userAgent)) operatingSystem = 'Windows';
    else if (/mac/i.test(userAgent)) operatingSystem = 'macOS';
    else if (/linux/i.test(userAgent)) operatingSystem = 'Linux';
    
    // Browser detection
    let browser: DeviceInfo['browser'] = 'Unknown';
    if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) browser = 'Chrome';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/edge/i.test(userAgent)) browser = 'Edge';
    
    // Orientation and preferences
    const isLandscape = screenWidth > screenHeight;
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    // Connection type detection
    let connectionType: DeviceInfo['connectionType'] = 'unknown';
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection?.effectiveType) {
        connectionType = connection.effectiveType;
      }
    }

    return {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth,
      screenHeight,
      devicePixelRatio,
      touchSupport,
      operatingSystem,
      browser,
      isLandscape,
      prefersDarkMode,
      hasHover,
      connectionType
    };
  }

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(getInitialDeviceInfo());
    };

    // Listen for orientation changes
    window.addEventListener('orientationchange', updateDeviceInfo);
    window.addEventListener('resize', updateDeviceInfo);
    
    // Listen for color scheme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', updateDeviceInfo);
    
    // Listen for hover capability changes
    const hoverQuery = window.matchMedia('(hover: hover)');
    hoverQuery.addEventListener('change', updateDeviceInfo);

    return () => {
      window.removeEventListener('orientationchange', updateDeviceInfo);
      window.removeEventListener('resize', updateDeviceInfo);
      darkModeQuery.removeEventListener('change', updateDeviceInfo);
      hoverQuery.removeEventListener('change', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

export function useResponsiveBreakpoints() {
  const deviceInfo = useDeviceDetection();
  
  return {
    xs: deviceInfo.screenWidth < 480,
    sm: deviceInfo.screenWidth >= 480 && deviceInfo.screenWidth < 768,
    md: deviceInfo.screenWidth >= 768 && deviceInfo.screenWidth < 1024,
    lg: deviceInfo.screenWidth >= 1024 && deviceInfo.screenWidth < 1280,
    xl: deviceInfo.screenWidth >= 1280 && deviceInfo.screenWidth < 1536,
    '2xl': deviceInfo.screenWidth >= 1536,
    isMobile: deviceInfo.isMobile,
    isTablet: deviceInfo.isTablet,
    isDesktop: deviceInfo.isDesktop,
    touchDevice: deviceInfo.touchSupport,
    hasHover: deviceInfo.hasHover
  };
}

export function getOptimalLayout(deviceInfo: DeviceInfo) {
  // Enterprise-grade layout optimization
  if (deviceInfo.isMobile) {
    return {
      navigation: 'overlay',
      sidebar: 'hidden',
      gridColumns: 1,
      cardSize: 'full',
      fontSize: 'base',
      spacing: 'compact',
      touchTargetSize: 'large'
    };
  }
  
  if (deviceInfo.isTablet) {
    return {
      navigation: deviceInfo.isLandscape ? 'sidebar' : 'overlay',
      sidebar: deviceInfo.isLandscape ? 'collapsed' : 'hidden',
      gridColumns: deviceInfo.isLandscape ? 2 : 1,
      cardSize: 'medium',
      fontSize: 'base',
      spacing: 'normal',
      touchTargetSize: 'medium'
    };
  }
  
  // Desktop
  return {
    navigation: 'sidebar',
    sidebar: 'expanded',
    gridColumns: 3,
    cardSize: 'small',
    fontSize: 'sm',
    spacing: 'normal',
    touchTargetSize: 'small'
  };
}