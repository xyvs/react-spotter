import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import * as React from "react";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { getAirportIDs, getFlights } from "../services.tsx";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z
    .object({
        origin: z.string().min(3, {
            message: "Origin must be at least 3 characters.",
        }),
        destination: z.string().min(3, {
            message: "Destination must be at least 3 characters.",
        }),
        flight_class: z.enum(["economy", "premium_economy", "business"], {
            message: "Class must be one of economy, premium or business.",
        }),
        is_single_flight: z.boolean(),
        departure_date: z.date().refine(
            (date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today;
            },
            {
                message: "Departure date must be in the future",
            },
        ),
        return_date: z.date().optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.is_single_flight && !data.return_date) {
            ctx.addIssue({
                code: "custom",
                message: "Return date required for round trip flights",
                path: ["return_date"],
            });
        }
    });

function FlightForm({ setFlights }: { setFlights: (flights: any) => void }) {
    const [loading, setLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            is_single_flight: false,
            flight_class: "economy",
        },
    });

    const { watch } = form;
    const is_single_flight = watch("is_single_flight");
    const departure_date = watch("departure_date");

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoading(true);
        console.log(data);
        try {
            const origin_airport = await getAirportIDs(data.origin);
            console.log(origin_airport);
            if (origin_airport.data.length === 0) {
                form.setError("origin", {
                    type: "manual",
                    message: "Unable to find airport",
                });
                return;
            }
            console.log(origin_airport.data[0]);

            const destination_airport = await getAirportIDs(data.destination);
            console.log(destination_airport);
            if (destination_airport.data.length === 0) {
                form.setError("destination", {
                    type: "manual",
                    message: "Unable to find airport",
                });
                return;
            }
            console.log(destination_airport.data[0]);

            let departure_date = format(data.departure_date, "yyyy-MM-dd");
            let return_date = '';
            if (!data.is_single_flight && data.return_date) {
                return_date = format(data.return_date, "yyyy-MM-dd");
            }

            const flights = await getFlights({
                origin: origin_airport.data[0],
                destination: destination_airport.data[0],
                departure_date: departure_date,
                return_date: return_date,
                flight_class: data.flight_class,
            });
            console.log(flights);

            setFlights(flights);
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setLoading(false);
        }

        setLoading(false);
    };

    return (
        <Card className="max-w-[700px] w-full">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                >
                    <CardHeader>
                        <CardTitle>Book a flight</CardTitle>
                        <CardDescription>
                            Fill the form and search for a flight!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="origin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Origin</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="New York"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="London"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="flight_class"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2 col-span-2">
                                        <FormLabel>Class</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex gap-4"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="economy" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        Economy
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="premium_economy" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        Premium
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="business" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        Business
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-2 col-span-2">
                                <FormField
                                    control={form.control}
                                    name="departure_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Departure</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value &&
                                                                    "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon className="opacity-50" />
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    "PPP",
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) =>
                                                            date < new Date()
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {!is_single_flight && (
                                    <FormField
                                        control={form.control}
                                        name="return_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Return</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={
                                                                    "outline"
                                                                }
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value &&
                                                                        "text-muted-foreground",
                                                                )}
                                                            >
                                                                <CalendarIcon className="opacity-50" />
                                                                {field.value ? (
                                                                    format(
                                                                        field.value,
                                                                        "PPP",
                                                                    )
                                                                ) : (
                                                                    <span>
                                                                        Pick a
                                                                        date
                                                                    </span>
                                                                )}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                field.value
                                                            }
                                                            onSelect={
                                                                field.onChange
                                                            }
                                                            disabled={(date) =>
                                                                date <
                                                                new Date(
                                                                    departure_date,
                                                                )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            <FormField
                                control={form.control}
                                name="is_single_flight"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 col-span-2 space-y-0">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Single flight</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Search"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default FlightForm;
