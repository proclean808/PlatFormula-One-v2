import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface Deadline {
  name: string;
  date: Date;
  url: string;
  color: string;
}

const deadlines: Deadline[] = [
  {
    name: "Y Combinator Spring 2026",
    date: new Date("2026-03-15T23:59:59"),
    url: "https://www.ycombinator.com/apply",
    color: "orange"
  },
  {
    name: "a16z Speedrun Summer 2026",
    date: new Date("2026-04-30T23:59:59"),
    url: "https://a16z.com/speedrun/",
    color: "purple"
  },
  {
    name: "Accel Atoms AI Cohort",
    date: new Date("2026-05-15T23:59:59"),
    url: "https://www.accel.com/programs/atoms",
    color: "blue"
  },
  {
    name: "Techstars Q2 2026",
    date: new Date("2026-04-01T23:59:59"),
    url: "https://www.techstars.com/apply",
    color: "blue"
  }
];

function getTimeRemaining(deadline: Date) {
  const now = new Date().getTime();
  const target = deadline.getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, expired: false };
}

function getColorClasses(color: string) {
  switch (color) {
    case "orange":
      return {
        border: "border-orange-500/50",
        bg: "bg-gradient-to-br from-orange-500/10 to-orange-600/5",
        hover: "hover:border-orange-500/70 hover:shadow-orange-500/20",
        text: "text-orange-400",
        badge: "bg-orange-500/20 text-orange-400"
      };
    case "purple":
      return {
        border: "border-purple-500/50",
        bg: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
        hover: "hover:border-purple-500/70 hover:shadow-purple-500/20",
        text: "text-purple-400",
        badge: "bg-purple-500/20 text-purple-400"
      };
    case "blue":
      return {
        border: "border-blue-500/50",
        bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
        hover: "hover:border-blue-500/70 hover:shadow-blue-500/20",
        text: "text-blue-400",
        badge: "bg-blue-500/20 text-blue-400"
      };
    default:
      return {
        border: "border-emerald-500/50",
        bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
        hover: "hover:border-emerald-500/70 hover:shadow-emerald-500/20",
        text: "text-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-400"
      };
  }
}

export function DeadlineTracker() {
  const [timeRemainingMap, setTimeRemainingMap] = useState<Record<string, ReturnType<typeof getTimeRemaining>>>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const newMap: Record<string, ReturnType<typeof getTimeRemaining>> = {};
      deadlines.forEach(deadline => {
        newMap[deadline.name] = getTimeRemaining(deadline.date);
      });
      setTimeRemainingMap(newMap);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const upcomingDeadlines = deadlines
    .filter(d => !timeRemainingMap[d.name]?.expired)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (upcomingDeadlines.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Upcoming Deadlines</h2>
        </div>
        <p className="text-muted-foreground">Don't miss these application deadlines for top accelerators</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {upcomingDeadlines.map((deadline) => {
          const timeLeft = timeRemainingMap[deadline.name];
          const colors = getColorClasses(deadline.color);

          if (!timeLeft) return null;

          return (
            <a
              key={deadline.name}
              href={deadline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className={`${colors.border} ${colors.bg} backdrop-blur ${colors.hover} transition-all hover:shadow-lg cursor-pointer h-full`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg ${colors.text}`}>{deadline.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {deadline.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${colors.text}`}>{timeLeft.days}</div>
                      <div className="text-xs text-muted-foreground">days</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${colors.text}`}>{timeLeft.hours}</div>
                      <div className="text-xs text-muted-foreground">hours</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${colors.text}`}>{timeLeft.minutes}</div>
                      <div className="text-xs text-muted-foreground">mins</div>
                    </div>
                  </div>
                  {timeLeft.days <= 7 && (
                    <div className={`mt-3 text-center text-xs font-semibold px-2 py-1 rounded ${colors.badge}`}>
                      ⚠️ Deadline approaching!
                    </div>
                  )}
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </section>
  );
}
