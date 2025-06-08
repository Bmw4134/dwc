/**
 * Voice Command-to-Track Generator
 * Parse speech to phrasing style and auto-export SUNO-ready tracks
 */

export interface VoiceCommand {
  id: string;
  timestamp: Date;
  rawTranscript: string;
  processedCommand: string;
  confidence: number;
  detectedIntent: TrackIntent;
  extractedElements: TrackElements;
}

export interface TrackIntent {
  mood: string;
  genre: string;
  energy: 'low' | 'medium' | 'high' | 'explosive';
  style: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'late-night';
  purpose: 'club' | 'radio' | 'background' | 'workout' | 'chill' | 'party';
}

export interface TrackElements {
  instruments: string[];
  effects: string[];
  vocal_style: string;
  tempo_keywords: string[];
  structure_hints: string[];
  mood_descriptors: string[];
}

export interface GeneratedTrack {
  title: string;
  lyrics: string;
  style: string;
  sunoPrompt: string;
  confidence: number;
  voiceCommandId: string;
  generatedAt: Date;
}

export class VoiceCommandTrackGenerator {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private commandHistory: Map<string, VoiceCommand> = new Map();
  private styleMapping: Map<string, string[]> = new Map();
  private moodPatterns: Map<string, RegExp> = new Map();

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeStyleMapping();
    this.initializeMoodPatterns();
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  private initializeStyleMapping() {
    this.styleMapping.set('club', ['ukg-glitchcore', 'dom-dolla', 'rallyhouse-core']);
    this.styleMapping.set('burner', ['floor-heater', 'dom-dolla']);
    this.styleMapping.set('night', ['deep-house', 'floor-heater']);
    this.styleMapping.set('bounce', ['rallyhouse-core', 'ukg-glitchcore']);
    this.styleMapping.set('sharp', ['ukg-glitchcore', 'electronic-sharp']);
    this.styleMapping.set('smooth', ['dom-dolla', 'floor-heater']);
    this.styleMapping.set('heavy', ['rallyhouse-core', 'bass-heavy']);
    this.styleMapping.set('echo', ['reverb-heavy', 'space-echo']);
    this.styleMapping.set('groovy', ['dom-dolla', 'groove-house']);
    this.styleMapping.set('dark', ['dark-techno', 'underground']);
  }

