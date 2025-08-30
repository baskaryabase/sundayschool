import React from 'react';
import { buttonStyles, textStyles, layoutStyles, cn } from '@/styles/theme';

interface ThemeExampleProps {
  className?: string;
}

export default function ThemeExample({ className }: ThemeExampleProps) {
  return (
    <div className={cn(layoutStyles.container, className)}>
      <div className={layoutStyles.card}>
        <h2 className={textStyles.heading2}>Theme Example</h2>
        
        <div className="mt-6">
          <h3 className={textStyles.heading3}>Text Colors</h3>
          <p className={textStyles.body}>This is regular body text (foreground color)</p>
          <p className={textStyles.bodyLight}>This is light body text (secondary-dark color)</p>
          <p className={textStyles.small}>This is small text (secondary color)</p>
          <p className="text-primary">This is primary color text</p>
          <p className="text-secondary">This is secondary color text (improved for white background)</p>
        </div>
        
        <div className="mt-6">
          <h3 className={textStyles.heading3}>Buttons</h3>
          <div className="flex space-x-4 mt-2">
            <button className={buttonStyles.primary}>Primary Button</button>
            <button className={buttonStyles.secondary}>Secondary Button</button>
            <button className={buttonStyles.danger}>Danger Button</button>
            <button className={buttonStyles.link}>Link Button</button>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className={textStyles.heading3}>Color Palette</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="flex flex-col">
              <div className="h-10 rounded bg-primary flex items-center justify-center text-white">Primary</div>
              <div className="h-10 rounded bg-primary-light flex items-center justify-center">Primary Light</div>
              <div className="h-10 rounded bg-primary-dark flex items-center justify-center text-white">Primary Dark</div>
            </div>
            <div className="flex flex-col">
              <div className="h-10 rounded bg-secondary flex items-center justify-center text-white">Secondary</div>
              <div className="h-10 rounded bg-secondary-light flex items-center justify-center">Secondary Light</div>
              <div className="h-10 rounded bg-secondary-dark flex items-center justify-center text-white">Secondary Dark</div>
            </div>
            <div className="flex flex-col">
              <div className="h-10 rounded bg-white border flex items-center justify-center">Background</div>
              <div className="h-10 rounded bg-foreground flex items-center justify-center text-white">Foreground</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
