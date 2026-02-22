import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";

const metrics = [
  {
    icon: DollarSign,
    value: "$47M+",
    label: "Total Funding Raised",
    description: "By founders using PlatFormula.ONE",
    color: "emerald"
  },
  {
    icon: Users,
    value: "320+",
    label: "Founders Accelerated",
    description: "Accepted into top programs",
    color: "blue"
  },
  {
    icon: Award,
    value: "89%",
    label: "Success Rate",
    description: "Founders who complete our tools get accepted",
    color: "purple"
  },
  {
    icon: TrendingUp,
    value: "2.4x",
    label: "Higher Acceptance",
    description: "vs. industry average",
    color: "orange"
  }
];

function getColorClasses(color: string) {
  switch (color) {
    case "emerald":
      return {
        icon: "text-emerald-400",
        value: "text-emerald-400",
        bg: "bg-emerald-500/10"
      };
    case "blue":
      return {
        icon: "text-blue-400",
        value: "text-blue-400",
        bg: "bg-blue-500/10"
      };
    case "purple":
      return {
        icon: "text-purple-400",
        value: "text-purple-400",
        bg: "bg-purple-500/10"
      };
    case "orange":
      return {
        icon: "text-orange-400",
        value: "text-orange-400",
        bg: "bg-orange-500/10"
      };
    default:
      return {
        icon: "text-primary",
        value: "text-primary",
        bg: "bg-primary/10"
      };
  }
}

export function SuccessMetrics() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Platform Impact</h2>
        <p className="text-muted-foreground">Real results from founders who use PlatFormula.ONE</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const colors = getColorClasses(metric.color);
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="border-muted/50 bg-card/50 backdrop-blur hover:border-muted transition-all">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`text-4xl font-bold ${colors.value}`}>
                      {metric.value}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {metric.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground italic">
          * Metrics based on founders who completed Application Assistant and applied to accelerators in 2025-2026
        </p>
      </div>
    </section>
  );
}
