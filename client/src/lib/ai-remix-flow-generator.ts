/**
 * AI Remix Flow Generator
 * Visual remix path builder with style preset dropdowns and auto-suggested FX layers
 */

export interface RemixNode {
  id: string;
  type: 'source' | 'style' | 'fx' | 'output';
  name: string;
  style?: string;
  parameters: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

export interface RemixFlow {
  id: string;
  name: string;
  nodes: RemixNode[];
  connections: Array<{
    from: string;
    to: string;
    type: 'audio' | 'control' | 'data';
  }>;
  globalSettings: {
    bpm: number;
    key: string;
    timeSignature: string;
  };
}

export interface StylePreset {
  id: string;
  name: string;
  category: 'house' | 'techno' | 'dubstep' | 'trap' | 'ambient' | 'experimental';
  baseStyle: string;
  autoFxLayers: FxLayer[];
  compatibleStyles: string[];
  sunoExportReady: boolean;
}

export interface FxLayer {
  id: string;
  name: string;
  type: 'filter' | 'delay' | 'reverb' | 'distortion' | 'modulation' | 'dynamics';
  parameters: Record<string, number>;
  intensity: number;
  position: 'pre' | 'post' | 'parallel';
  automatable: boolean;
}

export class AIRemixFlowGenerator {
  private presets: Map<string, StylePreset> = new Map();
  private fxLibrary: Map<string, FxLayer> = new Map();
  private activeFlows: Map<string, RemixFlow> = new Map();

  constructor() {
    this.initializeStylePresets();
    this.initializeFxLibrary();
  }

  private initializeStylePresets() {
    const presets: StylePreset[] = [
      {
        id: 'ukg-crusher',
        name: 'UKG Crusher',
        category: 'house',
        baseStyle: 'ukg-glitchcore',
        autoFxLayers: [
          { id: 'fx1', name: 'Bit Crusher', type: 'distortion', parameters: { bits: 8, rate: 0.7 }, intensity: 85, position: 'pre', automatable: true },
          { id: 'fx2', name: 'Stutter Gate', type: 'modulation', parameters: { rate: 16, depth: 0.9 }, intensity: 90, position: 'post', automatable: true },
          { id: 'fx3', name: 'Hall Reverb', type: 'reverb', parameters: { size: 0.8, decay: 0.6 }, intensity: 40, position: 'parallel', automatable: false }
        ],
        compatibleStyles: ['dom-dolla', 'rallyhouse-core'],
        sunoExportReady: true
      },
      {
        id: 'dom-roller',
        name: 'Dom Dolla Roller',
        category: 'house',
        baseStyle: 'dom-dolla',
        autoFxLayers: [
          { id: 'fx1', name: 'Analog Filter', type: 'filter', parameters: { cutoff: 0.6, resonance: 0.4 }, intensity: 70, position: 'pre', automatable: true },
          { id: 'fx2', name: 'Vintage Comp', type: 'dynamics', parameters: { ratio: 4, attack: 0.1 }, intensity: 65, position: 'post', automatable: false },
          { id: 'fx3', name: 'Analog Delay', type: 'delay', parameters: { time: 0.25, feedback: 0.3 }, intensity: 50, position: 'parallel', automatable: true }
        ],
        compatibleStyles: ['floor-heater', 'ukg-glitchcore'],
        sunoExportReady: true
      },
      {
        id: 'deep-burner',
        name: 'Deep Floor Burner',
        category: 'house',
        baseStyle: 'floor-heater',
        autoFxLayers: [
          { id: 'fx1', name: 'Warm Chorus', type: 'modulation', parameters: { rate: 0.5, depth: 0.3 }, intensity: 60, position: 'pre', automatable: false },
          { id: 'fx2', name: 'Plate Reverb', type: 'reverb', parameters: { size: 0.9, damping: 0.7 }, intensity: 75, position: 'parallel', automatable: false },
          { id: 'fx3', name: 'Tape Sat', type: 'distortion', parameters: { drive: 0.3, warmth: 0.8 }, intensity: 45, position: 'post', automatable: false }
        ],
        compatibleStyles: ['dom-dolla', 'rallyhouse-core'],
        sunoExportReady: true
      },
      {
        id: 'rally-bounce',
        name: 'Rallyhouse Bounce',
        category: 'trap',
        baseStyle: 'rallyhouse-core',
        autoFxLayers: [
          { id: 'fx1', name: 'Sidechain Pump', type: 'dynamics', parameters: { ratio: 8, release: 0.3 }, intensity: 95, position: 'post', automatable: true },
          { id: 'fx2', name: 'Tape Saturation', type: 'distortion', parameters: { drive: 0.6, harmonics: 0.4 }, intensity: 70, position: 'pre', automatable: false },
          { id: 'fx3', name: 'Spring Reverb', type: 'reverb', parameters: { tension: 0.7, decay: 0.5 }, intensity: 35, position: 'parallel', automatable: false }
        ],
        compatibleStyles: ['ukg-glitchcore', 'dom-dolla'],
        sunoExportReady: true
      }
    ];

    presets.forEach(preset => this.presets.set(preset.id, preset));
  }

