/**
 * Mobile-Specific Export Adapter
 * Auto-switch mode for SUNO iPhone limits with format cleaning and warnings
 */

export interface MobileConstraints {
  maxCharacters: number;
  maxLines: number;
  excludedStyles: string[];
  supportedFormats: string[];
  warningThresholds: {
    characters: number;
    lines: number;
  };
}

export interface MobileExportResult {
  success: boolean;
  formattedContent: string;
  warnings: string[];
  characterCount: number;
  lineCount: number;
  truncatedSections: string[];
  optimizations: string[];
}

export interface DeviceProfile {
  deviceType: 'iphone' | 'android' | 'tablet' | 'desktop';
  constraints: MobileConstraints;
  formatPreferences: string[];
}

export class MobileExportAdapter {
  private deviceProfiles: Map<string, DeviceProfile> = new Map();
  private formatCleaners: Map<string, (content: string) => string> = new Map();

  constructor() {
    this.initializeDeviceProfiles();
    this.initializeFormatCleaners();
  }

  private initializeDeviceProfiles() {
    // SUNO iPhone specific constraints
    this.deviceProfiles.set('suno-iphone', {
      deviceType: 'iphone',
      constraints: {
        maxCharacters: 3000,
        maxLines: 50,
        excludedStyles: [
          'experimental-glitch',
          'hardcore-industrial',
          'avant-garde-noise',
          'complex-polyrhythmic'
        ],
        supportedFormats: ['verse-chorus', 'simple-structure'],
        warningThresholds: {
          characters: 2700,
          lines: 45
        }
      },
      formatPreferences: ['pop-structure', 'radio-friendly', 'clean-vocal']
    });

    // Android SUNO constraints
    this.deviceProfiles.set('suno-android', {
      deviceType: 'android',
      constraints: {
        maxCharacters: 4000,
        maxLines: 60,
        excludedStyles: ['experimental-glitch'],
        supportedFormats: ['verse-chorus', 'bridge-structure', 'extended'],
        warningThresholds: {
          characters: 3500,
          lines: 55
        }
      },
      formatPreferences: ['standard-structure', 'vocal-clarity']
    });

    // Desktop/Web constraints (more permissive)
    this.deviceProfiles.set('suno-desktop', {
      deviceType: 'desktop',
      constraints: {
        maxCharacters: 8000,
        maxLines: 120,
        excludedStyles: [],
        supportedFormats: ['all'],
        warningThresholds: {
          characters: 7000,
          lines: 100
        }
      },
      formatPreferences: ['full-structure', 'complex-arrangements']
    });
  }

