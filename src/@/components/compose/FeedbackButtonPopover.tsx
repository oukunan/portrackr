import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

export default function FeedbackButtonPopover() {
  const [feedback, setFeedback] = useState("");
  const [isDoneFeedback, setIsDoneFeedback] = useState(false);

  useEffect(() => {
    if (isDoneFeedback) {
      setTimeout(() => {
        setIsDoneFeedback(false);
      }, 1000 * 60);
    }
  }, [isDoneFeedback]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    fetch("https://formcarry.com/s/13wIvXH60ON", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "anonymous",
        email: "anonymous@gmail.com",
        message: feedback,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === 200) {
          alert("We received your submission, thank you!");
        } else if (response.code === 422) {
          // Field validation failed
          // setError(response.message);
        } else {
          // other error from formcarry
          // setError(response.message);
        }
      })
      .catch(() => {
        // request related error.
        // setError(error.message ? error.message : error);
      })
      .finally(() => {
        setIsDoneFeedback(true);
        setFeedback('')
      });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="py-1 px-2.5 h-auto border-[1px] border-[#292a38] bg-transparent text-[#84859e]">
            Feedback
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          {isDoneFeedback ? (
            <span>Thank you for your feedback 🙏🏼</span>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="message">Feedback</label>
                <Textarea
                  id="message"
                  className="resize-none"
                  placeholder="Enter your feedback 😁"
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></Textarea>
              </div>

              <Button
                type="submit"
                disabled={feedback.trim().length === 0}
                className="bg-blue-500 hover:bg-blue-400 mt-2"
              >
                Send
              </Button>
            </form>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