  private initializeMoodPatterns() {
    this.moodPatterns.set('energetic', /energetic|pumped|hyped|explosive|wild|crazy/i);
    this.moodPatterns.set('chill', /chill|relaxed|calm|smooth|laid.back|mellow/i);
    this.moodPatterns.set('dark', /dark|underground|gritty|heavy|intense|aggressive/i);
    this.moodPatterns.set('uplifting', /uplifting|happy|bright|positive|euphoric/i);
    this.moodPatterns.set('mysterious', /mysterious|ambient|atmospheric|spacey|ethereal/i);
    this.moodPatterns.set('romantic', /romantic|love|intimate|sensual|tender/i);
    this.moodPatterns.set('party', /party|celebration|festival|crowd|dance.floor/i);
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject(new Error('Recognition not available'));

      this.isListening = true;
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        this.processVoiceCommand(transcript, confidence);
        resolve();
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private processVoiceCommand(transcript: string, confidence: number): VoiceCommand {
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const processedCommand = this.cleanTranscript(transcript);
    const detectedIntent = this.parseIntent(processedCommand);
    const extractedElements = this.extractElements(processedCommand);

    const voiceCommand: VoiceCommand = {
      id: commandId,
      timestamp: new Date(),
      rawTranscript: transcript,
      processedCommand,
      confidence,
      detectedIntent,
      extractedElements
    };

    this.commandHistory.set(commandId, voiceCommand);
    return voiceCommand;
  }

  private cleanTranscript(transcript: string): string {
    return transcript
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private parseIntent(command: string): TrackIntent {
    // Extract mood
    let mood = 'neutral';
    for (const [moodType, pattern] of this.moodPatterns.entries()) {
      if (pattern.test(command)) {
        mood = moodType;
        break;
      }
    }

    // Extract genre hints
    let genre = 'electronic';
    if (/house|deep|tech/i.test(command)) genre = 'house';
    else if (/dubstep|bass|drop/i.test(command)) genre = 'dubstep';
    else if (/trap|hip.hop|rap/i.test(command)) genre = 'trap';
    else if (/ambient|chill|downtempo/i.test(command)) genre = 'ambient';

    // Extract energy level
    let energy: TrackIntent['energy'] = 'medium';
    if (/explosive|crazy|wild|insane/i.test(command)) energy = 'explosive';
    else if (/high|pumped|energetic/i.test(command)) energy = 'high';
    else if (/low|chill|calm/i.test(command)) energy = 'low';

    // Extract style keywords
    const styles: string[] = [];
    for (const [keyword, styleList] of this.styleMapping.entries()) {
      if (command.includes(keyword)) {
        styles.push(...styleList);
      }
    }

    // Extract time of day
    let timeOfDay: TrackIntent['timeOfDay'] = 'evening';
    if (/morning|dawn|sunrise/i.test(command)) timeOfDay = 'morning';
    else if (/afternoon|day/i.test(command)) timeOfDay = 'afternoon';
    else if (/late.night|midnight|3am/i.test(command)) timeOfDay = 'late-night';
    else if (/night/i.test(command)) timeOfDay = 'night';

    // Extract purpose
    let purpose: TrackIntent['purpose'] = 'club';
    if (/radio|commercial/i.test(command)) purpose = 'radio';
    else if (/background|ambient/i.test(command)) purpose = 'background';
    else if (/workout|gym|running/i.test(command)) purpose = 'workout';
    else if (/chill|relax/i.test(command)) purpose = 'chill';
    else if (/party|celebration/i.test(command)) purpose = 'party';

    return {
      mood,
      genre,
      energy,
      style: styles,
      timeOfDay,
      purpose
    };
  }

  private extractElements(command: string): TrackElements {
    // Extract instruments
    const instruments: string[] = [];
    if (/bass|sub|808/i.test(command)) instruments.push('bass', 'sub-bass');
    if (/synth|lead/i.test(command)) instruments.push('synthesizer', 'lead-synth');
    if (/drums|kick|snare/i.test(command)) instruments.push('drums', 'percussion');
    if (/piano|keys/i.test(command)) instruments.push('piano', 'keys');
    if (/vocal|voice|singing/i.test(command)) instruments.push('vocals');

    // Extract effects
    const effects: string[] = [];
    if (/echo|delay/i.test(command)) effects.push('echo', 'delay');
    if (/reverb|hall|space/i.test(command)) effects.push('reverb', 'hall-reverb');
    if (/distortion|grit|dirty/i.test(command)) effects.push('distortion', 'overdrive');
    if (/filter|sweep/i.test(command)) effects.push('filter', 'filter-sweep');
    if (/chorus|wide/i.test(command)) effects.push('chorus', 'stereo-width');

    // Extract vocal style
    let vocal_style = 'clean';
    if (/robotic|vocoder/i.test(command)) vocal_style = 'robotic';
    else if (/pitched|high|low/i.test(command)) vocal_style = 'pitched';
    else if (/chopped|stuttered/i.test(command)) vocal_style = 'chopped';
    else if (/smooth|silky/i.test(command)) vocal_style = 'smooth';

    // Extract tempo keywords
    const tempo_keywords: string[] = [];
    if (/fast|quick|rapid|speed/i.test(command)) tempo_keywords.push('fast', 'uptempo');
    if (/slow|downtempo|chill/i.test(command)) tempo_keywords.push('slow', 'downtempo');
    if (/medium|moderate/i.test(command)) tempo_keywords.push('medium-tempo');

    // Extract structure hints
    const structure_hints: string[] = [];
    if (/intro|opening/i.test(command)) structure_hints.push('strong-intro');
    if (/drop|breakdown/i.test(command)) structure_hints.push('powerful-drop');
    if (/bridge|break/i.test(command)) structure_hints.push('dynamic-bridge');
    if (/outro|ending/i.test(command)) structure_hints.push('memorable-outro');

    // Extract mood descriptors
    const mood_descriptors: string[] = [];
    if (/dark|deep|underground/i.test(command)) mood_descriptors.push('dark', 'mysterious');
    if (/bright|uplifting|positive/i.test(command)) mood_descriptors.push('bright', 'uplifting');
    if (/emotional|feeling|heart/i.test(command)) mood_descriptors.push('emotional', 'heartfelt');

    return {
      instruments,
      effects,
      vocal_style,
      tempo_keywords,
      structure_hints,
      mood_descriptors
    };
  }

  async generateTrackFromVoice(commandId: string): Promise<GeneratedTrack> {
    const command = this.commandHistory.get(commandId);
    if (!command) {
      throw new Error('Voice command not found');
    }

    // Generate title based on intent
    const title = this.generateTitle(command.detectedIntent, command.extractedElements);
    
    // Generate lyrics based on mood and style
    const lyrics = this.generateLyrics(command.detectedIntent, command.extractedElements);
    
    // Generate style string for SUNO
    const style = this.generateStyleString(command.detectedIntent, command.extractedElements);
    
    // Generate SUNO prompt
    const sunoPrompt = this.generateSunoPrompt(command.detectedIntent, command.extractedElements);

    const generatedTrack: GeneratedTrack = {
      title,
      lyrics,
      style,
      sunoPrompt,
      confidence: command.confidence,
      voiceCommandId: commandId,
      generatedAt: new Date()
    };

    return generatedTrack;
  }

  private generateTitle(intent: TrackIntent, elements: TrackElements): string {
    const moodTitles = {
      'energetic': ['Unleashed', 'Electric Storm', 'Power Surge'],
      'chill': ['Midnight Flow', 'Smooth Waves', 'Velvet Dreams'],
      'dark': ['Shadow Realm', 'Underground', 'Dark Matter'],
      'uplifting': ['Rising Sun', 'Elevation', 'Sky High'],
      'mysterious': ['Enigma', 'Hidden Depths', 'Ethereal'],
      'party': ['Dance Floor Fire', 'Party Anthem', 'Club Destroyer']
    };

    const timeModifiers = {
      'late-night': 'Late Night',
      'morning': 'Dawn',
      'evening': 'Twilight',
      'night': 'Midnight'
    };

    const baseTitles = moodTitles[intent.mood] || ['Track', 'Untitled', 'New Generation'];
    const baseTitle = baseTitles[Math.floor(Math.random() * baseTitles.length)];
    
    const timeModifier = timeModifiers[intent.timeOfDay];
    
    if (timeModifier && Math.random() > 0.5) {
      return `${timeModifier} ${baseTitle}`;
    }

    if (elements.effects.length > 0 && Math.random() > 0.7) {
      const effect = elements.effects[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `${baseTitle} (${effect} Mix)`;
    }

    return baseTitle;
  }

  private generateLyrics(intent: TrackIntent, elements: TrackElements): string {
    const templates = {
      'club': [
        '[Verse]\nTurn it up, feel the beat\nEvery drop makes us complete\n\n[Hook]\n{mood_line}\nLet the music take control\n\n[Verse 2]\nBass is hitting, lights are bright\nWe\'re alive in neon light',
        '[Intro]\nReady for the night\n\n[Verse]\nFeel the rhythm in your soul\nLet the bass line take control\n\n[Chorus]\n{mood_line}\nDance until the morning light'
      ],
      'chill': [
        '[Verse]\nSoft melodies drift through time\nEvery note feels so divine\n\n[Chorus]\n{mood_line}\nFloat away on gentle waves\n\n[Bridge]\nClose your eyes and feel the flow\nLet the peaceful music grow',
        '[Ambient Intro]\n\n[Verse]\nWhispers in the evening air\nMusic floating everywhere\n\n[Chorus]\n{mood_line}\nDrifting in a dream so clear'
      ]
    };

    const moodLines = {
      'energetic': 'Energy flowing through the night',
      'chill': 'Peaceful moments, soft and light',
      'dark': 'Shadows dancing in the deep',
      'uplifting': 'Rising higher, spirits free',
      'mysterious': 'Secrets hidden in the sound',
      'party': 'Celebration all around'
    };

    const purposeTemplates = templates[intent.purpose] || templates['club'];
    const template = purposeTemplates[Math.floor(Math.random() * purposeTemplates.length)];
    const moodLine = moodLines[intent.mood] || 'Music flowing through the soul';

    return template.replace('{mood_line}', moodLine);
  }

  private generateStyleString(intent: TrackIntent, elements: TrackElements): string {
    const styleComponents: string[] = [];

    // Add detected styles
    if (intent.style.length > 0) {
      styleComponents.push(...intent.style.slice(0, 2)); // Limit to 2 main styles
    } else {
      // Fallback based on genre and mood
      if (intent.genre === 'house') styleComponents.push('dom-dolla');
      else if (intent.genre === 'dubstep') styleComponents.push('ukg-glitchcore');
      else styleComponents.push('electronic');
    }

    // Add energy modifier
    if (intent.energy === 'explosive') styleComponents.push('high-energy');
    else if (intent.energy === 'low') styleComponents.push('downtempo');

    // Add effects
    if (elements.effects.length > 0) {
      styleComponents.push(...elements.effects.slice(0, 2));
    }

    // Add vocal style if specified
    if (elements.vocal_style !== 'clean') {
      styleComponents.push(`${elements.vocal_style}-vocals`);
    }

    return styleComponents.join(', ');
  }

  private generateSunoPrompt(intent: TrackIntent, elements: TrackElements): string {
    const promptParts: string[] = [];

    // Mood and energy
    promptParts.push(`${intent.mood} ${intent.energy}-energy ${intent.genre}`);

    // Purpose context
    if (intent.purpose !== 'club') {
      promptParts.push(`perfect for ${intent.purpose}`);
    }

    // Time context
    if (intent.timeOfDay !== 'evening') {
      promptParts.push(`${intent.timeOfDay} vibe`);
    }

    // Key elements
    if (elements.instruments.length > 0) {
      promptParts.push(`featuring ${elements.instruments.slice(0, 2).join(' and ')}`);
    }

    if (elements.effects.length > 0) {
      promptParts.push(`with ${elements.effects.slice(0, 2).join(' and ')}`);
    }

    // Structure hints
    if (elements.structure_hints.length > 0) {
      promptParts.push(elements.structure_hints[0]);
    }

    return promptParts.join(', ');
  }

  processTextCommand(textCommand: string): VoiceCommand {
    // Allow text input as alternative to voice
    return this.processVoiceCommand(textCommand, 1.0);
  }

  getCommandHistory(): VoiceCommand[] {
    return Array.from(this.commandHistory.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  clearHistory(): void {
    this.commandHistory.clear();
  }

  exportForSuno(track: GeneratedTrack): {
    title: string;
    lyrics: string;
    style: string;
    prompt: string;
  } {
    return {
      title: track.title,
      lyrics: track.lyrics,
      style: track.style,
      prompt: track.sunoPrompt
    };
  }

  getSupportedCommands(): string[] {
    return [
      "Create a late night club burner with sharp echo hook",
      "Make a chill downtempo track with smooth bass",
      "Generate an energetic party anthem with heavy drops",
      "Build a mysterious ambient piece with reverb",
      "Craft a groovy house track with vocal chops",
      "Design a dark underground banger with distortion"
    ];
  }

  validateVoiceSupport(): boolean {
    return this.recognition !== null;
  }
}

export const voiceCommandGenerator = new VoiceCommandTrackGenerator();