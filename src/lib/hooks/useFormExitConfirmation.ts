import {useEffect, useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

interface UseFormExitConfirmationProps {
  navigation: StackNavigationProp<any, any>;
  targetRoute?: string;
  targetParams?: any;
  title?: string;
  message?: string;
}

export const useFormExitConfirmation = ({
  navigation,
  targetRoute,
  targetParams,
  title = 'Discard changes?',
  message = 'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
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

            // Dispatch the action that was prevented
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
          },
        },
      ]);
    },
    [title, message, targetRoute, targetParams, navigation],
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
