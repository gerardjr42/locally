"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const icebreakerQuestions = [
  "What hobbies or activities do you enjoy in your free time?",
  "If you could travel anywhere in the world, where would you go and why?",
  "What's your favorite book or movie, and what do you love about it?",
  "Do you have a favorite type of music or a favorite band?",
  "What's a fun fact about you that most people don't know?",
  "What's your go-to comfort food?",
  "If you could have dinner with any three people, dead or alive, who would they be?",
  "What's a skill you've always wanted to learn?",
  "How do you like to spend a rainy day?",
  "What's something you're passionate about?",
  "If you could instantly master any skill or talent, what would it be?",
  "What's your favorite childhood memory?",
  "What's a movie or TV show you can binge-watch anytime?",
  "What's something on your bucket list that you hope to achieve?",
  "How would your friends describe you in three words?",
  "What's your favorite way to meet new people?",
  "If you could live in any fictional world, which one would you choose?",
];

const MAX_BIO_LENGTH = 500;

export default function UserBioCreation() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [icebreakerResponses, setIcebreakerResponses] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [particles, setParticles] = useState([]);
  const [progress, setProgress] = useState(60);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x:
            (particle.x + particle.speedX + window.innerWidth) %
            window.innerWidth,
          y:
            (particle.y + particle.speedY + window.innerHeight) %
            window.innerHeight,
        }))
      );
    };

    const intervalId = setInterval(animateParticles, 50);
    return () => clearInterval(intervalId);
  }, []);

  const handleIcebreakerChange = (index, field, value) => {
    const updatedResponses = [...icebreakerResponses];
    updatedResponses[index][field] = value === "empty" ? "" : value;
    if (field === "question") {
      updatedResponses[index].answer = "";
    }
    setIcebreakerResponses(updatedResponses);
  };

  const availableQuestions = useMemo(() => {
    const selectedQuestions = icebreakerResponses.map(
      (response) => response.question
    );
    return icebreakerQuestions.filter(
      (question) => !selectedQuestions.includes(question)
    );
  }, [icebreakerResponses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("No user found");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Users")
        .update({
          bio: bio,
          icebreaker_responses: icebreakerResponses,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Bio and icebreaker responses saved successfully!");
      router.push("/register/interests");
    } catch (error) {
      toast.error(
        `Error saving bio and icebreaker responses: ${error.message}`
      );
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/register/details")}
        >
          <ArrowLeft className="mr-2 h-10 w-4" />
        </Button>

        <div className="mb-6">
          <Progress value={40} className="h-2" />
          <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
            <span>Profile Creation</span>
            <span>40%</span>
          </div>
        </div>

        <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Tell us about yourself
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2>Tell us about yourself</h2>
          <div>
            <Label htmlFor="bio">Your bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
              className="mt-1"
              maxLength={MAX_BIO_LENGTH}
            />
            <p className="text-sm text-gray-500 mt-1">
              {bio.length}/{MAX_BIO_LENGTH} characters
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Answer prompts</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select up to 3 questions and share your responses
            </p>
            {icebreakerResponses.map((response, index) => (
              <div key={index} className="space-y-2 mb-4">
                <Select
                  value={response.question || "empty"}
                  onValueChange={(value) =>
                    handleIcebreakerChange(index, "question", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px] w-full">
                      <SelectItem value="empty">Select a question</SelectItem>
                      {[...availableQuestions, response.question]
                        .filter(Boolean)
                        .map((question, qIndex) => (
                          <SelectItem
                            key={qIndex}
                            value={question}
                            className="w-2/3"
                          >
                            {question}
                          </SelectItem>
                        ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Your response..."
                  value={response.answer}
                  onChange={(e) =>
                    handleIcebreakerChange(index, "answer", e.target.value)
                  }
                  className="mt-1"
                  disabled={!response.question}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className=" btn bg-[#0D9488] hover:bg-[#0A7C72] text-white"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
