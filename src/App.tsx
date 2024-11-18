import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  class: z.enum(["economy", "premium", "business"], {
    message: "Class must be one of economy, premium or business.",
  }),
  isSingleFlight: z.boolean(),
  departureDate: z.date().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }, {
    message: "Departure date must be in the future",
  }),
  returnDate: z.date().optional().refine((returnDate, ctx) =>
    !ctx.parent.isSingleFlight && returnDate > ctx.parent.departureDate,
    {
      message: "Return date must be after the departure date",
      path: ["returnDate"],
    }
  ),
})

function App() {
  const [date, setDate] = React.useState<Date>()

  return (
    <>
      <div className="bg-background text-foreground min-h-screen min-w-screen flex items-center justify-center dark">
        <Card className="max-w-[700px] w-full">
          <CardHeader>
            <CardTitle>Book a flight</CardTitle>
            <CardDescription>Fill the form and search for a flight!</CardDescription>
          </CardHeader>
          <CardContent>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input placeholder="Lima" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Source</Label>
                  <Input placeholder="Mexico City" />
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="airplane-mode">
                      Select a class:
                    </Label>
                    <RadioGroup defaultValue="ecnomy" className="flex gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="economy" id="r1" />
                        <Label htmlFor="r1">Economy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="r2" />
                        <Label htmlFor="r2">Premium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bussiness" id="r3" />
                        <Label htmlFor="r3">Bussiness</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="origin">Departure</Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {date ? format(date, "PPP") : <span>Departure</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Return</Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {date ? format(date, "PPP") : <span>Return</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Single flight</Label>
                </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button className="w-full">Search flights</Button>
          </CardFooter>
        </Card>

      </div>
    </>
  )
}

export default App
