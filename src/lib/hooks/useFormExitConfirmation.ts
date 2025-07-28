import {useEffect, useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

interface UseFormExitConfirmationProps {
  navigation: StackNavigationProp<any, any>;
  targetRoute?: string;
  targetParams?: any;
  title?: string;
  message?: string;
  forceTargetRoute?: boolean; // New prop to force navigation to target route
}

export const useFormExitConfirmation = ({
  navigation,
  targetRoute,
  targetParams,
  title = 'Discard changes?',
  message = 'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
  forceTargetRoute = false, // Default to false for backward compatibility
}: UseFormExitConfirmationProps) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  const showExitConfirmation = useCallback(
    (e: any) => {
      Alert.alert(title, message, [
        {text: "Don't leave", style: 'cancel', onPress: () => {}},
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            // Allow navigation by setting hasUnsavedChanges to false
            setHasUnsavedChanges(false);

            // If forceTargetRoute is true, always navigate to target route
            if (forceTargetRoute && targetRoute) {
              // Try different navigation approaches
              try {
                // First, try to navigate directly
                navigation.navigate(targetRoute, targetParams);
              } catch (error) {
                console.log(
                  'Direct navigation failed, trying parent navigator',
                );
                // If that fails, try the parent navigator
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate(targetRoute, targetParams);
                } else {
                  // Fallback: just go back
                  navigation.goBack();
                }
              }
            } else {
              // Original behavior
              if (e.data.action) {
                navigation.dispatch(e.data.action);
              } else {
                // Fallback navigation
                if (targetRoute) {
                  navigation.navigate(targetRoute, targetParams);
                } else {
                  navigation.goBack();
                }
              }
            }
          },
        },
      ]);
    },
    [title, message, targetRoute, targetParams, navigation, forceTargetRoute],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // If we don't have unsaved changes, let the user leave normally
      if (!hasUnsavedChanges) {
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Show confirmation dialog
      showExitConfirmation(e);
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges, showExitConfirmation]);

  // Return function to manually set unsaved changes state
  return {
    setHasUnsavedChanges,
    hasUnsavedChanges,
  };
};
