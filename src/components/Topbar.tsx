import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Undo2, Redo2, Download, Moon, Sun, Settings2, FileCode2, FileText, Loader2, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PreviewStyles } from '../types';

interface TopbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onExportPDF: () => void;
  onExportHTML: () => void;
  isExporting?: boolean;
  styles: PreviewStyles;
  onStylesChange: (styles: PreviewStyles) => void;
  onResetStyles: () => void;
}

const FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
];

export function Topbar({
  title,
  onTitleChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  theme,
  onThemeToggle,
  onExportPDF,
  onExportHTML,
  isExporting,
  styles,
  onStylesChange,
  onResetStyles,
}: TopbarProps) {
  return (
    <div className="flex flex-col shrink-0">
      <header className="h-[60px] border-b border-border flex items-center justify-between px-5 bg-muted">
        <div className="flex items-center gap-3 font-bold tracking-tight text-foreground">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          MARKDOWN STUDIO
        </div>

        <div className="flex items-center space-x-4 flex-1 ml-8">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="max-w-[200px] h-[30px] font-medium border-transparent hover:border-border focus-visible:ring-1 focus-visible:ring-primary bg-transparent text-foreground"
            placeholder="Untitled Document"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground h-[30px] px-3.5 rounded-md text-[13px]">
            <Undo2 className="h-4 w-4 mr-1.5" /> Undo
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground h-[30px] px-3.5 rounded-md text-[13px]">
            <Redo2 className="h-4 w-4 mr-1.5" /> Redo
          </Button>
          <div className="w-[1px] h-5 bg-border mx-2"></div>

          <Popover>
            <PopoverTrigger className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground h-[30px] px-3.5">
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Styles</span>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-popover border-border text-popover-foreground">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Preview Styling</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onResetStyles}
                    className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Body Font</label>
                  <Select
                    value={styles.fontFamily}
                    onValueChange={(val) => onStylesChange({ ...styles, fontFamily: val })}
                  >
                    <SelectTrigger className="h-8 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      {FONTS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Heading Font</label>
                  <Select
                    value={styles.headingFontFamily}
                    onValueChange={(val) => onStylesChange({ ...styles, headingFontFamily: val })}
                  >
                    <SelectTrigger className="h-8 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      {FONTS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Base Font Size</label>
                    <span className="text-xs text-muted-foreground">{styles.baseFontSize}px</span>
                  </div>
                  <Slider
                    value={[styles.baseFontSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={(val) => onStylesChange({ ...styles, baseFontSize: Array.isArray(val) ? val[0] : val as number })}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Heading Scale</label>
                    <span className="text-xs text-muted-foreground">{styles.headingScale}x</span>
                  </div>
                  <Slider
                    value={[styles.headingScale]}
                    min={1}
                    max={2}
                    step={0.1}
                    onValueChange={(val) => onStylesChange({ ...styles, headingScale: Array.isArray(val) ? val[0] : val as number })}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger 
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary border border-primary text-primary-foreground hover:bg-primary/90 h-[30px] px-3.5"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isExporting ? 'Exporting...' : 'Export'}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
              <DropdownMenuItem onClick={onExportPDF} className="hover:bg-accent focus:bg-accent focus:text-accent-foreground cursor-pointer">
                <FileCode2 className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportHTML} className="hover:bg-accent focus:bg-accent focus:text-accent-foreground cursor-pointer">
                <FileCode2 className="h-4 w-4 mr-2" />
                Export as HTML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={onThemeToggle} className="h-[30px] w-[30px] bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
    </div>
  );
}
