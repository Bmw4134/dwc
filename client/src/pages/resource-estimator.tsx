import QQResourceUsageEstimator from "@/components/qq-resource-usage-estimator";

interface ResourceEstimatorProps {
  refreshTrigger: number;
}

export default function ResourceEstimator({ refreshTrigger }: ResourceEstimatorProps) {
  return <QQResourceUsageEstimator />;
}