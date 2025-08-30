import { NextPage } from 'next';
import ThemeExample from '@/components/ui/ThemeExample';
import { layoutStyles, textStyles } from '@/styles/theme';

const ThemePage: NextPage = () => {
  return (
    <div className={layoutStyles.container}>
      <div className="py-8">
        <h1 className={textStyles.heading1}>Sunday School Theme</h1>
        <p className="mt-2 text-secondary-dark">
          This page showcases the improved theme with better colors for readability.
        </p>
      </div>
      
      <ThemeExample />
      
      <div className="mt-8">
        <h2 className={textStyles.heading2}>About the Theme</h2>
        <p className="mt-2">
          The theme has been updated with improved secondary colors that are more readable on white backgrounds.
          The color palette provides a range of options for both light and dark mode.
        </p>
      </div>
    </div>
  );
};

export default ThemePage;
