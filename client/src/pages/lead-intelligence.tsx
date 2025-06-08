import QQLeadIntelligenceMap from "@/components/qq-lead-intelligence-map";

interface LeadIntelligenceProps {
  refreshTrigger: number;
}

export default function LeadIntelligence({ refreshTrigger }: LeadIntelligenceProps) {
  return <QQLeadIntelligenceMap />;
}