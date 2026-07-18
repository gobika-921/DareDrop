import React, { forwardRef, memo, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
  View,
} from "react-native";

import { AppText } from "@/components/AppText";
import { colors, radius, shadows, spacing, typography } from "@/theme";

export type AppInputVariant = "filled" | "outlined" | "minimal";

export interface AppInputProps extends Omit<TextInputProps, "style"> {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: TextInputProps["keyboardType"];
  returnKeyType?: TextInputProps["returnKeyType"];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: AppInputVariant;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  showClearButton?: boolean;
  onClear?: () => void;
}

const AppInputComponent = forwardRef<TextInput, AppInputProps>((props, ref) => {
  const {
    value,
    onChangeText,
    placeholder,
    label,
    helperText,
    error,
    disabled = false,
    editable = true,
    multiline = false,
    numberOfLines = 1,
    keyboardType = "default",
    returnKeyType = "done",
    secureTextEntry = false,
    autoCapitalize = "sentences",
    autoCorrect = true,
    maxLength,
    leftIcon,
    rightIcon,
    variant = "filled",
    style,
    inputStyle,
    placeholderTextColor,
    selectionColor,
    showClearButton = false,
    onClear,
    onFocus,
    onBlur,
    accessibilityLabel,
    accessibilityHint,
    accessible = true,
    allowFontScaling = true,
    testID,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || editable === false;
  const hasError = Boolean(error);
  const isClearVisible = showClearButton && !isDisabled && Boolean(value && value.length > 0);

  const containerVariantStyle = useMemo(() => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: colors.surface.default,
          borderColor: hasError
            ? colors.status.danger
            : isFocused && !isDisabled
              ? colors.accent.primary
              : colors.border.default,
          borderWidth: 1,
          borderBottomWidth: 1,
        };
      case "minimal":
        return {
          backgroundColor: colors.transparent,
          borderColor: hasError
            ? colors.status.danger
            : isFocused && !isDisabled
              ? colors.accent.primary
              : colors.border.default,
          borderWidth: 0,
          borderBottomWidth: 1,
        };
      case "filled":
      default:
        return {
          backgroundColor: colors.surface.elevated,
          borderColor: hasError
            ? colors.status.danger
            : isFocused && !isDisabled
              ? colors.accent.primary
              : colors.border.default,
          borderWidth: 1,
          borderBottomWidth: 1,
        };
    }
  }, [hasError, isDisabled, isFocused, variant]);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return [
      styles.container,
      {
        backgroundColor: containerVariantStyle.backgroundColor,
        borderColor: containerVariantStyle.borderColor,
        borderWidth: containerVariantStyle.borderWidth,
        borderBottomWidth: containerVariantStyle.borderBottomWidth,
        borderRadius: variant === "minimal" ? radius.none : radius.medium,
      },
      isDisabled ? styles.containerDisabled : null,
      style,
    ];
  }, [containerVariantStyle.backgroundColor, containerVariantStyle.borderBottomWidth, containerVariantStyle.borderColor, containerVariantStyle.borderWidth, isDisabled, style, variant]);

  const inputTextStyle = useMemo<StyleProp<TextStyle>>(() => {
    return [
      styles.input,
      multiline ? styles.inputMultiline : null,
      isDisabled ? styles.inputDisabled : null,
      inputStyle,
    ];
  }, [inputStyle, isDisabled, multiline]);

  const handleFocus: TextInputProps["onFocus"] = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps["onBlur"] = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
  };

  const helperTextContent = hasError ? error : helperText;
  const helperTextColor = hasError ? colors.status.danger : colors.text.secondary;

  return (
    <View style={styles.wrapper} accessible={accessible}>
      {label ? (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View style={containerStyle}>
        {leftIcon ? <View style={styles.iconWrapper}>{leftIcon}</View> : null}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ?? colors.text.secondary}
          editable={!isDisabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          selectionColor={selectionColor ?? colors.accent.primary}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessible={accessible}
          allowFontScaling={allowFontScaling}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={inputTextStyle}
          testID={testID}
          {...rest}
        />

        {isClearVisible ? (
          <Pressable
            accessibilityLabel="Clear input"
            accessibilityRole="button"
            onPress={handleClear}
            style={styles.clearButton}
          >
            <AppText variant="caption" style={styles.clearButtonText}>
              ×
            </AppText>
          </Pressable>
        ) : null}

        {rightIcon && !isClearVisible ? <View style={styles.iconWrapper}>{rightIcon}</View> : null}
      </View>

      {helperTextContent ? (
        <AppText variant="caption" style={[styles.helperText, { color: helperTextColor }]}>
          {helperTextContent}
        </AppText>
      ) : null}
    </View>
  );
});

AppInputComponent.displayName = "AppInput";

export const AppInput = memo(AppInputComponent);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: spacing["3xl"],
    shadowColor: shadows.none.shadowColor,
    shadowOffset: shadows.none.shadowOffset,
    shadowOpacity: shadows.none.shadowOpacity,
    shadowRadius: shadows.none.shadowRadius,
    elevation: shadows.none.elevation,
  },
  containerDisabled: {
    opacity: 0.65,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: typography.input.fontFamily,
    fontSize: typography.input.fontSize,
    fontWeight: typography.input.fontWeight as TextStyle["fontWeight"],
    lineHeight: typography.input.lineHeight,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inputMultiline: {
    minHeight: spacing["3xl"],
    textAlignVertical: "top",
  },
  inputDisabled: {
    color: colors.text.secondary,
  },
  helperText: {
    marginTop: spacing.xs,
  },
  clearButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  clearButtonText: {
    color: colors.text.secondary,
  },
});