  private initializeFxLibrary() {
    const fxLayers: FxLayer[] = [
      { id: 'lpf', name: 'Low Pass Filter', type: 'filter', parameters: { cutoff: 0.8, resonance: 0.2 }, intensity: 50, position: 'pre', automatable: true },
      { id: 'hpf', name: 'High Pass Filter', type: 'filter', parameters: { cutoff: 0.1, resonance: 0.1 }, intensity: 30, position: 'pre', automatable: true },
      { id: 'echo', name: 'Echo Delay', type: 'delay', parameters: { time: 0.5, feedback: 0.4 }, intensity: 60, position: 'parallel', automatable: true },
      { id: 'chorus', name: 'Stereo Chorus', type: 'modulation', parameters: { rate: 1.2, depth: 0.5 }, intensity: 55, position: 'pre', automatable: false },
      { id: 'compressor', name: 'Compressor', type: 'dynamics', parameters: { ratio: 3, attack: 0.05 }, intensity: 40, position: 'post', automatable: false },
      { id: 'overdrive', name: 'Overdrive', type: 'distortion', parameters: { drive: 0.4, tone: 0.6 }, intensity: 65, position: 'pre', automatable: true }
    ];

    fxLayers.forEach(fx => this.fxLibrary.set(fx.id, fx));
  }

  createRemixFlow(name: string, sourceTrackId: string): RemixFlow {
    const flowId = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const flow: RemixFlow = {
      id: flowId,
      name,
      nodes: [
        {
          id: 'source',
          type: 'source',
          name: 'Source Track',
          parameters: { trackId: sourceTrackId },
          position: { x: 100, y: 200 },
          connections: []
        }
      ],
      connections: [],
      globalSettings: {
        bpm: 128,
        key: 'C',
        timeSignature: '4/4'
      }
    };

    this.activeFlows.set(flowId, flow);
    return flow;
  }

  addStyleNode(flowId: string, presetId: string, position: { x: number; y: number }): RemixNode {
    const flow = this.activeFlows.get(flowId);
    const preset = this.presets.get(presetId);
    
    if (!flow || !preset) {
      throw new Error('Flow or preset not found');
    }

    const nodeId = `style_${Date.now()}`;
    const styleNode: RemixNode = {
      id: nodeId,
      type: 'style',
      name: preset.name,
      style: preset.baseStyle,
      parameters: {
        presetId,
        intensity: 100,
        blend: 0.8
      },
      position,
      connections: []
    };

    flow.nodes.push(styleNode);

    // Auto-add suggested FX layers
    preset.autoFxLayers.forEach((fx, index) => {
      const fxNodeId = this.addFxNode(flowId, fx.id, {
        x: position.x + 200 + (index * 150),
        y: position.y + (index * 100 - 50)
      });
      
      // Connect style node to FX nodes
      this.connectNodes(flowId, nodeId, fxNodeId);
    });

    return styleNode;
  }

  addFxNode(flowId: string, fxId: string, position: { x: number; y: number }): string {
    const flow = this.activeFlows.get(flowId);
    const fx = this.fxLibrary.get(fxId);
    
    if (!flow || !fx) {
      throw new Error('Flow or FX not found');
    }

    const nodeId = `fx_${Date.now()}`;
    const fxNode: RemixNode = {
      id: nodeId,
      type: 'fx',
      name: fx.name,
      parameters: {
        ...fx.parameters,
        intensity: fx.intensity,
        bypass: false
      },
      position,
      connections: []
    };

    flow.nodes.push(fxNode);
    return nodeId;
  }

  connectNodes(flowId: string, fromId: string, toId: string): void {
    const flow = this.activeFlows.get(flowId);
    if (!flow) return;

    const fromNode = flow.nodes.find(n => n.id === fromId);
    if (fromNode && !fromNode.connections.includes(toId)) {
      fromNode.connections.push(toId);
    }

    flow.connections.push({
      from: fromId,
      to: toId,
      type: 'audio'
    });
  }

  generateVisualRemixPath(flowId: string): Array<{ step: number; action: string; description: string; position: { x: number; y: number } }> {
    const flow = this.activeFlows.get(flowId);
    if (!flow) return [];

    const path: Array<{ step: number; action: string; description: string; position: { x: number; y: number } }> = [];
    let stepCounter = 1;

    // Sort nodes by position for logical flow
    const sortedNodes = [...flow.nodes].sort((a, b) => a.position.x - b.position.x);

    sortedNodes.forEach(node => {
      switch (node.type) {
        case 'source':
          path.push({
            step: stepCounter++,
            action: 'Source Input',
            description: 'Original track loaded',
            position: node.position
          });
          break;
        case 'style':
          path.push({
            step: stepCounter++,
            action: `Apply ${node.name}`,
            description: `Transform using ${node.style} preset`,
            position: node.position
          });
          break;
        case 'fx':
          path.push({
            step: stepCounter++,
            action: `Add ${node.name}`,
            description: `Process with ${node.name} effect`,
            position: node.position
          });
          break;
      }
    });

    return path;
  }

