import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Progress } from "../../../components/ui/progress";
import { checkTimer } from "../../../services/Timer.service";
import { PauseIcon, PlayIcon } from "lucide-react/dist/lucide-react";
import { useAuth } from "../../../context/Auth.context";
import { useQuery } from "@tanstack/react-query/build/modern";

const Home = () => {
  const { user } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: ["timer"],
    queryFn: async () => {
      const token = user?.tokens?.access_token; // Replace with your actual token retrieval logic
      if (!token) {
        // Handle the case where the token is not available
        return null;
      }
      return await checkTimer(token);
    },
  });

  // Assuming progress is a value derived from the data
  const progress =
    (data?.details?.remaining_percentage
      ? parseFloat(data.details.remaining_percentage.replace("%", ""))
      : 0) || 0;

  return (
    <div>
      <Card className="w-[500px] h-auto">
        <CardHeader>
          <CardTitle className="text-xl">Not Logged in Yet</CardTitle>
          <CardDescription>start your day press start</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="w-[80%] h-[50px] flex flex-col justify-around">
              <Progress className="" value={progress} />
              <Label>
                your progress: {data?.details?.remaining_percentage}
              </Label>
            </div>
            <Button>
              <PlayIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
