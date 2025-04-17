import React from 'react';
import { Home, Settings, User, Search, Mail, Bell, BarChart, CheckCircle, XCircle, AlertTriangle, Info, ArrowRight, ExternalLink, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Terminal } from 'lucide-react'; // For Alert example
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper component to display a color swatch
const ColorSwatch = ({ name, variable }: { name: string; variable: string }) => (
  <div className="flex items-center space-x-4 mb-2">
    <div
      className="w-10 h-10 rounded border border-border"
      style={{ backgroundColor: `var(${variable})` }}
    />
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-muted-foreground">{variable}</p>
    </div>
  </div>
);

// List of color variables from globals.css
const colorVariables = [
  { name: 'Background', variable: '--background' },
  { name: 'Foreground', variable: '--foreground' },
  { name: 'Card', variable: '--card' },
  { name: 'Card Foreground', variable: '--card-foreground' },
  { name: 'Popover', variable: '--popover' },
  { name: 'Popover Foreground', variable: '--popover-foreground' },
  { name: 'Primary', variable: '--primary' },
  { name: 'Primary Foreground', variable: '--primary-foreground' },
  { name: 'Secondary', variable: '--secondary' },
  { name: 'Secondary Foreground', variable: '--secondary-foreground' },
  { name: 'Muted', variable: '--muted' },
  { name: 'Muted Foreground', variable: '--muted-foreground' },
  { name: 'Accent', variable: '--accent' },
  { name: 'Accent Foreground', variable: '--accent-foreground' },
  { name: 'Destructive', variable: '--destructive' },
  { name: 'Border', variable: '--border' },
  { name: 'Input', variable: '--input' },
  { name: 'Ring', variable: '--ring' },
  { name: 'Chart 1', variable: '--chart-1' },
  { name: 'Chart 2', variable: '--chart-2' },
  { name: 'Chart 3', variable: '--chart-3' },
  { name: 'Chart 4', variable: '--chart-4' },
  { name: 'Chart 5', variable: '--chart-5' },
  // Sidebar specific colors
  { name: 'Sidebar', variable: '--sidebar' },
  { name: 'Sidebar Foreground', variable: '--sidebar-foreground' },
  { name: 'Sidebar Primary', variable: '--sidebar-primary' },
  { name: 'Sidebar Primary Foreground', variable: '--sidebar-primary-foreground' },
  { name: 'Sidebar Accent', variable: '--sidebar-accent' },
  { name: 'Sidebar Accent Foreground', variable: '--sidebar-accent-foreground' },
  { name: 'Sidebar Border', variable: '--sidebar-border' },
  { name: 'Sidebar Ring', variable: '--sidebar-ring' },
];

const icons = [
  { name: 'Home', Comp: Home },
  { name: 'Settings', Comp: Settings },
  { name: 'User', Comp: User },
  { name: 'Search', Comp: Search },
  { name: 'Mail', Comp: Mail },
  { name: 'Bell', Comp: Bell },
  { name: 'BarChart', Comp: BarChart },
  { name: 'CheckCircle', Comp: CheckCircle },
  { name: 'XCircle', Comp: XCircle },
  { name: 'AlertTriangle', Comp: AlertTriangle },
  { name: 'Info', Comp: Info },
  { name: 'ArrowRight', Comp: ArrowRight },
  { name: 'ExternalLink', Comp: ExternalLink },
  { name: 'PlusCircle', Comp: PlusCircle },
  { name: 'Trash2', Comp: Trash2 },
];


