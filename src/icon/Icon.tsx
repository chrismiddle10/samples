'use client';

import React from 'react';
import * as rn from 'react-native';
import { useTheme } from 'styled-components/native';
import { is } from '../../../shared';
import { transformStyle } from '../util';
import { IconProps, IconSize, IconTransients } from './Icon.types';
import { IconElements } from './Icon.styled';
import { getDefaultIconPkg, getIconDefinition, hasIconPkg } from './Icon.const';

// TODO: SUPPORT MORE TRANSFORMS: https://docs.fontawesome.com/web/style/power-transform/

export function Icon( props: IconProps ) {
    const {
        color,
        definition,
        disabled = false,
        duotoneColor,
        duotoneOpacity,
        hidden = false,
        name,
        pkg = getDefaultIconPkg(),
        rotate = 0,
        size = 'md',
        spacing = 'none',
        spin = false,
        style,
        variant = 'default',
        onPress,
    } = props;

    if( !hasIconPkg( pkg ) && hidden !== true ) {
        throw new Error( `icon: invalid pkg '${pkg}'` );
    }

    const theme = useTheme();

    const [pressed, setPressed] = React.useState( false );
    const [focused, setFocused] = React.useState( false );
    const [hovered, setHovered] = React.useState( false );

    const styles = transformStyle( IconElements, style );
    const transients: IconTransients = {
        $color: color,
        $disabled: disabled,
        $duotoneColor: duotoneColor,
        $duotoneOpacity: duotoneOpacity,
        $focused: focused,
        $hovered: hovered,
        $interactive: is.func( onPress ),
        $pressed: pressed,
        $pkg: pkg,
        $size: size,
        $spacing: spacing,
        $variant: variant,
    };

    const iconSize = is.withChar( size ) ? ( parseInt( theme.token.fontSize.md[size as IconSize] ) ) : size as number;
    const iconElement = (
        <IconElements.Root
            {...transients}
            color={disabled === true ? undefined : color}
            icon={definition || getIconDefinition( pkg, name )}
            secondaryColor={disabled === true ? undefined : duotoneColor}
            secondaryOpacity={duotoneOpacity}
            style={styles.Root as Any}
            transform={{ rotate }}
            size={iconSize}
        />
    );

    return hidden === true ? null : (
        <React.Fragment>
            {transients.$interactive ? (
                <IconElements.Pressable
                    focusable={true}
                    // REMARK: 2024-06-24: THIS IS INTENTIONALLY NOT OVERRIDABLE OR STYLEABLE
                    // style={styles.Pressable}
                    onBlur={() => {
                        setFocused( false );
                    }}
                    onFocus={() => {
                        setFocused( true );
                    }}
                    onHover={() => {
                        setHovered( true );
                    }}
                    onLeave={() => {
                        setHovered( false );
                    }}
                    onPressing={() => {
                        setPressed( true );
                    }}
                    onPress={() => {
                        setPressed( false );
                        onPress();
                    }}
                >
                    {spin ? <AnimatedIcon>{iconElement}</AnimatedIcon> : iconElement}
                </IconElements.Pressable>
            ) : (
                <React.Fragment>
                    {spin ? <AnimatedIcon>{iconElement}</AnimatedIcon> : iconElement}
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

Icon.displayName = 'Icon';

function AnimatedIcon( props: { children: React.ReactNode } ) {
    const { children } = props;

    const clockwiseValue = React.useRef( new rn.Animated.Value( 0 ) ).current;
    const clockwiseLoop = React.useRef<rn.Animated.CompositeAnimation>(
        rn.Animated.loop(
            rn.Animated.timing(
                clockwiseValue,
                {
                    toValue: 1,
                    duration: 1500,
                    easing: rn.Easing.linear,
                    useNativeDriver: PLATFORM.NATIVE,
                }
            )
        )
    );

    React.useLayoutEffect( () => {
        clockwiseLoop.current.start();
    }, [] );

    const clockwiseRef = clockwiseValue.interpolate( {
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    } );

    return (
        <rn.Animated.View
            style={{
                transform: [
                    { rotate: clockwiseRef },
                ],
            }}
        >
            {children}
        </rn.Animated.View>
    );
}
