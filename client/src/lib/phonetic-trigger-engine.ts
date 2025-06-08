/**
 * Phonetic Trigger Mapping Interface
 * Interactive tool for vocal triggers tied to REMI Engine blocks
 */

export interface PhoneticTrigger {
  id: string;
  trigger: string;
  phoneticPattern: string;
  lyricBlock: string;
  intensity: number; // 0-100
  position: 'intro' | 'verse' | 'hook' | 'bridge' | 'outro';
  duration: number; // seconds
  fadeIn: boolean;
  fadeOut: boolean;
}

export interface VocalMapping {
  trackId: string;
  triggers: PhoneticTrigger[];
  globalSettings: {
    sensitivity: number;
    responseTime: number;
    autoFade: boolean;
  };
}

export class PhoneticTriggerEngine {
  private activeTriggers: Map<string, PhoneticTrigger> = new Map();
  private voicePatterns: Map<string, RegExp> = new Map();

  constructor() {
    this.initializePhoneticPatterns();
  }

  private initializePhoneticPatterns() {
    // Common vocal triggers and their phonetic patterns
    this.voicePatterns.set('nnnn', /n{2,}/i);
    this.voicePatterns.set('mmm', /m{2,}/i);
    this.voicePatterns.set('ahh', /a+h+/i);
    this.voicePatterns.set('ohh', /o+h+/i);
    this.voicePatterns.set('yeah', /y(ea|a)h*/i);
    this.voicePatterns.set('hey', /h+e+y*/i);
    this.voicePatterns.set('woah', /w+o+a+h*/i);
    this.voicePatterns.set('uh', /u+h*/i);
    this.voicePatterns.set('eh', /e+h*/i);
    this.voicePatterns.set('drop', /drop|bass|beat/i);
  }

  createTrigger(config: Omit<PhoneticTrigger, 'id'>): PhoneticTrigger {
    const trigger: PhoneticTrigger = {
      id: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...config
    };

    this.activeTriggers.set(trigger.id, trigger);
    return trigger;
  }

  mapTriggerToLyricBlock(
    trigger: string,
    lyricBlock: string,
    position: PhoneticTrigger['position'],
    intensity: number = 80
  ): PhoneticTrigger {
    return this.createTrigger({
      trigger,
      phoneticPattern: this.generatePhoneticPattern(trigger),
      lyricBlock,
      intensity,
      position,
      duration: this.calculateOptimalDuration(lyricBlock),
      fadeIn: position === 'intro' || position === 'verse',
      fadeOut: position === 'outro' || position === 'bridge'
    });
  }

  private generatePhoneticPattern(trigger: string): string {
    // Convert trigger to phonetic representation
    const phoneticMap: Record<string, string> = {
      'nnnn': 'n̩n̩n̩n̩',
      'mmm': 'm̩m̩m̩',
      'ahh': 'ɑːɑːɑː',
      'ohh': 'oʊoʊoʊ',
      'yeah': 'jɛə',
      'hey': 'heɪ',
      'woah': 'woʊə',
      'uh': 'ʌ',
      'eh': 'ɛ',
      'drop': 'drɑːp'
    };

    return phoneticMap[trigger.toLowerCase()] || trigger;
  }

  private calculateOptimalDuration(lyricBlock: string): number {
    // Calculate based on syllable count and typical BPM
    const syllables = this.countSyllables(lyricBlock);
    const avgBPM = 128; // Default dance music BPM
    const beatsPerSyllable = 0.5;
    
    return (syllables * beatsPerSyllable * 60) / avgBPM;
  }

  private countSyllables(text: string): number {
    // Simple syllable counting algorithm
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;

    for (const char of text.toLowerCase()) {
      const isVowel = vowels.includes(char);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }

    return Math.max(1, count);
  }

  generateRealTimePhrasing(
    triggers: PhoneticTrigger[],
    baseTrackStructure: string
  ): string {
    let phrasedLyrics = baseTrackStructure;

    triggers.forEach(trigger => {
      const placeholder = `{${trigger.position.toUpperCase()}}`;
      const phrasedBlock = this.applyPhoneticTrigger(trigger);
      
      phrasedLyrics = phrasedLyrics.replace(placeholder, phrasedBlock);
    });

    return phrasedLyrics;
  }

  private applyPhoneticTrigger(trigger: PhoneticTrigger): string {
    let processedBlock = trigger.lyricBlock;

    // Apply intensity-based modifications
    if (trigger.intensity > 80) {
      processedBlock = this.addEmphasis(processedBlock);
    }

    // Add phonetic trigger
    if (trigger.fadeIn) {
      processedBlock = `${trigger.trigger}... ${processedBlock}`;
    } else {
      processedBlock = `${trigger.trigger} ${processedBlock}`;
    }

    if (trigger.fadeOut) {
      processedBlock = `${processedBlock}... ${trigger.trigger}`;
    }

    return processedBlock;
  }

  private addEmphasis(text: string): string {
    // Add emphasis markers for high-intensity triggers
    return text.split(' ').map(word => {
      if (word.length > 3) {
        return word.toUpperCase();
      }
      return word;
    }).join(' ');
  }

  exportTriggerMapping(trackId: string): VocalMapping {
    const trackTriggers = Array.from(this.activeTriggers.values());
    
    return {
      trackId,
      triggers: trackTriggers,
      globalSettings: {
        sensitivity: 75,
        responseTime: 0.1,
        autoFade: true
      }
    };
  }

  importTriggerMapping(mapping: VocalMapping): void {
    mapping.triggers.forEach(trigger => {
      this.activeTriggers.set(trigger.id, trigger);
    });
  }

  getAvailableTriggers(): string[] {
    return Array.from(this.voicePatterns.keys());
  }

  validateTriggerCompatibility(trigger: string, style: string): boolean {
    const styleCompatibility: Record<string, string[]> = {
      'ukg-glitchcore': ['nnnn', 'drop', 'woah', 'eh'],
      'dom-dolla': ['yeah', 'hey', 'uh', 'mmm'],
      'floor-heater': ['mmm', 'ahh', 'ohh'],
      'rallyhouse-core': ['drop', 'yeah', 'woah', 'nnnn']
    };

    return styleCompatibility[style]?.includes(trigger) || false;
  }
}

export const phoneticEngine = new PhoneticTriggerEngine();