"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"; // Import ToastAction
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Terminal, Waves } from "lucide-react"; // Example icons

// Import the chart components
import { BarChartMultiple } from '@/components/charts/bar-chart-multiple';
import { PieChartDonutText } from '@/components/charts/pie-chart-donut-text';
import { AreaChartStacked } from '@/components/charts/area-chart-stacked';
import { AreaChartSimple } from '@/components/charts/area-chart-simple';
import { BarChartSimple } from '@/components/charts/bar-chart-simple';
import { BarChartCustomLabel } from '@/components/charts/bar-chart-custom-label';
import { BarChartInteractive } from '@/components/charts/bar-chart-interactive';
import { RadialChartStacked } from '@/components/charts/radial-chart-stacked';
import { TooltipCustomLabel } from '@/components/charts/tooltip-custom-label';

// Note: Sidebar and Sonner/Toaster require specific setup/context not demonstrated here.

export default function ComponentsPage() {
  const [progress, setProgress] = useState(13);
  const { toast } = useToast();

  // Example data for Table
  const invoices = [
    { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
    { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  ];

  return (
    <div className="space-y-6 p-1 bg-transparent"> {/* Added bg-transparent */}
      <h1 className="text-4xl mb-6">Component Library</h1>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
          <TabsTrigger value="nav">Navigation & Overlays</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="layout">
          {/* Layout Components */}
          <Card>
            <CardHeader>
              <CardTitle>Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 mb-6">
                <Label>Card</Label>
                <Card>
                  <CardHeader><CardTitle>Inner Card</CardTitle><CardDescription>Card Description</CardDescription></CardHeader>
                  <CardContent><p>Card Content</p></CardContent>
                </Card>
              </div>
              <div className="space-y-2 mb-6">
                <Label>Separator</Label>
                <Separator />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms">
          {/* Form Components */}
          <Card>
            <CardHeader>
              <CardTitle>Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 mb-6">
                <Label htmlFor="email">Input</Label>
                <Input id="email" placeholder="Email" />
              </div>
              <div className="space-y-2 mb-6">
                <Label htmlFor="message">Textarea</Label>
                <Textarea id="message" placeholder="Type your message here." />
              </div>
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Checkbox: Accept terms</Label>
              </div>
              <RadioGroup defaultValue="option-one" className="mb-6">
                <Label>Radio Group</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">Option Two</Label>
                </div>
              </RadioGroup>
              <div className="space-y-2 mb-6">
                 <Label>Select</Label>
                 <Select>
                   <SelectTrigger><SelectValue placeholder="Theme" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="light">Light</SelectItem>
                     <SelectItem value="dark">Dark</SelectItem>
                     <SelectItem value="system">System</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
               <div className="flex items-center space-x-2 mb-6">
                 <Switch id="airplane-mode" />
                 <Label htmlFor="airplane-mode">Switch: Airplane Mode</Label>
               </div>
               <Button className="mb-6">Button</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          {/* Feedback Components */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Alert className="mb-6">
                 <Terminal className="h-4 w-4" />
                 <AlertTitle>Alert</AlertTitle>
                 <AlertDescription>This is an alert component.</AlertDescription>
               </Alert>
               <div className="space-y-2 mb-6">
                 <Label>Progress</Label>
                 <Progress value={progress} className="w-[60%]" />
               </div>
               <div className="space-y-2 mb-6">
                 <Label>Skeleton</Label>
                 <div className="flex items-center space-x-4">
                   <Skeleton className="h-12 w-12 rounded-full" />
                   <div className="space-y-2">
                     <Skeleton className="h-4 w-[250px]" />
                     <Skeleton className="h-4 w-[200px]" />
                   </div>
                 </div>
               </div>
               <Button
                 variant="outline"
                 className="mb-6"
                 onClick={() => {
                   toast({
                     title: "Toast Notification",
                     description: "Friday, February 10, 2023 at 5:57 PM",
                     action: <ToastAction altText="Try again">Try again</ToastAction>,
                   })
                 }}
               >
                 Show Toast
               </Button>
               {/* Sonner needs setup */}
               {/* <Button variant="outline" onClick={() => toastSonner("Sonner Event has been created")}>Show Sonner</Button> */}
               {/* <TooltipProvider>
                 <Tooltip>
                   <TooltipTrigger>
                     <Button variant="outline">Tooltip</Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     This is a tooltip
                   </TooltipContent>
                 </Tooltip>
               </TooltipProvider> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          {/* Data Display Components */}
          <Card>
            <CardHeader>
              <CardTitle>Data Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Avatar className="mb-6">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Badge className="mb-6">Badge</Badge>
              <Table className="mb-6">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">{invoice.invoice}</TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nav">
          {/* Navigation & Overlays */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation & Overlays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-wrap gap-4"> {/* Use flex-wrap */}
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>Dialog Description</DialogDescription>
                  </DialogHeader>
                  Dialog Content
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" className="mb-6">Dropdown Menu</Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>Sheet Description</SheetDescription>
                  </SheetHeader>
                  Sheet Content
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet> */}
              {/* Example Tabs removed */}
              {/* Sidebar requires specific layout integration */}
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="charts">
          {/* Chart Components */}
          <Card>
            <CardHeader>
              <CardTitle>Charts (Recharts)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <BarChartMultiple />
                <PieChartDonutText />
                <AreaChartStacked />
                <AreaChartSimple />
                <BarChartSimple />
                <BarChartCustomLabel />
                <BarChartInteractive />
                <RadialChartStacked />
                <TooltipCustomLabel />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

    </div>
  );
}