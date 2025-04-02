import { Link, type LinkProps } from 'expo-router'; // Import LinkProps for type safety
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<LinkProps, 'href'> & { href: string | LinkProps['href'] }; // Allow string or LinkProps['href']

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as LinkProps['href']} // Explicitly cast href to the expected type
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          if (event?.preventDefault) {
            event.preventDefault();
          }
          // Open the link in an in-app browser.
          await openBrowserAsync(href.toString()); // Ensure href is converted to a string
        }
      }}
    />
  );
}