export default function StyleGuidePage() {
  return (
    <div className="w-full py-10">
      <h1 className="text-4xl mb-8">Style Guide</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sections will be added here */}
        <Card>
          <CardHeader>
            <CardTitle>Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {colorVariables.map((color) => (
                <ColorSwatch key={color.variable} name={color.name} variable={color.variable} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Typography examples will go here */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Sans Serif (Geist Sans)</h2>
              <p className="text-sm text-muted-foreground mb-4">Applied via `font-sans` (maps to --font-geist-sans)</p>
              <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
              <h2 className="text-3xl font-semibold mb-2">Heading 2</h2>
              <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
              <h4 className="text-xl font-semibold mb-2">Heading 4</h4>
              <h5 className="text-lg font-semibold mb-2">Heading 5</h5>
              <h6 className="text-base font-semibold mb-4">Heading 6</h6>
              <p className="mb-6">
                This is a paragraph of body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <h2 className="text-lg font-semibold mb-2">Monospace (Geist Mono)</h2>
              <p className="text-sm text-muted-foreground mb-4">Applied via `font-mono` (maps to --font-geist-mono)</p>
              <pre className="bg-muted p-4 rounded font-mono text-sm">
                <code>
                  {`const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};`}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spacing &amp; Radius</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Spacing/Radius examples will go here */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Border Radius</h2>
              <p className="text-sm text-muted-foreground mb-4">Base radius (--radius) is set to 0.625rem (10px).</p>
              {/* Keep existing radius examples */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-sm flex items-center justify-center text-primary-foreground">sm</div>
                  <p className="text-xs mt-1">rounded-sm (--radius-sm)</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-md flex items-center justify-center text-primary-foreground">md</div>
                  <p className="text-xs mt-1">rounded-md (--radius-md)</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">lg</div>
                  <p className="text-xs mt-1">rounded-lg (--radius-lg)</p>
                </div>
                 <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">xl</div>
                  <p className="text-xs mt-1">rounded-xl (--radius-xl)</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground">full</div>
                  <p className="text-xs mt-1">rounded-full</p>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-2 mt-8">Spacing Scale (CSS Variables)</h2>
              <p className="text-sm text-muted-foreground mb-4">Defined in globals.css for consistent padding, margins, gaps.</p>
              <div className="space-y-4">
                {[
                  { name: 'xs', variable: '--spacing-xs', value: '0.25rem' },
                  { name: 's', variable: '--spacing-s', value: '0.5rem' },
                  { name: 'm', variable: '--spacing-m', value: '1rem' },
                  { name: 'l', variable: '--spacing-l', value: '1.5rem' },
                  { name: 'xl', variable: '--spacing-xl', value: '2.5rem' },
                ].map(space => (
                  <div key={space.name} className="flex items-center gap-4">
                    <div className="w-24 text-right">
                      <p className="font-medium">{space.name}</p>
                      <p className="text-xs text-muted-foreground">{space.variable}</p>
                      <p className="text-xs text-muted-foreground">({space.value})</p>
                    </div>
                    <div className="flex-1 bg-muted rounded" style={{ padding: `var(${space.variable})` }}>
                      <div className="bg-background p-2 rounded text-sm">Padding: {space.name}</div>
                    </div>
                    <div className="flex-1 bg-muted rounded" style={{ margin: `var(${space.variable})` }}>
                      <div className="bg-background p-2 rounded text-sm">Margin: {space.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Icons (Lucide)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Icon examples will go here */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {/* Map over icons array, applying hover background with Tailwind and color prop directly to each icon */}
              {icons.map(({ name, Comp }) => (
                <div key={name} className="flex flex-col items-center text-center p-2 border rounded-md hover:bg-[oklch(0.769_0.188_70.08_/_15%)] dark:hover:bg-[oklch(0.769_0.188_70.08_/_25%)] transition-colors">
                  <Comp className="w-6 h-6 mb-1" color="oklch(0.769 0.188 70.08)" />
                  <p className="text-xs text-muted-foreground">{name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Core Components</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Component examples will go here */}
            <div className="space-y-8">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-medium mb-4">Buttons</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button disabled>Disabled</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button><Home className="mr-2 h-4 w-4" /> With Icon</Button>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-lg font-medium mb-4">Badges</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              {/* Alerts */}
              <div>
                <h3 className="text-lg font-medium mb-4">Alerts</h3>
                <div className="space-y-4">
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      This is a default alert component.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      This is a destructive alert component.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              {/* Inputs */}
              <div>
                <h3 className="text-lg font-medium mb-4">Inputs</h3>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="Email" />
                </div>
                 <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <Label htmlFor="email-disabled">Email (Disabled)</Label>
                  <Input type="email" id="email-disabled" placeholder="Email" disabled />
                </div>
              </div>

              {/* Checkbox */}
              <div>
                <h3 className="text-lg font-medium mb-4">Checkbox</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                 <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="terms-disabled" disabled />
                  <Label htmlFor="terms-disabled">Accept terms (Disabled)</Label>
                </div>
              </div>

               {/* Switch */}
              <div>
                <h3 className="text-lg font-medium mb-4">Switch</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
                </div>
                 <div className="flex items-center space-x-2 mt-2">
                  <Switch id="airplane-mode-disabled" disabled />
                  <Label htmlFor="airplane-mode-disabled">Airplane Mode (Disabled)</Label>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>


       </div>
    </div>
  );
}