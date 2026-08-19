import {useContext} from 'react';
import {ThemeContext} from '@themes/ThemeContext';

/**
 * Primary accessor for theme tokens inside components.
 *
 *   const {theme} = useTheme();
 *   <View style={{backgroundColor: theme.colors.background}} />
 *
 * Always read colors/spacing/radius/typography from here — never hardcode.
 */
export function useTheme() {
  return useContext(ThemeContext);
}
