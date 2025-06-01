import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  useCheckTimerQuery,
  useLazyStartTimerQuery,
  useLazyStopTimerQuery,
} from "@/redux/services/timer.service";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";

export const Route = createFileRoute("/app/Home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: checkTimerData,
    error: checkTimerError,
    isLoading: checkTimerLoading,
  } = useCheckTimerQuery({});

  const [startTimer, { error: startTimerError }] = useLazyStartTimerQuery();

  const [stopTimer, { error: stopTimerError }] = useLazyStopTimerQuery();

  const progress: string =
    checkTimerData?.details?.remaining_percentage.replace("%", "");
  console.log("check timer Data", progress);
  console.log("start timer error", startTimerError);

  const onPressStart = () => {
    if (progress) {
      stopTimer({});
    } else {
      startTimer({});
    }
  };

  return (
    <div className="">
      <Card className="h-auto max-w-lg">
        <CardHeader>
          <CardTitle>{checkTimerData?.message}</CardTitle>
          <CardDescription>Do what ever you like!</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="w-[80%] h-[50px] justify-between flex flex-col">
            <Progress className="w-full" value={+progress} />
            <CardDescription>
              This is your progress Broh!: {progress}
            </CardDescription>
          </div>
          <Button onClick={onPressStart}>
            <Play />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