  private initializeFormatCleaners() {
    // iPhone-specific cleaning
    this.formatCleaners.set('iphone', (content: string) => {
      return content
        // Remove excessive whitespace
        .replace(/\n{3,}/g, '\n\n')
        // Clean up spacing around section markers
        .replace(/\[\s*([^\]]+)\s*\]/g, '[$1]')
        // Minimize repeated characters
        .replace(/([a-zA-Z])\1{3,}/g, '$1$1$1')
        // Remove trailing spaces
        .replace(/[ \t]+$/gm, '')
        // Ensure single space after punctuation
        .replace(/[.!?]+\s+/g, '. ')
        // Remove redundant line breaks in verses
        .replace(/(\[Verse[^\]]*\])\n+/g, '$1\n');
    });

    // Android cleaning (less aggressive)
    this.formatCleaners.set('android', (content: string) => {
      return content
        .replace(/\n{4,}/g, '\n\n\n')
        .replace(/\[\s*([^\]]+)\s*\]/g, '[$1]')
        .replace(/[ \t]+$/gm, '');
    });

    // Desktop cleaning (minimal)
    this.formatCleaners.set('desktop', (content: string) => {
      return content.replace(/[ \t]+$/gm, '');
    });
  }

  adaptForMobile(
    content: string,
    targetDevice: string = 'suno-iphone',
    preserveStructure: boolean = true
  ): MobileExportResult {
    const profile = this.deviceProfiles.get(targetDevice);
    if (!profile) {
      throw new Error(`Unknown device profile: ${targetDevice}`);
    }

    const warnings: string[] = [];
    const optimizations: string[] = [];
    const truncatedSections: string[] = [];

    // Initial content analysis
    const initialCharCount = content.length;
    const initialLineCount = content.split('\n').length;

    // Apply device-specific cleaning
    const cleaner = this.formatCleaners.get(profile.deviceType);
    let cleanedContent = cleaner ? cleaner(content) : content;

    // Check initial constraints
    if (initialCharCount > profile.constraints.warningThresholds.characters) {
      warnings.push(`Content approaching character limit (${initialCharCount}/${profile.constraints.maxCharacters})`);
    }

    if (initialLineCount > profile.constraints.warningThresholds.lines) {
      warnings.push(`Content approaching line limit (${initialLineCount}/${profile.constraints.maxLines})`);
    }

    // Apply mobile-specific optimizations
    if (profile.deviceType === 'iphone') {
      const optimized = this.optimizeForIPhone(cleanedContent, profile.constraints, preserveStructure);
      cleanedContent = optimized.content;
      optimizations.push(...optimized.optimizations);
      truncatedSections.push(...optimized.truncatedSections);
    }

    // Final character and line count check
    const finalCharCount = cleanedContent.length;
    const finalLineCount = cleanedContent.split('\n').length;

    // Enforce hard limits
    if (finalCharCount > profile.constraints.maxCharacters) {
      const truncated = this.truncateToLimit(cleanedContent, profile.constraints.maxCharacters, preserveStructure);
      cleanedContent = truncated.content;
      truncatedSections.push(...truncated.removedSections);
      warnings.push(`Content truncated to ${profile.constraints.maxCharacters} characters`);
    }

    if (finalLineCount > profile.constraints.maxLines) {
      const truncated = this.truncateLinesToLimit(cleanedContent, profile.constraints.maxLines, preserveStructure);
      cleanedContent = truncated.content;
      truncatedSections.push(...truncated.removedSections);
      warnings.push(`Content truncated to ${profile.constraints.maxLines} lines`);
    }

    // Validate excluded styles
    const styleWarnings = this.checkExcludedStyles(cleanedContent, profile.constraints.excludedStyles);
    warnings.push(...styleWarnings);

    return {
      success: warnings.length === 0 || !warnings.some(w => w.includes('excluded')),
      formattedContent: cleanedContent,
      warnings,
      characterCount: cleanedContent.length,
      lineCount: cleanedContent.split('\n').length,
      truncatedSections,
      optimizations
    };
  }

  private optimizeForIPhone(
    content: string,
    constraints: MobileConstraints,
    preserveStructure: boolean
  ): {
    content: string;
    optimizations: string[];
    truncatedSections: string[];
  } {
    const optimizations: string[] = [];
    const truncatedSections: string[] = [];
    let optimizedContent = content;

    // 1. Compress section headers
    optimizedContent = optimizedContent.replace(/\[Verse \d+\]/g, '[V]');
    optimizedContent = optimizedContent.replace(/\[Chorus\]/g, '[C]');
    optimizedContent = optimizedContent.replace(/\[Bridge\]/g, '[B]');
    optimizedContent = optimizedContent.replace(/\[Outro\]/g, '[O]');
    optimizations.push('Compressed section headers for mobile');

    // 2. Remove excessive repetition in choruses
    const chorusMatches = optimizedContent.match(/\[C\]([\s\S]*?)(?=\[|$)/g);
    if (chorusMatches && chorusMatches.length > 2) {
      // Keep only first two choruses if identical
      const firstChorus = chorusMatches[0];
      const identicalChoruses = chorusMatches.filter(c => c === firstChorus);
      
      if (identicalChoruses.length > 2) {
        optimizedContent = optimizedContent.replace(
          new RegExp(this.escapeRegex(firstChorus), 'g'),
          (match, offset, string) => {
            const beforeMatch = string.substring(0, offset);
            const chorusCount = (beforeMatch.match(/\[C\]/g) || []).length;
            return chorusCount < 2 ? match : '';
          }
        );
        optimizations.push('Removed duplicate choruses');
        truncatedSections.push('Duplicate chorus sections');
      }
    }

    // 3. Minimize bridge sections if too long
    const bridgeMatch = optimizedContent.match(/\[B\]([\s\S]*?)(?=\[|$)/);
    if (bridgeMatch && bridgeMatch[1].length > 200) {
      const shortenedBridge = bridgeMatch[1].substring(0, 150) + '...';
      optimizedContent = optimizedContent.replace(bridgeMatch[0], '[B]' + shortenedBridge);
      optimizations.push('Shortened bridge section');
      truncatedSections.push('Extended bridge lyrics');
    }

    // 4. Remove ad-libs and parenthetical content if needed
    if (optimizedContent.length > constraints.maxCharacters * 0.9) {
      const beforeLength = optimizedContent.length;
      optimizedContent = optimizedContent.replace(/\([^)]*\)/g, '');
      optimizedContent = optimizedContent.replace(/\*[^*]*\*/g, '');
      
      if (optimizedContent.length < beforeLength) {
        optimizations.push('Removed ad-libs and parenthetical content');
      }
    }

    // 5. Compress whitespace more aggressively
    optimizedContent = optimizedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    optimizations.push('Compressed whitespace for mobile format');

    return {
      content: optimizedContent,
      optimizations,
      truncatedSections
    };
  }

  private truncateToLimit(
    content: string,
    maxChars: number,
    preserveStructure: boolean
  ): { content: string; removedSections: string[] } {
    if (content.length <= maxChars) {
      return { content, removedSections: [] };
    }

    const removedSections: string[] = [];
    let truncatedContent = content;

    if (preserveStructure) {
      // Try to remove complete sections first
      const sections = ['[O]', '[B]', '\\[V\\](?!.*\\[V\\])'];  // Remove outro, bridge, last verse
      
      for (const sectionPattern of sections) {
        const regex = new RegExp(`${sectionPattern}[\\s\\S]*?(?=\\[|$)`, 'g');
        const match = truncatedContent.match(regex);
        
        if (match && truncatedContent.length > maxChars) {
          truncatedContent = truncatedContent.replace(regex, '');
          removedSections.push(match[0].split('\n')[0]);
          
          if (truncatedContent.length <= maxChars) break;
        }
      }
    }

    // If still too long, truncate at character limit
    if (truncatedContent.length > maxChars) {
      truncatedContent = truncatedContent.substring(0, maxChars - 3) + '...';
      removedSections.push('End content truncated');
    }

    return { content: truncatedContent, removedSections };
  }

  private truncateLinesToLimit(
    content: string,
    maxLines: number,
    preserveStructure: boolean
  ): { content: string; removedSections: string[] } {
    const lines = content.split('\n');
    if (lines.length <= maxLines) {
      return { content, removedSections: [] };
    }

    const removedSections: string[] = [];
    let truncatedLines = lines;

    if (preserveStructure) {
      // Find section boundaries and remove from end
      const sectionIndices: number[] = [];
      lines.forEach((line, index) => {
        if (line.match(/\[.*\]/)) {
          sectionIndices.push(index);
        }
      });

      // Remove sections from the end
      while (truncatedLines.length > maxLines && sectionIndices.length > 2) {
        const lastSectionStart = sectionIndices.pop()!;
        const removedSection = truncatedLines[lastSectionStart];
        truncatedLines = truncatedLines.slice(0, lastSectionStart);
        removedSections.push(removedSection);
      }
    }

    // Final line-based truncation
    if (truncatedLines.length > maxLines) {
      const removed = truncatedLines.slice(maxLines);
      truncatedLines = truncatedLines.slice(0, maxLines);
      removedSections.push(`${removed.length} lines truncated`);
    }

    return { 
      content: truncatedLines.join('\n'), 
      removedSections 
    };
  }

  private checkExcludedStyles(content: string, excludedStyles: string[]): string[] {
    const warnings: string[] = [];
    
    excludedStyles.forEach(style => {
      const stylePattern = new RegExp(style.replace('-', '[\\s-]'), 'i');
      if (stylePattern.test(content)) {
        warnings.push(`Style "${style}" is not supported on this device`);
      }
    });

    return warnings;
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  detectOptimalDevice(userAgent?: string): string {
    if (!userAgent) {
      return 'suno-desktop';
    }

    if (/iPhone|iPod/.test(userAgent)) {
      return 'suno-iphone';
    } else if (/Android.*Mobile/.test(userAgent)) {
      return 'suno-android';
    } else if (/iPad|Android(?!.*Mobile)/.test(userAgent)) {
      return 'suno-android'; // Treat tablets like Android
    }

    return 'suno-desktop';
  }

  previewMobileFormat(content: string, deviceType: string = 'suno-iphone'): {
    preview: string;
    warnings: string[];
    recommendations: string[];
  } {
    const result = this.adaptForMobile(content, deviceType, true);
    
    const recommendations: string[] = [];
    
    if (result.characterCount > 2500) {
      recommendations.push('Consider shortening verses or removing bridge section');
    }
    
    if (result.lineCount > 40) {
      recommendations.push('Reduce number of repeated sections');
    }
    
    if (result.truncatedSections.length > 0) {
      recommendations.push('Simplify structure to avoid content loss');
    }

    return {
      preview: result.formattedContent,
      warnings: result.warnings,
      recommendations
    };
  }

  exportForSUNOMobile(content: string, deviceType?: string): {
    formatted: string;
    metadata: {
      deviceProfile: string;
      optimizations: string[];
      characterCount: number;
      lineCount: number;
      warnings: string[];
    };
  } {
    const targetDevice = deviceType || this.detectOptimalDevice(navigator?.userAgent);
    const result = this.adaptForMobile(content, targetDevice, true);

    return {
      formatted: result.formattedContent,
      metadata: {
        deviceProfile: targetDevice,
        optimizations: result.optimizations,
        characterCount: result.characterCount,
        lineCount: result.lineCount,
        warnings: result.warnings
      }
    };
  }

  validateMobileCompatibility(content: string, deviceType: string = 'suno-iphone'): {
    compatible: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const profile = this.deviceProfiles.get(deviceType);
    if (!profile) {
      return {
        compatible: false,
        issues: ['Unknown device profile'],
        suggestions: []
      };
    }

    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check character limit
    if (content.length > profile.constraints.maxCharacters) {
      issues.push(`Exceeds character limit: ${content.length}/${profile.constraints.maxCharacters}`);
      suggestions.push('Reduce content length or use desktop version');
    }

    // Check line limit
    const lineCount = content.split('\n').length;
    if (lineCount > profile.constraints.maxLines) {
      issues.push(`Exceeds line limit: ${lineCount}/${profile.constraints.maxLines}`);
      suggestions.push('Combine sections or reduce repetition');
    }

    // Check excluded styles
    const styleIssues = this.checkExcludedStyles(content, profile.constraints.excludedStyles);
    issues.push(...styleIssues);
    
    if (styleIssues.length > 0) {
      suggestions.push('Switch to mobile-compatible style presets');
    }

    return {
      compatible: issues.length === 0,
      issues,
      suggestions
    };
  }
}

export const mobileExportAdapter = new MobileExportAdapter();