  exportToSunoFormat(flowId: string, originalTrack: { title: string; lyrics: string }): {
    title: string;
    lyrics: string;
    style: string;
    remixChain: string;
  } {
    const flow = this.activeFlows.get(flowId);
    if (!flow) {
      throw new Error('Flow not found');
    }

    // Build style string from remix path
    const styleNodes = flow.nodes.filter(n => n.type === 'style');
    const fxNodes = flow.nodes.filter(n => n.type === 'fx');

    const baseStyles = styleNodes.map(n => n.style).filter(Boolean);
    const fxList = fxNodes.map(n => n.name);

    const styleString = [
      ...baseStyles,
      ...fxList
    ].join(', ');

    // Generate remix title
    const remixSuffix = styleNodes.length > 0 ? ` (${styleNodes[0].name} Remix)` : ' (Remix)';
    const title = originalTrack.title + remixSuffix;

    // Build remix chain for tracking
    const remixChain = flow.nodes
      .filter(n => n.type !== 'source')
      .map(n => n.name)
      .join(' → ');

    return {
      title,
      lyrics: originalTrack.lyrics,
      style: styleString,
      remixChain
    };
  }

  getCompatiblePresets(currentStyle: string): StylePreset[] {
    return Array.from(this.presets.values()).filter(preset => 
      preset.compatibleStyles.includes(currentStyle) || preset.baseStyle === currentStyle
    );
  }

  suggestFxLayers(styleId: string, intensity: 'low' | 'medium' | 'high'): FxLayer[] {
    const preset = this.presets.get(styleId);
    if (!preset) return [];

    const intensityMultiplier = {
      'low': 0.6,
      'medium': 1.0,
      'high': 1.4
    };

    return preset.autoFxLayers.map(fx => ({
      ...fx,
      intensity: Math.min(100, fx.intensity * intensityMultiplier[intensity])
    }));
  }

  validateFlowForExport(flowId: string): { valid: boolean; issues: string[] } {
    const flow = this.activeFlows.get(flowId);
    if (!flow) {
      return { valid: false, issues: ['Flow not found'] };
    }

    const issues: string[] = [];

    // Check for source node
    if (!flow.nodes.some(n => n.type === 'source')) {
      issues.push('Missing source track');
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set(flow.connections.flatMap(c => [c.from, c.to]));
    const disconnectedNodes = flow.nodes.filter(n => !connectedNodeIds.has(n.id) && n.type !== 'source');
    
    if (disconnectedNodes.length > 0) {
      issues.push(`${disconnectedNodes.length} disconnected nodes`);
    }

    // Check SUNO compatibility
    const styleNodes = flow.nodes.filter(n => n.type === 'style');
    const incompatibleStyles = styleNodes.filter(n => {
      const preset = this.presets.get(n.parameters?.presetId);
      return !preset?.sunoExportReady;
    });

    if (incompatibleStyles.length > 0) {
      issues.push('Some styles not SUNO compatible');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  cloneFlow(flowId: string, newName: string): RemixFlow {
    const originalFlow = this.activeFlows.get(flowId);
    if (!originalFlow) {
      throw new Error('Original flow not found');
    }

    const newFlowId = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const clonedFlow: RemixFlow = {
      ...originalFlow,
      id: newFlowId,
      name: newName,
      nodes: originalFlow.nodes.map(node => ({
        ...node,
        id: `${node.id}_clone_${Date.now()}`
      }))
    };

    this.activeFlows.set(newFlowId, clonedFlow);
    return clonedFlow;
  }

  getFlowMetrics(flowId: string): {
    nodeCount: number;
    connectionCount: number;
    styleComplexity: number;
    fxChainLength: number;
    estimatedProcessingTime: number;
  } {
    const flow = this.activeFlows.get(flowId);
    if (!flow) {
      return { nodeCount: 0, connectionCount: 0, styleComplexity: 0, fxChainLength: 0, estimatedProcessingTime: 0 };
    }

    const fxNodes = flow.nodes.filter(n => n.type === 'fx');
    const styleNodes = flow.nodes.filter(n => n.type === 'style');

    const styleComplexity = styleNodes.reduce((sum, node) => {
      const preset = this.presets.get(node.parameters?.presetId);
      return sum + (preset?.autoFxLayers.length || 0);
    }, 0);

    const estimatedProcessingTime = (fxNodes.length * 2) + (styleNodes.length * 5); // seconds

    return {
      nodeCount: flow.nodes.length,
      connectionCount: flow.connections.length,
      styleComplexity,
      fxChainLength: fxNodes.length,
      estimatedProcessingTime
    };
  }
}

export const remixFlowGenerator = new AIRemixFlowGenerator();