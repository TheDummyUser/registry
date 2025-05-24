import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { checkTimer } from "@/services/Timer.service";
import { ArrowRight, PauseIcon, PlayIcon } from "lucide-react";
import { useAuth } from "@/context/Auth.context";
import { useQuery } from "@tanstack/react-query";

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

  const name = [
    {
      id: 1,
      name: "abhiram",
    },
    {
      id: 2,
      name: "reddy",
    },
  ];
  return (
    <div>
      <div className="lg:flex lg:gap-5  items-center">
        {/* card progressing start */}
        <Card className="lg:w-[500px] h-auto cursor-default">
          <CardHeader>
            <CardTitle className="text-xl">Not Logged in Yet</CardTitle>
            <CardDescription>start your day press start</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="w-[80%] h-[50px] flex flex-col justify-around">
                <Progress className="" value={progress} />
                <Label>
                  your progress: {data?.details?.remaining_percentage || "0%"}
                </Label>
              </div>
              <Button className="cursor-pointer">
                <PlayIcon />
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* card progressing end */}

        <Card className=" lg:w-[300px]">
          <CardHeader>
            <CardTitle className="text-xl">Your Team name</CardTitle>
            <CardDescription>your team descritption</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <Label className="mb-[10px]">Team Members:</Label>
            {name.map(({ id, name }) => (
              <p key={id} className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" /> {name}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
